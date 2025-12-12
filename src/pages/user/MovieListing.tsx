import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShowtimes } from '@/hooks/useShowtimes';
import { useMovies } from '@/hooks/useMovies';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Film, Clock, Calendar, MapPin, Star, Ticket } from 'lucide-react';
import { format, isAfter, startOfDay } from 'date-fns';
import { Movie, Showtime } from '@/types/database';

const MovieListing: React.FC = () => {
  const { showtimes, loading: showtimesLoading, fetchShowtimes } = useShowtimes();
  const { movies, loading: moviesLoading } = useMovies();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  const loading = showtimesLoading || moviesLoading;

  // Group showtimes by movie
  const today = startOfDay(new Date());
  const upcomingShowtimes = showtimes.filter(s => 
    s.is_active && isAfter(new Date(s.show_date), today) || format(new Date(s.show_date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const movieShowtimes = upcomingShowtimes.reduce((acc, showtime) => {
    const movieId = showtime.movie_id;
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: showtime.movie!,
        showtimes: [],
      };
    }
    acc[movieId].showtimes.push(showtime);
    return acc;
  }, {} as Record<string, { movie: Movie; showtimes: Showtime[] }>);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Loader size="lg" text="Loading movies..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero */}
        <div className="text-center py-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Now <span className="text-gradient">Showing</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse movies and book your tickets for an unforgettable experience.
          </p>
        </div>

        {Object.keys(movieShowtimes).length === 0 ? (
          <EmptyState
            icon={<Film className="w-12 h-12 text-muted-foreground" />}
            title="No shows available"
            description="There are no movies showing at the moment. Check back later!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(movieShowtimes).map(({ movie, showtimes }) => (
              <Card 
                key={movie.id} 
                className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden group"
              >
                {movie.poster_url ? (
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={movie.poster_url} 
                      alt={movie.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                ) : (
                  <div className="h-56 bg-muted/50 flex items-center justify-center">
                    <Film className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                )}
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-xl font-semibold truncate">{movie.title}</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{movie.genre}</Badge>
                    <Badge variant="outline">{movie.rating}</Badge>
                    <Badge variant="outline">{movie.language}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {movie.duration_minutes} min
                    </span>
                  </div>

                  {movie.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {movie.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">
                      {showtimes.length} show{showtimes.length > 1 ? 's' : ''} available
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Book Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListing;
