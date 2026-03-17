import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AboutDialog } from './AboutDialog';

export function Footer() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToFeatures = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="border-t border-border bg-background">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center text-[10px] font-bold">db</span>
                <span className="font-serif font-semibold text-base">DoBetter</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                A simple tool to plan activities, track what you've done, and build better daily habits.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h4 className="font-sans font-semibold text-sm tracking-wide uppercase text-muted-foreground">Navigate</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">Home</Link>
                </li>
                <li>
                  <button onClick={scrollToFeatures} className="text-foreground/70 hover:text-foreground transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAboutOpen(true)} className="text-foreground/70 hover:text-foreground transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <Link to="/login" className="text-foreground/70 hover:text-foreground transition-colors">Sign In</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-sans font-semibold text-sm tracking-wide uppercase text-muted-foreground">Contact</h4>
              <a
                href="mailto:israeleyibio@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                israeleyibio@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} DoBetter
            </p>
          </div>
        </div>
      </footer>

      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
    </>
  );
}
