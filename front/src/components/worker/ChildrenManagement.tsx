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
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
      toast.error("Échec du chargement des profils");
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
      toast.success("Profil supprimé avec succès");
      fetchChildren();
    } catch (error) {
      toast.error("Échec de la suppression du profil");
    } finally {
      setShowDeleteDialog(false);
      setChildToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Button onClick={() => setShowAddChild(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Prénom / Nom</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {children.map((child) => (
              <TableRow key={child._id}>
                <TableCell>
                  <Avatar>
                    {child.photo ? (
                      <AvatarImage
                        src={`http://localhost:5001${child.photo}`}
                        alt={child.prenom}
                      />
                    ) : (
                      <AvatarFallback>
                        {child.prenom.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
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
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le profil sera définitivement
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
