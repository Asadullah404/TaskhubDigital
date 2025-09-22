import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import About from "@/components/About";

export interface ScrollProgress {
  scrollY: number;
  progress: number;
  velocity: number;
}

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    scrollY: 0,
    progress: 0,
    velocity: 0,
  });

  const lastScrollY = useRef(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      const velocity = (scrollY - lastScrollY.current) * 0.1;

      setScrollProgress({ scrollY, progress, velocity });
      lastScrollY.current = scrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen bg-background transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "linear-gradient(135deg, hsl(220, 30%, 5%) 0%, hsl(240, 25%, 8%) 50%, hsl(260, 20%, 6%) 100%)",
      }}
    >
      <CustomCursor />
      <ParticleBackground scrollProgress={scrollProgress} />
      <Header scrollProgress={scrollProgress} />

      <main>
        {/* Main brand heading for SEO */}
        <h1 className="sr-only">TaskHubDigital - Professional Digital Services</h1>

        <section id="hero">
          <Hero scrollProgress={scrollProgress.progress} />
        </section>

        <section id="services">
          <Services scrollProgress={scrollProgress.progress} />
        </section>

        <section id="about">
          <About scrollProgress={scrollProgress.progress} />
        </section>

        <section id="testimonials">
          <Testimonials scrollProgress={scrollProgress.progress} />
        </section>
      </main>

      <Footer scrollProgress={scrollProgress} />
    </div>
  );
};

export default Index;
