import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import dbLogo from '@/assets/logo.svg';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <li><Link to="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link to="/features" className="hover:text-secondary transition-colors">Features</Link></li>
              <li><Link to="/about" className="hover:text-secondary transition-colors">About</Link></li>
              <li><Link to="/login" className="hover:text-secondary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="#" className="hover:text-secondary transition-colors">Documentation</Link></li>
              <li><Link to="#" className="hover:text-secondary transition-colors">User Guide</Link></li>
              <li><Link to="#" className="hover:text-secondary transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-secondary transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <a href="mailto:support@dobetter.app" className="hover:text-secondary transition-colors">
                  support@dobetter.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            © 2025 DoBetter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
