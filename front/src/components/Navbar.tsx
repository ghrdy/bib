/// <reference types="vite-plugin-svgr/client" />
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import HouseIcon from "../assets/House.svg?react";
import BooksIcon from "../assets/Books.svg?react";
import UsersIcon from "../assets/UsersThree.svg?react";
import GearIcon from "../assets/Gear.svg?react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "referent":
        return "Animateur Référent";
      case "simple":
        return "Animateur";
      default:
        return role;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button
                variant="ghost"
                className={`flex items-center space-x-2 ${
                  isActive("/") ? "navbar-button-selected" : ""
                }`}
              >
                <HouseIcon className="h-4 w-4" />
                <span>Accueil</span>
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/children">
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 ${
                      isActive("/children") ? "navbar-button-selected" : ""
                    }`}
                  >
                    <UsersIcon className="h-4 w-4" />
                    <span>Enfants</span>
                  </Button>
                </Link>
                <Link to="/books">
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 ${
                      isActive("/books") ? "navbar-button-selected" : ""
                    }`}
                  >
                    <BooksIcon className="h-4 w-4" />
                    <span>Livres</span>
                  </Button>
                </Link>
                {user?.role === "admin" && (
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      className={`flex items-center space-x-2 ${
                        isActive("/settings") ? "navbar-button-selected" : ""
                      }`}
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
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium">{`${user.prenom} ${user.nom}`}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDisplay(user.role)}
                  </p>
                </div>
              )}
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Connexion</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
