import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import type { Product, Badge } from "@/data/products";
import { useCart, fmt } from "@/lib/cart";

const badgeText: Record<Badge, string> = {
  best: "Ø§Ù„Ø£ÙƒØ«Ø± Ø·Ù„Ø¨Ø§Ù‹",
  new: "ÙˆØµÙ„ Ø­Ø¯ÙŠØ«Ø§Ù‹",
  limited: "Ù„ÙØªØ±Ø© Ù…Ø­Ø¯ÙˆØ¯Ø©",
  expert: "ØªØ±Ø´ÙŠØ­ Ø§Ù„Ø®Ø¨Ø±Ø§Ø¡",
  today: "ÙØ±ØµØ© Ø§Ù„ÙŠÙˆÙ…",
};
const badgeColor: Record<Badge, string> = {
  best: "bg-badge-navy",
  new: "bg-badge-purple",
  limited: "bg-badge-orange",
  expert: "bg-badge-purple",
  today: "bg-badge-orange",
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  return (
    <div className="relative bg-white rounded-2xl border border-cream-deep shadow-[0_6px_20px_-10px_rgba(183,110,34,0.25)] overflow-hidden w-full flex flex-col">
      {/* Top badges */}
      <div className="absolute top-3 right-3 z-10">
        {product.badge && (
          <span
            className={`${badgeColor[product.badge]} text-white text-[11px] font-bold px-3 py-1 rounded-md leading-tight`}
          >
            {badgeText[product.badge]}
          </span>
        )}
      </div>
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <span className="bg-discount text-white text-[11px] font-bold px-2 py-1 rounded-md leading-tight">
          {discount}%<br />
          Ø®ØµÙ…
        </span>
        {product.freeShipping && (
          <span className="bg-badge-green text-white text-[10px] font-bold px-2 py-1 rounded-md leading-tight">
            Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ
          </span>
        )}
      </div>

      <Link to="/products/$id" params={{ id: product.id }} className="block p-6 pt-10 bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-contain"
          loading="lazy"
        />
      </Link>

      <div className="px-4 pb-4 pt-2 flex-1 flex flex-col">
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          className="text-sm font-bold text-foreground text-center min-h-[44px] line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-end justify-between">
          <button
            onClick={(e) => {
              e.preventDefault();
              add(product);
            }}
            aria-label="Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø©"
            className="w-9 h-9 rounded-full bg-cream-deep/60 hover:bg-cream-deep flex items-center justify-center text-brand-dark transition"
          >
            <ShoppingBag size={16} />
          </button>
          <div className="text-right flex flex-col gap-0.5">
            <div className="text-xs text-muted-foreground line-through">
              {fmt(product.oldPrice)} Ø±.Ø³
            </div>
            <div className="text-brand font-bold text-base">{fmt(product.price)} Ø±.Ø³</div>
            <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
              {fmt(product.priceYer || product.price * 142)} Ø±.ÙŠ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
