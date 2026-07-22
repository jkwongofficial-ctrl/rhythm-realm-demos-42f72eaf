-- Set is_featured default to false (hidden by default)
ALTER TABLE public.music_tracks
ALTER COLUMN is_featured SET DEFAULT false;

-- Update all existing tracks to be hidden by default
UPDATE public.music_tracks
SET is_featured = false
WHERE is_featured IS NULL OR is_featured = true;
