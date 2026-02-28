import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Target, Users, Zap } from 'lucide-react';
import dbLogo from '@/assets/logo.svg';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <img src={dbLogo} alt="DoBetter Logo" className="h-6 w-6 rounded-md object-cover" />
            About DoBetter
          </DialogTitle>
          <DialogDescription>
            Your personal productivity companion
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">DoBetter</strong> is a simple yet powerful activity management app designed to help students, professionals, and anyone who wants to organize their daily life. Plan your day, track your progress, and build better habits — all in one place.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Target className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Goal-Oriented</p>
                <p className="text-xs text-muted-foreground">Set daily goals, categorize activities, and stay focused on what matters most.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Zap className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Fast & Simple</p>
                <p className="text-xs text-muted-foreground">No complex setup. Create an account and start organizing your life in minutes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-info mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Built for Everyone</p>
                <p className="text-xs text-muted-foreground">Whether you're a student, freelancer, or professional — DoBetter adapts to your workflow.</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Made with ❤️ to help you do better, every day.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
