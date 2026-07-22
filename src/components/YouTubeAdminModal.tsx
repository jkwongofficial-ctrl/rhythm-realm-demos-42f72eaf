import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onUrlUpdated: (newUrl: string) => void;
}

export const YouTubeAdminModal = ({
  isOpen,
  onClose,
  currentUrl,
  onUrlUpdated,
}: YouTubeAdminModalProps) => {
  const [url, setUrl] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key: "youtube_url", value: url }, { onConflict: "key" });

      if (error) throw error;

      toast({
        title: "Success",
        description: "YouTube link updated!",
      });

      onUrlUpdated(url);
      onClose();
    } catch (error) {
      console.error("Error updating YouTube URL:", error);
      toast({
        title: "Error",
        description: "Failed to update YouTube link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md overflow-hidden sketch-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-muted">
          <h2 className="text-xl font-bold text-foreground">Update YouTube Link</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Paste the full YouTube video URL
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 sketch-border"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
