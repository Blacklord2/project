import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus, Calendar, Clock, CheckCircle, Target, Trash2, Edit2,
  TrendingUp, TrendingDown, Flame, BarChart2, ListTodo,
  Zap, BookOpen, Dumbbell, User2, MoreHorizontal, Upload,
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

const PIE_COLORS = ['hsl(210,55%,48%)', 'hsl(108,19%,40%)', 'hsl(152,40%,38%)', 'hsl(38,80%,50%)', 'hsl(24,8%,55%)'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ─── helpers ───────────────────────────────────────────────────────────── */

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

/* ─── component ─────────────────────────────────────────────────────────── */

export default function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      const diff = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - diff + i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
      .catch(() => {})
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

  const handleImportIcs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const result = await activitiesApi.importIcs(file);
      const newActivities = result.activities.map(item => ({
        ...item,
        createdAt: typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt,
      })) as Activity[];
      setActivities(prev => [...prev, ...newActivities]);
      toast({
        title: 'Import successful',
        description: `Imported ${result.imported} activit${result.imported !== 1 ? 'ies' : 'y'}${result.skipped > 0 ? `, skipped ${result.skipped}` : ''}.`,
      });
    } catch (err) {
      toast({
        title: 'Import failed',
        description: err instanceof Error ? err.message : 'Could not import the .ics file.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const displayActivities = activeTab === 'today' ? todayActivities : activities;

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      {/* ── Top banner ── */}
      <div className="bg-foreground px-6 py-8 md:py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-background/50 text-xs font-medium tracking-wide uppercase mb-1">{formatDate(new Date())}</p>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-background">
              {getGreeting()}, {user?.fullName?.split(' ')[0]}
            </h1>
            <p className="text-background/50 mt-1 text-sm">
              {completionPct === 100 && todayActivities.length > 0
                ? 'All done for today — great work!'
                : `${pendingToday} task${pendingToday !== 1 ? 's' : ''} remaining today`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".ics,text/calendar"
              className="hidden"
              onChange={handleImportIcs}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="bg-background/10 text-background border border-background/20 hover:bg-background/20 text-sm font-medium"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import .ics'}
            </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-background text-foreground hover:bg-background/90 text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="font-serif">{editingActivity ? 'Edit Activity' : 'New Activity'}</DialogTitle>
                <DialogDescription>
                  {editingActivity ? 'Update the details below.' : 'Add a new activity to your schedule.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input id="title" placeholder="e.g., Morning Workout" value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea id="description" placeholder="Optional details..." value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                    <Input id="date" type="date" value={formData.date}
                      onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                    <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v as Activity['category'] }))}>
                      <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
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
                  <div className="space-y-1.5">
                    <Label htmlFor="startTime" className="text-sm font-medium">Start *</Label>
                    <Input id="startTime" type="time" value={formData.startTime}
                      onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))} className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="endTime" className="text-sm font-medium">End *</Label>
                    <Input id="endTime" type="time" value={formData.endTime}
                      onChange={e => setFormData(p => ({ ...p, endTime: e.target.value }))} className="h-10" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-sm">Cancel</Button>
                <Button onClick={handleSubmit} className="bg-foreground text-background hover:bg-foreground/90 text-sm">{editingActivity ? 'Save Changes' : 'Add Activity'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-border/60 shadow-warm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">Today</span>
              </div>
              <p className="text-2xl font-semibold font-serif">{todayActivities.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Scheduled</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-warm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-[10px] font-medium text-success">{completionPct}%</span>
              </div>
              <p className="text-2xl font-semibold font-serif">{completedToday}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
              <Progress value={completionPct} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-warm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">Left</span>
              </div>
              <p className="text-2xl font-semibold font-serif">{pendingToday}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-warm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Flame className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">Streak</span>
              </div>
              <p className="text-2xl font-semibold font-serif">{streak}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Day{streak !== 1 ? 's' : ''} in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border-border/60 shadow-warm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-sans font-semibold">
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                Weekly Overview
              </CardTitle>
              <CardDescription className="text-xs">Activities this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  total:     { label: 'Total',     color: 'hsl(var(--muted-foreground))' },
                  completed: { label: 'Completed', color: 'hsl(var(--success))' },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barGap={2} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={24} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total"     fill="hsl(var(--border))" radius={[3,3,0,0]} />
                    <Bar dataKey="completed" fill="hsl(var(--success))" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-warm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-sans font-semibold">
                <Target className="h-4 w-4 text-muted-foreground" />
                By Category
              </CardTitle>
              <CardDescription className="text-xs">All-time breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                        paddingAngle={2} dataKey="value" strokeWidth={0}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px' }}
                      />
                      <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '11px' }} />
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
        <Card className="border-border/60 shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-sans font-semibold">
                  <ListTodo className="h-4 w-4 text-muted-foreground" />
                  Activities
                </CardTitle>
                <CardDescription className="text-xs">Manage your schedule</CardDescription>
              </div>
              <div className="flex items-center gap-0.5 bg-muted/60 rounded-md p-0.5">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    activeTab === 'today' ? 'bg-background shadow-warm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    activeTab === 'all' ? 'bg-background shadow-warm text-foreground' : 'text-muted-foreground hover:text-foreground'
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
                <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-medium text-sm mb-1">No activities yet</h3>
                <p className="text-xs text-muted-foreground mb-4">Add your first activity to get started</p>
                <Button onClick={() => handleOpenDialog()} className="text-sm bg-foreground text-background hover:bg-foreground/90">
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {[...displayActivities]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((activity) => {
                    const Icon = categoryIcons[activity.category];
                    return (
                      <div
                        key={activity.id}
                        className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          activity.completed
                            ? 'bg-muted/30 border-border/40 opacity-60'
                            : 'bg-background border-border/60 hover:border-border hover:shadow-warm'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleComplete(activity.id)}
                          className={`h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
                            activity.completed
                              ? 'bg-success border-success text-success-foreground'
                              : 'border-border hover:border-success hover:bg-success/5'
                          }`}
                        >
                          {activity.completed && <CheckCircle className="h-3 w-3" />}
                        </button>

                        <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${categoryColors[activity.category].split(' ').slice(0,2).join(' ')}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-medium text-sm ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {activity.title}
                            </span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 font-normal ${categoryColors[activity.category]}`}>
                              {categoryLabels[activity.category]}
                            </Badge>
                          </div>
                          {activity.description && (
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{activity.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
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

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenDialog(activity)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(activity.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Category breakdown ── */}
        <Card className="border-border/60 shadow-warm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-sans font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
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
                  <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${categoryColors[cat].split(' ').slice(0,2).join(' ')}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{categoryLabels[cat]}</span>
                      <span className="text-xs text-muted-foreground">{done}/{total}</span>
                    </div>
                    <Progress value={pct} className="h-1" />
                  </div>
                  <span className="text-xs font-medium w-8 text-right text-muted-foreground">{pct}%</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
