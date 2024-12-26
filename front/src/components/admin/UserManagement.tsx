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
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import { getUsers, deleteUser, User } from "@/lib/api/users";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function UserManagement() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      if (!accessToken) return;
      const fetchedUsers = await getUsers(accessToken);
      setUsers(fetchedUsers);
    } catch (error) {
      toast.error("Echec lors de la récupération des utilisateurs");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (!userToDelete || !accessToken) return;

      await deleteUser(userToDelete._id, accessToken);
      toast.success("L'utilisateur a été supprimé");
      fetchUsers();
    } catch (error) {
      toast.error("Echec lors de la suppression de l'utilisateur");
    } finally {
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button onClick={() => setShowAddUser(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prénom / Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user)}
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

      <AddUserDialog
        open={showAddUser}
        onOpenChange={setShowAddUser}
        onUserAdded={fetchUsers}
      />

      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={showEditUser}
          onOpenChange={setShowEditUser}
          onUserUpdated={fetchUsers}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. L'utilisateur sera supprimé du
              système et les données liées seront perdues.
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
    </div>
  );
}
