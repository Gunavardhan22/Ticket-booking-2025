// Database types for the booking system

export interface Theatre {
  id: string;
  name: string;
  location: string;
  city: string;
  total_rows: number;
  seats_per_row: number;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  genre: string;
  duration_minutes: number;
  poster_url: string | null;
  rating: string;
  language: string;
  release_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  theatre_id: string;
  show_date: string;
  show_time: string;
  base_price: number;
  premium_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  movie?: Movie;
  theatre?: Theatre;
}

export interface Booking {
  id: string;
  user_id: string;
  showtime_id: string;
  seats: string[];
  total_amount: number;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  booking_status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  ticket_code: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  showtime?: Showtime;
}

export type TheatreInsert = Omit<Theatre, 'id' | 'created_at' | 'updated_at'>;
export type MovieInsert = Omit<Movie, 'id' | 'created_at' | 'updated_at'>;
export type ShowtimeInsert = Omit<Showtime, 'id' | 'created_at' | 'updated_at' | 'movie' | 'theatre'>;
export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'showtime'>;
