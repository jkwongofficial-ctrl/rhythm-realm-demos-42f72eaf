-- Add featured/show_on_homepage column to music_tracks
ALTER TABLE public.music_tracks
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT true;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_music_tracks_is_featured ON public.music_tracks(is_featured);

-- Update RLS policy if needed (should already allow updates)
-- No additional policies needed as authenticated users can already update
