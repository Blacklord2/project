import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-campus.jpg';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Productivity workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container py-20 md:py-32 lg:py-40">
        <div className="max-w-3xl space-y-8 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 border border-secondary/30 px-4 py-1.5 text-sm text-primary-foreground backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
            Personal Activity Planner
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Plan Your Day
            <span className="block text-secondary mt-2">DoBetter</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed">
            Take control of your time with DoBetter. Create, organize, and track 
            your daily activities effortlessly. Build better habits and achieve 
            your goals one task at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link to="/register">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="hero-outline" size="xl">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-primary-foreground/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-foreground">Easy</p>
                <p className="text-sm text-primary-foreground/70">To Use</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-foreground">Track</p>
                <p className="text-sm text-primary-foreground/70">Progress</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-foreground">Save</p>
                <p className="text-sm text-primary-foreground/70">Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
