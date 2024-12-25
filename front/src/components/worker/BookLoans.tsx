import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookPlus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  BookLoan,
  getBookLoans,
  createBookLoan,
  deleteBookLoan,
} from "@/lib/api/bookLoans";
import { ChildProfile } from "@/lib/api/children";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChildLoansDialogProps {
  child: ChildProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChildLoansDialog({
  child,
  open,
  onOpenChange,
}: ChildLoansDialogProps) {
  const { accessToken } = useAuth();
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [newLoan, setNewLoan] = useState({
    bookTitle: "",
    returnDate: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<BookLoan | null>(null);

  const fetchLoans = async () => {
    try {
      if (!accessToken) return;
      const allLoans = await getBookLoans(accessToken);
      // Filter loans for this specific child
      const childLoans = allLoans.filter((loan) => loan.userId === child._id);
      setLoans(childLoans);
    } catch (error) {
      toast.error("Failed to fetch loans");
    }
  };

  useEffect(() => {
    if (open) {
      fetchLoans();
    }
  }, [open, accessToken, child._id]);

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!accessToken) return;

      await createBookLoan(
        {
          bookTitle: newLoan.bookTitle,
          userId: child._id,
          returnDate: newLoan.returnDate,
        },
        accessToken
      );

      toast.success("Loan added successfully");
      setNewLoan({ bookTitle: "", returnDate: "" });
      setShowAddLoan(false);
      fetchLoans();
    } catch (error) {
      toast.error("Failed to add loan");
    }
  };

  const handleDeleteLoan = (loan: BookLoan) => {
    setLoanToDelete(loan);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!loanToDelete || !accessToken) return;

      await deleteBookLoan(loanToDelete._id, accessToken);
      toast.success("Loan deleted successfully");
      fetchLoans();
    } catch (error) {
      toast.error("Failed to delete loan");
    } finally {
      setShowDeleteDialog(false);
      setLoanToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Emprunts de {child.prenom} {child.nom}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!showAddLoan ? (
              <Button onClick={() => setShowAddLoan(true)}>
                <BookPlus className="mr-2 h-4 w-4" />
                Nouvel emprunt
              </Button>
            ) : (
              <form onSubmit={handleAddLoan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookTitle">Titre du livre</Label>
                    <Input
                      id="bookTitle"
                      value={newLoan.bookTitle}
                      onChange={(e) =>
                        setNewLoan({ ...newLoan, bookTitle: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Date de retour</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={newLoan.returnDate}
                      onChange={(e) =>
                        setNewLoan({ ...newLoan, returnDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddLoan(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre du livre</TableHead>
                  <TableHead>Date d'emprunt</TableHead>
                  <TableHead>Date de retour</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell>{loan.bookTitle}</TableCell>
                    <TableCell>
                      {new Date(loan.loanDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(loan.returnDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLoan(loan)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'enregistrement de l'emprunt sera
              définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
