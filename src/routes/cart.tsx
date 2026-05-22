import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart, fmt } from "@/lib/cart";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "سلة المشتريات — أورا للعطور" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-cream-deep rounded-full flex items-center justify-center text-brand mb-6">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-3">سلتك فارغة</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
          تبدو سلة التسوق الخاصة بك فارغة. تصفح مجموعة عطورنا الفاخرة لاكتشاف روائح تأسر الحواس.
        </p>
        <Link
          to="/products"
          className="bg-brand text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-brand-dark transition-all hover:scale-105"
        >
          تصفح المتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 py-8 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">سلة المشتريات</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map(({ product, qty }) => (
            <div
              key={product.id}
              className="bg-card rounded-3xl border border-cream-deep p-4 md:p-5 flex gap-4 md:gap-6 shadow-sm relative group"
            >
              <button
                onClick={() => remove(product.id)}
                className="absolute top-4 left-4 text-muted-foreground hover:text-discount bg-cream-deep/50 hover:bg-discount/10 w-8 h-8 rounded-full flex items-center justify-center transition opacity-100 md:opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>

              <Link to="/products/$id" params={{ id: product.id }} className="shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain bg-cream-deep/30 rounded-2xl"
                />
              </Link>

              <div className="flex-1 flex flex-col py-1">
                <Link
                  to="/products/$id"
                  params={{ id: product.id }}
                  className="text-lg font-bold text-foreground hover:text-brand line-clamp-2 pr-8 md:pr-0"
                >
                  {product.name}
                </Link>
                <div className="text-sm text-muted-foreground mt-1">
                  القسم:{" "}
                  {product.category === "men"
                    ? "رجالي"
                    : product.category === "women"
                      ? "نسائي"
                      : "للجنسين"}
                </div>

                <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center bg-cream-deep/40 border border-cream-deep rounded-xl">
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:text-brand transition"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:text-brand transition"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                  <div className="font-bold text-brand text-lg">{fmt(product.price * qty)} ر.س</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-card rounded-3xl border border-cream-deep p-6 md:p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="font-bold">{fmt(total)} ر.س</span>
              </div>
              <div className="flex justify-between text-badge-green font-bold bg-badge-green/10 p-2 rounded-lg">
                <span>الشحن</span>
                <span>مجاني</span>
              </div>
            </div>
            <div className="border-t border-dashed border-cream-deep pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">الإجمالي</span>
                <span className="font-bold text-brand text-2xl">{fmt(total)} ر.س</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">شامل ضريبة القيمة المضافة</p>
            </div>
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-4 shadow-lg transition-transform active:scale-[0.98]"
            >
              إتمام الطلب بأمان
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
