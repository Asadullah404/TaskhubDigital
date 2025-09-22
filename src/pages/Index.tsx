import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import About from "@/components/About";
import { Helmet } from "react-helmet";

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

      setScrollProgress({
        scrollY,
        progress,
        velocity,
      });

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
        background: `linear-gradient(135deg, 
          hsl(220, 30%, 5%) 0%, 
          hsl(240, 25%, 8%) 50%, 
          hsl(260, 20%, 6%) 100%)`,
      }}
    >
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>
          TaskHubDigital – Web Development, SEO, Content Writing & Graphic Design
        </title>
        <meta
          name="description"
          content="TaskHubDigital offers Web Development, SEO Optimization, Content Writing, and Graphic Design services in Karachi and worldwide. Boost your online presence today."
        />
        <meta
          name="keywords"
          content="Web Development, SEO Optimization, Content Writing, Graphic Design, Logo Design, Karachi Pakistan, React Development, Next.js Development, Mobile App Development"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com" />

        {/* ✅ Schema.org Structured Data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TaskHubDigital",
            "url": "https://yourwebsite.com",
            "logo": "https://yourwebsite.com/logo.png",
            "sameAs": [
              "https://www.facebook.com/yourpage",
              "https://www.linkedin.com/company/yourpage"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Karachi",
              "addressCountry": "PK"
            },
            "description": "TaskHubDigital offers Web Development, SEO Optimization, Content Writing, and Graphic Design services."
          }
        `}</script>
      </Helmet>

      <CustomCursor />
      <ParticleBackground scrollProgress={scrollProgress} />

      {/* ✅ Header with anchor links */}
      <Header scrollProgress={scrollProgress} />

      <main>
        {/* ✅ Hero with H1 keyword */}
        <section id="home">
          <h1 className="sr-only">
            TaskHubDigital – Digital Services: Web Development, SEO, Content Writing & Graphic Design
          </h1>
          <Hero scrollProgress={scrollProgress.progress} />
        </section>

        {/* ✅ Services Section */}
        <section id="services">
          <h2>Our Digital Services</h2>
          <Services scrollProgress={scrollProgress.progress} />
        </section>

        {/* ✅ About Section */}
        <section id="about">
          <h2>About TaskHubDigital</h2>
          <About scrollProgress={scrollProgress.progress} />
        </section>

        {/* ✅ Testimonials */}
        <section id="testimonials">
          <h2>What Our Clients Say</h2>
          <Testimonials scrollProgress={scrollProgress.progress} />
        </section>
      </main>

      {/* ✅ Footer with contact info */}
      <Footer scrollProgress={scrollProgress} />
    </div>
  );
};

export default Index;
