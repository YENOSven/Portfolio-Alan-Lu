import { useEffect, useState } from "react";
import blueboxIntro from "@/assets/bluebox-intro.jpg";

type IntroSplashProps = {
  /** Duration in ms before auto-dismiss (default 3000) */
  duration?: number;
  onComplete: () => void;
};

const DEFAULT_DURATION = 3000; // 3 seconds

export function IntroSplash({
  duration = DEFAULT_DURATION,
  onComplete,
}: IntroSplashProps) {
  const [fading, setFading] = useState(false);

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Complete after fade
  useEffect(() => {
    if (fading) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fading, onComplete]);

  const handleSkip = () => {
    setFading(true);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer transition-opacity duration-1000 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Single intro image */}
      <div className="absolute inset-0">
        <img
          src={blueboxIntro}
          alt="Blue Box - Chinatsu and Taiki"
          className="w-full h-full object-cover animate-[scale-in_1s_ease-out]"
        />
      </div>

      {/* Dark overlay for text visibility */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Title overlay */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
          Alan Lu
        </h1>
        <p className="text-white/80 text-lg md:text-xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Welcome to my portfolio
        </p>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm pointer-events-none animate-pulse">
        Click anywhere to continue
      </div>
    </div>
  );
}
