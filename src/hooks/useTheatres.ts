import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theatre, TheatreInsert } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useTheatres = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTheatres = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('theatres')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setTheatres(data as Theatre[]);
    }
    setLoading(false);
  }, [toast]);

  const createTheatre = async (theatre: TheatreInsert) => {
    const { data, error } = await supabase
      .from('theatres')
      .insert(theatre)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return null;
    }
    
    toast({ title: 'Success', description: 'Theatre created successfully!' });
    await fetchTheatres();
    return data as Theatre;
  };

  const updateTheatre = async (id: string, updates: Partial<TheatreInsert>) => {
    const { error } = await supabase
      .from('theatres')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    
    toast({ title: 'Success', description: 'Theatre updated successfully!' });
    await fetchTheatres();
    return true;
  };

  const deleteTheatre = async (id: string) => {
    const { error } = await supabase
      .from('theatres')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    }
    
    toast({ title: 'Success', description: 'Theatre deleted successfully!' });
    await fetchTheatres();
    return true;
  };

  useEffect(() => {
    fetchTheatres();
  }, [fetchTheatres]);

  return { theatres, loading, fetchTheatres, createTheatre, updateTheatre, deleteTheatre };
};
