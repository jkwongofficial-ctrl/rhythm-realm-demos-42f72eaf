import { cn } from "@/lib/utils";

interface WaveformProps {
  isPlaying: boolean;
  className?: string;
  barCount?: number;
}

export const Waveform = ({ isPlaying, className, barCount = 5 }: WaveformProps) => {
  return (
    <div className={cn("flex items-end gap-1 h-8", className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 bg-secondary rounded-full transition-all duration-300",
            isPlaying ? "waveform-bar" : "h-2"
          )}
          style={{
            height: isPlaying ? `${Math.random() * 60 + 40}%` : "25%",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};
