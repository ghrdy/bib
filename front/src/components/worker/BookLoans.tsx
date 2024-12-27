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
import { BookPlus, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  BookLoan,
  getBookLoansByUserId,
  createBookLoan,
  deleteBookLoan,
  updateBookLoan,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [showEditLoan, setShowEditLoan] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<BookLoan | null>(null);
  const [newLoan, setNewLoan] = useState({
    bookId: "",
    returnDate: "",
  });
  const [editLoan, setEditLoan] = useState({
    bookId: "",
    returnDate: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<BookLoan | null>(null);

  const fetchLoans = async () => {
    try {
      if (!accessToken) return;
      const childLoans = await getBookLoansByUserId(child._id, accessToken);
      setLoans(childLoans);
    } catch (error) {
      toast.error("Echec lors de la récupération des emprunts");
    }
  };

  const fetchBooks = async () => {
    try {
      if (!accessToken) return;
      const fetchedBooks = await getBooks(accessToken);
      setBooks(fetchedBooks);
    } catch (error) {
      toast.error("Echec lors de la récupération des livres");
    }
  };

  useEffect(() => {
    if (open) {
      fetchLoans();
    }
  }, [open, accessToken, child._id]);

  const handleAddLoanClick = async () => {
    setShowAddLoan(true);
    await fetchBooks();
  };

  const handleEditLoanClick = async (loan: BookLoan) => {
    setSelectedLoan(loan);
    setEditLoan({
      bookId: loan.book._id,
      returnDate: new Date(loan.returnDate).toISOString().split("T")[0],
    });
    await fetchBooks();
    setShowEditLoan(true);
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!accessToken) return;

      if (!newLoan.bookId) {
        toast.error("Veuillez choisir un livre");
        return;
      }

      const selectedBook = books.find((book) => book._id === newLoan.bookId);
      if (!selectedBook) {
        toast.error("Livre non trouvé");
        return;
      }

      await createBookLoan(
        {
          book: selectedBook,
          childId: child._id,
          returnDate: newLoan.returnDate,
        },
        accessToken
      );

      toast.success("L'emprunt a été ajouté avec succès");
      setNewLoan({ bookId: "", returnDate: "" });
      setShowAddLoan(false);
      fetchLoans();
    } catch (error) {
      toast.error("Echec lors de l'ajout de l'emprunt");
    }
  };

  const handleEditLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!accessToken || !selectedLoan) return;

      if (!editLoan.bookId) {
        toast.error("Veuillez choisir un livre");
        return;
      }

      const selectedBook = books.find((book) => book._id === editLoan.bookId);
      if (!selectedBook) {
        toast.error("Livre non trouvé");
        return;
      }

      await updateBookLoan(
        selectedLoan._id,
        {
          book: selectedBook,
          returnDate: editLoan.returnDate,
        },
        accessToken
      );

      toast.success("L'emprunt a été modifié avec succès");
      setShowEditLoan(false);
      setSelectedLoan(null);
      fetchLoans();
    } catch (error) {
      toast.error("Echec lors de la modification de l'emprunt");
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
      toast.success("L'emprunt a été supprimé avec succès");
      fetchLoans();
    } catch (error) {
      toast.error("Echec de la suppression de l'emprunt");
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
            {!showAddLoan && !showEditLoan ? (
              <Button onClick={handleAddLoanClick}>
                <BookPlus className="mr-2 h-4 w-4" />
                Nouvel emprunt
              </Button>
            ) : showAddLoan ? (
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
            ) : (
              <form onSubmit={handleEditLoan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="book">Livre</Label>
                    <Select
                      value={editLoan.bookId}
                      onValueChange={(value) =>
                        setEditLoan({ ...editLoan, bookId: value })
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
                      value={editLoan.returnDate}
                      onChange={(e) =>
                        setEditLoan({ ...editLoan, returnDate: e.target.value })
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
                    onClick={() => {
                      setShowEditLoan(false);
                      setSelectedLoan(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Modifier</Button>
                </div>
              </form>
            )}

            {loans.length === 0 ? (
              <p>Aucun emprunt en cours</p>
            ) : (
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
                      <TableCell>{loan.book.titre}</TableCell>
                      <TableCell>
                        {new Date(loan.loanDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(loan.returnDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditLoanClick(loan)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Modifier</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteLoan(loan)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Supprimer</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
