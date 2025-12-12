import { Booking } from '@/types';
import { showApi } from './showApi';

const BOOKINGS_KEY = 'seat-booking-bookings';

const getStoredBookings = (): Booking[] => {
  const data = localStorage.getItem(BOOKINGS_KEY);
  if (data) {
    return JSON.parse(data).map((booking: Booking) => ({
      ...booking,
      createdAt: new Date(booking.createdAt),
    }));
  }
  return [];
};

const saveBookings = (bookings: Booking[]): void => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingApi = {
  async create(showId: string, seats: number[]): Promise<Booking> {
    await delay(500);
    
    // Create booking with PENDING status
    const booking: Booking = {
      id: crypto.randomUUID(),
      showId,
      seats,
      status: 'PENDING',
      createdAt: new Date(),
    };

    try {
      // Try to update the show with booked seats
      await showApi.updateBookedSeats(showId, seats);
      
      // If successful, update booking to CONFIRMED
      booking.status = 'CONFIRMED';
    } catch (error) {
      // If failed, mark as FAILED
      booking.status = 'FAILED';
      throw error;
    }

    // Store the booking
    const bookings = getStoredBookings();
    bookings.push(booking);
    saveBookings(bookings);

    return booking;
  },

  async getByShowId(showId: string): Promise<Booking[]> {
    await delay(200);
    const bookings = getStoredBookings();
    return bookings.filter(b => b.showId === showId);
  },

  async getAll(): Promise<Booking[]> {
    await delay(300);
    return getStoredBookings();
  },
};
