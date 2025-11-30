import { HeroSection } from "@/components/HeroSection";
import { MusicShowcase } from "@/components/MusicShowcase";
import { ContactSection } from "@/components/ContactSection";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MusicShowcase />
      <ContactSection />
    </main>
  );
};

export default Index;
