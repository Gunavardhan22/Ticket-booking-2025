export interface Show {
  id: string;
  name: string;
  startTime: Date;
  totalSeats: number;
  bookedSeats: number[];
  createdAt: Date;
}

export interface Booking {
  id: string;
  showId: string;
  seats: number[];
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

export type SeatStatus = 'available' | 'selected' | 'booked';
