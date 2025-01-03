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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlus, Pencil, Trash2, KeyRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import { User, getUsers, deleteUser, resetUserPassword } from "@/lib/api/users";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { SearchBar } from "@/components/worker/SearchBar";
import { UsersList } from "./UsersList";
import { UserDetailView } from "./UserDetailView";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

export default function UserManagement() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(
    null
  );
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);

  const fetchUsers = async () => {
    try {
      if (!accessToken) return;
      const fetchedUsers = await getUsers(accessToken);
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      toast.error("Echec lors de la récupération des utilisateurs");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        user.nom.toLowerCase().includes(searchTerm) ||
        user.prenom.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const handleResetPassword = (user: User) => {
    setUserToResetPassword(user);
    setShowResetPasswordDialog(true);
  };

  const confirmResetPassword = async () => {
    try {
      if (!userToResetPassword || !accessToken) return;

      await resetUserPassword(userToResetPassword._id, accessToken);
      toast.success("Email de réinitialisation envoyé");
    } catch (error) {
      toast.error("Échec de l'envoi de l'email de réinitialisation");
    } finally {
      setShowResetPasswordDialog(false);
      setUserToResetPassword(null);
      fetchUsers();
    }
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

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="w-full flex justify-between gap-4">
          <Button onClick={() => setShowAddUser(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
          <div className="w-1/3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un utilisateur..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile view */}
        <div className="md:hidden">
          <UsersList users={filteredUsers} onSelectUser={handleSelectUser} />
        </div>

        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prénom / Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    {!user.validated && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium inline-block">
                        En attente de validation
                      </div>
                    )}
                    {user.validated && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium inline-block">
                        Validé
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modifier</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleResetPassword(user)}
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Réinitialiser le mot de passe</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AddUserDialog
        open={showAddUser}
        onOpenChange={setShowAddUser}
        onUserAdded={fetchUsers}
      />

      {selectedUser && (
        <>
          <EditUserDialog
            user={selectedUser}
            open={showEditUser}
            onOpenChange={setShowEditUser}
            onUserUpdated={fetchUsers}
          />
          <UserDetailView
            user={selectedUser}
            onBack={() => setShowUserDetail(false)}
            onResetPassword={() => handleResetPassword(selectedUser)}
            onEdit={() => {
              set Continuing with the UserManagement.tsx file content from where we left off:


              setShowEditUser(true);
              setShowUserDetail(false);
            }}
            onDelete={() => {
              handleDeleteUser(selectedUser);
              setShowUserDetail(false);
            }}
          />
        </>
      )}

      {showUserDetail && selectedUser && (
        <UserDetailView
          user={selectedUser}
          onBack={() => setShowUserDetail(false)}
          onResetPassword={() => handleResetPassword(selectedUser)}
          onEdit={() => {
            setShowEditUser(true);
            setShowUserDetail(false);
          }}
          onDelete={() => {
            handleDeleteUser(selectedUser);
            setShowUserDetail(false);
          }}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'utilisateur sera définitivement
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

      {userToResetPassword && (
        <ResetPasswordDialog
          open={showResetPasswordDialog}
          onOpenChange={setShowResetPasswordDialog}
          onConfirm={confirmResetPassword}
          userName={`${userToResetPassword.prenom} ${userToResetPassword.nom}`}
        />
      )}
    </Card>
  );
}