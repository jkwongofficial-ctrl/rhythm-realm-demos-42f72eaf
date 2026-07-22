-- Ensure is_featured column exists and has correct default
ALTER TABLE public.music_tracks
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Update existing tracks to be hidden by default
UPDATE public.music_tracks
SET is_featured = false
WHERE is_featured = true;

-- Create index for faster filtering if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_music_tracks_is_featured ON public.music_tracks(is_featured);
