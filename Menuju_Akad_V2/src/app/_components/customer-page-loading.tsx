import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function CustomerPageLoading() {
  return (
    <main id="main-content" className="min-h-dvh w-full bg-surface p-4 sm:p-8">
      <div className="w-full">
        <PageSkeleton label="Membuka halaman" />
      </div>
    </main>
  );
}
