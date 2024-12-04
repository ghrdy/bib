import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ArrowRight, Library, BookMarked, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center space-y-12 py-12">
      <section className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full" />
          <h1 className="text-5xl font-bold tracking-tight relative">
            Library Management System
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A modern, intuitive platform designed to streamline library operations and enhance the reading experience for everyone.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        <Card className="hover-card glass">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Library className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Smart Management</CardTitle>
            <CardDescription>
              Efficiently manage your library's resources with our intelligent system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Automated tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Real-time updates
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Smart notifications
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover-card glass">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookMarked className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Book Tracking</CardTitle>
            <CardDescription>
              Keep track of your books and loans with ease
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Digital cataloging
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Loan management
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Return reminders
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover-card glass">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users and permissions with precision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Role-based access
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Activity tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                User analytics
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 mt-12">
        <Link to="/admin" className="group">
          <Card className="hover-card h-full transition-all duration-300 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Users className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <span>Administrators</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Powerful tools for system management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Comprehensive user management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Project creation and tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Advanced system configuration</span>
                </li>
              </ul>
              <Button variant="ghost" className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground">
                Access Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/worker" className="group">
          <Card className="hover-card h-full transition-all duration-300 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <span>Workers</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Streamlined tools for daily operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Efficient child registration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Simple book loan management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Quick access to important features</span>
                </li>
              </ul>
              <Button variant="ghost" className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground">
                Access Worker Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}