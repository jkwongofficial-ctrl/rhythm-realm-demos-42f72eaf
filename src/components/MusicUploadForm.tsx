import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, X } from "lucide-react";

const MUSIC_EMOJIS = [
  "🎵", "🎶", "🎼", "🎹", "🎸", "🎤", "🎧", "🎺", "🎷", "🥁",
  "🎻", "🎚️", "🎛️", "📻", "💿", "🔊", "🔉", "🎮", "🎯", "⭐",
];

const getRandomEmoji = () => MUSIC_EMOJIS[Math.floor(Math.random() * MUSIC_EMOJIS.length)];

interface UploadTrack {
  file: File;
  title: string;
  emoji: string;
}

interface DuplicatePrompt {
  track: UploadTrack;
  index: number;
}

interface DuplicateResponse {
  replace: boolean;
}

export function MusicUploadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioFiles, setAudioFiles] = useState<UploadTrack[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadTrack, setCurrentUploadTrack] = useState<string>("");
  const [duplicatePrompt, setDuplicatePrompt] = useState<DuplicatePrompt | null>(null);
  const [duplicateResponses, setDuplicateResponses] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const { session } = useAuth();

  const checkDuplicate = async (title: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("music_tracks")
        .select("id")
        .eq("title", title)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false;
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newTracks: UploadTrack[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("audio/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an audio file. Skipped.`,
            variant: "destructive",
          });
          continue;
        }
        if (file.size > 50 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than 50MB. Skipped.`,
            variant: "destructive",
          });
          continue;
        }

        // Auto-generate title from filename (remove extension)
        const title = file.name.replace(/\.[^/.]+$/, "");

        newTracks.push({
          file,
          title: title.length > 0 ? title : `Track ${audioFiles.length + i + 1}`,
          emoji: getRandomEmoji(),
        });
      }

      setAudioFiles([...audioFiles, ...newTracks]);
      e.target.value = ""; // Reset input
    }
  };

  const removeTrack = (index: number) => {
    setAudioFiles(audioFiles.filter((_, i) => i !== index));
  };

  const updateTrackTitle = (index: number, title: string) => {
    const updated = [...audioFiles];
    updated[index].title = title;
    setAudioFiles(updated);
  };

  const regenerateEmoji = (index: number) => {
    const updated = [...audioFiles];
    updated[index].emoji = getRandomEmoji();
    setAudioFiles(updated);
  };

  const handleUpload = async () => {
    if (audioFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one audio file",
        variant: "destructive",
      });
      return;
    }

    if (!session) {
      toast({
        title: "Not authenticated",
        description: "Please sign in before uploading",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Refresh session
      const { data: { session: freshSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !freshSession) {
        throw new Error("Session expired. Please sign in again.");
      }

      // Check for duplicates first
      for (let i = 0; i < audioFiles.length; i++) {
        const track = audioFiles[i];
        const isDuplicate = await checkDuplicate(track.title);

        if (isDuplicate && !(i in duplicateResponses)) {
          setIsLoading(false);
          setDuplicatePrompt({ track, index: i });
          return;
        }
      }

      // Upload each track
      for (let i = 0; i < audioFiles.length; i++) {
        const track = audioFiles[i];
        const shouldSkip = (i in duplicateResponses) && !duplicateResponses[i];

        if (shouldSkip) {
          setUploadProgress(Math.round(((i + 1) / audioFiles.length) * 100));
          continue;
        }

        setCurrentUploadTrack(track.title);
        setUploadProgress(Math.round((i / audioFiles.length) * 100));

        const fileExt = track.file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `music/${fileName}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from("music_files")
          .upload(filePath, track.file, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("music_files")
          .getPublicUrl(filePath);

        // Check if this is a replacement
        const { data: existingTrack } = await supabase
          .from("music_tracks")
          .select("id, file_path")
          .eq("title", track.title)
          .maybeSingle();

        if (existingTrack) {
          // Delete old file if it exists
          if (existingTrack.file_path) {
            await supabase.storage
              .from("music_files")
              .remove([existingTrack.file_path])
              .catch(() => {}); // Ignore errors
          }

          // Update existing record
          const { error: updateError } = await supabase
            .from("music_tracks")
            .update({
              audio_url: publicUrl,
              file_path: filePath,
              cover_icon: track.emoji,
            })
            .eq("id", existingTrack.id);

          if (updateError) throw updateError;
        } else {
          // Insert new record
          const { error: dbError } = await supabase.from("music_tracks").insert({
            title: track.title,
            genre: "GAME OST",
            duration: "1:00",
            cover_icon: track.emoji,
            audio_url: publicUrl,
            file_path: filePath,
          });

          if (dbError) {
            throw dbError;
          }
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / audioFiles.length) * 100));
      }

      toast({
        title: "Success",
        description: `${audioFiles.length} track(s) uploaded successfully!`,
      });

      setAudioFiles([]);
      setUploadProgress(0);
      setCurrentUploadTrack("");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload tracks",
        variant: "destructive",
      });
      setUploadProgress(0);
      setCurrentUploadTrack("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Select Audio Files (Multiple)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleAudioFileChange}
            disabled={isLoading}
            className="cursor-pointer flex-1"
          />
          {audioFiles.length > 0 && (
            <span className="text-sm text-muted-foreground px-3 py-2 bg-muted rounded-lg">
              {audioFiles.length} file{audioFiles.length !== 1 ? "s" : ""} selected
            </span>
          )}
        </div>
      </div>

      {/* Tracks List */}
      {audioFiles.length > 0 && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-muted">
          <p className="text-sm font-medium text-foreground">
            Editing tracks (Genre: GAME OST, Duration: 1:00)
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {audioFiles.map((track, index) => (
              <div
                key={index}
                className="p-3 bg-card rounded-lg border border-muted flex items-center gap-3"
              >
                {/* Emoji Button */}
                <button
                  type="button"
                  onClick={() => regenerateEmoji(index)}
                  className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
                  title="Click to randomize emoji"
                >
                  {track.emoji}
                </button>

                {/* Title Input */}
                <input
                  type="text"
                  value={track.title}
                  onChange={(e) => updateTrackTitle(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-muted rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                  placeholder="Track title"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeTrack(index)}
                  className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isLoading || audioFiles.length === 0}
        className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg transition-colors flex items-center justify-center gap-2 sketch-border font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading {audioFiles.length} track{audioFiles.length !== 1 ? "s" : ""}...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload {audioFiles.length} Track{audioFiles.length !== 1 ? "s" : ""}
          </>
        )}
      </button>

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{uploadProgress}% Complete</span>
            {currentUploadTrack && (
              <span className="text-primary font-medium truncate max-w-xs">
                Uploading: {currentUploadTrack}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        📝 Auto-filled: Genre = GAME OST, Duration = 1:00
        <br />
        🎲 Emoji randomized - click to change
        <br />
        ✏️ Edit titles as needed before uploading
      </p>

      {/* Duplicate Prompt */}
      {duplicatePrompt && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-2xl max-w-sm w-full p-6 sketch-border space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {duplicatePrompt.track.emoji} Duplicate Track
              </h3>
              <p className="text-muted-foreground">
                A track named "<strong>{duplicatePrompt.track.title}</strong>" already exists.
                Would you like to replace it or keep the existing file?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDuplicateResponses({
                    ...duplicateResponses,
                    [duplicatePrompt.index]: false,
                  });
                  setDuplicatePrompt(null);
                  handleUpload();
                }}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
              >
                Keep Existing
              </button>
              <button
                onClick={() => {
                  setDuplicateResponses({
                    ...duplicateResponses,
                    [duplicatePrompt.index]: true,
                  });
                  setDuplicatePrompt(null);
                  handleUpload();
                }}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors sketch-border"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
