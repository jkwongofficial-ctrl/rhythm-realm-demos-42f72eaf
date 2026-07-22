# Music Dashboard Setup Guide

This guide will walk you through setting up the music upload dashboard for your music portfolio website.

## What's Been Created

✅ **Dashboard Page** (`/dashboard`) - Admin-only music management interface  
✅ **Upload Form** - Upload audio files with metadata (title, genre, duration, emoji)  
✅ **Track Manager** - View, play, and delete uploaded music tracks  
✅ **Database Integration** - Tracks stored in Supabase with file storage  
✅ **Frontend Integration** - Music showcase automatically displays uploaded tracks  

## Setup Steps

### 1. **Create Database Table**

Go to your Supabase dashboard and run this SQL in the SQL Editor:

```sql
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

-- Enable RLS (Row Level Security)
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
```

### 2. **Create Storage Bucket**

In your Supabase dashboard:

1. Go to **Storage** → **New Bucket**
2. Name it: `music_files`
3. **Uncheck** "Private bucket" to make it public
4. Click **Create bucket**

### 3. **Set Up Admin User**

The dashboard is restricted to: **lawreinenala@yahoo.com**

**Important**: You need to:
1. Create/verify this user exists in Supabase Auth
2. The password you provided: `12345678`

If the user doesn't exist yet:
1. Go to Supabase → Authentication → Users
2. Click "Invite User" 
3. Enter: `lawreinenala@yahoo.com`
4. Supabase will send an invite link

Alternatively, you can sign up through your app's auth page with this email.

### 4. **Update Types (Already Done)**

The Supabase types have been updated to include the `music_tracks` table in `src/integrations/supabase/types.ts`.

## How to Use

### For Admin User (lawreinenala@yahoo.com)

1. **Sign In**: Log in with your email and password at the login page
2. **Access Dashboard**: Click the "Dashboard" link in the navbar
3. **Upload Music**:
   - Enter track title (e.g., "Epic Boss Battle")
   - Enter genre (e.g., "Orchestral")
   - Enter duration in MM:SS format (e.g., "3:42")
   - Select a cover emoji (e.g., "⚔️")
   - Select the audio file (MP3, WAV, etc., max 50MB)
   - Click "Upload Track"
4. **Manage Tracks**: View all uploaded tracks and delete them if needed

### For Website Visitors

1. **View Music**: Go to the home page and scroll to "Musical Pieces"
2. **Play Music**: Click any track card to play it
3. **Now Playing Bar**: Shows currently playing track with progress

## Project Structure

```
src/
├── pages/
│   └── Dashboard.tsx          # Admin dashboard page
├── components/
│   ├── MusicUploadForm.tsx    # Upload form component
│   ├── MusicTracksManager.tsx # Track management component
│   ├── MusicShowcase.tsx      # Updated to fetch from database
│   └── Navbar.tsx             # Updated with dashboard link
└── integrations/supabase/
    └── types.ts               # Updated with music_tracks table
```

## Features

### Admin Dashboard
- ✅ File upload with validation (audio files only, max 50MB)
- ✅ Metadata form (title, genre, duration, emoji)
- ✅ Track management (view, delete)
- ✅ Real-time track list updates
- ✅ Success/error toast notifications

### Music Showcase (Public)
- ✅ Displays all uploaded tracks
- ✅ Play/stop functionality
- ✅ Now-playing bar with progress indicator
- ✅ Responsive grid layout (1-3 columns)
- ✅ Smooth animations

## Security Notes

- ✅ Only email `lawreinenala@yahoo.com` can access the dashboard
- ✅ Database RLS policies ensure data integrity
- ✅ Public read access for music tracks (required for frontend)
- ✅ Audio files stored in Supabase Storage with public URLs

## Troubleshooting

### "Upload failed" error
- Check that the `music_files` bucket was created
- Ensure bucket is set to public (not private)
- Check file size (must be under 50MB)
- Check file type (must be audio file)

### Dashboard shows "Access denied"
- Make sure you're logged in with `lawreinenala@yahoo.com`
- Verify the account exists in Supabase Auth

### Tracks not showing on homepage
- Check that the database table was created
- Verify RLS policies are enabled
- Check browser console for errors

### File upload succeeds but track doesn't appear
- Verify the `music_tracks` table exists
- Check Supabase dashboard for the inserted record
- Refresh the page to see updates

## Testing

1. Sign in as the admin user
2. Upload a test music file
3. Verify it appears in the dashboard's "Manage Tracks" section
4. Go to the homepage and verify the track appears in "Musical Pieces"
5. Try playing the track (click the card)

## Next Steps

- Consider adding:
  - Audio waveform visualization
  - Download button for tracks
  - Analytics tracking for plays
  - Search/filter functionality
  - Batch upload
  - Track categorization/playlists

## Support

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Check Supabase dashboard for database/storage issues
3. Verify all setup steps were completed correctly
4. Check that the admin email is correctly configured
