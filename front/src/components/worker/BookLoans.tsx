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
      toast.error('Failed to fetch book loans');
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
      toast.success('Book loan deleted successfully');
      fetchLoans();
    } catch (error) {
      toast.error('Failed to delete book loan');
    } finally {
      setShowDeleteDialog(false);
      setLoanToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Book Loans</h2>
          <p className="text-muted-foreground">
            Manage book loans and returns
          </p>
        </div>
        <Button onClick={() => setShowAddLoan(true)}>
          <BookPlus className="mr-2 h-4 w-4" />
          New Loan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>Currently borrowed books.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Loan Date</TableHead>
                <TableHead>Due Date</TableHead>
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
      </Card>

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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book loan record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}