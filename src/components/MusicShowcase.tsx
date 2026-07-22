import { useState, useEffect, useRef } from "react";
import { MusicCard } from "./MusicCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  duration: string;
  cover_icon: string;
  audio_url: string;
}

export const MusicShowcase = () => {
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchMusicTracks();
  }, []);

  async function fetchMusicTracks() {
    try {
      const { data, error } = await supabase
        .from("music_tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMusicTracks((data || []) as MusicTrack[]);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setIsLoading(false);
    }
  }

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

  useEffect(() => {
    if (audioRef.current && playingIndex !== null) {
      audioRef.current.src = musicTracks[playingIndex].audio_url;
      audioRef.current.play().catch(err => console.error("Play error:", err));
      setIsPlaying(true);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [playingIndex, musicTracks]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => console.error("Play error:", err));
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlay = (index: number) => {
    setPlayingIndex(playingIndex === index ? null : index);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <section
        id="music"
        ref={sectionRef}
        className="py-20 md:py-32 bg-paper"
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">Loading music tracks...</p>
        </div>
      </section>
    );
  }

  if (musicTracks.length === 0) {
    return (
      <section
        id="music"
        ref={sectionRef}
        className="py-20 md:py-32 bg-paper"
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">No music tracks available yet</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="music"
      ref={sectionRef}
      className="py-20 md:py-32 bg-paper"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlayingIndex(null)}
      />

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
              key={track.id}
              className={cn(
                "transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <MusicCard
                title={track.title}
                genre={track.genre}
                duration={track.duration}
                coverIcon={track.cover_icon}
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
            <div className="container mx-auto">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-3xl flex-shrink-0">{musicTracks[playingIndex].cover_icon}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{musicTracks[playingIndex].title}</p>
                    <p className="text-sm text-muted-foreground font-hand truncate">{musicTracks[playingIndex].genre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Volume control */}
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-muted rounded-full cursor-pointer"
                    />
                  </div>

                  {/* Play/Pause button */}
                  <button
                    onClick={handlePlayPause}
                    className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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

                  {/* Stop button */}
                  <button
                    onClick={() => setPlayingIndex(null)}
                    className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                    aria-label="Stop"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground min-w-fit">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-2 bg-muted rounded-full cursor-pointer"
                />
                <span className="text-xs text-muted-foreground min-w-fit">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
