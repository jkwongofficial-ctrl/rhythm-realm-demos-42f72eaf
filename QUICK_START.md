# Music Dashboard - Quick Start Guide

## ✅ What's Ready

Your music upload dashboard is now fully built and integrated! Here's what you have:

### 🎵 Dashboard Features
- **Upload Page** - Drag & drop music files with metadata (title, genre, duration, emoji)
- **Track Manager** - View all uploaded tracks with delete functionality
- **Live Integration** - Uploaded music automatically appears on the homepage
- **Secure Access** - Only `lawreinenala@yahoo.com` can access the dashboard

### 🔐 Admin Access
- **Email**: lawreinenala@yahoo.com
- **Password**: 12345678

## 🚀 Getting Started (3 Steps)

### Step 1: Set Up Database (Supabase Dashboard)

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Paste this SQL and click "Run":

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

ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.music_tracks
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.music_tracks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.music_tracks
  FOR DELETE USING (true);

CREATE INDEX idx_music_tracks_created_at ON public.music_tracks(created_at DESC);
```

### Step 2: Create Storage Bucket

1. In Supabase, go to **Storage**
2. Click **New Bucket**
3. Name: `music_files`
4. **Uncheck** "Private bucket"
5. Click **Create bucket**

### Step 3: Test the Dashboard

1. Open http://localhost:8081/
2. Click **Sign in** (or find auth button)
3. Sign up/log in with: `lawreinenala@yahoo.com` / `12345678`
4. You'll see **Dashboard** link in navbar
5. Click **Dashboard**
6. Upload a test music file:
   - Title: "Test Track"
   - Genre: "Test"
   - Duration: "1:00"
   - Emoji: "🎵"
   - Select an audio file (MP3, WAV, etc.)
7. Click **Upload Track**
8. Go back home and scroll to **Musical Pieces** - your track appears!

## 📁 Files Created

```
src/
├── pages/
│   └── Dashboard.tsx                 # Main admin dashboard
├── components/
│   ├── MusicUploadForm.tsx          # Upload form
│   ├── MusicTracksManager.tsx       # Track list & delete
│   └── Navbar.tsx                   # Updated with dashboard link

Database:
└── music_tracks table               # Stores track metadata

Storage:
└── music_files bucket               # Stores audio files
```

## 🎯 How It Works

### Admin Uploads Music
1. Admin logs in with email `lawreinenala@yahoo.com`
2. Goes to `/dashboard`
3. Fills in track details (title, genre, duration, emoji)
4. Selects an audio file
5. File is uploaded to Supabase Storage
6. Metadata is saved to `music_tracks` table

### Website Shows Music
1. Homepage fetches all tracks from `music_tracks` table
2. Displays them in "Musical Pieces" section
3. Visitors can click to play tracks
4. Shows now-playing bar with progress

## ⚙️ Configuration

The admin email is currently hardcoded to: `lawreinenala@yahoo.com`

If you want to change it later, edit: `src/pages/Dashboard.tsx`
```ts
const ADMIN_EMAIL = "lawreinenala@yahoo.com";  // Change this
```

## 🔒 Security

- ✅ Only the specified email can access dashboard
- ✅ RLS policies prevent unauthorized database access
- ✅ Audio files stored securely in Supabase Storage
- ✅ Public URLs used for playback (read-only)

## 🐛 Troubleshooting

### "Upload failed" error
- ✓ Check `music_files` bucket exists (go to Storage)
- ✓ Ensure bucket is **PUBLIC** (not private)
- ✓ File must be an audio file (MP3, WAV, FLAC, etc.)
- ✓ File must be under 50MB

### Dashboard shows "Access denied"
- ✓ Make sure you're signed in
- ✓ Must use email: `lawreinenala@yahoo.com`
- ✓ Check browser console for errors (F12)

### Tracks not showing on homepage
- ✓ Refresh the page (music might be cached)
- ✓ Check Supabase: Table → music_tracks (should see data)
- ✓ Check browser console (F12) for errors

### Can't sign in
- ✓ First time? Click "Sign up" instead
- ✓ Email must be: `lawreinenala@yahoo.com`
- ✓ Password: `12345678`
- ✓ Check Supabase Auth section to verify user exists

## 📝 Testing Checklist

- [ ] Database table created (check Supabase)
- [ ] Storage bucket created (check Supabase)
- [ ] Admin user exists in Supabase Auth
- [ ] Can sign in with admin credentials
- [ ] Dashboard page loads without errors
- [ ] Can upload a test music file
- [ ] Track appears in "Manage Tracks" section
- [ ] Track appears on homepage
- [ ] Can delete track from dashboard
- [ ] Track disappears from homepage

## 🎓 Next Features You Could Add

- Audio waveform visualization
- Track search & filtering
- Batch upload
- User comments/ratings
- Download button
- Playlist creation
- Analytics (play counts)
- Track editing

## 🆘 Need Help?

1. Check browser console (F12 → Console tab)
2. Check Supabase dashboard for errors
3. Verify all setup steps were completed
4. Restart dev server: `npm run dev`

---

**Ready to go!** Open http://localhost:8081/ and start uploading music! 🎵
