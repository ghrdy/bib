import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { createUser } from "@/lib/api/users";
import { useAuth } from "@/lib/auth";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

export default function AddUserDialog({
  open,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    role: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      await createUser(formData, accessToken);
      toast.success("L'utilisateur est ajouté");
      onUserAdded();
      onOpenChange(false);
      setFormData({ prenom: "", nom: "", email: "", role: "" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Echec lors de l'ajout de l'utilisateur"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Adresse Mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2 mb-4">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="referent">Animateur référent</SelectItem>
                <SelectItem value="simple">Animateur Simple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Créer l'utilisateur
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
