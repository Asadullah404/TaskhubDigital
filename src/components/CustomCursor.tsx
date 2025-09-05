import { useEffect, useRef, useState } from "react";

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrame: number;

    const updateTarget = (x: number, y: number) => {
      targetPos.current = { x, y };
      setIsVisible(true);
    };

    const mouseMove = (e: MouseEvent) => updateTarget(e.clientX, e.clientY);
    const touchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        updateTarget(t.clientX, t.clientY);
      }
    };

    const animate = () => {
      // Make the dot follow instantly (no lerp)
      currentPos.current.x = targetPos.current.x;
      currentPos.current.y = targetPos.current.y;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${
          currentPos.current.x - 8
        }px, ${currentPos.current.y - 8}px, 0) scale(${isHovering ? 1.3 : 1})`;
        cursorRef.current.style.opacity = isVisible ? "1" : "0";
      }

      // Make the ring trail but faster (lerp 0.35 for snappy)
      if (ringRef.current) {
        const ringX = lerp(
          parseFloat(ringRef.current.style.left || "0"),
          targetPos.current.x - 16,
          0.35
        );
        const ringY = lerp(
          parseFloat(ringRef.current.style.top || "0"),
          targetPos.current.y - 16,
          0.35
        );

        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
        ringRef.current.style.transform = `scale(${isHovering ? 1.6 : 1})`;
        ringRef.current.style.opacity = isVisible ? "1" : "0";
      }

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    // Listeners
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("touchmove", touchMove);
    document.addEventListener("mouseleave", () => setIsVisible(false));
    document.addEventListener("touchend", () => setIsVisible(false));

    const interactiveElements = document.querySelectorAll(
      "button, a, .service-card, .hover-lift, .hover-glow"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => setIsHovering(true));
      el.addEventListener("mouseleave", () => setIsHovering(false));
      el.addEventListener("touchstart", () => setIsHovering(true));
      el.addEventListener("touchend", () => setIsHovering(false));
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("touchmove", touchMove);
    };
  }, [isHovering, isVisible]);

  return (
    <>
      {/* Fast dot (follows instantly) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary pointer-events-none z-[9999] shadow-[0_0_20px_rgba(59,130,246,0.7)]"
      />

      {/* Ring (smooth + slightly trailing) */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] w-10 h-10 border-2 border-primary/40 rounded-full"
        style={{ left: 0, top: 0 }}
      />
    </>
  );
};

export default CustomCursor;
