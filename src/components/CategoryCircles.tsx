import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export function CategoryCircles({ items = categories }: { items?: typeof categories }) {
  return (
    <div className="relative px-4 md:px-12 py-6">
      <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar items-start">
        {items.slice(1).map((c) => (
          <Link key={c.id} to="/products" className="flex flex-col items-center shrink-0 group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-background overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              {/* Replace with the generic perfume image or use the specific icon from categories */}
              <img src={c.icon || "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=300"} alt={c.name} className="w-full h-full object-cover p-2 rounded-full" />
            </div>
            <span className="text-sm md:text-base mt-3 font-bold text-center text-foreground">{c.name}</span>
          </Link>
        ))}
        <Link to="/products" className="flex flex-col items-center shrink-0 group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand text-white flex items-center justify-center shadow-sm group-hover:bg-brand-dark transition-colors">
            <ArrowLeft size={32} />
          </div>
          <span className="text-sm md:text-base mt-3 font-bold text-foreground">عرض الكل</span>
        </Link>
      </div>
    </div>
  );
}
