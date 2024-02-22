import { redis } from "./redis";
export const rateLimiting = async (ip: string) => {
  await redis.incr(ip);
  await redis.expire(ip, 60 * 15);
  const count = await redis.get(ip);
  console.log(count);
  if (!count) {
    return false;
  }
  if (+count > 50) {
    throw new Error("Too many requests wait for 15 minutes to start again");
  }
};
