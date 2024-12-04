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
import { Switch } from "@/components/ui/switch";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import AddChildDialog from "./AddChildDialog";
import EditChildDialog from "./EditChildDialog";
import {
  ChildProfile,
  getChildProfiles,
  deleteChildProfile,
} from "@/lib/api/children";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function ChildrenManagement() {
  const { accessToken } = useAuth();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [showEditChild, setShowEditChild] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [childToDelete, setChildToDelete] = useState<ChildProfile | null>(null);

  const fetchChildren = async () => {
    try {
      if (!accessToken) return;
      const fetchedChildren = await getChildProfiles(accessToken);
      setChildren(fetchedChildren);
    } catch (error) {
      toast.error("Failed to fetch children profiles");
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [accessToken]);

  const handleEditChild = (child: ChildProfile) => {
    setSelectedChild(child);
    setShowEditChild(true);
  };

  const handleDeleteChild = (child: ChildProfile) => {
    setChildToDelete(child);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!childToDelete || !accessToken) return;

      await deleteChildProfile(childToDelete._id, accessToken);
      toast.success("Child profile deleted successfully");
      fetchChildren();
    } catch (error) {
      toast.error("Failed to delete child profile");
    } finally {
      setShowDeleteDialog(false);
      setChildToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Children Management
          </h2>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children.map((child) => (
                <TableRow key={child._id}>
                  <TableCell>{`${child.prenom} ${child.nom}`}</TableCell>
                  <TableCell>{child.classeSuivie}</TableCell>
                  <TableCell>
                    {new Date(child.dateNaissance).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditChild(child)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteChild(child)}
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

      <AddChildDialog
        open={showAddChild}
        onOpenChange={setShowAddChild}
        onChildAdded={fetchChildren}
      />

      {selectedChild && (
        <EditChildDialog
          child={selectedChild}
          open={showEditChild}
          onOpenChange={setShowEditChild}
          onChildUpdated={fetchChildren}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              child's profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
