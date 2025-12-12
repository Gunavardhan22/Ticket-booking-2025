import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShowtimes } from '@/hooks/useShowtimes';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/Loader';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Film, Ticket, 
  IndianRupee, CreditCard, CheckCircle 
} from 'lucide-react';
import { format } from 'date-fns';

const SeatBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { showtimes, loading: showtimesLoading } = useShowtimes();
  const { getBookedSeats, createBooking } = useBookings();
  
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [loadingSeats, setLoadingSeats] = useState(true);

  const showtime = showtimes.find(s => s.id === id);
  const theatre = showtime?.theatre;
  const movie = showtime?.movie;

  useEffect(() => {
    if (id) {
      setLoadingSeats(true);
      getBookedSeats(id).then(seats => {
        setBookedSeats(seats);
        setLoadingSeats(false);
      });
    }
  }, [id, getBookedSeats]);

  const seatGrid = useMemo(() => {
    if (!theatre) return [];
    const rows = theatre.total_rows;
    const seatsPerRow = theatre.seats_per_row;
    const grid: string[][] = [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats: string[] = [];
      const rowLabel = String.fromCharCode(65 + row);
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        rowSeats.push(`${rowLabel}${seat}`);
      }
      grid.push(rowSeats);
    }
    return grid;
  }, [theatre]);

  const isPremiumRow = (rowIndex: number) => {
    if (!theatre) return false;
    return rowIndex >= theatre.total_rows - 3; // Last 3 rows are premium
  };

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    if (!showtime || !theatre) return 0;
    
    return selectedSeats.reduce((total, seatId) => {
      const rowLetter = seatId.charAt(0);
      const rowIndex = rowLetter.charCodeAt(0) - 65;
      const price = isPremiumRow(rowIndex) ? showtime.premium_price : showtime.base_price;
      return total + price;
    }, 0);
  };

  const handleBooking = async () => {
    if (!user || !showtime || selectedSeats.length === 0) return;

    setIsBooking(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const booking = await createBooking({
      user_id: user.id,
      showtime_id: showtime.id,
      seats: selectedSeats,
      total_amount: calculateTotal(),
      payment_status: 'PAID',
      booking_status: 'CONFIRMED',
    });

    setIsBooking(false);

    if (booking) {
      setTicketCode(booking.ticket_code);
      setBookingComplete(true);
    }
  };

  if (showtimesLoading || loadingSeats) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Loader size="lg" text="Loading seat layout..." />
        </div>
      </div>
    );
  }

  if (!showtime || !theatre || !movie) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Show not found</h1>
          <Button className="mt-4" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-background">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="bg-card/50 border-border/50 text-center">
            <CardContent className="py-12 space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-seat-available/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-seat-available" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-muted-foreground">Your tickets have been booked successfully.</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">Your Ticket Code</p>
                <code className="text-2xl font-mono font-bold text-primary">{ticketCode}</code>
              </div>

              <div className="text-left space-y-2 p-4 bg-muted/20 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Movie:</span>
                  <span className="font-medium">{movie.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theatre:</span>
                  <span className="font-medium">{theatre.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {format(new Date(showtime.show_date), 'MMM dd')} at {showtime.show_time.slice(0, 5)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats:</span>
                  <span className="font-medium">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-2 mt-2">
                  <span className="text-muted-foreground">Total Paid:</span>
                  <span className="font-bold text-primary">₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/my-bookings')}>
                  View Bookings
                </Button>
                <Button className="flex-1" onClick={() => navigate('/')}>
                  Book More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-primary" />
                  Select Your Seats
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Screen indicator */}
                <div className="mb-8 text-center">
                  <div className="mx-auto w-3/4 h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Screen</span>
                </div>

                {/* Seat Grid */}
                <div className="space-y-2 overflow-x-auto">
                  {seatGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-center gap-1">
                      <span className="w-6 text-sm font-medium text-muted-foreground">
                        {String.fromCharCode(65 + rowIndex)}
                      </span>
                      <div className="flex gap-1">
                        {row.map((seatId, seatIndex) => {
                          const isBooked = bookedSeats.includes(seatId);
                          const isSelected = selectedSeats.includes(seatId);
                          const isPremium = isPremiumRow(rowIndex);
                          
                          return (
                            <button
                              key={seatId}
                              onClick={() => toggleSeat(seatId)}
                              disabled={isBooked}
                              className={`
                                w-7 h-7 rounded-t-lg text-xs font-medium transition-all
                                ${isBooked 
                                  ? 'bg-seat-booked text-foreground/50 cursor-not-allowed' 
                                  : isSelected 
                                    ? 'bg-seat-selected text-white scale-105' 
                                    : isPremium
                                      ? 'bg-primary/30 hover:bg-primary/50 text-foreground'
                                      : 'bg-seat-available/50 hover:bg-seat-available text-foreground'
                                }
                              `}
                              title={`${seatId} - ${isPremium ? `Premium ₹${showtime.premium_price}` : `Standard ₹${showtime.base_price}`}`}
                            >
                              {seatIndex + 1}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-6 text-sm font-medium text-muted-foreground">
                        {String.fromCharCode(65 + rowIndex)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-8 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-t-lg bg-seat-available/50" />
                    <span className="text-xs text-muted-foreground">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-t-lg bg-primary/30" />
                    <span className="text-xs text-muted-foreground">Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-t-lg bg-seat-selected" />
                    <span className="text-xs text-muted-foreground">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-t-lg bg-seat-booked" />
                    <span className="text-xs text-muted-foreground">Booked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {theatre.name}, {theatre.city}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(showtime.show_date), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {showtime.show_time.slice(0, 5)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-medium">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Tickets</span>
                    <span className="font-medium">{selectedSeats.length}</span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {calculateTotal()}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={selectedSeats.length === 0 || isBooking}
                  onClick={handleBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ₹{calculateTotal()}
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Mock payment - no real charges will be made
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
