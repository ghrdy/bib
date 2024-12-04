import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { BookPlus, Pencil, Trash2 } from "lucide-react";
import AddLoanDialog from "./AddLoanDialog";
import EditLoanDialog from "./EditLoanDialog";
import { BookLoan, getBookLoans, deleteBookLoan } from "@/lib/api/bookLoans";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function BookLoans() {
  const { accessToken } = useAuth();
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<BookLoan | null>(null);
  const [showEditLoan, setShowEditLoan] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<BookLoan | null>(null);

  const fetchLoans = async () => {
    try {
      if (!accessToken) return;
      const fetchedLoans = await getBookLoans(accessToken);
      setLoans(fetchedLoans);
    } catch (error) {
      toast.error('Échec du chargement des emprunts');
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [accessToken]);

  const handleEditLoan = (loan: BookLoan) => {
    setSelectedLoan(loan);
    setShowEditLoan(true);
  };

  const handleDeleteLoan = (loan: BookLoan) => {
    setLoanToDelete(loan);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!loanToDelete || !accessToken) return;
      
      await deleteBookLoan(loanToDelete._id, accessToken);
      toast.success('Emprunt supprimé avec succès');
      fetchLoans();
    } catch (error) {
      toast.error('Échec de la suppression');
    } finally {
      setShowDeleteDialog(false);
      setLoanToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Emprunts en cours</CardTitle>
          <CardDescription>Liste des livres actuellement empruntés</CardDescription>
        </div>
        <Button onClick={() => setShowAddLoan(true)}>
          <BookPlus className="mr-2 h-4 w-4" />
          Nouvel emprunt
        </Button>
      </CardHeader>
      <CardContent>
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
                <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(loan.returnDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditLoan(loan)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
      </CardContent>

      <AddLoanDialog
        open={showAddLoan}
        onOpenChange={setShowAddLoan}
        onLoanAdded={fetchLoans}
      />

      {selectedLoan && (
        <EditLoanDialog
          loan={selectedLoan}
          open={showEditLoan}
          onOpenChange={setShowEditLoan}
          onLoanUpdated={fetchLoans}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'enregistrement de l'emprunt sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}