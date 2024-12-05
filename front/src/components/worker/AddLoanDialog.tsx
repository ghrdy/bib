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
import { useState, useEffect } from "react";
import { createBookLoan } from "@/lib/api/bookLoans";
import { getChildProfiles, ChildProfile } from "@/lib/api/children";
import { useAuth } from "@/lib/auth";

interface AddLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoanAdded: () => void;
}

export default function AddLoanDialog({
  open,
  onOpenChange,
  onLoanAdded,
}: AddLoanDialogProps) {
  const { accessToken } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [formData, setFormData] = useState({
    bookTitle: "",
    userId: "",
    returnDate: "",
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        if (!accessToken) return;
        const fetchedChildren = await getChildProfiles(accessToken);
        setChildren(fetchedChildren);
      } catch (error) {
        toast.error("Failed to fetch children profiles");
      }
    };

    if (open) {
      fetchChildren();
    }
  }, [open, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      await createBookLoan(formData, accessToken);
      toast.success("Book loan added successfully!");
      onLoanAdded();
      onOpenChange(false);
      setFormData({
        bookTitle: "",
        userId: "",
        returnDate: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create book loan"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvel emprunt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child">Enfant</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) =>
                setFormData({ ...formData, userId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un enfant" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child._id} value={child._id}>
                    {`${child.prenom} ${child.nom}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookTitle">Titre du Livre</Label>
            <Input
              id="bookTitle"
              value={formData.bookTitle}
              onChange={(e) =>
                setFormData({ ...formData, bookTitle: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="returnDate">Date de retour</Label>
            <Input
              id="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={(e) =>
                setFormData({ ...formData, returnDate: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Créer un emprunt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
