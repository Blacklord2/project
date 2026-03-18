import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Target, Users, Zap } from 'lucide-react';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <span className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-bold font-sans">db</span>
            About DoBetter
          </DialogTitle>
          <DialogDescription>
            A personal activity planner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">DoBetter</strong> is a simple activity management app for anyone who wants to organize their day. Plan activities, track progress, and build better habits.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60">
              <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Goal-Oriented</p>
                <p className="text-xs text-muted-foreground">Set daily goals, categorize activities, and stay focused on what matters.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60">
              <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Fast & Simple</p>
                <p className="text-xs text-muted-foreground">No complex setup. Create an account and start organizing in minutes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60">
              <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Built for Everyone</p>
                <p className="text-xs text-muted-foreground">Students, freelancers, professionals; DoBetter adapts to your workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
