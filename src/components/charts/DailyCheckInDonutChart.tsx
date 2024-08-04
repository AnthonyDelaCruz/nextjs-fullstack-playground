import React from "react";

import db from "@/lib/db";
import CheckinDonutChart from "./CheckinDonutChart";
import { addDays, formatDate } from "date-fns";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";

export default async function DailyCheckInDonutChart() {
  const { user } = await validateRequest();

  if (!user) return redirect(Routes.AUTHENTICATE);

  const checkinsToday = await db.checkin.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(formatDate(new Date(), "yyyy-MM-dd")),
        lte: addDays(new Date(), 1),
      },
    },
    include: {
      tags: true,
    },
  });

  const tags = await db.tags.findMany();

  return (
    <CheckinDonutChart
      headerTitle="Daily Insight"
      headerDescription="No. of check-ins you did today"
      checkins={checkinsToday}
      tags={tags}
    />
  );
}
