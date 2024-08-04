import React from "react";
import AdminDashboardTable from "../tables/AdminDashboardTable";
import db from "@/lib/db";

export default async function AdminDashboard() {
  const checkins = await db.checkin.findMany({
    include: {
      tags: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return (
    <div>
      <AdminDashboardTable data={checkins} />
    </div>
  );
}
