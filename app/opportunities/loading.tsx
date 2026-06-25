import { Navbar } from "@/components/navbar";
import { OpportunitiesPageSkeleton } from "@/components/ui/skeleton";

export default function OpportunitiesLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <OpportunitiesPageSkeleton />
    </main>
  );
}
