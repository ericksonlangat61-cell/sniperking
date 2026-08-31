import React, { useEffect, useRef, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fade, setFade] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 14 + 14,
        opacity: Math.random() * 0.4 + 0.6
      });
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reset if off screen
        if (particle.y > canvas.height) {
          particle.y = -50;
          particle.x = Math.random() * canvas.width;
          particle.opacity = Math.random() * 0.4 + 0.6;
        }

        // Draw particle
        ctx.fillStyle = `rgba(0, 255, 136, ${particle.opacity})`;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15;
        ctx.font = `bold ${particle.size}px 'Arial'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', particle.x, particle.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      const fadeTimer = setTimeout(onFinish, 500);
      return () => clearTimeout(fadeTimer);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundImage: 'url(/sniperking/splash-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fade ? 0 : 1,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.3 }}></div>

      {/* Canvas for falling dollars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      ></canvas>

      {/* Content already in background image */}
    </div>
  );
}
