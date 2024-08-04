import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-col gap-4 min-h-screen container">
      <div>
        <Navbar />
        <Separator />
      </div>
      {children}
    </section>
  );
}
