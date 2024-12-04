import BookLoans from "@/components/worker/BookLoans";

export default function BooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Livres</h1>
        <p className="text-muted-foreground">
          Gérer les emprunts et retours de livres
        </p>
      </div>
      <BookLoans />
    </div>
  );
}