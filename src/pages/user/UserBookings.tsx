import React from 'react';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components/Loader';
import { Ticket, Calendar, MapPin, Clock, IndianRupee, Film, QrCode } from 'lucide-react';
import { format } from 'date-fns';

const UserBookings: React.FC = () => {
  const { bookings, loading, cancelBooking } = useBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-seat-available/20 text-seat-available border-seat-available/30';
      case 'CANCELLED':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'COMPLETED':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Loader size="lg" text="Loading your bookings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-primary" />
            My Bookings
          </h1>
          <p className="text-muted-foreground">View your ticket history and booking details</p>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            icon={<Ticket className="w-12 h-12 text-muted-foreground" />}
            title="No bookings yet"
            description="Start by browsing movies and booking your tickets!"
            action={
              <Button onClick={() => window.location.href = '/'}>
                Browse Movies
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left Section - Movie Info */}
                    <div className="flex gap-4">
                      {booking.showtime?.movie?.poster_url ? (
                        <img 
                          src={booking.showtime.movie.poster_url} 
                          alt={booking.showtime.movie.title}
                          className="w-20 h-28 object-cover rounded-lg hidden sm:block"
                        />
                      ) : (
                        <div className="w-20 h-28 bg-muted/50 rounded-lg hidden sm:flex items-center justify-center">
                          <Film className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <h3 className="font-semibold text-lg">
                            {booking.showtime?.movie?.title || 'Unknown Movie'}
                          </h3>
                          <Badge className={getStatusColor(booking.booking_status)}>
                            {booking.booking_status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.showtime?.theatre?.name}, {booking.showtime?.theatre?.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.showtime?.show_date && format(new Date(booking.showtime.show_date), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.showtime?.show_time?.slice(0, 5)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-primary" />
                          <span className="font-medium">Seats: {booking.seats.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Ticket & Price */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="flex items-center gap-2 mb-1">
                          <QrCode className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Ticket Code</span>
                        </div>
                        <code className="text-lg font-mono font-bold text-primary">
                          {booking.ticket_code}
                        </code>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xl font-bold">
                          <IndianRupee className="w-5 h-5" />
                          {booking.total_amount}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {booking.seats.length} ticket{booking.seats.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      {booking.booking_status === 'CONFIRMED' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                    Booked on {format(new Date(booking.created_at), 'MMMM dd, yyyy • h:mm a')}
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

export default UserBookings;
