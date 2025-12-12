import React, { useState } from 'react';
import { useShows } from '@/contexts/ShowContext';
import { validateShowForm } from '@/utils/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';

interface CreateShowFormProps {
  onSuccess?: () => void;
}

export const CreateShowForm: React.FC<CreateShowFormProps> = ({ onSuccess }) => {
  const { addShow } = useShows();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    totalSeats: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateShowForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await addShow({
        name: formData.name.trim(),
        startTime: new Date(formData.startTime),
        totalSeats: parseInt(formData.totalSeats, 10),
      });
      
      toast.success('Show created successfully!');
      setFormData({ name: '', startTime: '', totalSeats: '' });
      setErrors({});
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to create show');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum datetime for the input (current time)
  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Show Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter show name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          name="startTime"
          type="datetime-local"
          min={minDateTime}
          value={formData.startTime}
          onChange={handleChange}
          className={errors.startTime ? 'border-destructive' : ''}
        />
        {errors.startTime && (
          <p className="text-sm text-destructive">{errors.startTime}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalSeats">Total Seats</Label>
        <Input
          id="totalSeats"
          name="totalSeats"
          type="number"
          placeholder="Enter number of seats"
          min="1"
          max="500"
          value={formData.totalSeats}
          onChange={handleChange}
          className={errors.totalSeats ? 'border-destructive' : ''}
        />
        {errors.totalSeats && (
          <p className="text-sm text-destructive">{errors.totalSeats}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Create Show
          </>
        )}
      </Button>
    </form>
  );
};
