import Redis from 'ioredis';
import { BloomFilter } from 'bloomfilter';
const redis = new Redis();

export async function incrementHit(shortCode) {
  await redis.incr(`hits:${shortCode}`);
}

export async function getHits(shortCode) {
  return parseInt(await redis.get(`hits:${shortCode}`)) || 0;
}

// Approximate unique visitors
const filter = new BloomFilter(32 * 256, 16); // adjust bits & hashes
export function trackUniqueVisitor(shortCode, visitorId) {
  if (!filter.test(visitorId)) {
    filter.add(visitorId);
    redis.incr(`unique:${shortCode}`);
  }
}
