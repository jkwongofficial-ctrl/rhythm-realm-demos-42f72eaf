import { AuthButton } from "./AuthButton";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <a href="/" className="font-display font-bold text-xl text-foreground hover:text-secondary transition-colors">
          🎮 Easton Romero
        </a>
        <div className="flex items-center gap-4">
          {user && user.email === "lawreinenala@yahoo.com" && (
            <a
              href="/dashboard"
              className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
            >
              Dashboard
            </a>
          )}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
