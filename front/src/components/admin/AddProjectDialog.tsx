import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { createProject } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: () => void;
}

export default function AddProjectDialog({
  open,
  onOpenChange,
  onProjectAdded,
}: AddProjectDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    nom: "",
    annee: new Date().getFullYear(),
    image: null as File | null,
    animateurs: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const data = {
        ...formData,
        image: formData.image || null,
      };

      await createProject(data, accessToken);
      toast.success("Project added successfully!");
      onProjectAdded();
      onOpenChange(false);
      setFormData({
        nom: "",
        annee: new Date().getFullYear(),
        image: null,
        animateurs: [],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project"
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Année</Label>
            <Input
              id="year"
              type="number"
              value={formData.annee}
              onChange={(e) =>
                setFormData({ ...formData, annee: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Ajouter le projet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
