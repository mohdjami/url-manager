import { Icons } from "@/components/Icons";
import { Shell } from "@/components/layouts/shell";

export default async function DashboardLoading() {
  return (
    <Shell>
      <div className="flex justify-center p-8">
        <Icons.spinner className="animate-spin text-4xl" />
      </div>
    </Shell>
  );
}
