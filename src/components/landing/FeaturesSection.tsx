import { 
  Calendar, 
  CheckCircle, 
  Bell, 
  BarChart3, 
  Clock,
  Smartphone,
  Zap,
  Target,
  Repeat
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Create and manage your activities with an intuitive interface. Plan your day in seconds.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: CheckCircle,
    title: 'Progress Tracking',
    description: 'Mark activities as complete and track your daily achievements and productivity.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss an important activity with timely notifications and alerts.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set daily goals and categorize activities to stay focused on what matters.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: BarChart3,
    title: 'Activity Insights',
    description: 'View your activity patterns and understand how you spend your time.',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    icon: Clock,
    title: 'Time Management',
    description: 'Optimize your schedule with start and end times for each activity.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your activities anytime, anywhere on any device with responsive design.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    description: 'No complex setup required. Start organizing your life in minutes.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Repeat,
    title: 'Categories',
    description: 'Organize activities by category: work, study, fitness, personal, and more.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="text-gradient">DoBetter</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple yet powerful tools to help you organize your day, 
            track your progress, and achieve your goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-border/50 bg-card hover:shadow-lg hover:border-secondary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
