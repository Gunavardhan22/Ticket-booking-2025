import React from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { useShows } from '@/contexts/ShowContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const MyBookings: React.FC = () => {
  const { bookings } = useBooking();
  const { shows } = useShows();

  const getShow = (showId: string) => shows.find(s => s.id === showId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-seat-available/20 text-seat-available border-seat-available/30';
      case 'PENDING':
        return 'bg-seat-selected/20 text-seat-selected border-seat-selected/30';
      case 'FAILED':
        return 'bg-seat-booked/20 text-seat-booked border-seat-booked/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<Ticket className="w-12 h-12 text-muted-foreground" />}
            title="No bookings yet"
            description="Start by browsing shows and booking your seats!"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View your ticket history and booking status</p>
        </div>

        <div className="grid gap-4">
          {bookings.map((booking) => {
            const show = getShow(booking.showId);
            return (
              <Card key={booking.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {show?.name || 'Unknown Show'}
                    </CardTitle>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {show && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(show.startTime), 'MMM dd, yyyy • h:mm a')}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      Seats: {booking.seats.join(', ')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Ticket className="w-4 h-4" />
                      {booking.seats.length} ticket{booking.seats.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy • h:mm a')}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
