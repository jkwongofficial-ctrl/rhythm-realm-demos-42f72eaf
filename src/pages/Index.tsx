import { HeroSection } from "@/components/HeroSection";
import { MusicShowcase } from "@/components/MusicShowcase";
import { ContactSection } from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <MusicShowcase />
      <ContactSection />
    </main>
  );
};

export default Index;
