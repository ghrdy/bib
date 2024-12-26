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
import { Book, getBooks } from "@/lib/api/books";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [newLoan, setNewLoan] = useState({
    bookId: "",
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

  const fetchBooks = async () => {
    try {
      if (!accessToken) return;
      const fetchedBooks = await getBooks(accessToken);
      setBooks(fetchedBooks);
    } catch (error) {
      toast.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    if (open) {
      fetchLoans();
      fetchBooks();
    }
  }, [open, accessToken, child._id]);

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!accessToken) return;

      if (!newLoan.bookId) {
        toast.error("Please select a book");
        return;
      }

      await createBookLoan(
        {
          bookId: newLoan.bookId,
          userId: child._id,
          returnDate: newLoan.returnDate,
        },
        accessToken
      );

      toast.success("Loan added successfully");
      setNewLoan({ bookId: "", returnDate: "" });
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
                    <Label htmlFor="book">Livre</Label>
                    <Select
                      value={newLoan.bookId}
                      onValueChange={(value) =>
                        setNewLoan({ ...newLoan, bookId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un livre" />
                      </SelectTrigger>
                      <SelectContent>
                        {books.map((book) => (
                          <SelectItem key={book._id} value={book._id}>
                            {book.titre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Date de retour</Label>
                    <input
                      id="returnDate"
                      type="date"
                      value={newLoan.returnDate}
                      onChange={(e) =>
                        setNewLoan({ ...newLoan, returnDate: e.target.value })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
