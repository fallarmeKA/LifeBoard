import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

export default function ClockGreeting() {
  const [time, setTime] = useState(new Date());
  const userName = useStore((state) => state.userName);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️', gradient: 'from-yellow-400 to-orange-500' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️', gradient: 'from-blue-400 to-cyan-500' };
    if (hour < 21) return { text: 'Good Evening', emoji: '🌆', gradient: 'from-orange-500 to-pink-500' };
    return { text: 'Good Night', emoji: '🌙', gradient: 'from-indigo-600 to-purple-700' };
  };

  const greeting = getGreeting();

  return (
    <Card className={`p-8 bg-gradient-to-br ${greeting.gradient} text-white overflow-hidden relative`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-5xl font-bold mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </motion.h2>
        <motion.p
          className="text-2xl font-medium opacity-90"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.9, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {greeting.text}, {userName} {greeting.emoji}
        </motion.p>
        <motion.p
          className="text-sm opacity-75 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.4 }}
        >
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </motion.p>
      </motion.div>

      {/* Animated background elements */}
      <motion.div
        className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </Card>
  );
}
