import { useEffect, useState, useRef } from "react";
import { ScrollProgress } from "@/pages/Index";

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  rotationSpeed: number;
  logo: string; // path to logo
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

const ParticleBackground = ({ scrollProgress }: { scrollProgress: ScrollProgress }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = window.innerWidth < 768 ? 50 : 100; // more logos

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          z: Math.random() * 1500 - 750,
          size: Math.random() * 40 + 20, // 20px – 60px logos
          rotationSpeed: Math.random() * 1.2 - 0.6,
          logo: techLogos[Math.floor(Math.random() * techLogos.length)],
        });
      }

      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener("resize", generateParticles);
    return () => window.removeEventListener("resize", generateParticles);
  }, []);

  const getTransform = (particle: Particle) => {
    const { progress, velocity } = scrollProgress;

    const zOffset = particle.z + progress * 2500; // fly inside
    const scale = Math.max(0.2, 1 + zOffset / 1500); // closer → bigger
    const rotateZ = progress * particle.rotationSpeed * 360 + velocity * 5;
    const translateY = velocity * particle.rotationSpeed * 20;

    return {
      transform: `translate3d(${particle.x}%, ${particle.y + translateY}%, ${zOffset}px) 
                  scale(${scale}) rotateZ(${rotateZ}deg)`,
      opacity: Math.max(0, Math.min(1, 1 - Math.abs(zOffset) / 2000)), // fade away far objects
    };
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ perspective: "8000px", perspectiveOrigin: "50% 50%" }}
    >
      {particles.map((particle) => (
        <img
          key={particle.id}
          src={particle.logo}
          alt="tech-logo"
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            willChange: "transform, opacity",
            ...getTransform(particle),
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
