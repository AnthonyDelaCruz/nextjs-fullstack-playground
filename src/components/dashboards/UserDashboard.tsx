import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CheckinForm from "../forms/CheckinForm";
import UserDashboardTable from "../tables/UserDashboardTable";
import { Separator } from "../ui/separator";
import DailyCheckInDonutChart from "../charts/DailyCheckInDonutChart";
import PastThreeMonthsCheckinAreaChart from "../charts/PastThreeMonthsCheckinAreaChart";
import db from "@/lib/db";
import { validateRequest } from "@/lib/auth";
import { Routes } from "@/constants/routes";
import { redirect } from "next/navigation";
import { AreaChart, Table } from "lucide-react";

export default async function UserDashboard() {
  const { user } = await validateRequest();

  if (!user) return redirect(Routes.AUTHENTICATE);

  const checkins = await db.checkin.findMany({
    where: {
      userId: user.id,
    },
    include: {
      tags: true,
    },
  });

  const tags = await db.tags.findMany();

  return (
    <Tabs defaultValue="table-view">
      <div className="flex justify-between mb-4">
        <CheckinForm tags={tags} />
        <TabsList>
          <TabsTrigger value="table-view">
            <Table />
          </TabsTrigger>
          <TabsTrigger value="insights">
            <AreaChart />
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="table-view">
        <UserDashboardTable data={checkins} />
      </TabsContent>
      <TabsContent value="insights">
        <div>
          <Separator />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <DailyCheckInDonutChart />
          <PastThreeMonthsCheckinAreaChart />
        </div>
      </TabsContent>
    </Tabs>
  );
}
