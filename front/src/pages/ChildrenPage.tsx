import ChildrenManagement from "@/components/worker/ChildrenManagement";

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Enfants</h1>
        <p className="text-muted-foreground">
          Gérer les profils des enfants
        </p>
      </div>
      <ChildrenManagement />
    </div>
  );
}