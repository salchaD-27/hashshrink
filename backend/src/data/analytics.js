// Redis + Bloom filter, to track and count hits and approximate unique visitors for items identified by a shortCode.

import Redis from 'ioredis';
import { BloomFilter } from 'bloomfilter';
const redis = new Redis(); // initializes a Redis client, allows async access to Redis databases from node.js, with built-in Promise support

// tracks the total number of times a given shortCode is accessed
export async function incrementHit(shortCode) { // increments the numeric value stored under the key hits:<shortCode>
  await redis.incr(`hits:${shortCode}`); // standard Redis command to atomically increment integers stored at a given key
}

// gets the current hit count for a given shortCode by retrieving the key's value from Redis and converting it to an integer
export async function getHits(shortCode) {
  return parseInt(await redis.get(`hits:${shortCode}`)) || 0; // defaulting to 0 if missing/invalid
}

// Approximate unique visitors tracking
// Bloom filter - probabilistic data structure for fast, space-efficient set membership checks
const filter = new BloomFilter(32 * 256, 16); // fixed size and hash function count; adjusted for desired accuracy and memory trade-off
export function trackUniqueVisitor(shortCode, visitorId) {
  if (!filter.test(visitorId)) {
    filter.add(visitorId); // If the provided visitorId hasn't been seen before for this session (not present in the filter), it's added.
    redis.incr(`unique:${shortCode}`); // When a new visitor is detected (first time in filter), the Redis counter unique:<shortCode> is incremented, recording another unique visitor
  }
}
