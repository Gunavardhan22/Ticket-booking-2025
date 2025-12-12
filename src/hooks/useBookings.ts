import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking, BookingInsert, Showtime, Movie, Theatre } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    let query = supabase
      .from('bookings')
      .select(`
        *,
        showtime:showtimes(
          *,
          movie:movies(*),
          theatre:theatres(*)
        )
      `)
      .order('created_at', { ascending: false });

    // Non-admins only see their own bookings (enforced by RLS too)
    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      const mapped = (data || []).map((item: any) => ({
        ...item,
        showtime: item.showtime ? {
          ...item.showtime,
          movie: item.showtime.movie as Movie,
          theatre: item.showtime.theatre as Theatre,
        } : undefined,
      }));
      setBookings(mapped as Booking[]);
    }
    setLoading(false);
  }, [user, isAdmin]);

  const getBookedSeats = async (showtimeId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('seats')
      .eq('showtime_id', showtimeId)
      .eq('booking_status', 'CONFIRMED');

    if (error) {
      console.error('Error fetching booked seats:', error);
      return [];
    }

    return data.flatMap((b: any) => b.seats);
  };

  const createBooking = async (booking: Omit<BookingInsert, 'ticket_code'>) => {
    // Generate ticket code
    const ticketCode = 'TKT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...booking,
        ticket_code: ticketCode,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Booking Failed', description: error.message, variant: 'destructive' });
      return null;
    }
    
    toast({ title: 'Booking Confirmed!', description: `Your ticket code is ${ticketCode}` });
    await fetchBookings();
    return data as Booking;
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ booking_status: 'CANCELLED' })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    
    toast({ title: 'Booking Cancelled', description: 'Your booking has been cancelled.' });
    await fetchBookings();
    return true;
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  return { bookings, loading, fetchBookings, getBookedSeats, createBooking, cancelBooking };
};
