export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'study' | 'fitness' | 'personal' | 'other';
  completed: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}
