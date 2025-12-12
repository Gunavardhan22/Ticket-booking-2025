import React from 'react';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Ticket, Calendar, MapPin, User, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

const BookingManagement: React.FC = () => {
  const { bookings, loading } = useBookings();

  if (loading) return <Loader text="Loading bookings..." />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-seat-available/20 text-seat-available border-seat-available/30';
      case 'CANCELLED': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'COMPLETED': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-seat-available/20 text-seat-available';
      case 'PENDING': return 'bg-seat-selected/20 text-seat-selected';
      case 'FAILED': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          All Bookings ({bookings.length})
        </h2>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-12 h-12 text-muted-foreground" />}
          title="No bookings yet"
          description="Bookings will appear here once customers start booking tickets."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {booking.showtime?.movie?.title || 'Unknown Movie'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ticket: <code className="bg-muted px-2 py-0.5 rounded">{booking.ticket_code}</code>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(booking.booking_status)}>
                      {booking.booking_status}
                    </Badge>
                    <Badge className={getPaymentColor(booking.payment_status)}>
                      {booking.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {booking.showtime?.theatre?.name}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {booking.showtime?.show_date && format(new Date(booking.showtime.show_date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ticket className="w-4 h-4" />
                    Seats: {booking.seats.join(', ')}
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    ₹{booking.total_amount}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy • h:mm a')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
