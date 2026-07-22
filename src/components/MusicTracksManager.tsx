import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  duration: string;
  cover_icon: string;
  audio_url: string;
  file_path: string;
  created_at: string;
}

export function MusicTracksManager() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTracks();
  }, []);

  async function fetchTracks() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("music_tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTracks((data as MusicTrack[]) || []);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tracks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteTrack(track: MusicTrack) {
    setDeletingId(track.id);

    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("music_files")
        .remove([track.file_path]);

      if (storageError) {
        console.warn("Storage deletion warning:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("music_tracks")
        .delete()
        .eq("id", track.id);

      if (dbError) throw dbError;

      setTracks(tracks.filter((t) => t.id !== track.id));

      toast({
        title: "Success",
        description: "Track deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting track:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete track",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading tracks...</div>;
  }

  if (tracks.length === 0) {
    return <div className="text-center text-muted-foreground">No tracks uploaded yet</div>;
  }

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center justify-between p-4 bg-muted rounded-lg"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{track.cover_icon}</span>
            <div>
              <h3 className="font-semibold text-foreground">{track.title}</h3>
              <p className="text-sm text-muted-foreground">
                {track.genre} • {track.duration}
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteTrack(track)}
            disabled={deletingId === track.id}
          >
            {deletingId === track.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
