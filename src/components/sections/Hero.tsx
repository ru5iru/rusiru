import { ArrowRight, Download } from 'lucide-react';
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
    <section className="relative overflow-hidden min-h-screen flex items-center pt-20 md:pt-24" aria-label="Introduction to Rusiru Rathmina, Full-Stack Software Engineer">
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
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-5xl w-full">

          {/* Left - Profile Card */}
          <div
            className="opacity-0 animate-fade-in flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-5"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Profile Image */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full gradient-bg opacity-20 blur-xl scale-125" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-56 lg:h-56 rounded-full overflow-hidden border-2 border-primary/30 shadow-xl">
                <img
                  src={profilePhoto}
                  alt="Rusiru Rathmina - Full-Stack Software Engineer based in Colombo, Sri Lanka"
                  loading="eager"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Name & Short Bio */}
            <div className="lg:mt-1">
              <h2
                className="text-lg sm:text-xl font-bold text-foreground opacity-0 animate-fade-in"
                style={{ animationDelay: '0.5s' }}
              >
                Rusiru Rathmina
              </h2>
              <p
                className="text-sm text-muted-foreground max-w-[220px] mt-1 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                Full-Stack Software Engineer with a passion for building scalable, user-centric applications.
              </p>
            </div>
          </div>

          {/* Right - Headline & Description */}
          <div className="flex-1">
            {/* Large Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="gradient-text">Building Robust</span>
              <br />
              <span className="gradient-text">Full-Stack Solutions</span>
              <br />
              <span className="text-foreground/80">for Modern Web</span>
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed opacity-0 animate-fade-in"
              style={{ animationDelay: '0.7s' }}
            >
              As a software engineer and problem solver, I specialize in developing
              high-performance web applications, RESTful APIs, and enterprise solutions
              that help businesses scale and succeed.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start opacity-0 animate-fade-in"
              style={{ animationDelay: '0.9s' }}
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
        </div>

      </div>
    </section>
  );
}
