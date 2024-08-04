"use server";

import { loginFormSchema } from "@/components/forms/LoginForm";
import { signUpFormSchema } from "@/components/forms/SignupForm";
import { Routes } from "@/constants/routes";
import { lucia, validateRequest } from "@/lib/auth";
import db from "@/lib/db";
import { hash, verify } from "@node-rs/argon2";
import { Roles } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

interface ActionResult {
  error: string;
}

export async function signup(
  values: z.infer<typeof signUpFormSchema>
): Promise<ActionResult> {
  const { username, password } = values;

  try {
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const newUser = await db.user.create({
      data: {
        username,
        passwordHash,
        role: Roles.USER,
      },
    });

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    // Ideally, this should be sent to a log service for tracking
    console.error("Signup error", error);

    return {
      error: "An error occurred while creating your account",
    };
  }

  return redirect(Routes.DASHBOARD);
}

export async function login(
  values: z.infer<typeof loginFormSchema>
): Promise<ActionResult> {
  try {
    const { username, password } = values;

    const existingUser = await db.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (!existingUser) throw new Error();

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) throw new Error();

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    return {
      error: "Incorrect username or password",
    };
  }

  return redirect(Routes.DASHBOARD);
}

export async function logout(): Promise<{ error: string }> {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    return {
      error: "An error occurred while logging out",
    };
  }

  return redirect(Routes.AUTHENTICATE);
}
