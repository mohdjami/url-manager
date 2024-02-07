import { db } from "./db";

const isVarified = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user?.emailVerified === null) {
    return false;
  }
  return true;
};

export default isVarified;
