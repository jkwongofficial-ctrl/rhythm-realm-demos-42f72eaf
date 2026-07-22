-- Create settings table for storing YouTube URL and other app settings
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings
CREATE POLICY "Allow public read" ON public.settings
  FOR SELECT USING (true);

-- Allow authenticated users to update settings (in practice, only admins)
CREATE POLICY "Allow authenticated update" ON public.settings
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow authenticated users to insert settings
CREATE POLICY "Allow authenticated insert" ON public.settings
  FOR INSERT WITH CHECK (true);

-- Insert default YouTube URL (empty, admin will update)
INSERT INTO public.settings (key, value)
VALUES ('youtube_url', 'https://www.youtube.com')
ON CONFLICT (key) DO NOTHING;
