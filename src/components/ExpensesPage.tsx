import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { Expense } from '@/types/dashboard';
import { Plus, Trash2, Edit, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

const CATEGORY_COLORS = {
  food: '#ef4444',
  transport: '#3b82f6',
  entertainment: '#8b5cf6',
  utilities: '#10b981',
  shopping: '#f59e0b',
  other: '#6b7280',
};

const CATEGORY_ICONS = {
  food: '🍔',
  transport: '🚗',
  entertainment: '🎬',
  utilities: '💡',
  shopping: '🛍️',
  other: '📦',
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 15}
        fill={fill}
      />
    </g>
  );
};

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | Expense['category']>('all');
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'other' as Expense['category'],
    type: 'expense' as 'income' | 'expense',
  });

  const handleAddExpense = () => {
    if (!newExpense.title.trim() || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount) * (newExpense.type === 'expense' ? 1 : -1),
      category: newExpense.category,
      date: new Date().toISOString(),
    };

    addExpense(expense);
    setNewExpense({ title: '', amount: '', category: 'other', type: 'expense' });
    setIsDialogOpen(false);
  };

  const filteredExpenses = selectedCategory === 'all'
    ? expenses
    : expenses.filter((e) => e.category === selectedCategory);

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const { totalIncome, totalExpenses, categoryData } = useMemo(() => {
    const income = expenses.filter((e) => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);
    const expenseTotal = expenses.filter((e) => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals: Record<string, number> = {};
    expenses.filter((e) => e.amount > 0).forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: CATEGORY_COLORS[name as Expense['category']],
      icon: CATEGORY_ICONS[name as Expense['category']],
    }));

    return {
      totalIncome: income,
      totalExpenses: expenseTotal,
      categoryData: chartData,
    };
  }, [expenses]);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Expense Tracker</h1>
          <p className="text-muted-foreground">Manage your finances with ease</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Income</p>
                  <p className="text-3xl font-bold mt-1">£{totalIncome.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-red-500 to-rose-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Expenses</p>
                  <p className="text-3xl font-bold mt-1">£{totalExpenses.toFixed(2)}</p>
                </div>
                <TrendingDown className="w-10 h-10 opacity-80" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`p-6 bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-cyan-600' : 'from-orange-500 to-amber-600'} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Balance</p>
                  <p className="text-3xl font-bold mt-1">£{balance.toFixed(2)}</p>
                </div>
                <DollarSign className="w-10 h-10 opacity-80" />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Spending Distribution</h2>
              {categoryData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  <p>No expense data yet</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Transactions Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Transaction</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <Select
                        value={newExpense.type}
                        onValueChange={(value: 'income' | 'expense') => setNewExpense({ ...newExpense, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Title"
                        value={newExpense.title}
                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      />
                      <Select
                        value={newExpense.category}
                        onValueChange={(value: Expense['category']) => setNewExpense({ ...newExpense, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">🍔 Food</SelectItem>
                          <SelectItem value="transport">🚗 Transport</SelectItem>
                          <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                          <SelectItem value="utilities">💡 Utilities</SelectItem>
                          <SelectItem value="shopping">🛍️ Shopping</SelectItem>
                          <SelectItem value="other">📦 Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddExpense} className="w-full">Add Transaction</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="food">🍔 Food</TabsTrigger>
                  <TabsTrigger value="transport">🚗 Transport</TabsTrigger>
                  <TabsTrigger value="entertainment">🎬 Entertainment</TabsTrigger>
                  <TabsTrigger value="utilities">💡 Utilities</TabsTrigger>
                  <TabsTrigger value="shopping">🛍️ Shopping</TabsTrigger>
                  <TabsTrigger value="other">📦 Other</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                  {sortedExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                              style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '20' }}
                            >
                              {CATEGORY_ICONS[expense.category]}
                            </div>
                            <div>
                              <p className="font-semibold">{expense.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {expense.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(expense.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className={`text-lg font-bold ${expense.amount < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {expense.amount < 0 ? '+' : '-'}£{Math.abs(expense.amount).toFixed(2)}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {sortedExpenses.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No transactions yet. Add your first transaction!</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
