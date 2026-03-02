import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import dbLogo from '@/assets/logo.svg';
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
      <footer className="bg-primary text-primary-foreground">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-md">
                  <img src={dbLogo} alt="DoBetter Logo" className="h-full w-full object-cover opacity-90" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg leading-tight">DoBetter</span>
                  <span className="text-[10px] text-primary-foreground/70 leading-none">Organize Your Life</span>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Your personal productivity companion. Plan activities, track progress,
                and achieve your goals with our intuitive platform.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
                </li>
                <li>
                  <button
                    onClick={scrollToFeatures}
                    className="hover:text-secondary transition-colors text-left"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsAboutOpen(true)}
                    className="hover:text-secondary transition-colors text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <Link to="/login" className="hover:text-secondary transition-colors">Sign In</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-secondary transition-colors">Get Started</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold">Contact</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/80">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-secondary shrink-0" />
                  <a
                    href="mailto:israeleyibio@gmail.com"
                    className="hover:text-secondary transition-colors break-all"
                  >
                    israeleyibio@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} DoBetter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
    </>
  );
}
