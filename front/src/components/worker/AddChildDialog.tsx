import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddChildDialog({ open, onOpenChange }: AddChildDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Child added successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Child</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input id="class" placeholder="Enter class" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input id="photo" type="file" accept="image/*" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes/Observations</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes or observations"
            />
          </div>
          <Button type="submit" className="w-full">Add Child</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}