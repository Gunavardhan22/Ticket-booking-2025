import React from 'react';
import { Show } from '@/types';
import { Calendar, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ShowCardProps {
  show: Show;
  variant?: 'user' | 'admin';
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, variant = 'user' }) => {
  const navigate = useNavigate();
  const availableSeats = show.totalSeats - show.bookedSeats.length;
  const isSoldOut = availableSeats === 0;
  const isPast = new Date(show.startTime) < new Date();

  return (
    <div className="glass-card p-6 flex flex-col gap-4 group hover:border-primary/30 transition-all duration-300">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {show.name}
        </h3>
        {isSoldOut && (
          <span className="px-2 py-1 text-xs font-medium bg-destructive/20 text-destructive rounded-md">
            Sold Out
          </span>
        )}
        {isPast && !isSoldOut && (
          <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md">
            Past Event
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
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
          <span>
            {availableSeats} / {show.totalSeats} seats available
          </span>
        </div>
      </div>

      {/* Progress bar for seat availability */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-seat-available transition-all duration-500"
          style={{ width: `${(availableSeats / show.totalSeats) * 100}%` }}
        />
      </div>

      {variant === 'user' && !isPast && (
        <Button
          onClick={() => navigate(`/booking/${show.id}`)}
          disabled={isSoldOut}
          className="mt-2 w-full"
        >
          {isSoldOut ? 'Sold Out' : 'Book Now'}
        </Button>
      )}
    </div>
  );
};
