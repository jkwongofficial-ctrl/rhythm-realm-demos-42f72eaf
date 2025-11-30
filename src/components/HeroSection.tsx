import { useState, useEffect } from "react";
import heroCharacter from "@/assets/hero-character.png";
import { cn } from "@/lib/utils";

export const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToMusic = () => {
    document.getElementById("music")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[10%] left-[5%] text-4xl md:text-5xl animate-float opacity-20">♪</span>
        <span className="absolute top-[15%] right-[10%] text-5xl md:text-6xl animate-float opacity-15" style={{ animationDelay: "1s" }}>♫</span>
        <span className="absolute bottom-[25%] left-[8%] text-3xl md:text-4xl animate-float opacity-20" style={{ animationDelay: "2s" }}>♬</span>
        <span className="absolute top-[35%] left-[20%] text-4xl animate-float opacity-10" style={{ animationDelay: "0.5s" }}>🎵</span>
        <span className="absolute bottom-[35%] right-[15%] text-5xl animate-float opacity-15" style={{ animationDelay: "1.5s" }}>🎶</span>
      </div>

      {/* Main hero content */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex items-center justify-center py-8 md:py-16">
        <div className={cn(
          "relative w-full transition-all duration-1000",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          {/* Hero image */}
          <img
            src={heroCharacter}
            alt="Yash Deshpande - Game Music Producer"
            className="w-full h-auto max-h-[75vh] object-contain mx-auto"
          />
          
          {/* Overlay badge */}
          <div className={cn(
            "absolute bottom-4 left-4 md:bottom-8 md:left-8 lg:bottom-12 lg:left-12 transition-all duration-700 delay-300",
            isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}>
            <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full sketch-border-thin">
              <p className="text-secondary font-bold text-sm md:text-lg tracking-wide">
                🎮 Game Music Producer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        onClick={scrollToMusic}
        className={cn(
          "pb-8 cursor-pointer transition-all duration-700 delay-500",
          "hover:scale-110 active:scale-95",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <span className="font-hand text-lg">Listen to my work</span>
          <div className="animate-bounce-soft">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
