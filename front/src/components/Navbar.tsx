import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Home } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold text-lg">LibraryAdmin</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
            <Link to="/worker">
              <Button variant="ghost" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Worker</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}