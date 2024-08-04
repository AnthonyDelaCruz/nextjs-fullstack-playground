import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { Routes } from "@/constants/routes";

export default async function AuthenticationPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect(Routes.DASHBOARD);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Login</TabsTrigger>
          <TabsTrigger value="password">Sign-Up</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <LoginForm />
        </TabsContent>
        <TabsContent value="password">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
