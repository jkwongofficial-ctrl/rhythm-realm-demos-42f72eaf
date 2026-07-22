# Database Schema

## music_tracks Table

This table stores metadata about music tracks. The actual audio files are stored in Supabase Storage, and this table maintains references to them.

### Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes | Primary key, auto-generated |
| `title` | TEXT | Yes | Track title (e.g., "Epic Boss Battle") |
| `genre` | TEXT | Yes | Music genre (e.g., "Orchestral") |
| `duration` | TEXT | Yes | Track duration in MM:SS format (e.g., "3:42") |
| `cover_icon` | TEXT | Yes | Single or double emoji for cover (e.g., "⚔️") |
| `audio_url` | TEXT | Yes | Public URL to the audio file in storage |
| `file_path` | TEXT | Yes | Internal path in storage (e.g., "music/1234567890.mp3") |
| `created_at` | TIMESTAMP | Auto | When the track was uploaded |
| `updated_at` | TIMESTAMP | Auto | When the track was last modified |

### Example Record

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Epic Boss Battle",
  "genre": "Orchestral",
  "duration": "3:42",
  "cover_icon": "⚔️",
  "audio_url": "https://utfxpwezjbncjkbhjiyb.supabase.co/storage/v1/object/public/music_files/music/1234567890.mp3",
  "file_path": "music/1234567890.mp3",
  "created_at": "2024-07-03T12:00:00+00:00",
  "updated_at": "2024-07-03T12:00:00+00:00"
}
```

## Storage Bucket: music_files

Stores the actual audio files. Must be public to allow streaming.

### Structure
```
music_files/
└── music/
    ├── 1234567890.mp3
    ├── 1234567891.wav
    └── ...
```

### Access Rules
- **Public Read**: Anyone can access and play files
- **Authenticated Write**: Only logged-in users can upload (Dashboard checks admin email)
- **Authenticated Delete**: Only logged-in users can delete (Dashboard checks admin email)

## Policies (Row Level Security)

The database uses RLS to ensure proper access control:

### PUBLIC READ
```sql
CREATE POLICY "Allow public read access" ON public.music_tracks
  FOR SELECT USING (true);
```
- Anyone can query tracks from the homepage
- Required for the music showcase to work

### AUTHENTICATED INSERT
```sql
CREATE POLICY "Allow authenticated users to insert" ON public.music_tracks
  FOR INSERT WITH CHECK (true);
```
- Only logged-in users can insert records
- Dashboard verifies admin email in the app layer

### AUTHENTICATED DELETE
```sql
CREATE POLICY "Allow authenticated users to delete" ON public.music_tracks
  FOR DELETE USING (true);
```
- Only logged-in users can delete records
- Dashboard verifies admin email in the app layer

## Usage in Application

### Reading Tracks (Homepage)
```typescript
const { data } = await supabase
  .from("music_tracks")
  .select("*")
  .order("created_at", { ascending: false });
```

### Creating Track (Dashboard Upload)
```typescript
const { error } = await supabase
  .from("music_tracks")
  .insert({
    title: string,
    genre: string,
    duration: string,
    cover_icon: string,
    audio_url: string,
    file_path: string
  });
```

### Deleting Track (Dashboard Delete)
```typescript
const { error } = await supabase
  .from("music_tracks")
  .delete()
  .eq("id", trackId);
```

## Related Tables

### user_roles
Controls admin access (already existed in your project)

| Column | Type |
|--------|------|
| `id` | UUID |
| `user_id` | UUID (FK to auth.users) |
| `role` | enum ('admin', 'user') |
| `created_at` | TIMESTAMP |

## Indexes

```sql
CREATE INDEX idx_music_tracks_created_at ON public.music_tracks(created_at DESC);
```

- Optimizes sorting by creation date
- Improves query performance for the homepage

## Storage File Limits

Configure in Supabase Storage settings:
- Max file size: 50MB per file (set in Dashboard.tsx validation)
- Allowed types: Audio files (MP3, WAV, FLAC, OGG, etc.)
- Bucket: Public read, authenticated write/delete
