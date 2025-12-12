import { SeatStatus } from '@/types';

export const getSeatStatus = (
  seatNumber: number,
  bookedSeats: number[],
  selectedSeats: number[]
): SeatStatus => {
  if (bookedSeats.includes(seatNumber)) {
    return 'booked';
  }
  if (selectedSeats.includes(seatNumber)) {
    return 'selected';
  }
  return 'available';
};

export const getSeatLabel = (seatNumber: number, seatsPerRow: number): string => {
  const row = Math.floor((seatNumber - 1) / seatsPerRow);
  const seatInRow = ((seatNumber - 1) % seatsPerRow) + 1;
  const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
  return `${rowLetter}${seatInRow}`;
};

export const calculateGridDimensions = (totalSeats: number): { rows: number; cols: number } => {
  // Aim for roughly 10-12 seats per row for visual appeal
  const seatsPerRow = Math.min(12, Math.ceil(Math.sqrt(totalSeats * 1.5)));
  const rows = Math.ceil(totalSeats / seatsPerRow);
  return { rows, cols: seatsPerRow };
};

export const getSeatClassName = (status: SeatStatus): string => {
  const baseClass = 'seat';
  switch (status) {
    case 'available':
      return `${baseClass} seat-available`;
    case 'selected':
      return `${baseClass} seat-selected`;
    case 'booked':
      return `${baseClass} seat-booked`;
    default:
      return baseClass;
  }
};
