import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import { Roles } from "@prisma/client";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import UserDashboard from "@/components/dashboards/UserDashboard";
import { Routes } from "@/constants/routes";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) return redirect(Routes.AUTHENTICATE);

  return (
    <main>
      {user.role === Roles.USER ? <UserDashboard /> : <AdminDashboard />}
    </main>
  );
}
