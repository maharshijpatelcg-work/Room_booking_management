import type { Metadata } from "next";
import { Toaster } from "sonner";
import TopNav from "@/components/layout/TopNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "EquipBook — Campus Equipment & Resource Booking",
  description: "Manage and book equipment and resources for your college",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink antialiased min-h-screen flex flex-col">
        {/* Persistent TopNav: mounts once, never remounts across page navigation */}
        <TopNav />
        <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
          {children}
        </main>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
