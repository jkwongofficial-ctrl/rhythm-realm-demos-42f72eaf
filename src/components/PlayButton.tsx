import { useState } from "react";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PlayButton = ({ isPlaying, onClick, size = "md", className }: PlayButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 26,
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-primary transition-all duration-300",
        "hover:scale-110 active:scale-95 sketch-border-thin",
        sizeClasses[size],
        isHovered && "animate-wiggle",
        className
      )}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {/* Pulse ring when playing */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full bg-secondary animate-pulse-ring" />
      )}
      
      {/* Icon */}
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10 text-primary-foreground"
        style={{ strokeWidth: 2.5 }}
      >
        {isPlaying ? (
          // Pause icon - hand-drawn style
          <>
            <path
              d="M6 4h4v16H6z"
              fill="currentColor"
              className="origin-center"
            />
            <path
              d="M14 4h4v16h-4z"
              fill="currentColor"
              className="origin-center"
            />
          </>
        ) : (
          // Play icon - hand-drawn style triangle
          <path
            d="M6 3l15 9-15 9V3z"
            fill="currentColor"
            className="origin-center"
          />
        )}
      </svg>
    </button>
  );
};
