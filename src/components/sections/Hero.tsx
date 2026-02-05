import { ArrowDown, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile/profile-photo.jpg';

export function Hero() {
  const handleScrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Left side - Text Content */}
          <div className="text-center lg:text-left max-w-xl order-2 lg:order-1">
            {/* Greeting */}
            <p
              className="text-base md:text-lg text-muted-foreground mb-3 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              Hi, I'm
            </p>

            {/* Name */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="gradient-text">Rusiru Rathmina</span>
            </h1>

            {/* Title */}
            <h2
              className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              Full-Stack Software Engineer
            </h2>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center opacity-0 animate-fade-in pb-20 lg:pb-0"
              style={{ animationDelay: '0.8s' }}
            >
              <Button
                onClick={handleScrollToProjects}
                size="lg"
                className="gradient-bg text-white px-6 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 glow group w-full sm:w-auto"
              >
                View Work
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-6 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-full border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <a
                  href="https://drive.google.com/uc?export=download&id=1Rl9tFni6vHsP7K2XW_zeamOr7HMKMabO"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Resume
                </a>
              </Button>
            </div>
          </div>

          {/* Right side - Profile Image with Orbital Rings */}
          <div
            className="relative order-1 lg:order-2 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            {/* Outer orbital ring */}
            <div className="absolute inset-0 -m-6 md:-m-8 rounded-full border border-primary/20 animate-spin-slow" />
            
            {/* Middle orbital ring */}
            <div 
              className="absolute inset-0 -m-3 md:-m-4 rounded-full border border-accent/30 animate-spin-slow"
              style={{ animationDirection: 'reverse', animationDuration: '25s' }}
            />
            
            {/* Orbital dots */}
            <div className="absolute inset-0 -m-6 md:-m-8 animate-spin-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 rounded-full gradient-bg" />
            </div>
            <div 
              className="absolute inset-0 -m-3 md:-m-4 animate-spin-slow"
              style={{ animationDirection: 'reverse', animationDuration: '25s' }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent" />
            </div>

            {/* Gradient glow behind image */}
            <div className="absolute inset-0 rounded-full gradient-bg opacity-20 blur-2xl scale-110" />
            
            {/* Profile Image Container - Smaller sizes */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-background shadow-2xl">
              {/* Inner gradient border */}
              <div className="absolute inset-0 rounded-full p-1 gradient-bg">
                <div className="w-full h-full rounded-full overflow-hidden bg-background">
                  <img
                    src={profilePhoto}
                    alt="Rusiru Rathmina"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 md:w-16 md:h-16 rounded-full gradient-bg opacity-60 blur-xl" />
            <div className="absolute -top-2 -left-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent opacity-40 blur-xl" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center opacity-0 animate-fade-in"
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
    </section>
  );
}
