import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plus, Calendar, Clock, CheckCircle, Target, Trash2, Edit2,
  TrendingUp, TrendingDown, Flame, Award, BarChart2, ListTodo,
  ChevronRight, Zap, BookOpen, Dumbbell, User2, MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/texrarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/charts';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '@/types';
import { activitiesApi, ApiActivity, remindersApi } from '@/lib/api';

/* ─── constants ─────────────────────────────────────────────────────────── */

const categoryColors: Record<Activity['category'], string> = {
  work:     'bg-info/10 text-info border-info/20',
  study:    'bg-secondary/10 text-secondary border-secondary/20',
  fitness:  'bg-success/10 text-success border-success/20',
  personal: 'bg-warning/10 text-warning border-warning/20',
  other:    'bg-muted text-muted-foreground border-border',
};

const categoryLabels: Record<Activity['category'], string> = {
  work: 'Work', study: 'Study', fitness: 'Fitness', personal: 'Personal', other: 'Other',
};

const categoryIcons: Record<Activity['category'], React.ElementType> = {
  work: Zap, study: BookOpen, fitness: Dumbbell, personal: User2, other: MoreHorizontal,
};

const PIE_COLORS = ['hsl(200,80%,50%)', 'hsl(174,60%,40%)', 'hsl(152,60%,40%)', 'hsl(38,92%,50%)', 'hsl(220,15%,55%)'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ─── helpers ───────────────────────────────────────────────────────────── */

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── seed data ─────────────────────────────────────────────────────────── */


/* ─── component ─────────────────────────────────────────────────────────── */

export default function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const [formData, setFormData] = useState({
    title: '', description: '',
    date: todayStr(), startTime: '', endTime: '',
    category: 'other' as Activity['category'],
  });

  /* derived */
  const today = todayStr();
  const todayActivities = useMemo(() => activities.filter(a => a.date === today), [activities, today]);
  const completedToday = todayActivities.filter(a => a.completed).length;
  const pendingToday   = todayActivities.length - completedToday;
  const completionPct  = todayActivities.length ? Math.round((completedToday / todayActivities.length) * 100) : 0;

  /* weekly bar chart data */
  const weeklyData = useMemo(() => {
    return DAYS.map((day, i) => {
      const d = new Date();
      const diff = (d.getDay() + 6) % 7; // Mon=0
      d.setDate(d.getDate() - diff + i);
      const ds = d.toISOString().split('T')[0];
      const dayActs = activities.filter(a => a.date === ds);
      return {
        day,
        total:     dayActs.length,
        completed: dayActs.filter(a => a.completed).length,
      };
    });
  }, [activities]);

  /* pie chart data */
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: categoryLabels[name as Activity['category']], value }));
  }, [activities]);

  /* streak */
  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split('T')[0];
      const acts = activities.filter(a => a.date === ds);
      if (acts.length === 0 || acts.some(a => !a.completed)) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [activities]);

  /* fetch activities on mount */
  useEffect(() => {
    activitiesApi.list()
      .then(data => setActivities(data.map(item => ({
        ...item,
        createdAt: typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt,
      })) as Activity[]))
      .catch(() => {/* fallback to empty */})
      .finally(() => setIsLoading(false));
  }, []);

  /* schedule email reminders whenever activities or user changes */
  useEffect(() => {
    if (!user?.email || isLoading) return;
    const apiActivities = activities.map(a => ({
      ...a,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
    })) as ApiActivity[];
    remindersApi.schedule(apiActivities).catch(() => {});
  }, [activities, user, isLoading]);

  /* form helpers */
  const resetForm = () => {
    setFormData({ title: '', description: '', date: todayStr(), startTime: '', endTime: '', category: 'other' });
    setEditingActivity(null);
  };

  const handleOpenDialog = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({ title: activity.title, description: activity.description || '', date: activity.date, startTime: activity.startTime, endTime: activity.endTime, category: activity.category });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    try {
      if (editingActivity) {
        const updated = await activitiesApi.update(editingActivity.id, formData);
        setActivities(prev => prev.map(a => a.id === editingActivity.id ? { ...updated, createdAt: typeof updated.createdAt === 'string' ? new Date(updated.createdAt) : updated.createdAt } as Activity : a));
        toast({ title: 'Activity updated', description: 'Your activity has been updated.' });
      } else {
        const created = await activitiesApi.create(formData);
        setActivities(prev => [...prev, { ...created, createdAt: typeof created.createdAt === 'string' ? new Date(created.createdAt) : created.createdAt } as Activity]);
        toast({ title: 'Activity added', description: 'New activity added to your schedule.' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save activity.', variant: 'destructive' });
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updated = await activitiesApi.toggle(id);
      setActivities(prev => prev.map(a => a.id === id ? { ...updated, createdAt: typeof updated.createdAt === 'string' ? new Date(updated.createdAt) : updated.createdAt } as Activity : a));
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update activity.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await activitiesApi.delete(id);
      setActivities(prev => prev.filter(a => a.id !== id));
      toast({ title: 'Activity deleted', description: 'The activity has been removed.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete activity.', variant: 'destructive' });
    }
  };

  const displayActivities = activeTab === 'today' ? todayActivities : activities;

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      {/* ── Top banner ── */}
      <div className="gradient-hero px-6 py-8 md:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-primary-foreground/70 text-sm mb-1">{formatDate(new Date())}</p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
              {getGreeting()}, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm">
              {completionPct === 100 && todayActivities.length > 0
                ? '🎉 All done for today — great work!'
                : `You have ${pendingToday} task${pendingToday !== 1 ? 's' : ''} remaining today`}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
                <DialogDescription>
                  {editingActivity ? 'Update your activity details below.' : 'Create a new activity for your schedule.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" placeholder="e.g., Morning Workout" value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Add more details..." value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input id="date" type="date" value={formData.date}
                      onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v as Activity['category'] }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Input id="startTime" type="time" value={formData.startTime}
                      onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input id="endTime" type="time" value={formData.endTime}
                      onChange={e => setFormData(p => ({ ...p, endTime: e.target.value }))} />
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
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-success" /> Today
                </span>
              </div>
              <p className="text-3xl font-bold">{todayActivities.length}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Scheduled</p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <span className="text-xs text-success font-medium">{completionPct}%</span>
              </div>
              <p className="text-3xl font-bold">{completedToday}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Completed</p>
              <Progress value={completionPct} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-warning" /> Remaining
                </span>
              </div>
              <p className="text-3xl font-bold">{pendingToday}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Pending</p>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-destructive" />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Award className="h-3 w-3 text-warning" /> Streak
                </span>
              </div>
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Day{streak !== 1 ? 's' : ''} in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Weekly bar chart */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart2 className="h-4 w-4 text-secondary" />
                    Weekly Overview
                  </CardTitle>
                  <CardDescription>Activities this week</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  total:     { label: 'Total',     color: 'hsl(var(--secondary))' },
                  completed: { label: 'Completed', color: 'hsl(var(--success))' },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barGap={4} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={24} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total"     fill="hsl(var(--secondary))" radius={[4,4,0,0]} opacity={0.4} />
                    <Bar dataKey="completed" fill="hsl(var(--success))"   radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Category pie chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-info" />
                By Category
              </CardTitle>
              <CardDescription>All-time breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                        paddingAngle={3} dataKey="value">
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Activity list ── */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-secondary" />
                  Activities
                </CardTitle>
                <CardDescription>Manage your scheduled tasks</CardDescription>
              </div>
              {/* Tab toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'today' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'all' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {displayActivities.length === 0 ? (
              <div className="text-center py-14">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No activities yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Start by adding your first activity</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" /> Add Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {[...displayActivities]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((activity) => {
                    const Icon = categoryIcons[activity.category];
                    return (
                      <div
                        key={activity.id}
                        className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          activity.completed
                            ? 'bg-muted/20 border-border/40 opacity-60'
                            : 'bg-card border-border hover:border-secondary/40 hover:shadow-sm'
                        }`}
                      >
                        {/* Complete toggle */}
                        <button
                          onClick={() => handleToggleComplete(activity.id)}
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            activity.completed
                              ? 'bg-success border-success text-success-foreground'
                              : 'border-muted-foreground/30 hover:border-success hover:bg-success/10'
                          }`}
                        >
                          {activity.completed && <CheckCircle className="h-3.5 w-3.5" />}
                        </button>

                        {/* Category icon */}
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[activity.category].split(' ').slice(0,2).join(' ')}`}>
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-medium text-sm ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {activity.title}
                            </span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[activity.category]}`}>
                              {categoryLabels[activity.category]}
                            </Badge>
                          </div>
                          {activity.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.startTime} – {activity.endTime}
                            </span>
                            {activeTab === 'all' && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {activity.date}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(activity)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(activity.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Bottom row: Category summary + Quick tips ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Category summary */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-secondary" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['work','study','fitness','personal','other'] as Activity['category'][]).map(cat => {
                const total = activities.filter(a => a.category === cat).length;
                const done  = activities.filter(a => a.category === cat && a.completed).length;
                const pct   = total ? Math.round((done / total) * 100) : 0;
                const Icon  = categoryIcons[cat];
                if (total === 0) return null;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[cat].split(' ').slice(0,2).join(' ')}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{categoryLabels[cat]}</span>
                        <span className="text-xs text-muted-foreground">{done}/{total}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Productivity tips */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                Productivity Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { tip: 'Time-block your deep work sessions for maximum focus.', icon: Clock },
                { tip: 'Review your goals every morning to stay aligned.', icon: Target },
                { tip: 'Take a 5-minute break every 25 minutes (Pomodoro).', icon: Flame },
                { tip: 'Celebrate small wins — they build momentum.', icon: Award },
              ].map(({ tip, icon: TipIcon }, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/60 border border-border/40">
                  <TipIcon className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
