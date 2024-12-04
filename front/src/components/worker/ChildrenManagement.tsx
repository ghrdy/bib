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
import { Switch } from "@/components/ui/switch";
import { UserPlus } from "lucide-react";
import AddChildDialog from "./AddChildDialog";

export default function ChildrenManagement() {
  const [showAddChild, setShowAddChild] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Children Management</h2>
          <p className="text-muted-foreground">
            Add and manage children's profiles
          </p>
        </div>
        <Button onClick={() => setShowAddChild(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Child
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Children</CardTitle>
          <CardDescription>A list of all registered children.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Loan Status</TableHead>
                <TableHead>Restriction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Alice Smith</TableCell>
                <TableCell>CE2</TableCell>
                <TableCell>2016-05-12</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>
                  <Switch />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddChildDialog open={showAddChild} onOpenChange={setShowAddChild} />
    </div>
  );
}