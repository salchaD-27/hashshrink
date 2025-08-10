// Redis-based key–value storage to store and look up short URLs and their corresponding original URL
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export async function setMapping(shortCode, originalURL) {
  // creating two mappings
  await redis.set(`short:${shortCode}`, originalURL); // enables looking up the original URL when a user visits a short link.
  await redis.set(`url:${originalURL}`, shortCode); // enables reverse lookup
}
// redis.set overwrites if the key already exists

export async function getByShortCode(shortCode) {
  return redis.get(`short:${shortCode}`);
}

export async function getByOriginalURL(originalURL) {
  return redis.get(`url:${originalURL}`);
}
