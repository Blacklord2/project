import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative container py-24 md:py-36 lg:py-44">
        <div className="max-w-2xl space-y-8 animate-fade-up">
          {/* Overline */}
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-primary">
            Personal Activity Planner
          </p>

          {/* Heading — editorial serif */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-tight">
            Plan your day.
            <br />
            <span className="text-primary italic">Do better.</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
            Create, organize, and track your daily activities.
            Build habits that stick, one task at a time.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 text-sm font-medium px-6 h-11">
                Start for free
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-sm font-medium px-6 h-11 border-border hover:bg-muted/50">
                Sign in
              </Button>
            </Link>
          </div>

          {/* Quiet proof */}
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <span>Free forever</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>No credit card</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Takes 30 seconds</span>
          </div>
        </div>
      </div>

      {/* Bottom fade line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
}
