import React, { useState } from 'react';
import { useMovies } from '@/hooks/useMovies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Film, Plus, Clock, Star, Trash2, Globe } from 'lucide-react';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation', 'Documentary'];
const RATINGS = ['U', 'U/A', 'A', 'S'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'];

const MovieManagement: React.FC = () => {
  const { movies, loading, createMovie, deleteMovie, updateMovie } = useMovies();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Action',
    duration_minutes: 120,
    poster_url: '',
    rating: 'U',
    language: 'English',
    release_date: '',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMovie({
      ...formData,
      release_date: formData.release_date || null,
      poster_url: formData.poster_url || null,
      description: formData.description || null,
    });
    setFormData({
      title: '',
      description: '',
      genre: 'Action',
      duration_minutes: 120,
      poster_url: '',
      rating: 'U',
      language: 'English',
      release_date: '',
      is_active: true,
    });
    setIsOpen(false);
  };

  if (loading) return <Loader text="Loading movies..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Film className="w-6 h-6 text-primary" />
          Movie Management
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Movie Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Avengers: Endgame"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief synopsis..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={formData.genre} onValueChange={(v) => setFormData({ ...formData, genre: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={30}
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select value={formData.rating} onValueChange={(v) => setFormData({ ...formData, rating: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RATINGS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(v) => setFormData({ ...formData, language: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poster">Poster URL</Label>
                <Input
                  id="poster"
                  value={formData.poster_url}
                  onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  placeholder="https://example.com/poster.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="release">Release Date</Label>
                <Input
                  id="release"
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Add Movie</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {movies.length === 0 ? (
        <EmptyState
          icon={<Film className="w-12 h-12 text-muted-foreground" />}
          title="No movies yet"
          description="Add movies to start creating showtimes."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <Card key={movie.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors overflow-hidden">
              {movie.poster_url && (
                <div className="h-40 overflow-hidden">
                  <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="truncate">{movie.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMovie(movie.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{movie.genre}</Badge>
                  <Badge variant="outline">{movie.rating}</Badge>
                  <Badge variant="outline">{movie.language}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {movie.duration_minutes} min
                  </span>
                  <Badge variant={movie.is_active ? 'default' : 'secondary'} className="text-xs">
                    {movie.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {movie.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieManagement;
