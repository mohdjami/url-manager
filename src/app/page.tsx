// import User from "@/components/User";
import Hero from "@/components/Hero";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { startMessageConsumer } from "./kafka/consumer";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <Hero />;
}
