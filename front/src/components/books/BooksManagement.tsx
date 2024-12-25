import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AddBookDialog from "./AddBookDialog";
import EditBookDialog from "./EditBookDialog";
import { Book, getBooks, deleteBook } from "@/lib/api/books";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function BooksManagement() {
  const { accessToken } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showEditBook, setShowEditBook] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      if (!accessToken) return;
      const fetchedBooks = await getBooks(accessToken);
      setBooks(fetchedBooks);
    } catch (error) {
      toast.error("Échec du chargement des livres");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [accessToken]);

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setShowEditBook(true);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!bookToDelete || !accessToken) return;

      await deleteBook(bookToDelete._id, accessToken);
      toast.success("Livre supprimé avec succès");
      fetchBooks();
    } catch (error) {
      toast.error("Échec de la suppression");
    } finally {
      setShowDeleteDialog(false);
      setBookToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Button onClick={() => setShowAddBook(true)}>
          <BookPlus className="mr-2 h-4 w-4" />
          Ajouter un livre
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>
                  <Avatar>
                    {book.photo ? (
                      <AvatarImage
                        src={`http://localhost:5001${book.photo}`}
                        alt={book.titre}
                      />
                    ) : (
                      <AvatarFallback>
                        {book.titre.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
                <TableCell>{book.titre}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditBook(book)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBook(book)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AddBookDialog
        open={showAddBook}
        onOpenChange={setShowAddBook}
        onBookAdded={fetchBooks}
      />

      {selectedBook && (
        <EditBookDialog
          book={selectedBook}
          open={showEditBook}
          onOpenChange={setShowEditBook}
          onBookUpdated={fetchBooks}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le livre sera définitivement
              supprimé.
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
    </Card>
  );
}
