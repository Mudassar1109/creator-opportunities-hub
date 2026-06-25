import { Navbar } from "@/components/navbar";
import { OpportunityDetailSkeleton } from "@/components/ui/skeleton";

export default function OpportunityDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <OpportunityDetailSkeleton />
    </main>
  );
}
