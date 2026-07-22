import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Loader2, Edit2, Check, X, Eye, EyeOff } from "lucide-react";

interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  duration: string;
  cover_icon: string;
  audio_url: string;
  file_path: string;
  created_at: string;
  is_featured?: boolean;
}

export function MusicTracksManager() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
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

  async function toggleTrackFeatured(track: MusicTrack) {
    setTogglingId(track.id);

    try {
      const newFeaturedStatus = !track.is_featured;

      if (newFeaturedStatus) {
        const featuredCount = tracks.filter((t) => t.is_featured).length;
        if (featuredCount >= 6) {
          setShowLimitModal(true);
          setTogglingId(null);
          return;
        }
      }

      const { error } = await supabase
        .from("music_tracks")
        .update({ is_featured: newFeaturedStatus })
        .eq("id", track.id);

      if (error) throw error;

      setTracks(
        tracks.map((t) =>
          t.id === track.id ? { ...t, is_featured: newFeaturedStatus } : t
        )
      );

      toast({
        title: "Success",
        description: newFeaturedStatus
          ? "Track will show on homepage"
          : "Track hidden from homepage",
      });
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function updateTrackTitle(trackId: string, newTitle: string) {
    if (!newTitle.trim()) {
      toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSavingId(trackId);

    try {
      const { error } = await supabase
        .from("music_tracks")
        .update({ title: newTitle })
        .eq("id", trackId);

      if (error) throw error;

      setTracks(
        tracks.map((t) =>
          t.id === trackId ? { ...t, title: newTitle } : t
        )
      );

      toast({
        title: "Success",
        description: "Track name updated",
      });

      setEditingId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Error updating track:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update track",
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
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
      <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
        {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center justify-between p-4 bg-muted rounded-lg"
        >
          <div className="flex items-center gap-4 flex-1">
            <span className="text-3xl">{track.cover_icon}</span>
            <div className="flex-1">
              {editingId === track.id ? (
                <div className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 px-3 py-2 bg-background rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    autoFocus
                  />
                  <button
                    onClick={() => updateTrackTitle(track.id, editingTitle)}
                    disabled={savingId === track.id}
                    className="p-2 hover:bg-primary/20 rounded transition-colors"
                  >
                    {savingId === track.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingTitle("");
                    }}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-foreground">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {track.genre} • {track.duration}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {editingId !== track.id && (
              <>
                <Button
                  variant={track.is_featured ?? true ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTrackFeatured(track)}
                  disabled={togglingId === track.id}
                  title={track.is_featured ?? true ? "Shown on homepage" : "Hidden from homepage"}
                >
                  {togglingId === track.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : track.is_featured ?? true ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(track.id);
                    setEditingTitle(track.title);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
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
        </div>
      ))}
      </div>

      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-2xl max-w-sm w-full p-6 sketch-border space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                📊 Limit Reached
              </h3>
              <p className="text-muted-foreground">
                You can only select six tracks to feature on the homepage.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLimitModal(false)}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors sketch-border font-medium"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
