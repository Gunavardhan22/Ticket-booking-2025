export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateShowForm = (data: {
  name: string;
  startTime: string;
  totalSeats: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Show name is required';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Show name must be at least 3 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Show name must be less than 100 characters';
  }

  // Start time validation
  if (!data.startTime) {
    errors.startTime = 'Start time is required';
  } else {
    const startDate = new Date(data.startTime);
    if (isNaN(startDate.getTime())) {
      errors.startTime = 'Invalid date format';
    } else if (startDate <= new Date()) {
      errors.startTime = 'Start time must be in the future';
    }
  }

  // Total seats validation
  const seats = parseInt(data.totalSeats, 10);
  if (!data.totalSeats || isNaN(seats)) {
    errors.totalSeats = 'Total seats is required';
  } else if (seats < 1) {
    errors.totalSeats = 'Must have at least 1 seat';
  } else if (seats > 500) {
    errors.totalSeats = 'Maximum 500 seats allowed';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSeatSelection = (
  selectedSeats: number[],
  bookedSeats: number[],
  totalSeats: number
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (selectedSeats.length === 0) {
    errors.seats = 'Please select at least one seat';
  }

  const invalidSeats = selectedSeats.filter(
    seat => seat < 1 || seat > totalSeats
  );
  if (invalidSeats.length > 0) {
    errors.seats = `Invalid seat numbers: ${invalidSeats.join(', ')}`;
  }

  const conflicting = selectedSeats.filter(seat => bookedSeats.includes(seat));
  if (conflicting.length > 0) {
    errors.conflict = `Seats ${conflicting.join(', ')} are already booked`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
