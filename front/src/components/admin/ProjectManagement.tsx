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
import { FolderPlus } from "lucide-react";
import AddProjectDialog from "./AddProjectDialog";

export default function ProjectManagement() {
  const [showAddProject, setShowAddProject] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Management</h2>
          <p className="text-muted-foreground">
            Create and manage library projects
          </p>
        </div>
        <Button onClick={() => setShowAddProject(true)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>A list of all library projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Summer Reading</TableCell>
                <TableCell>Summer reading program for kids</TableCell>
                <TableCell>2024-06-01</TableCell>
                <TableCell>Active</TableCell>
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

      <AddProjectDialog open={showAddProject} onOpenChange={setShowAddProject} />
    </div>
  );
}