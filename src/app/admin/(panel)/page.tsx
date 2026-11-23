import { Container } from "@/components/ui/container";
import { DashboardView } from "@/features/admin/components/dashboard-view";
import { getDashboardStats } from "@/features/admin/queries";
import { requireAdmin } from "@/lib/auth/admin";

export default async function Dashboard() {
  const admin = await requireAdmin();
  const stats = await getDashboardStats();
  return (
    <Container size="wide" className="py-10">
      <DashboardView stats={stats} email={admin.email} />
    </Container>
  );
}
