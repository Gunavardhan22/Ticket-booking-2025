import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Showtime, ShowtimeInsert, Movie, Theatre } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useShowtimes = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchShowtimes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('showtimes')
      .select(`
        *,
        movie:movies(*),
        theatre:theatres(*)
      `)
      .order('show_date', { ascending: true })
      .order('show_time', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const mapped = (data || []).map((item: any) => ({
        ...item,
        movie: item.movie as Movie,
        theatre: item.theatre as Theatre,
      }));
      setShowtimes(mapped);
    }
    setLoading(false);
  }, [toast]);

  const createShowtime = async (showtime: ShowtimeInsert) => {
    const { data, error } = await supabase
      .from('showtimes')
      .insert(showtime)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
    
    toast({ title: 'Success', description: 'Showtime created successfully!' });
    await fetchShowtimes();
    return data as Showtime;
  };

  const updateShowtime = async (id: string, updates: Partial<ShowtimeInsert>) => {
    const { error } = await supabase
      .from('showtimes')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    
    toast({ title: 'Success', description: 'Showtime updated successfully!' });
    await fetchShowtimes();
    return true;
  };

  const deleteShowtime = async (id: string) => {
    const { error } = await supabase
      .from('showtimes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    
    toast({ title: 'Success', description: 'Showtime deleted successfully!' });
    await fetchShowtimes();
    return true;
  };

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  return { showtimes, loading, fetchShowtimes, createShowtime, updateShowtime, deleteShowtime };
};
