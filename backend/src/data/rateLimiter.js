import Redis from 'ioredis';
const redis = new Redis();

export async function isAllowed(ip, limit = 100, windowSec = 60) {
  const key = `rate:${ip}`;
  const now = Date.now();
  const windowStart = now - windowSec * 1000;

  await redis.zremrangebyscore(key, 0, windowStart);
  const count = await redis.zcard(key);

  if (count >= limit) return false;

  await redis.zadd(key, now, `${now}`);
  await redis.expire(key, windowSec);
  return true;
}
