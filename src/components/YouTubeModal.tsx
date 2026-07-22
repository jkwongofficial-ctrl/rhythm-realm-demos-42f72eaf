import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  onEditClick: () => void;
  isAdmin: boolean;
}

export const YouTubeModal = ({
  isOpen,
  onClose,
  videoUrl,
  onEditClick,
  isAdmin,
}: YouTubeModalProps) => {
  if (!isOpen) return null;

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden sketch-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-muted">
          <h2 className="text-xl font-bold text-foreground">Latest Video</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Container */}
        <div className="p-6">
          {embedUrl ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No video link set</p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-3 justify-center">
            <a
              href={videoUrl || "https://www.youtube.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors sketch-border"
            >
              View More on YouTube
            </a>

            {isAdmin && (
              <button
                onClick={onEditClick}
                className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg transition-colors sketch-border"
              >
                Admin - Update Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
