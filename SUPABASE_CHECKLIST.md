# Supabase Configuration Checklist

This is a step-by-step checklist to configure Supabase for your music dashboard.

## 📋 Pre-requisites

- [ ] Supabase account and project created
- [ ] Project ID: `utfxpwezjbncjkbhjiyb`
- [ ] Access to Supabase dashboard

## ✅ Step 1: Create Database Table

**Location**: Supabase Dashboard → SQL Editor → New Query

1. [ ] Click "New Query" button
2. [ ] Copy the SQL below
3. [ ] Paste into the query editor
4. [ ] Click "Run" button (green play button)
5. [ ] Verify "1 row created" message appears

**SQL to run**:
```sql
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

CREATE POLICY "Allow public read access" ON public.music_tracks
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON public.music_tracks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete" ON public.music_tracks
  FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_music_tracks_created_at ON public.music_tracks(created_at DESC);
```

**Verify**:
- [ ] Go to Table Editor
- [ ] Should see `music_tracks` table in the left sidebar
- [ ] Table should have 9 columns (id, title, genre, duration, cover_icon, audio_url, file_path, created_at, updated_at)

## ✅ Step 2: Create Storage Bucket

**Location**: Supabase Dashboard → Storage

1. [ ] Click "Storage" in left sidebar
2. [ ] Click "New Bucket" button (top right)
3. [ ] In modal dialog:
   - [ ] **Name**: `music_files` (exactly this name)
   - [ ] **Privacy**: UNCHECK "Private bucket" (must be PUBLIC)
   - [ ] Leave other settings as default
4. [ ] Click "Create bucket"
5. [ ] Verify bucket appears in Storage list

**Verify**:
- [ ] See `music_files` bucket in Storage sidebar
- [ ] Bucket is publicly accessible (not marked private)

## ✅ Step 3: Verify Auth User

**Location**: Supabase Dashboard → Authentication → Users

1. [ ] Click "Authentication" in left sidebar
2. [ ] Click "Users" tab
3. [ ] Look for user with email: `lawreinenala@yahoo.com`

**If user exists**:
- [ ] Verify email is confirmed (green check mark)
- [ ] Note the user ID for reference

**If user doesn't exist**:
- [ ] Click "Invite user" button (top right)
- [ ] Enter email: `lawreinenala@yahoo.com`
- [ ] Click "Send invite"
- [ ] User will receive an invite link

**Alternative - Sign up through app**:
- [ ] Open http://localhost:8081/auth
- [ ] Click "Sign up"
- [ ] Enter email: `lawreinenala@yahoo.com`
- [ ] Enter password: `12345678`
- [ ] Click "Sign up" button
- [ ] Verify confirmation email (if needed)

**Verify**:
- [ ] User `lawreinenala@yahoo.com` exists in Auth → Users
- [ ] Email is confirmed

## ✅ Step 4: Verify Table Policies

**Location**: Supabase Dashboard → Table Editor → music_tracks

1. [ ] Go to Table Editor
2. [ ] Click on `music_tracks` table
3. [ ] Click "RLS" button (top right area)
4. [ ] Should see 3 policies:
   - [ ] "Allow public read access"
   - [ ] "Allow authenticated users to insert"
   - [ ] "Allow authenticated users to delete"
5. [ ] All should show checkmarks

**Verify**:
- [ ] RLS is "Enabled" (shown at top)
- [ ] All 3 policies are listed

## ✅ Step 5: Test Connection

**Location**: Your app at http://localhost:8081/

1. [ ] Open http://localhost:8081/
2. [ ] Click "Sign in" button
3. [ ] Enter email: `lawreinenala@yahoo.com`
4. [ ] Enter password: `12345678`
5. [ ] Click "Sign in"
6. [ ] Should redirect to home page
7. [ ] Look for "Dashboard" link in navbar (top right)
8. [ ] Click "Dashboard"

**Verify**:
- [ ] Successfully logged in
- [ ] Dashboard page loads without errors
- [ ] See "Upload New Track" form
- [ ] See "Manage Tracks" section
- [ ] Browser console shows no errors (F12)

## ✅ Step 6: Test Upload

**Location**: Your app Dashboard page

1. [ ] On Dashboard page
2. [ ] Fill in upload form:
   - [ ] Title: `Test Track`
   - [ ] Genre: `Test`
   - [ ] Duration: `1:00`
   - [ ] Emoji: `🎵`
   - [ ] Select an audio file from your computer
3. [ ] Click "Upload Track" button
4. [ ] Wait for "Success - Music track uploaded successfully!" toast

**Verify in Supabase Dashboard**:
- [ ] Go to Table Editor → music_tracks
- [ ] Should see your new track record
- [ ] Columns should contain the data you entered

**Verify in Storage**:
- [ ] Go to Storage → music_files
- [ ] Should see a file like `music/1234567890.mp3`

**Verify on Homepage**:
- [ ] Go to http://localhost:8081/
- [ ] Scroll to "Musical Pieces" section
- [ ] Should see your test track with the emoji
- [ ] Click the track card (should show now-playing bar)

## ✅ Step 7: Test Delete

**Location**: Your app Dashboard page

1. [ ] On Dashboard page
2. [ ] In "Manage Tracks" section
3. [ ] Find your test track
4. [ ] Click the red trash icon button
5. [ ] Confirm deletion

**Verify**:
- [ ] Track disappears from track list
- [ ] Get "Success - Track deleted successfully!" toast
- [ ] Go back to homepage
- [ ] Track no longer appears in "Musical Pieces"

## ✅ Step 8: Final Verification

- [ ] Can sign in with admin email
- [ ] Dashboard is accessible from navbar
- [ ] Can upload files
- [ ] Tracks appear in database
- [ ] Tracks appear on homepage
- [ ] Can delete tracks
- [ ] Tracks disappear from everywhere after deletion

## 🎉 All Set!

If all checkboxes are completed, your music dashboard is fully configured and working!

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com
- **Your App**: http://localhost:8081/
- **Admin Dashboard**: http://localhost:8081/dashboard (after login)
- **Table Editor**: Supabase → Table Editor
- **Storage**: Supabase → Storage
- **Users**: Supabase → Authentication → Users
- **SQL Editor**: Supabase → SQL Editor

## ⚠️ Common Configuration Mistakes

- ❌ Storage bucket is set to "Private" (must be PUBLIC)
- ❌ SQL policies not created (RLS must be enabled)
- ❌ Wrong bucket name (must be `music_files`, not `music` or `files`)
- ❌ User doesn't exist in Supabase Auth
- ❌ Admin email in code doesn't match Supabase user email
- ❌ Table not created (SQL query wasn't run)

## 💡 Tips

- If upload fails, check bucket privacy setting first
- If tracks don't appear, refresh browser (Ctrl+R or Cmd+R)
- If auth fails, check Supabase Auth → Users table
- If can't find Dashboard link, make sure you're logged in with the right email
- Supabase takes a few seconds to sync - wait 5 seconds after upload to refresh
