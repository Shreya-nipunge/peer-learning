import React, { useEffect, useState, useRef } from 'react';

const Sparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkleIdRef = useRef(0);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let lastMoveTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < 50) return; // Limit to ~20 renders per second
      lastMoveTime = now;

      const newSparkles = Array.from({ length: 2 }).map(() => ({
        id: sparkleIdRef.current++,
        x: e.clientX + Math.random() * 10 - 5,
        y: e.clientY + Math.random() * 10 - 5,
      }));

      setSparkles((prev) => [...prev, ...newSparkles]);

      newSparkles.forEach((sparkle) => {
        const timeout = setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
          timeouts = timeouts.filter((t) => t !== timeout); // Prevent memory leak!
        }, 800);
        timeouts.push(timeout);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div id="sparkle-container">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{ left: `${sparkle.x}px`, top: `${sparkle.y}px`, position: 'absolute', pointerEvents: 'none' }}
        />
      ))}
    </div>
  );
};

export default React.memo(Sparkles);
