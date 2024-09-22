import About from "@/components/pages/About";
import Features from "@/components/pages/Features";
import Hero from "@/components/pages/Hero";
export default async function Home() {
  return (
    <main>
      <div>
        <title>
          V2 URL Manager I am revamping this project with Supabase. Please wait
          for version 2.
        </title>
        <meta name="description" content="Home page" />
      </div>
      <Hero />
      <Features />
      <About />
    </main>
  );
}
