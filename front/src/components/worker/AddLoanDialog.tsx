import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface AddLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddLoanDialog({ open, onOpenChange }: AddLoanDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Book loan added successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Book Loan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child">Child</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alice">Alice Smith</SelectItem>
                <SelectItem value="bob">Bob Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookTitle">Book Title</Label>
            <Input id="bookTitle" placeholder="Enter book title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookPhoto">Book Photo (Optional)</Label>
            <Input id="bookPhoto" type="file" accept="image/*" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="borrowDate">Borrow Date</Label>
              <Input id="borrowDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" required />
            </div>
          </div>
          <Button type="submit" className="w-full">Create Loan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}