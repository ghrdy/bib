import { useState } from "react";
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
import { BookPlus } from "lucide-react";
import AddLoanDialog from "./AddLoanDialog";

export default function BookLoans() {
  const [showAddLoan, setShowAddLoan] = useState(false);

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
                <TableHead>Child</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Alice Smith</TableCell>
                <TableCell>The Little Prince</TableCell>
                <TableCell>2024-03-01</TableCell>
                <TableCell>2024-03-15</TableCell>
                <TableCell>Borrowed</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Return
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddLoanDialog open={showAddLoan} onOpenChange={setShowAddLoan} />
    </div>
  );
}