import React, { useState } from 'react';
import { useShowtimes } from '@/hooks/useShowtimes';
import { useMovies } from '@/hooks/useMovies';
import { useTheatres } from '@/hooks/useTheatres';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Clock, MapPin, Trash2, IndianRupee } from 'lucide-react';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const ShowtimeManagement: React.FC = () => {
  const { showtimes, loading, createShowtime, deleteShowtime } = useShowtimes();
  const { movies } = useMovies();
  const { theatres } = useTheatres();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    movie_id: '',
    theatre_id: '',
    show_date: '',
    show_time: '',
    base_price: 100,
    premium_price: 150,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createShowtime(formData);
    setFormData({
      movie_id: '',
      theatre_id: '',
      show_date: '',
      show_time: '',
      base_price: 100,
      premium_price: 150,
      is_active: true,
    });
    setIsOpen(false);
  };

  if (loading) return <Loader text="Loading showtimes..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Showtime Management
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button disabled={movies.length === 0 || theatres.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Showtime
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Showtime</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Movie</Label>
                <Select value={formData.movie_id} onValueChange={(v) => setFormData({ ...formData, movie_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a movie" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.filter(m => m.is_active).map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Theatre</Label>
                <Select value={formData.theatre_id} onValueChange={(v) => setFormData({ ...formData, theatre_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a theatre" />
                  </SelectTrigger>
                  <SelectContent>
                    {theatres.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name} - {t.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Show Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.show_date}
                    onChange={(e) => setFormData({ ...formData, show_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Show Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.show_time}
                    onChange={(e) => setFormData({ ...formData, show_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base">Base Price (₹)</Label>
                  <Input
                    id="base"
                    type="number"
                    min={1}
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premium">Premium Price (₹)</Label>
                  <Input
                    id="premium"
                    type="number"
                    min={1}
                    value={formData.premium_price}
                    onChange={(e) => setFormData({ ...formData, premium_price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!formData.movie_id || !formData.theatre_id}>
                Schedule Showtime
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {movies.length === 0 || theatres.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-12 h-12 text-muted-foreground" />}
          title="Setup required"
          description="Add movies and theatres first to schedule showtimes."
        />
      ) : showtimes.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-12 h-12 text-muted-foreground" />}
          title="No showtimes scheduled"
          description="Schedule your first showtime to start selling tickets."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showtimes.map((showtime) => (
            <Card key={showtime.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="truncate">{showtime.movie?.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteShowtime(showtime.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {showtime.theatre?.name}, {showtime.theatre?.city}
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(showtime.show_date), 'MMM dd, yyyy')}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {showtime.show_time.slice(0, 5)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    Base: ₹{showtime.base_price}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    Premium: ₹{showtime.premium_price}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowtimeManagement;
