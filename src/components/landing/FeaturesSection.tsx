import {
  Calendar,
  CheckCircle,
  Bell,
  BarChart3,
  Clock,
  Target,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Create activities with dates, times, and categories. Your day, organized in seconds.',
  },
  {
    icon: CheckCircle,
    title: 'Progress Tracking',
    description: 'Mark tasks complete. See your completion rate and daily streaks at a glance.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Email reminders for upcoming activities so nothing falls through the cracks.',
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Categorize activities by type: work, study, fitness, personal, and stay focused.',
  },
  {
    icon: BarChart3,
    title: 'Weekly Insights',
    description: 'Visual charts show how you spend your time and where you can improve.',
  },
  {
    icon: Clock,
    title: 'Time Blocks',
    description: 'Set start and end times. See your schedule laid out clearly by the hour.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 border-b border-border">
      <div className="container">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="font-sans text-sm font-medium tracking-widest uppercase text-primary mb-4">
            Features
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-4">
            Everything you need,
            <br />nothing you don't
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Simple tools to organize your day, track your habits, and see your progress over time.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-base mb-1.5">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
