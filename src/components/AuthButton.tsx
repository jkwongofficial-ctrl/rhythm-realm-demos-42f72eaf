import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AuthButton = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Button
        onClick={() => navigate("/auth")}
        variant="outline"
        className="sketch-border-thin bg-background/80 backdrop-blur-sm hover:bg-background font-display"
      >
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-display font-bold">
          Admin
        </span>
      )}
      <Button
        onClick={signOut}
        variant="outline"
        className="sketch-border-thin bg-background/80 backdrop-blur-sm hover:bg-background font-display"
      >
        Sign Out
      </Button>
    </div>
  );
};
