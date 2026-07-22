import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Shuffle } from "lucide-react";

const MUSIC_EMOJIS = [
  "🎵", "🎶", "🎼", "🎹", "🎸", "🎤", "🎧", "🎺", "🎷", "🥁",
  "🎻", "🎚️", "🎛️", "📻", "📀", "💿", "📀", "🔊", "🔉", "🎼",
  "🎹", "🎸", "🎺", "🎻", "🥁", "🎷", "🎼", "🎤", "🎧", "🎵",
  "⚫", "⭐", "✨", "🌟", "💫", "🎆", "🎇", "🌠", "🎪", "🎭",
  "🎨", "🖼️", "🎬", "🎮", "🎯", "🎲", "🧩", "🎰", "🃏", "🎳",
];

const getRandomEmoji = () => MUSIC_EMOJIS[Math.floor(Math.random() * MUSIC_EMOJIS.length)];

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  genre: z.string().min(1, "Genre is required").max(50),
  duration: z.string().min(1, "Duration is required"),
  coverIcon: z.string().min(1, "Emoji is required").max(2),
});

type FormValues = z.infer<typeof formSchema>;

export function MusicUploadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const { toast } = useToast();
  const { session } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
      duration: "",
      coverIcon: getRandomEmoji(),
    },
  });

  useEffect(() => {
    form.setValue("coverIcon", getRandomEmoji());
  }, []);

  const handleRandomEmoji = () => {
    form.setValue("coverIcon", getRandomEmoji());
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Audio file must be smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!audioFile) {
      toast({
        title: "Audio file required",
        description: "Please select an audio file to upload",
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
      // Refresh session to ensure valid token
      const { data: { session: freshSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !freshSession) {
        throw new Error("Session expired. Please sign in again.");
      }

      // Upload audio file to storage
      const fileExt = audioFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `music/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("music_files")
        .upload(filePath, audioFile, { upsert: true });

      if (uploadError) {
        console.error("Storage upload error details:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("music_files").getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase.from("music_tracks").insert({
        title: values.title,
        genre: values.genre,
        duration: values.duration,
        cover_icon: values.coverIcon,
        audio_url: publicUrl,
        file_path: filePath,
      });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Music track uploaded successfully!",
      });

      form.reset();
      setAudioFile(null);
      setAudioFileName("");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload track",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Epic Boss Battle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Orchestral" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (MM:SS)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3:42" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverIcon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Emoji</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="e.g., ⚔️" maxLength={2} {...field} className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRandomEmoji}
                    disabled={isLoading}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Audio File</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                disabled={isLoading}
                className="cursor-pointer"
              />
              {audioFileName && (
                <span className="text-sm text-muted-foreground">{audioFileName}</span>
              )}
            </div>
          </FormControl>
        </FormItem>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Track
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
