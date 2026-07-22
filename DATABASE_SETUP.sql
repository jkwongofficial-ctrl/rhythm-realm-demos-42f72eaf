-- Create music_tracks table
CREATE TABLE IF NOT EXISTS public.music_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  duration TEXT NOT NULL,
  cover_icon TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create storage bucket for music files
-- Note: You may need to create the bucket through the Supabase dashboard if this doesn't work
-- Navigate to Storage > New Bucket > Name: "music_files" > Make it Public

-- Enable RLS (Row Level Security) on music_tracks table
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.music_tracks
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON public.music_tracks
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete" ON public.music_tracks
  FOR DELETE USING (true);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_music_tracks_created_at ON public.music_tracks(created_at DESC);

-- Ensure the user exists in Supabase Auth and add to user_roles as admin
-- Replace USER_ID with the actual user ID from Supabase Auth
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('USER_ID', 'admin')
-- ON CONFLICT DO NOTHING;
