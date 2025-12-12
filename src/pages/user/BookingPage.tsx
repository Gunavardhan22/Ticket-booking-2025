import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShows } from '@/contexts/ShowContext';
import { useBooking } from '@/contexts/BookingContext';
import { SeatGrid } from '@/components/SeatGrid/SeatGrid';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Users, CheckCircle, XCircle, Loader2, Ticket } from 'lucide-react';
import { toast } from 'sonner';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getShow, refreshShow, loading } = useShows();
  const {
    selectedSeats,
    bookingStatus,
    error,
    confirmBooking,
    resetBooking,
    clearSelection,
  } = useBooking();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const show = id ? getShow(id) : undefined;

  useEffect(() => {
    if (id && !show) {
      setIsRefreshing(true);
      refreshShow(id).finally(() => setIsRefreshing(false));
    }
    
    // Reset booking state when entering page
    return () => {
      resetBooking();
    };
  }, [id]);

  const handleConfirmBooking = async () => {
    if (!id || selectedSeats.length === 0) return;

    try {
      await confirmBooking(id);
      toast.success('Booking confirmed successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Booking failed');
    }
  };

  if (loading || isRefreshing) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Loader size="lg" text="Loading show details..." />
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<Ticket className="w-12 h-12 text-muted-foreground" />}
            title="Show not found"
            description="The show you're looking for doesn't exist or has been removed."
            action={
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shows
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const availableSeats = show.totalSeats - show.bookedSeats.length;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shows
          </Button>

          <div className="glass-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {show.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{format(new Date(show.startTime), 'PPP')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{format(new Date(show.startTime), 'p')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{availableSeats} seats available</span>
                  </div>
                </div>
              </div>

              {/* Booking summary */}
              <div className="flex items-center gap-4">
                {selectedSeats.length > 0 && bookingStatus === 'idle' && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Selected</p>
                    <p className="text-lg font-semibold text-primary">
                      {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking status messages */}
        {bookingStatus === 'confirmed' && (
          <div className="mb-8 p-6 glass-card border-seat-available/50 bg-seat-available/10">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-seat-available" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Booking Confirmed!</h3>
                <p className="text-muted-foreground">
                  Your seats have been successfully reserved.
                </p>
              </div>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => {
                  resetBooking();
                  navigate('/');
                }}
              >
                Book Another Show
              </Button>
            </div>
          </div>
        )}

        {bookingStatus === 'failed' && error && (
          <div className="mb-8 p-6 glass-card border-destructive/50 bg-destructive/10">
            <div className="flex items-center gap-4">
              <XCircle className="w-8 h-8 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Booking Failed</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={resetBooking}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Seat grid */}
        {bookingStatus !== 'confirmed' && (
          <div className="glass-card p-8 mb-8">
            <SeatGrid totalSeats={show.totalSeats} bookedSeats={show.bookedSeats} />
          </div>
        )}

        {/* Action buttons */}
        {bookingStatus === 'idle' && selectedSeats.length > 0 && (
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={clearSelection}>
              Clear Selection
            </Button>
            <Button onClick={handleConfirmBooking} className="min-w-32">
              Confirm Booking
            </Button>
          </div>
        )}

        {bookingStatus === 'pending' && (
          <div className="flex justify-center">
            <Button disabled className="min-w-32">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
