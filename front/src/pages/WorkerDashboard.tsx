import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChildrenManagement from "@/components/worker/ChildrenManagement";
import BookLoans from "@/components/worker/BookLoans";

export default function WorkerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Worker Dashboard</h1>
        <p className="text-muted-foreground">
          Manage children and book loans.
        </p>
      </div>

      <Tabs defaultValue="children" className="space-y-4">
        <TabsList>
          <TabsTrigger value="children">Children</TabsTrigger>
          <TabsTrigger value="loans">Book Loans</TabsTrigger>
        </TabsList>
        <TabsContent value="children" className="space-y-4">
          <ChildrenManagement />
        </TabsContent>
        <TabsContent value="loans" className="space-y-4">
          <BookLoans />
        </TabsContent>
      </Tabs>
    </div>
  );
}