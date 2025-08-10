// (sliding window algorithm)
// For each IP address:
// Store request timestamps in a sorted set.
// Clean up timestamps older than windowSec seconds.
// Count remaining timestamps — if less than limit, allow the request and log its timestamp.
// If the count exceeds limit, block the request.

// eg, limit = 5 requests per 10 seconds.
// isAllowed("1.2.3.4")  // returns true (first request)
// ...
// 6th request within 10s -> returns false
// After 10s -> counts reset automatically, allowed again

// Sliding window rate limiting is more accurate than fixed windows (avoids bursts at window boundaries).
// Redis keeps all operations O(log n) in speed using sorted sets.
// Works in distributed environments since Redis is centralized.

// Redis itself is a centralized, in-memory data store typically running on one or more dedicated servers (nodes). 
// It stores data in a single logical database accessible by clients, which makes Redis a centralized system in terms of data access.
// Despite being centralized, Redis supports distributed environments because it can be used as a common, shared store that multiple servers, applications, or services connect to remotely over a network. 
// This allows many distributed components to share and synchronize data through this single centralized Redis instance.
// Furthermore, Redis offers clustering and replication features (especially in Redis Enterprise and Redis Cluster) that allow the dataset and workload to be spread over multiple Redis nodes, providing scalability, fault tolerance, and high availability. 
// This distributed clustering is still managed in a way that keeps Redis a logically centralized service from client applications' perspective.
// Thus, Redis clients in a distributed system (multiple app servers, microservices, etc.) can rely on Redis as a centralized backend data store while the clients themselves are distributed
// Redis ensures data consistency and rapid access.

import Redis from 'ioredis';
const redis = new Redis();

// limit — max number of allowed requests in the time window (default: 100).
// windowSec — size of the "sliding time window" in seconds (default: 60 seconds).
export async function isAllowed(ip, limit = 100, windowSec = 60) {
  const key = `rate:${ip}`; // creates a unique Redis key for the IP,
  const now = Date.now();
  const windowStart = now - windowSec * 1000; // earliest time allowed in the current sliding window.

  // remove expired requests from the sorted set
  // Redis sorted set members have a score — here, the score is the timestamp of the request.
  // This removes all old request timestamps (with score <= windowStart) that are outside the current rate-limit window.
  await redis.zremrangebyscore(key, 0, windowStart); // counts how many timestamps remain in the set
  const count = await redis.zcard(key);

  if (count >= limit) return false;

  await redis.zadd(key, now, `${now}`); // adds the current request to the sorted set
  await redis.expire(key, windowSec); // ensures Redis can clean up this key if inactive.
  return true;
}
