/**
 * Centralised API client for the DoBetter backend.
 * All requests go through /api (proxied to http://localhost:3001 in dev).
 */

const BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('db_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/* ─── Auth ───────────────────────────────────────────────────────────────── */

export interface ApiUser {
  id: number;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}

export const authApi = {
  register: (email: string, fullName: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, fullName, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<ApiUser>('/auth/me'),

  updateProfile: (data: { fullName?: string; password?: string }) =>
    request<ApiUser>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

/* ─── Activities ─────────────────────────────────────────────────────────── */

export interface ApiActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'study' | 'fitness' | 'personal' | 'other';
  completed: boolean;
  createdAt: string;
}

export type CreateActivityPayload = Omit<ApiActivity, 'id' | 'completed' | 'createdAt'>;
export type UpdateActivityPayload = Partial<Omit<ApiActivity, 'id' | 'createdAt'>>;

export const activitiesApi = {
  list: (date?: string) =>
    request<ApiActivity[]>(`/activities${date ? `?date=${date}` : ''}`),

  create: (payload: CreateActivityPayload) =>
    request<ApiActivity>('/activities', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateActivityPayload) =>
    request<ApiActivity>(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  toggle: (id: string) =>
    request<ApiActivity>(`/activities/${id}/toggle`, { method: 'PATCH' }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/activities/${id}`, { method: 'DELETE' }),
};

/* ─── Reminders ──────────────────────────────────────────────────────────── */

export const remindersApi = {
  schedule: (activities: ApiActivity[]) =>
    request<{ success: boolean; scheduled: number }>('/reminders/schedule', {
      method: 'POST',
      body: JSON.stringify({ activities }),
    }),

  cancel: (activityId: string) =>
    request<{ success: boolean }>(`/reminders/${activityId}`, { method: 'DELETE' }),
};
