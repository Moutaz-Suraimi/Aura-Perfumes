import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export function CategoryCircles({ items = categories }: { items?: typeof categories }) {
  return (
    <div className="relative px-4 md:px-12 py-6">
      <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar items-start">
        <Link to="/products" className="flex flex-col items-center shrink-0 group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand text-white flex items-center justify-center shadow-lg group-hover:bg-brand-dark transition-colors">
            <ArrowLeft size={32} />
          </div>
          <span className="text-sm md:text-base mt-3 font-bold">Ø¹Ø±Ø¶ Ø§Ù„ÙƒÙ„</span>
        </Link>
        {items.slice(1).map((c) => (
          <div key={c.id} className="flex flex-col items-center shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border border-cream-deep shadow-md overflow-hidden p-4 flex items-center justify-center">
              <img src={c.icon} alt={c.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm md:text-base mt-3 font-bold text-center">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
