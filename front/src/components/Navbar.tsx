import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { HouseIcon } from "../assets/House.svg";
import { BooksIcon } from "../assets/Books.svg";
import { UsersIcon } from "../assets/UsersThree.svg";
import { GearIcon } from "../assets/Gear.svg";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <HouseIcon className="h-6 w-6" />
            <span className="font-semibold text-lg">LibraryAdmin</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <HouseIcon className="h-4 w-4" />
                <span>Accueil</span>
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/children">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <UsersIcon className="h-4 w-4" />
                    <span>Enfants</span>
                  </Button>
                </Link>
                <Link to="/books">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <BooksIcon className="h-4 w-4" />
                    <span>Livres</span>
                  </Button>
                </Link>
                {user?.role === "admin" && (
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <GearIcon className="h-4 w-4" />
                      <span>Plus</span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ""}
              </span>
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
