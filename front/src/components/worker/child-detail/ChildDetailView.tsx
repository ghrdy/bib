import { ChildProfile } from "@/lib/api/children";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, BookPlus } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ChildStatus } from "./ChildStatus";
import { formatDate } from "@/lib/utils";

interface ChildDetailViewProps {
  child: ChildProfile;
  onBack: () => void;
  onRestrict: () => void;
  onLoan: () => void;
}

export function ChildDetailView({
  child,
  onBack,
  onRestrict,
  onLoan,
}: ChildDetailViewProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRestrict}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <AlertTriangle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-4 pt-8 pb-20">
        <ProfileAvatar
          imageUrl={child.photo}
          name={`${child.prenom} ${child.nom}`}
          size="lg"
          className="h-32 w-32"
        />

        <h2 className="mt-4 text-2xl font-bold">
          {child.prenom} {child.nom}
        </h2>

        <div className="mt-2">
          <ChildStatus status={child.status} />
        </div>

        <Button className="mt-6 w-full max-w-sm" onClick={onLoan}>
          <BookPlus className="mr-2 h-5 w-5" />
          Enregistrer un emprunt
        </Button>

        <div className="mt-8 w-full max-w-sm space-y-4">
          <InfoSection label="Classe" value={child.classeSuivie} />
          <InfoSection
            label="Date de naissance"
            value={formatDate(child.dateNaissance)}
          />
          {child.noteObservation && (
            <InfoSection
              label="Notes / Observations"
              value={child.noteObservation}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function InfoSection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
