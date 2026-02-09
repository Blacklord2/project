import { Activity, Notification } from '@/types';

// Sample activities for demo
export const sampleActivities: Activity[] = [
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
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Activity Completed',
    message: 'Great job! You completed your morning workout.',
    type: 'success',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    title: 'Reminder',
    message: 'Your team meeting starts in 30 minutes.',
    type: 'info',
    timestamp: new Date(),
    read: false,
  },
];
