import React, { useEffect } from 'react';
import { useShows } from '@/contexts/ShowContext';
import { ShowCard } from '@/components/ShowCard';
import { Loader } from '@/components/Loader';
import { EmptyState } from '@/components/EmptyState';
import { Ticket, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ShowList: React.FC = () => {
  const { shows, loading, error, fetchShows } = useShows();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  // Filter to show only upcoming shows
  const upcomingShows = shows.filter(show => new Date(show.startTime) >= new Date());
  const pastShows = shows.filter(show => new Date(show.startTime) < new Date());

  if (loading && shows.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Loader size="lg" text="Loading shows..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<Ticket className="w-12 h-12 text-destructive" />}
            title="Failed to load shows"
            description={error}
            action={
              <Button onClick={fetchShows} variant="outline">
                Try Again
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your <span className="text-gradient">Perfect Seat</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse upcoming shows and reserve your seats with our seamless booking experience.
          </p>
        </div>

        {shows.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12 text-muted-foreground" />}
            title="No shows available"
            description="There are no shows scheduled at the moment. Check back later or create one if you're an admin."
            action={
              isAdmin ? (
                <Button onClick={() => navigate('/admin')}>
                  Create a Show
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-12">
            {/* Upcoming shows */}
            {upcomingShows.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-primary" />
                  Upcoming Shows
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingShows.map((show, index) => (
                    <div
                      key={show.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ShowCard show={show} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past shows */}
            {pastShows.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-6 h-6" />
                  Past Shows
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
                  {pastShows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowList;
