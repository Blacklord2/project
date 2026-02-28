import { UserPlus, Settings, Calendar, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up for free in seconds with just your email and password.',
  },
  {
    step: 2,
    icon: Calendar,
    title: 'Add Activities',
    description: 'Create activities with title, time, category, and optional description.',
  },
  {
    step: 3,
    icon: Settings,
    title: 'Organize Your Day',
    description: 'View your schedule, categorize tasks, and prioritize what matters most.',
  },
  {
    step: 4,
    icon: CheckCircle,
    title: 'Track Progress',
    description: 'Mark activities complete and watch your productivity grow over time.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Get Started in
            <span className="text-primaryfd"> 4 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Start organizing your life today with our simple and intuitive platform.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center group">
                {/* Step Number */}
                <div className="relative z-10 mx-auto mb-6">
                  <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    <item.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-secondary text-secondary-foreground font-bold flex items-center justify-center text-sm shadow-md">
                    {item.step}
                  </div>
                </div>

                <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
