import { redis } from "./redis";
export const rateLimiting = async (ip: string) => {
  await redis.incr(ip);
  await redis.expire(ip, 60);
  const count = await redis.get(ip);
  if (!count) {
    return false;
  }
  if (+count > 5) {
    return true;
  }
};
