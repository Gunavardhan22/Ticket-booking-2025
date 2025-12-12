import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Building2, Film, Calendar, Ticket } from 'lucide-react';
import TheatreManagement from './TheatreManagement';
import MovieManagement from './MovieManagement';
import ShowtimeManagement from './ShowtimeManagement';
import BookingManagement from './BookingManagement';

const AdminDashboard: React.FC = () => {
  const { isAdmin, profile } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name || 'Admin'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="theatres" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="theatres" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Theatres</span>
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Movies</span>
            </TabsTrigger>
            <TabsTrigger value="showtimes" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Showtimes</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theatres" className="mt-6">
            <TheatreManagement />
          </TabsContent>

          <TabsContent value="movies" className="mt-6">
            <MovieManagement />
          </TabsContent>

          <TabsContent value="showtimes" className="mt-6">
            <ShowtimeManagement />
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <BookingManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
