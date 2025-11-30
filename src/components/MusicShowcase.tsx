import { useState, useEffect, useRef } from "react";
import { MusicCard } from "./MusicCard";
import { cn } from "@/lib/utils";

const musicTracks = [
  {
    title: "Epic Boss Battle",
    genre: "Orchestral",
    duration: "3:42",
    coverIcon: "⚔️",
  },
  {
    title: "Forest Whispers",
    genre: "Ambient",
    duration: "4:15",
    coverIcon: "🌲",
  },
  {
    title: "Neon Streets",
    genre: "Synthwave",
    duration: "2:58",
    coverIcon: "🌃",
  },
  {
    title: "Victory Theme",
    genre: "Fanfare",
    duration: "1:24",
    coverIcon: "🏆",
  },
  {
    title: "Mystical Cave",
    genre: "Fantasy",
    duration: "5:01",
    coverIcon: "💎",
  },
  {
    title: "Pixel Adventure",
    genre: "Chiptune",
    duration: "2:33",
    coverIcon: "👾",
  },
];

export const MusicShowcase = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlay = (index: number) => {
    setPlayingIndex(playingIndex === index ? null : index);
  };

  return (
    <section 
      id="music" 
      ref={sectionRef}
      className="py-20 md:py-32 bg-paper"
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Musical <span className="text-secondary">Pieces</span>
          </h2>
          <p className="font-hand text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
            Click to play and experience the soundscapes I've crafted for games
          </p>
          
          {/* Decorative underline */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-secondary rounded-full" />
          </div>
        </div>

        {/* Music grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {musicTracks.map((track, index) => (
            <div
              key={track.title}
              className={cn(
                "transition-all duration-700",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <MusicCard
                {...track}
                index={index}
                onPlay={handlePlay}
                isCurrentlyPlaying={playingIndex === index}
              />
            </div>
          ))}
        </div>

        {/* Now playing bar */}
        {playingIndex !== null && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t-3 border-primary p-4 shadow-2xl animate-fade-in-up z-50">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{musicTracks[playingIndex].coverIcon}</span>
                <div>
                  <p className="font-bold text-foreground">{musicTracks[playingIndex].title}</p>
                  <p className="text-sm text-muted-foreground font-hand">{musicTracks[playingIndex].genre}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Progress bar */}
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">0:00</span>
                  <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full w-1/3 animate-pulse" />
                  </div>
                  <span className="text-xs text-muted-foreground">{musicTracks[playingIndex].duration}</span>
                </div>
                
                <button
                  onClick={() => setPlayingIndex(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Stop"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
