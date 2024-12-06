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
import {
  BookLoan,
  UpdateBookLoanData,
  updateBookLoan,
} from "@/lib/api/bookLoans";
import { getChildProfiles, ChildProfile } from "@/lib/api/children";
import { useAuth } from "@/lib/auth";

interface EditLoanDialogProps {
  loan: BookLoan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoanUpdated: () => void;
}

export default function EditLoanDialog({
  loan,
  open,
  onOpenChange,
  onLoanUpdated,
}: EditLoanDialogProps) {
  const { accessToken } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [formData, setFormData] = useState({
    bookTitle: loan.bookTitle,
    userId: loan.userId,
    returnDate: loan.returnDate.split("T")[0],
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
      const updateData: UpdateBookLoanData = {
        bookTitle: formData.bookTitle,
        userId: formData.userId,
        returnDate: formData.returnDate,
      };

      if (!accessToken) {
        throw new Error("No access token available");
      }

      await updateBookLoan(loan._id, updateData, accessToken);
      toast.success("L'emprunt a été modifié");
      onLoanUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update book loan"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'emprunt</DialogTitle>
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
                <SelectValue placeholder="Select a child" />
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
            <Label htmlFor="bookTitle">Titre du livre</Label>
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
            Modifier l'emprunt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
