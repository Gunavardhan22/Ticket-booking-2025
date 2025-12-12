import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShowtimes } from '@/hooks/useShowtimes';
import { useMovies } from '@/hooks/useMovies';
import { useTheatres } from '@/hooks/useTheatres';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/Loader';
import { Film, Clock, Calendar, MapPin, ArrowLeft, Ticket } from 'lucide-react';
import { format, isAfter, startOfDay, addDays } from 'date-fns';
import { Showtime, Theatre } from '@/types/database';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies, loading: moviesLoading } = useMovies();
  const { showtimes, loading: showtimesLoading } = useShowtimes();
  const { theatres } = useTheatres();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const movie = movies.find(m => m.id === id);
  const loading = moviesLoading || showtimesLoading;

  // Get upcoming dates for this movie
  const today = startOfDay(new Date());
  const movieShowtimes = showtimes.filter(s => 
    s.movie_id === id && 
    s.is_active && 
    (isAfter(new Date(s.show_date), today) || format(new Date(s.show_date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
  );

  const availableDates = [...new Set(movieShowtimes.map(s => s.show_date))].sort();
  
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const filteredShowtimes = movieShowtimes.filter(s => s.show_date === selectedDate);

  // Group by theatre
  const showtimesByTheatre = filteredShowtimes.reduce((acc, showtime) => {
    const theatreId = showtime.theatre_id;
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: showtime.theatre!,
        showtimes: [],
      };
    }
    acc[theatreId].showtimes.push(showtime);
    return acc;
  }, {} as Record<string, { theatre: Theatre; showtimes: Showtime[] }>);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Loader size="lg" text="Loading movie details..." />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <Button className="mt-4" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movies
        </Button>

        {/* Movie Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {movie.poster_url ? (
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="w-full md:w-64 h-80 object-cover rounded-lg shadow-lg" 
            />
          ) : (
            <div className="w-full md:w-64 h-80 bg-muted/50 rounded-lg flex items-center justify-center">
              <Film className="w-16 h-16 text-muted-foreground/50" />
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">{movie.genre}</Badge>
              <Badge variant="outline" className="text-sm">{movie.rating}</Badge>
              <Badge variant="outline" className="text-sm">{movie.language}</Badge>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.duration_minutes} minutes
              </span>
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(movie.release_date), 'MMM dd, yyyy')}
                </span>
              )}
            </div>

            {movie.description && (
              <p className="text-muted-foreground">{movie.description}</p>
            )}
          </div>
        </div>

        {/* Date Selector */}
        {availableDates.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Select Date
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {availableDates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? 'default' : 'outline'}
                  onClick={() => setSelectedDate(date)}
                  className="flex-shrink-0"
                >
                  {format(new Date(date), 'EEE, MMM dd')}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Showtimes by Theatre */}
        {Object.keys(showtimesByTheatre).length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No shows available for this date.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.values(showtimesByTheatre).map(({ theatre, showtimes }) => (
              <Card key={theatre.id} className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {theatre.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {theatre.location}, {theatre.city}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {showtimes.sort((a, b) => a.show_time.localeCompare(b.show_time)).map((showtime) => (
                      <Button
                        key={showtime.id}
                        variant="outline"
                        className="flex-col h-auto py-2 px-4 hover:border-primary"
                        onClick={() => navigate(`/book/${showtime.id}`)}
                      >
                        <span className="font-semibold">{showtime.show_time.slice(0, 5)}</span>
                        <span className="text-xs text-muted-foreground">
                          ₹{showtime.base_price} - ₹{showtime.premium_price}
                        </span>
                      </Button>
                    ))}
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

export default MovieDetails;
