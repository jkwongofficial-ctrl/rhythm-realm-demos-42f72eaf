import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
export const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const handleEmailClick = () => {
    navigator.clipboard.writeText("lawreinenala@yahoo.com");
    toast.success("Email copied to clipboard!", {
      description: "lawreinenala@yahoo.com"
    });
  };
  const socialLinks = [{
    name: "Email",
    icon: "✉️",
    action: handleEmailClick
  }, {
    name: "Twitter",
    icon: "🐦",
    href: "#"
  }, {
    name: "SoundCloud",
    icon: "☁️",
    href: "#"
  }, {
    name: "YouTube",
    icon: "📺",
    href: "#"
  }];
  return <section ref={sectionRef} className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className={cn("max-w-2xl mx-auto text-center transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Let's <span className="text-secondary">Create</span>
          </h2>
          <p className="font-hand text-xl text-muted-foreground mb-12">
            Got a game that needs an epic soundtrack? Let's make magic together!
          </p>

          {/* Social/Contact icons */}
          <div className="flex justify-center gap-6">
            {socialLinks.map((link, index) => <button key={link.name} onClick={link.action} onMouseEnter={() => setHoveredIcon(link.name)} onMouseLeave={() => setHoveredIcon(null)} className={cn("relative p-4 bg-muted rounded-full transition-all duration-300 sketch-border-thin", "hover:bg-secondary/20 hover:scale-110 active:scale-95", hoveredIcon === link.name && "animate-wiggle")} style={{
            transitionDelay: `${index * 50}ms`,
            animationDelay: `${index * 100}ms`
          }} aria-label={link.name}>
                <span className="text-3xl">{link.icon}</span>
                
                {/* Tooltip */}
                <span className={cn("absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground whitespace-nowrap transition-all duration-200", hoveredIcon === link.name ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2")}>
                  {link.name}
                </span>
              </button>)}
          </div>
        </div>

        {/* Footer */}
        <div className={cn("mt-20 pt-8 border-t border-border text-center transition-all duration-700 delay-300", isVisible ? "opacity-100" : "opacity-0")}>
          <p className="text-muted-foreground font-hand text-lg">Portfolio '25 •  <span className="text-secondary">Easton Romero</span>
          </p>
        </div>
      </div>
    </section>;
};