import { Show } from '@/types';

const SHOWS_KEY = 'seat-booking-shows';

// Helper to get shows from localStorage
const getStoredShows = (): Show[] => {
  const data = localStorage.getItem(SHOWS_KEY);
  if (data) {
    return JSON.parse(data).map((show: Show) => ({
      ...show,
      startTime: new Date(show.startTime),
      createdAt: new Date(show.createdAt),
    }));
  }
  return [];
};

// Helper to save shows to localStorage
const saveShows = (shows: Show[]): void => {
  localStorage.setItem(SHOWS_KEY, JSON.stringify(shows));
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const showApi = {
  async getAll(): Promise<Show[]> {
    await delay(300);
    return getStoredShows();
  },

  async getById(id: string): Promise<Show | null> {
    await delay(200);
    const shows = getStoredShows();
    return shows.find(s => s.id === id) || null;
  },

  async create(show: Omit<Show, 'id' | 'createdAt' | 'bookedSeats'>): Promise<Show> {
    await delay(400);
    const shows = getStoredShows();
    const newShow: Show = {
      ...show,
      id: crypto.randomUUID(),
      bookedSeats: [],
      createdAt: new Date(),
    };
    shows.push(newShow);
    saveShows(shows);
    return newShow;
  },

  async updateBookedSeats(showId: string, seats: number[]): Promise<Show> {
    await delay(300);
    const shows = getStoredShows();
    const showIndex = shows.findIndex(s => s.id === showId);
    
    if (showIndex === -1) {
      throw new Error('Show not found');
    }

    const show = shows[showIndex];
    const conflictingSeats = seats.filter(seat => show.bookedSeats.includes(seat));
    
    if (conflictingSeats.length > 0) {
      throw new Error(`Seats ${conflictingSeats.join(', ')} are already booked`);
    }

    shows[showIndex] = {
      ...show,
      bookedSeats: [...show.bookedSeats, ...seats],
    };
    
    saveShows(shows);
    return shows[showIndex];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const shows = getStoredShows();
    const filtered = shows.filter(s => s.id !== id);
    saveShows(filtered);
  },
};
