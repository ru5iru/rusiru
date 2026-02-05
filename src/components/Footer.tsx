import { 
  Linkedin, 
  Github, 
  Facebook, 
} from 'lucide-react';

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socialLinks = [
  { href: 'https://www.linkedin.com/in/ru5iru', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-[#0077B5]' },
  { href: 'https://github.com/ru5iru', icon: Github, label: 'GitHub', color: 'hover:text-foreground' },
  { href: 'https://www.discordapp.com/users/Rusiru#4036', icon: DiscordIcon, label: 'Discord', color: 'hover:text-[#5865F2]' },
  { href: 'https://web.facebook.com/ru5iru', icon: Facebook, label: 'Facebook', color: 'hover:text-[#1877F2]' },
  { href: 'https://twitter.com/ru5iru', icon: XIcon, label: 'X', color: 'hover:text-foreground' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground ${link.color} transition-all duration-300 hover:scale-125`}
                  aria-label={link.label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              );
            })}
            {/* Reddit */}
            <a
              href="https://www.reddit.com/u/ru5iru/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#FF4500] transition-all duration-300 hover:scale-125"
              aria-label="Reddit"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </a>
            {/* Blogger */}
            <a
              href="https://iamrusiru.blogspot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#FF5722] transition-all duration-300 hover:scale-125"
              aria-label="Blogger"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.954 10.667c-.072-.322-.272-.6-.534-.763-.263-.164-.581-.228-.903-.18l-1.274.19c-.127-.84-.406-1.647-.827-2.376-.422-.729-.977-1.37-1.637-1.883-1.319-.973-3.021-1.481-4.779-1.481-2.173 0-4.14.79-5.539 2.226C4.062 7.837 3.28 9.756 3.28 11.85c0 .74.097 1.478.288 2.194-.614.18-1.169.53-1.598 1.004-.429.475-.723 1.054-.849 1.673-.126.619-.079 1.263.138 1.86.216.595.582 1.123 1.056 1.526.959.816 2.214 1.269 3.535 1.269h10.3c1.321 0 2.576-.453 3.535-1.269.474-.403.84-.931 1.056-1.526.217-.597.264-1.241.138-1.86-.126-.619-.42-1.198-.849-1.673-.43-.474-.984-.824-1.598-1.004.191-.716.288-1.454.288-2.194 0-.324-.019-.649-.056-.972l1.274-.19c.322-.048.606-.195.804-.415.199-.22.307-.502.307-.794 0-.066-.006-.133-.017-.198-.011-.066-.03-.131-.056-.192l-.022-.066zm-7.094 7.933H10.14c-.424 0-.768-.343-.768-.767s.344-.767.768-.767h3.72c.424 0 .768.343.768.767s-.344.767-.768.767zm1.86-4.6H10.14c-.424 0-.768-.343-.768-.767s.344-.767.768-.767h5.58c.424 0 .768.343.768.767s-.344.767-.768.767z"/>
              </svg>
            </a>
            {/* Spotify */}
            <a
              href="https://open.spotify.com/user/31ihlph5wpwcdblzhklpoc3evmy4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#1DB954] transition-all duration-300 hover:scale-125"
              aria-label="Spotify"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </a>
          </div>

          {/* Logo */}
          <a href="#" className="text-3xl font-display font-bold gradient-text">
            RR.
          </a>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Rusiru Rathmina. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
