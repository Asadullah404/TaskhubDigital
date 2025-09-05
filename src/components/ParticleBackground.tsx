import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { ScrollProgress } from "@/pages/Index";

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  rotationSpeed: number;
  logo: string;
}

const techLogos = [
  "/logos/python.svg",
  "/logos/javascript.svg",
  "/logos/java.svg",
  "/logos/firebase.svg",
  "/logos/react.svg",
  "/logos/nodejs.svg",
  "/logos/html.svg",
  "/logos/css.svg",
  "/logos/content-writing.svg",
];

// Simplified throttle function
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  return (...args: any[]) => {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func(...args);
        timeoutId = null;
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

const ParticleBackground = ({ scrollProgress }: { scrollProgress: ScrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastScrollRef = useRef({ progress: 0, velocity: 0 });
  const particlesRef = useRef<any[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  // Further reduce particle count for mobile
  const particleCount = useMemo(() => {
    return windowSize.width < 768 ? 15 : 30;
  }, [windowSize.width]);

  // Handle window resize
  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, 250);
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize particle generation
  const generateParticles = useCallback(() => {
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 1000 - 500, // Reduced z-range for better performance
        size: Math.random() * 20 + 10, // Smaller particles: 10px – 30px
        rotationSpeed: Math.random() * 0.8 - 0.4, // Slower rotation
        logo: techLogos[Math.floor(Math.random() * techLogos.length)],
      });
    }
    
    particlesRef.current = newParticles;
    setForceUpdate(prev => prev + 1); // Force re-render
  }, [particleCount]);

  useEffect(() => {
    generateParticles();
  }, [generateParticles, windowSize]);

  // Use direct DOM manipulation for better performance
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles = particlesRef.current;
    const { progress, velocity } = scrollProgress;
    
    // Skip expensive calculations if scroll hasn't changed much
    const progressDiff = Math.abs(progress - lastScrollRef.current.progress);
    const velocityDiff = Math.abs(velocity - lastScrollRef.current.velocity);
    
    if (progressDiff < 0.001 && velocityDiff < 0.1) {
      return;
    }
    
    lastScrollRef.current = { progress, velocity };
    
    // Use requestAnimationFrame for smooth animations
    const updateParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const element = container.children[i] as HTMLElement;
        if (!element) continue;
        
        // Calculate transformations
        const zOffset = particle.z + progress * 2000; // Reduced zoom effect
        const scale = Math.max(0.1, 1 + zOffset / 1000);
        const rotateZ = progress * 20;
        
        // Calculate movement towards center during zoom
        const centerX = 50;
        const centerY = 50;
        const distanceFromCenterX = particle.x - centerX;
        const distanceFromCenterY = particle.y - centerY;
        const zoomFactor = progress * 1.5;
        const adjustedX = particle.x - (distanceFromCenterX * zoomFactor);
        const adjustedY = particle.y - (distanceFromCenterY * zoomFactor);
        
        const translateY = velocity * particle.rotationSpeed * 10;
        const opacity = Math.max(0, Math.min(1, 1 - Math.abs(zOffset) / 2000));
        
        // Apply transformations directly to DOM
        element.style.transform = `translate3d(${adjustedX}%, ${adjustedY + translateY}%, ${zOffset}px) scale(${scale}) rotateZ(${rotateZ}deg)`;
        element.style.opacity = `${opacity}`;
      }
      
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateParticles);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress.progress, scrollProgress.velocity]);

  // Pre-load images to prevent layout shifts
  useEffect(() => {
    techLogos.forEach(logo => {
      const img = new Image();
      img.src = logo;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ 
        perspective: windowSize.width < 768 ? "2500px" : "3000px", // Responsive perspective
        perspectiveOrigin: "50% 50%",
        contain: "strict", // Strict CSS containment
        willChange: "transform"
      }}
    >
      {particlesRef.current.map((particle) => (
        <img
          key={particle.id}
          src={particle.logo}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            // Initial transform to prevent initial flash
            transform: `translate3d(${particle.x}%, ${particle.y}%, ${particle.z}px) scale(1) rotateZ(0deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;