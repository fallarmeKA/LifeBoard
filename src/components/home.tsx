import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ClockGreeting from './ClockGreeting';
import QuickLinks from './QuickLinks';
import WeatherWidget from './WeatherWidget';
import ExpenseTracker from './ExpenseTracker';
import ThemeSettings from './ThemeSettings';
import { useStore } from '@/store/useStore';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { CheckSquare, ArrowRight, Wallet } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const { theme, setTheme } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LifeBoard
            </h1>
            <p className="text-muted-foreground mt-1">Your Personal Command Center</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/tasks')}>
              <CheckSquare className="w-4 h-4 mr-2" />
              Tasks & Notes
            </Button>
            <Button variant="outline" onClick={() => navigate('/expenses')}>
              <Wallet className="w-4 h-4 mr-2" />
              Expenses
            </Button>
            <ThemeSettings theme={theme} onThemeChange={handleThemeChange} />
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clock & Greeting - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <ClockGreeting />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <QuickLinks />
          </motion.div>

          {/* Weather Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <WeatherWidget />
          </motion.div>

          {/* Expense Tracker - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <ExpenseTracker />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>All data stored locally in your browser • Privacy-first design</p>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}

export default Home;