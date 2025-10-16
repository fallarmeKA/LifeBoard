import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Expense } from '@/types/dashboard';

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreState {
  // Theme
  theme: 'light' | 'dark';
  accentColor: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setAccentColor: (color: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  // Quick Links
  quickLinks: QuickLink[];
  addQuickLink: (link: QuickLink) => void;
  deleteQuickLink: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Weather
  weatherLocation: string;
  setWeatherLocation: (location: string) => void;

  // User
  userName: string;
  setUserName: (name: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'light',
      accentColor: '#3b82f6',
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),

      // Tasks
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      reorderTasks: (tasks) => set({ tasks }),

      // Expenses
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({ expenses: [...state.expenses, expense] })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        })),

      // Quick Links
      quickLinks: [
        { id: '1', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
        { id: '2', title: 'Gmail', url: 'https://gmail.com', icon: '📧' },
        { id: '3', title: 'YouTube', url: 'https://youtube.com', icon: '📺' },
      ],
      addQuickLink: (link) =>
        set((state) => ({ quickLinks: [...state.quickLinks, link] })),
      deleteQuickLink: (id) =>
        set((state) => ({
          quickLinks: state.quickLinks.filter((link) => link.id !== id),
        })),

      // Notes
      notes: [],
      addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),

      // Weather
      weatherLocation: 'London',
      setWeatherLocation: (location) => set({ weatherLocation: location }),

      // User
      userName: 'Friend',
      setUserName: (name) => set({ userName: name }),
    }),
    {
      name: 'lifeboard-storage',
    }
  )
);
