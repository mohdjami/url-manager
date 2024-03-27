import About from "@/components/pages/About";
import Features from "@/components/pages/Features";
import Hero from "@/components/pages/Hero";
export default async function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <About />
    </main>
  );
}
