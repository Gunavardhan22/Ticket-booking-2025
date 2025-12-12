import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Movie, MovieInsert } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setMovies(data as Movie[]);
    }
    setLoading(false);
  }, [toast]);

  const createMovie = async (movie: MovieInsert) => {
    const { data, error } = await supabase
      .from('movies')
      .insert(movie)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
    
    toast({ title: 'Success', description: 'Movie created successfully!' });
    await fetchMovies();
    return data as Movie;
  };

  const updateMovie = async (id: string, updates: Partial<MovieInsert>) => {
    const { error } = await supabase
      .from('movies')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    
    toast({ title: 'Success', description: 'Movie updated successfully!' });
    await fetchMovies();
    return true;
  };

  const deleteMovie = async (id: string) => {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    
    toast({ title: 'Success', description: 'Movie deleted successfully!' });
    await fetchMovies();
    return true;
  };

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, fetchMovies, createMovie, updateMovie, deleteMovie };
};
