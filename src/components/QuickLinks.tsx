import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore } from '@/store/useStore';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';

export default function QuickLinks() {
  const { quickLinks, addQuickLink, deleteQuickLink } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '🔗' });

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;

    addQuickLink({
      id: Date.now().toString(),
      ...newLink,
    });
    setNewLink({ title: '', url: '', icon: '🔗' });
    setIsDialogOpen(false);
  };

  return (
    <Card className="p-6 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Quick Links</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Quick Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Title"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              />
              <Input
                placeholder="URL (https://...)"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
              <Input
                placeholder="Icon (emoji)"
                value={newLink.icon}
                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                maxLength={2}
              />
              <Button onClick={handleAddLink} className="w-full">Add Link</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence>
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group relative p-4 hover:shadow-lg transition-all cursor-pointer">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">{link.icon}</span>
                  <span className="text-sm font-medium text-center">{link.title}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteQuickLink(link.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
