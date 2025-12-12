import React, { useCallback, useEffect, useRef } from 'react';
import { getSeatStatus, getSeatLabel, calculateGridDimensions, getSeatClassName } from '@/utils/seatUtils';
import { useBooking } from '@/contexts/BookingContext';

interface SeatGridProps {
  totalSeats: number;
  bookedSeats: number[];
}

export const SeatGrid: React.FC<SeatGridProps> = ({ totalSeats, bookedSeats }) => {
  const { selectedSeats, toggleSeat } = useBooking();
  const gridRef = useRef<HTMLDivElement>(null);
  const { rows, cols } = calculateGridDimensions(totalSeats);

  const handleSeatClick = useCallback(
    (seatNumber: number) => {
      if (bookedSeats.includes(seatNumber)) return;
      toggleSeat(seatNumber);
    },
    [bookedSeats, toggleSeat]
  );

  // DOM-based highlighting with event delegation
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const seatElement = target.closest('[data-seat]');
      if (seatElement) {
        const seatNumber = parseInt(seatElement.getAttribute('data-seat') || '0', 10);
        if (seatNumber > 0) {
          handleSeatClick(seatNumber);
        }
      }
    };

    grid.addEventListener('click', handleClick);
    return () => grid.removeEventListener('click', handleClick);
  }, [handleSeatClick]);

  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Screen indicator */}
      <div className="relative w-full max-w-2xl">
        <div className="w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        <div className="absolute inset-0 blur-lg bg-primary/30" />
        <p className="text-center text-xs text-muted-foreground mt-3 uppercase tracking-widest">
          Screen
        </p>
      </div>

      {/* Seat grid */}
      <div
        ref={gridRef}
        className="grid gap-2 p-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {seats.map((seatNumber) => {
          const status = getSeatStatus(seatNumber, bookedSeats, selectedSeats);
          const label = getSeatLabel(seatNumber, cols);
          const className = getSeatClassName(status);

          return (
            <button
              key={seatNumber}
              data-seat={seatNumber}
              className={className}
              disabled={status === 'booked'}
              title={`Seat ${label}${status === 'booked' ? ' (Booked)' : ''}`}
              aria-label={`Seat ${label}, ${status}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded seat-available" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded seat-selected" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded seat-booked" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>
    </div>
  );
};
