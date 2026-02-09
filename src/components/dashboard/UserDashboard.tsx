import { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle, Target, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/texrarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/types';

const categoryColors: Record<Activity['category'], string> = {
  work: 'bg-info/10 text-info border-info/20',
  study: 'bg-secondary/10 text-secondary border-secondary/20',
  fitness: 'bg-success/10 text-success border-success/20',
  personal: 'bg-warning/10 text-warning border-warning/20',
  other: 'bg-muted text-muted-foreground border-border',
};

const categoryLabels: Record<Activity['category'], string> = {
  work: 'Work',
  study: 'Study',
  fitness: 'Fitness',
  personal: 'Personal',
  other: 'Other',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Morning Workout',
      description: '30 minutes cardio and strength training',
      date: new Date().toISOString().split('T')[0],
      startTime: '07:00',
      endTime: '07:30',
      category: 'fitness',
      completed: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Team Meeting',
      description: 'Weekly project sync with the team',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      category: 'work',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Study Session',
      description: 'Review chapter 5 of the textbook',
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '16:00',
      category: 'study',
      completed: false,
      createdAt: new Date(),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    category: 'other' as Activity['category'],
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      category: 'other',
    });
    setEditingActivity(null);
  };

  const handleOpenDialog = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        title: activity.title,
        description: activity.description || '',
        date: activity.date,
        startTime: activity.startTime,
        endTime: activity.endTime,
        category: activity.category,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (editingActivity) {
      setActivities(prev =>
        prev.map(a =>
          a.id === editingActivity.id
            ? { ...a, ...formData }
            : a
        )
      );
      toast({
        title: 'Activity updated',
        description: 'Your activity has been updated successfully.',
      });
    } else {
      const newActivity: Activity = {
        id: String(Date.now()),
        ...formData,
        completed: false,
        createdAt: new Date(),
      };
      setActivities(prev => [...prev, newActivity]);
      toast({
        title: 'Activity added',
        description: 'Your new activity has been added to your schedule.',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleToggleComplete = (id: string) => {
    setActivities(prev =>
      prev.map(a =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );
  };

  const handleDelete = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    toast({
      title: 'Activity deleted',
      description: 'The activity has been removed from your schedule.',
    });
  };

  const todayActivities = activities.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const completedCount = todayActivities.filter(a => a.completed).length;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Let's make today productive
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
              <DialogDescription>
                {editingActivity ? 'Update your activity details below.' : 'Create a new activity to add to your schedule.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Morning Workout"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as Activity['category'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingActivity ? 'Save Changes' : 'Add Activity'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayActivities.length}</p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayActivities.length - completedCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-secondary" />
            Today's Activities
          </CardTitle>
          <CardDescription>Your scheduled activities for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No activities for today</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding your first activity
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayActivities
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      activity.completed
                        ? 'bg-muted/30 border-border/50 opacity-70'
                        : 'bg-card border-border hover:border-secondary/30 hover:shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleComplete(activity.id)}
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        activity.completed
                          ? 'bg-success border-success text-success-foreground'
                          : 'border-muted-foreground/30 hover:border-secondary'
                      }`}
                    >
                      {activity.completed && <CheckCircle className="h-4 w-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-medium ${activity.completed ? 'line-through' : ''}`}>
                            {activity.title}
                          </h4>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
                          )}
                        </div>
                        <Badge className={`shrink-0 ${categoryColors[activity.category]}`}>
                          {categoryLabels[activity.category]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{activity.startTime} - {activity.endTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(activity)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
