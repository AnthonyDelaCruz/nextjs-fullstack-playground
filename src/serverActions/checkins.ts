"use server";

import { checkinFormSchema } from "@/components/forms/CheckinForm";
import { z } from "zod";
import db from "@/lib/db";
import { Roles, User } from "@prisma/client";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCheckin(values: z.infer<typeof checkinFormSchema>) {
  const { user } = await validateRequest();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const response = await db.checkin.create({
    data: {
      userId: user.id as User["id"],
      timeSpent: values.timeSpent,
      timeUnit: values.timeUnit,
      activity: values.activity,
      tags: {
        connect: values.tags.map((tagId) => ({ id: tagId })),
      },
      createdAt: new Date(),
    },
  });

  revalidatePath("/");
}

export async function deleteCheckin(checkinId: string) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await db.checkin.delete({
      where: {
        id: checkinId,
        userId: user.id,
      },
    });

    revalidatePath("/");
  } catch (error) {
    return {
      error: "An error occurred while deleting your check-in",
    };
  }
}
