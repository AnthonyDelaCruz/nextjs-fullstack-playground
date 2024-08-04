import React from "react";
import CheckinAreaChart from "./CheckinAreaChart";
import db from "@/lib/db";
import { addDays, startOfMonth, subMonths } from "date-fns";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";

export default async function PastThreeMonthsCheckinAreaChart() {
  const tags = await db.tags.findMany();

  const { user } = await validateRequest();

  if (!user) return redirect(Routes.AUTHENTICATE);

  const checkinsPastThreeMonths = await db.checkin.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfMonth(subMonths(new Date(), 3)),
        lte: addDays(new Date(), 1),
      },
    },
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <CheckinAreaChart
      headerTitle="Looking back..."
      headerDescription="These are your check-ins from the past 3 months, grouped by tags"
      checkins={checkinsPastThreeMonths}
      tags={tags}
    />
  );
}
