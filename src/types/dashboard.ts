export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  order: number;
  category?: 'work' | 'personal' | 'errands';
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'utilities' | 'shopping' | 'other';
  date: string;
}

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
}

export type Theme = 'light' | 'dark';
export type ColorTheme = 'blue' | 'purple' | 'green' | 'orange';