"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";


export interface HeroProps {
  scrollProgress: number; // ✅ ensure type is exported so index.tsx can use
}

const Hero: React.FC<HeroProps> = ({ scrollProgress }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0"
    >
      {/* 3D Starfield Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars
            radius={100}
            depth={80}
            count={8000}
            factor={4}
            saturation={0}
            fade
            speed={2 + scrollProgress * 5} // 🚀 speed depends on scroll
          />
        </Canvas>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-80" />

      {/* Content */}
      <div
        className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
          Get Your{" "}
          <span className="gradient-text">Digital Tasks</span>{" "}
          Done –{" "}
          <span className="text-primary-glow">Fast & Easy</span>
        </h1>

        <p className="text-lg md:text-2xl text-muted-foreground mb-8 leading-relaxed">
          Coding, Web Development, SEO, Content Writing & More
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-4 text-lg animate-pulse-glow hover-lift"
            onClick={scrollToServices}
          >
            Select Your Task
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg hover-glow"
          >
            Learn More
          </Button>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-effect p-6 rounded-lg hover-lift animate-float">
            <div className="text-3xl font-bold gradient-text">500+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div
            className="glass-effect p-6 rounded-lg hover-lift animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="text-3xl font-bold gradient-text">50+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div
            className="glass-effect p-6 rounded-lg hover-lift animate-float"
            style={{ animationDelay: "2s" }}
          >
            <div className="text-3xl font-bold gradient-text">24/7</div>
            <div className="text-muted-foreground">Support Available</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown
          size={32}
          className="text-primary cursor-pointer hover:text-primary-glow transition-colors"
          onClick={scrollToServices}
        />
      </div>
    </section>
  );
};

export default Hero;
