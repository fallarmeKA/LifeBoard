import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Moon, Sun, Download, Upload } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

interface ThemeSettingsProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function ThemeSettings({ theme, onThemeChange }: ThemeSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const success = storage.importData(content);
          if (success) {
            toast({
              title: "Data Imported",
              description: "Your data has been imported successfully. Refresh to see changes.",
            });
            setTimeout(() => window.location.reload(), 1500);
          } else {
            toast({
              title: "Import Failed",
              description: "Failed to import data. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <Label>Dark Mode</Label>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Data Management</h3>
            <div className="space-y-2">
              <Button onClick={handleExport} variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={handleImport} variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
