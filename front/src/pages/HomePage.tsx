import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Library, BookMarked, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg?react";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center space-y-12">
      <section className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full" />
          <h1 className="text-5xl font-bold tracking-tight relative">
            <Logo className="inline-block h-48 w-48 mb-2" />
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Une plateforme moderne et intuitive conçue pour simplifier les
          opérations de bibliothèque et améliorer l'expérience de lecture pour
          tous.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Commencer
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
            <CardTitle>Gestion Intelligente</CardTitle>
            <CardDescription>
              Gérez efficacement les ressources de votre bibliothèque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Suivi automatisé
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Mises à jour en temps réel
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Notifications intelligentes
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover-card glass">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookMarked className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Suivi des Livres</CardTitle>
            <CardDescription>
              Suivez vos livres et prêts en toute simplicité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Catalogage numérique
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Gestion des prêts
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Rappels de retour
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover-card glass">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>
              Gérez les utilisateurs avec précision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Accès basé sur les rôles
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Suivi des activités
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Analytique utilisateur
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
