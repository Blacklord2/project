import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative bg-foreground rounded-2xl px-8 py-16 md:px-16 md:py-20 overflow-hidden">
          {/* Subtle decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />

          <div className="relative z-10 max-w-xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-background leading-tight mb-4">
              Ready to do
              <span className="italic"> better?</span>
            </h2>

            <p className="text-background/60 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Start organizing your day in under a minute. It's free, no strings
              attached.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 text-sm font-medium px-6 h-11"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  className="text-sm font-medium px-6 h-11 bg-transparent border border-background/30 text-background/80 hover:bg-background/10 hover:text-background"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
