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
import { Project, UpdateProjectData, updateProject } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: () => void;
}

export default function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    nom: project.nom,
    annee: project.annee,
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updateData: UpdateProjectData = {
        nom: formData.nom,
        annee: formData.annee,
        image: formData.image,
      };

      if (!accessToken) {
        throw new Error("No access token available");
      }

      await updateProject(project._id, updateData, accessToken);
      toast.success("Project updated successfully!");
      onProjectUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update project"
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
          <DialogTitle>Editer le projet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Projet</Label>
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
            <Label htmlFor="image">URL de l'image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Mettre à jour le projet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
