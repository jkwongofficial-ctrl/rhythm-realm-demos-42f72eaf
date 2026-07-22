import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { MusicUploadForm } from "@/components/MusicUploadForm";
import { MusicTracksManager } from "@/components/MusicTracksManager";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ADMIN_EMAIL = "lawreinenala@yahoo.com";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        setIsAdminVerified(false);
      } else {
        setIsAdminVerified(true);
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Access denied. Only the admin user ({ADMIN_EMAIL}) can access the dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Music Dashboard</h1>
            <p className="text-muted-foreground">Manage and upload your music tracks</p>
          </div>

          <div className="grid gap-8">
            {/* Upload Section */}
            <Card className="p-8 bg-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Upload New Track</h2>
              <MusicUploadForm />
            </Card>

            {/* Music Tracks Manager */}
            <Card className="p-8 bg-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Manage Tracks</h2>
              <MusicTracksManager />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
