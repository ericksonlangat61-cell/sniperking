import React, { useRef, useState, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function LoginPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize subtle falling particles
    const particles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 1 + 0.5,
        size: Math.random() * 8 + 10,
        opacity: Math.random() * 0.2 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.y > canvas.height) {
          particle.y = -50;
          particle.x = Math.random() * canvas.width;
          particle.opacity = Math.random() * 0.2 + 0.1;
        }

        ctx.fillStyle = `rgba(0, 255, 136, ${particle.opacity})`;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 8;
        ctx.font = `bold ${particle.size}px 'Arial'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', particle.x, particle.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual login API call
      console.log('Login attempt:', { username, password, rememberMe });
      // For now, just simulate
      setTimeout(() => {
        setLoading(false);
        // Redirect to dashboard on success
      }, 1000);
    } catch (err) {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/sniperking/splash-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.6 }}></div>

      {/* Canvas for falling dollars background */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ background: 'transparent' }}></canvas>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div
          className="rounded-2xl p-8 border-2"
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.85)',
            borderColor: '#FFD700',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{
              backgroundImage: 'linear-gradient(90deg, #FFD700, #D4AF37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">Login to continue to SNIPERKING</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', borderLeft: '3px solid #FF4444' }}>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Username or Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or email"
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: '#0e0e0e',
                  borderColor: '#2a2a2a',
                  color: '#EAEAEA',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00FF88'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 12 characters"
                  className="w-full px-4 py-3 rounded-lg border pr-10"
                  style={{
                    backgroundColor: '#0e0e0e',
                    borderColor: '#2a2a2a',
                    color: '#EAEAEA',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00FF88'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#00FF88' }}
                />
                <span className="ml-2 text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-gray-500 hover:text-green-400 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-black transition-all mt-6 uppercase tracking-wider"
              style={{
                backgroundImage: 'linear-gradient(90deg, #FFD700, #FFC107)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                transform: loading ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '🔄 Connecting...' : '→ Sign In to SNIPERKING'}
            </button>
          </form>

          {/* Contact Admin */}
          <p className="text-center text-gray-500 text-xs mt-6">Contact admin for access</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600 text-xs font-mono">
        SNIPERKING.SITE.$ • 0-80ms LIVE • Advanced Deriv Market Intelligence
      </div>
    </div>
  );
}
