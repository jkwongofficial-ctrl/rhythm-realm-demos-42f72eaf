import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PlayButton } from "./PlayButton";
import { Waveform } from "./Waveform";

interface MusicCardProps {
  title: string;
  genre: string;
  duration: string;
  coverIcon: string;
  audioSrc?: string;
  index: number;
  onPlay: (index: number) => void;
  isCurrentlyPlaying: boolean;
}

export const MusicCard = ({
  title,
  genre,
  duration,
  coverIcon,
  index,
  onPlay,
  isCurrentlyPlaying,
}: MusicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = () => {
    onPlay(index);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-card p-6 transition-all duration-500 cursor-pointer sketch-border",
        "hover:shadow-xl hover:-translate-y-2",
        isCurrentlyPlaying && "bg-mint-light/30",
      )}
      style={{
        animationDelay: `${index * 0.15}s`,
      }}
    >
      {/* Sketch-style corner decorations */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-primary rounded-tl-sm opacity-60" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-primary rounded-br-sm opacity-60" />

      {/* Cover icon area */}
      <div className={cn(
        "relative aspect-square mb-4 bg-muted rounded-lg flex items-center justify-center overflow-hidden",
        "transition-all duration-300",
        isHovered && "scale-105"
      )}>
        <span className="text-6xl select-none transition-transform duration-300 group-hover:animate-bounce-soft">
          {coverIcon}
        </span>
        
        {/* Play overlay */}
        <div className={cn(
          "absolute inset-0 bg-primary/10 flex items-center justify-center transition-opacity duration-300",
          isHovered || isCurrentlyPlaying ? "opacity-100" : "opacity-0"
        )}>
          <PlayButton 
            isPlaying={isCurrentlyPlaying} 
            onClick={handlePlay}
            size="md"
          />
        </div>
      </div>

      {/* Track info */}
      <div className="space-y-2">
        <h3 className={cn(
          "font-bold text-lg text-foreground leading-tight transition-colors",
          isCurrentlyPlaying && "text-secondary"
        )}>
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-hand text-base">
            {genre}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {duration}
          </span>
        </div>

        {/* Waveform visualization */}
        <div className="pt-2">
          <Waveform isPlaying={isCurrentlyPlaying} barCount={8} />
        </div>
      </div>

      {/* Playing indicator */}
      {isCurrentlyPlaying && (
        <div className="absolute top-3 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
          </span>
        </div>
      )}
    </div>
  );
};
