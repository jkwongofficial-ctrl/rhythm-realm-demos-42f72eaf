import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  duration: string;
  cover_icon: string;
  audio_url: string;
}

interface ModalMusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: MusicTrack[];
  currentTrackIndex: number | null;
  onTrackSelect: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const ModalMusicPlayer = ({
  isOpen,
  onClose,
  tracks,
  currentTrackIndex,
  onTrackSelect,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
}: ModalMusicPlayerProps) => {
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleNextTrack = () => {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      onTrackSelect(currentTrackIndex + 1);
    }
  };

  const handlePrevTrack = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      onTrackSelect(currentTrackIndex - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col sketch-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-muted">
          <h2 className="text-xl font-bold text-foreground">All Tracks</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Player */}
        {currentTrackIndex !== null && (
          <div className="p-6 bg-muted/30 border-b border-muted">
            <div className="text-center mb-4">
              <span className="text-4xl">{tracks[currentTrackIndex].cover_icon}</span>
              <p className="font-bold text-foreground mt-2">{tracks[currentTrackIndex].title}</p>
              <p className="text-sm text-muted-foreground">{tracks[currentTrackIndex].genre}</p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-full cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
            </div>

            {/* Player controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrevTrack}
                disabled={currentTrackIndex === 0}
                className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6V6zm3.5 6l8.5-6v12l-8.5-6z" />
                </svg>
              </button>

              <button
                onClick={onPlayPause}
                className="p-3 bg-primary hover:bg-primary/90 rounded-full transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  {isPlaying ? (
                    <>
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </>
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>

              <button
                onClick={handleNextTrack}
                disabled={currentTrackIndex === tracks.length - 1}
                className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6h2v12h-2V6zm-3.5 6L4 18V6l8.5 6z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Playlist */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-muted">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => onTrackSelect(index)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3",
                  currentTrackIndex === index && "bg-primary/10 border-l-4 border-primary"
                )}
              >
                <span className="text-2xl">{track.cover_icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    currentTrackIndex === index && "text-primary"
                  )}>
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.genre} • {track.duration}
                  </p>
                </div>
                {currentTrackIndex === index && isPlaying && (
                  <div className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
