import React, { useState } from 'react';
import { useTheatres } from '@/hooks/useTheatres';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Plus, MapPin, Grid3X3, Trash2, Edit } from 'lucide-react';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';

const TheatreManagement: React.FC = () => {
  const { theatres, loading, createTheatre, deleteTheatre } = useTheatres();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    total_rows: 10,
    seats_per_row: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTheatre(formData);
    setFormData({ name: '', location: '', city: '', total_rows: 10, seats_per_row: 10 });
    setIsOpen(false);
  };

  if (loading) return <Loader text="Loading theatres..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Theatre Management
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Theatre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Theatre</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Theatre Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="PVR Cinemas"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Mall Road, Near Central Park"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Mumbai"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rows">Total Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    min={1}
                    value={formData.total_rows}
                    onChange={(e) => setFormData({ ...formData, total_rows: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats per Row</Label>
                  <Input
                    id="seats"
                    type="number"
                    min={1}
                    value={formData.seats_per_row}
                    onChange={(e) => setFormData({ ...formData, seats_per_row: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Theatre</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {theatres.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-12 h-12 text-muted-foreground" />}
          title="No theatres yet"
          description="Add your first theatre to start scheduling shows."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {theatres.map((theatre) => (
            <Card key={theatre.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {theatre.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTheatre(theatre.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {theatre.location}, {theatre.city}
                </div>
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  {theatre.total_rows} rows × {theatre.seats_per_row} seats = {theatre.total_rows * theatre.seats_per_row} total
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheatreManagement;
