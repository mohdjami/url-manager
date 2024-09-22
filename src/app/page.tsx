import About from "@/components/pages/About";
import Features from "@/components/pages/Features";
import Hero from "@/components/pages/Hero";
export default async function Home() {
  return (
    <main>
      <div>
        <title>V2 URL Manager</title>
        <meta name="description" content="Home page" />
      </div>
      <Hero />
      <Features />
      <About />
    </main>
  );
}
