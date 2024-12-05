import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { createChildProfile } from "@/lib/api/children";
import { useAuth } from "@/lib/auth";

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChildAdded: () => void;
}

export default function AddChildDialog({
  open,
  onOpenChange,
  onChildAdded,
}: AddChildDialogProps) {
  const { accessToken, user } = useAuth();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    classeSuivie: "",
    noteObservation: "",
    photo: null as File | null,
    parentId: user?.id || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const data = {
        ...formData,
        photo: formData.photo || undefined,
      };

      await createChildProfile(data, accessToken);
      toast.success("Child profile added successfully!");
      onChildAdded();
      onOpenChange(false);
      setFormData({
        nom: "",
        prenom: "",
        dateNaissance: "",
        classeSuivie: "",
        noteObservation: "",
        photo: null,
        parentId: user?.id || "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create child profile"
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un enfant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de naissance</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) =>
                  setFormData({ ...formData, dateNaissance: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Classe</Label>
              <Input
                id="class"
                value={formData.classeSuivie}
                onChange={(e) =>
                  setFormData({ ...formData, classeSuivie: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Observations</Label>
            <Textarea
              id="notes"
              value={formData.noteObservation}
              onChange={(e) =>
                setFormData({ ...formData, noteObservation: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Ajouter l'enfant
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
