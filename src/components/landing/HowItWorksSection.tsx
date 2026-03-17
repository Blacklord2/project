import { UserPlus, Calendar, CheckCircle, BarChart3 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create an account',
    description: 'Sign up free with your email. Takes less than 30 seconds.',
  },
  {
    step: '02',
    icon: Calendar,
    title: 'Add your activities',
    description: 'Set a title, time, date, and category for each task.',
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'Complete & track',
    description: 'Check off tasks as you go. Your progress updates in real time.',
  },
  {
    step: '04',
    icon: BarChart3,
    title: 'Review your week',
    description: 'See charts and streaks that show how productive you\'ve been.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 border-b border-border">
      <div className="container">
        <div className="max-w-xl mb-14">
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-primary mb-4">
            How It Works
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold leading-tight">
            Four steps to a
            <br />more organized day
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Step number */}
              <span className="font-serif text-6xl font-light text-border/80 leading-none select-none">
                {item.step}
              </span>

              <div className="mt-4 space-y-2">
                <div className="h-9 w-9 rounded-lg bg-foreground/5 flex items-center justify-center">
                  <item.icon className="h-4.5 w-4.5 text-foreground/70" />
                </div>
                <h3 className="font-sans font-semibold text-base pt-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
