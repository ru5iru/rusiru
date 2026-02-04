import { ArrowDown, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const handleScrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <p
            className="text-lg md:text-xl text-muted-foreground mb-4 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Hi, I'm
          </p>

          {/* Name */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="gradient-text">Rusiru Rathmina</span>
          </h1>

          {/* Title */}
          <h2
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium mb-10 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            Full-Stack Software Engineer
          </h2>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <Button
              onClick={handleScrollToProjects}
              size="lg"
              className="gradient-bg text-white px-8 py-6 text-lg font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 glow group"
            >
              View Work
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-full border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
            >
              <a
                href="https://drive.google.com/uc?export=download&id=1Rl9tFni6vHsP7K2XW_zeamOr7HMKMabO"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-5 w-5" />
                Resume
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in"
        style={{ animationDelay: '1.2s' }}
      >
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="text-sm font-medium">Scroll</span>
          <ArrowDown className="h-5 w-5 animate-bounce-subtle" />
        </a>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-1/4 left-10 w-20 h-20 border border-primary/20 rounded-full opacity-0 animate-fade-in animate-spin-slow"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-1/4 right-10 w-32 h-32 border border-accent/20 rounded-full opacity-0 animate-fade-in animate-spin-slow"
        style={{ animationDelay: '1.2s', animationDirection: 'reverse' }}
      />
    </section>
  );
}
