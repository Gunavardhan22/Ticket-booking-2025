import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Ticket, Shield, LogOut, User, History, Film } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              Seat<span className="text-primary">Book</span>
            </span>
          </Link>

          {/* Navigation */}
          {user && (
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Film className="w-4 h-4" />
                Shows
              </Link>
              
              {!isAdmin && (
                <Link
                  to="/my-bookings"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/my-bookings' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <History className="w-4 h-4" />
                  My Bookings
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                  {isAdmin ? (
                    <Shield className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-sm font-medium">
                    {profile?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
