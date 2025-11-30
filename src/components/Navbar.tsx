import { AuthButton } from "./AuthButton";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <a href="/" className="font-display font-bold text-xl text-foreground hover:text-secondary transition-colors">
          🎮 Easton Romero
        </a>
        <AuthButton />
      </div>
    </nav>
  );
};
