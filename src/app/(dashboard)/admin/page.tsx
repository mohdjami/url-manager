import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Admin = async () => {
  const session = await getServerSession(authOptions);
  console.log(session, "session");
  if (session?.user) {
    return (
      <div className="text-2xl">Welcome to admin {session?.user.username}</div>
    );
  }
  return <h2>Please login to see this admin page</h2>;
};

export default Admin;
