import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export async function setMapping(shortCode, originalURL) {
  await redis.set(`short:${shortCode}`, originalURL);
  await redis.set(`url:${originalURL}`, shortCode);
}

export async function getByShortCode(shortCode) {
  return redis.get(`short:${shortCode}`);
}

export async function getByOriginalURL(originalURL) {
  return redis.get(`url:${originalURL}`);
}
