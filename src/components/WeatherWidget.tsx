import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, CloudRain, Sun, CloudSnow, Wind } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useStore } from '@/store/useStore';

export default function WeatherWidget() {
  const { weatherLocation, setWeatherLocation } = useStore();
  const [location, setLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('London');
  const [weather, setWeather] = useState({
    current: { temp: 18, condition: 'Partly Cloudy', icon: 'cloud' },
    forecast: [
      { day: 'Tomorrow', temp: 20, condition: 'Sunny', icon: 'sun' },
      { day: 'Wednesday', temp: 16, condition: 'Rainy', icon: 'rain' },
      { day: 'Thursday', temp: 19, condition: 'Cloudy', icon: 'cloud' },
    ]
  });

  useEffect(() => {
    const savedLocation = storage.getWeatherLocation();
    setCurrentLocation(savedLocation);
  }, []);

  const updateLocation = () => {
    if (location.trim()) {
      setWeatherLocation(location);
      setLocation('');
    }
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'cloud': return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'snow': return <CloudSnow className="w-8 h-8 text-blue-300" />;
      default: return <Wind className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <Card className="p-6 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Weather</h2>
          <p className="text-sm text-muted-foreground">{currentLocation}</p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          {getWeatherIcon(weather.current.icon)}
          <div>
            <p className="text-4xl font-bold">{weather.current.temp}°C</p>
            <p className="text-muted-foreground">{weather.current.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs font-medium mb-2">{day.day}</p>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.icon)}
              </div>
              <p className="text-lg font-semibold">{day.temp}°C</p>
              <p className="text-xs text-muted-foreground">{day.condition}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && updateLocation()}
          />
          <Button onClick={updateLocation}>Update</Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Note: Using mock data. Connect OpenWeather API for live data.
        </p>
      </div>
    </Card>
  );
}