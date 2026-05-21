import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-brand selection:text-white">
        <Header />
        <main className="flex-1 w-full relative z-10 animate-in fade-in duration-500">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster />
    </CartProvider>
  ),
  head: () => ({
    meta: [
      { title: "أورا للعطور - متجر العطور الفاخرة" },
      { name: "description", content: "اكتشف مجموعة من أرقى العطور الحصرية والمميزة." },
    ],
  }),
});
