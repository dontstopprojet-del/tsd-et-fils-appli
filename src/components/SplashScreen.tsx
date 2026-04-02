import { useEffect, useState } from 'react';
import { COLORS } from '../constants/theme';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);

    const duration = 2800;
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 300);
          setTimeout(onComplete, 800);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-all duration-700 ${fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      style={{ background: `linear-gradient(160deg, #0D3B54 0%, ${COLORS.primary} 35%, #0A3D5C 65%, ${COLORS.secondary} 100%)` }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.15 + 0.05,
              animationDelay: Math.random() * 2 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3, 4].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border border-cyan-400/10"
            style={{
              width: 150 + ring * 80 + 'px',
              height: 150 + ring * 80 + 'px',
              animation: `pulse ${3 + ring * 0.5}s ease-in-out infinite`,
              animationDelay: ring * 0.3 + 's',
            }}
          />
        ))}
      </div>

      <div className={`relative transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute inset-0 blur-3xl bg-cyan-400/20 rounded-full scale-150" />

        <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-52 md:h-52 relative z-10 drop-shadow-2xl">
          <defs>
            <linearGradient id="splashDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="35%" stopColor="#00B8D4" />
              <stop offset="70%" stopColor="#0088CC" />
              <stop offset="100%" stopColor="#005580" />
            </linearGradient>
            <linearGradient id="splashShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.7" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id="splashGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g filter="url(#splashGlow)">
            <path
              d="M100 12 C100 12 160 78 160 115 C160 143 133 165 100 165 C67 165 40 143 40 115 C40 78 100 12 100 12 Z"
              fill="url(#splashDropGrad)"
            />
          </g>

          <ellipse cx="68" cy="82" rx="20" ry="14" fill="url(#splashShine)" transform="rotate(-40, 68, 82)" />
          <ellipse cx="78" cy="98" rx="10" ry="6" fill="white" opacity="0.35" transform="rotate(-40, 78, 98)" />
          <ellipse cx="85" cy="108" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-40, 85, 108)" />

          <text
            x="100"
            y="125"
            textAnchor="middle"
            fontSize="56"
            fontWeight="900"
            fill="white"
            fontFamily="Arial, sans-serif"
            letterSpacing="4"
            filter="url(#innerGlow)"
          >
            TSD
          </text>

          <line x1="60" y1="138" x2="140" y2="138" stroke="white" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />

          <g className="animate-pulse">
            <circle cx="100" cy="185" r="4" fill="#00D4FF" opacity="0.6" />
            <circle cx="80" cy="190" r="2.5" fill="#00D4FF" opacity="0.4" />
            <circle cx="120" cy="190" r="2.5" fill="#00D4FF" opacity="0.4" />
            <circle cx="90" cy="195" r="1.5" fill="#00D4FF" opacity="0.3" />
            <circle cx="110" cy="195" r="1.5" fill="#00D4FF" opacity="0.3" />
          </g>
        </svg>
      </div>

      <div className={`mt-10 text-center relative z-10 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1
          className="text-4xl md:text-5xl font-black text-white tracking-tight"
          style={{ textShadow: '0 4px 30px rgba(0, 212, 255, 0.5)' }}
        >
          TSD <span className="text-2xl md:text-3xl font-light italic text-cyan-300">et</span> Fils
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <p className="text-cyan-200/90 text-sm md:text-base tracking-[0.25em] uppercase font-light">
            Plomberie & Sanitaire
          </p>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </div>
      </div>

      <div className={`mt-14 w-72 md:w-96 relative z-10 transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full rounded-full transition-all duration-75 relative"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00D4FF 0%, #00E5FF 50%, #FFD700 100%)',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)',
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-white/60 text-xs tracking-widest font-light">
              {progress < 30 ? 'Initialisation...' : progress < 70 ? 'Chargement...' : progress < 100 ? 'Finalisation...' : 'Bienvenue!'}
            </p>
            <p className="text-cyan-300 text-base font-mono font-bold tracking-wider">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-8 flex items-center gap-3 transition-all duration-1000 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: i * 0.2 + 's',
              }}
            />
          ))}
        </div>
        <span className="text-white/40 text-xs tracking-[0.15em] uppercase">Excellence & Innovation</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: (2 - i) * 0.2 + 's',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
