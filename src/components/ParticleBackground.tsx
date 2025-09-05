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

// Throttle scroll updates to reduce calculations
const throttleScrollUpdates = (callback: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  return (...args: any[]) => {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      callback(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    }
  };
};

const ParticleBackground = ({ scrollProgress }: { scrollProgress: ScrollProgress }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastScrollRef = useRef({ progress: 0, velocity: 0 });

  // Reduce particle count for better performance
  const particleCount = useMemo(() => {
    return window.innerWidth < 768 ? 25 : 50; // Reduced from 50/100 to 25/50
  }, []);

  // Memoize particle generation
  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 1500 - 750,
        size: Math.random() * 30 + 15, // Slightly smaller: 15px – 45px
        rotationSpeed: Math.random() * 1.2 - 0.6,
        logo: techLogos[Math.floor(Math.random() * techLogos.length)],
      });
    }

    setParticles(newParticles);
  }, [particleCount]);

  useEffect(() => {
    generateParticles();
    
    const debouncedResize = throttleScrollUpdates(generateParticles, 250);
    window.addEventListener("resize", debouncedResize);
    
    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [generateParticles]);

  // Memoized transform calculations with significant optimization
  const particleStyles = useMemo(() => {
    const { progress, velocity } = scrollProgress;
    
    // Skip expensive calculations if scroll hasn't changed much
    const progressDiff = Math.abs(progress - lastScrollRef.current.progress);
    const velocityDiff = Math.abs(velocity - lastScrollRef.current.velocity);
    
    if (progressDiff < 0.001 && velocityDiff < 0.1) {
      return null; // Return null to indicate no update needed
    }
    
    lastScrollRef.current = { progress, velocity };

    return particles.map((particle) => {
      // Increased zoom effect - small scroll creates huge zoom
      const zOffset = particle.z + progress * 3500; // Increased from 2500 to 8000
      const scale = Math.max(0.1, 1 + zOffset / 800); // More aggressive scaling (decreased divisor from 1500 to 800)
      
      // Slow rotation for all particles (no individual rotation speeds)
      const rotateZ = progress * 30; // Slow, uniform rotation (reduced from particle.rotationSpeed * 360)
      
      // Calculate movement towards center during zoom
      const centerX = 50; // Center X position (50%)
      const centerY = 50; // Center Y position (50%)
      
      // Distance from center for this particle
      const distanceFromCenterX = particle.x - centerX;
      const distanceFromCenterY = particle.y - centerY;
      
      // Move particles towards center as they zoom (stronger effect with more progress)
      const zoomFactor = progress * 2; // Controls how much they move towards center
      const adjustedX = particle.x - (distanceFromCenterX * zoomFactor);
      const adjustedY = particle.y - (distanceFromCenterY * zoomFactor);
      
      const translateY = velocity * particle.rotationSpeed * 20;
      const opacity = Math.max(0, Math.min(1, 1 - Math.abs(zOffset) / 3000)); // Adjusted fade distance

      // Pre-calculate transform string with adjusted positions
      const transform = `translate3d(${adjustedX}%, ${adjustedY + translateY}%, ${zOffset}px) scale(${scale}) rotateZ(${rotateZ}deg)`;

      return {
        transform,
        opacity,
        // Include particle data for key reference
        id: particle.id,
      };
    });
  }, [particles, scrollProgress.progress, scrollProgress.velocity]);

  // Use previous styles if no update needed
  const [cachedStyles, setCachedStyles] = useState<any[]>([]);
  
  useEffect(() => {
    if (particleStyles) {
      setCachedStyles(particleStyles);
    }
  }, [particleStyles]);

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
        perspective: "8000px", 
        perspectiveOrigin: "50% 50%",
        contain: "layout style paint", // CSS containment for performance
        willChange: "transform" // Hint for GPU acceleration
      }}
    >
      {particles.map((particle, index) => {
        const style = cachedStyles[index];
        if (!style) return null;

        return (
          <img
            key={particle.id}
            src={particle.logo}
            alt="tech-logo"
            loading="lazy" // Lazy load images
            decoding="async" // Async image decoding
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              willChange: "transform, opacity",
              transform: style.transform,
              opacity: style.opacity,
              backfaceVisibility: "hidden", // Prevent flickering
              transformStyle: "preserve-3d", // Better 3D rendering
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleBackground;