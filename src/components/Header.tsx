import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/products", search: { q: query.trim() } });
      setSearchOpen(false);
    }
  };

  const categories = [
    { label: "الكل", param: "all" },
    { label: "عطور رجالية", param: "men" },
    { label: "عطور نسائية", param: "women" },
    { label: "عطور للجنسين", param: "unisex" },
    { label: "بخور", param: "bakhoor" },
    { label: "جميع المنتجات", param: "all" },
  ];

  return (
    <header className="px-4 md:px-8 pt-6 pb-4 relative z-40">
      <div className="flex items-center justify-between relative">
        <Link
          to="/cart"
          aria-label="السلة"
          className="relative w-12 h-12 bg-cream-deep/40 text-foreground rounded-full flex items-center justify-center hover:bg-cream-deep/60 transition shrink-0 shadow-sm"
        >
          <ShoppingCart size={22} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>

        {searchOpen ? (
          <form
            onSubmit={handleSearch}
            className="flex-1 mx-4 relative animate-in fade-in zoom-in duration-200"
          >
            <input
              type="text"
              autoFocus
              placeholder="ابحث عن عطر..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-cream-deep/40 text-foreground rounded-full px-5 py-3 outline-none focus:ring-1 focus:ring-brand text-sm shadow-sm"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          </form>
        ) : (
          <Link to="/" className="text-brand font-bold text-xl md:text-2xl tracking-wide truncate">
            أورا للعطور
          </Link>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {!searchOpen && (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="بحث"
              className="w-12 h-12 bg-cream-deep/40 text-foreground rounded-full flex items-center justify-center hover:bg-cream-deep/60 shadow-sm transition"
            >
              <Search size={22} />
            </button>
          )}
          <button
            aria-label="القائمة"
            onClick={() => setOpen(true)}
            className="w-12 h-12 bg-cream-deep/40 text-foreground rounded-full flex items-center justify-center hover:bg-cream-deep/60 shadow-sm transition"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Slide-in menu (mobile) */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 h-full w-[300px] bg-background text-foreground shadow-2xl p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">تصفح المتجر</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-cream-deep flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>
            <div className="rounded-2xl bg-cream-deep p-4 mb-5">
              <p className="font-bold mb-1">حسابي</p>
              <p className="text-xs text-muted-foreground mb-3">
                سجل دخول للوصول لطلباتك وحفظ عطورك المفضلة
              </p>
              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="inline-block bg-brand text-white font-bold rounded-lg px-4 py-2 text-sm"
              >
                لوحة التحكم
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mb-3">تصفح أقسام المتجر السريعة</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-cream-deep font-bold"
                >
                  الرئيسية
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.label}>
                  <Link
                    to="/products"
                    search={{ category: c.param }}
                    onClick={() => setOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-cream-deep font-bold"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </header>
  );
}
