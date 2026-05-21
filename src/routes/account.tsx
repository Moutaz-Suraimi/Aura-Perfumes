import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Copy,
} from "lucide-react";
import { featuredProduct, type Product } from "@/data/products";
import { fmt } from "@/lib/cart";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم — أورا للعطور" },
      { name: "description", content: "إدارة حسابك وطلباتك وعناوينك في المتجر." },
    ],
  }),
  component: AccountDashboard,
});

type Tab = "profile" | "orders" | "addresses" | "wishlist";

const user = {
  name: "أحمد محمد",
  email: "ahmed@example.com",
  phone: "+966 50 000 0000",
  city: "الرياض",
  country: "السعودية",
};

const orders = [
  {
    id: "#ORD-88219",
    date: "15 مايو 2026",
    total: 890,
    status: "delivered" as const,
    items: [{ product: featuredProduct, qty: 1 }],
  },
  {
    id: "#ORD-88102",
    date: "28 أبريل 2026",
    total: 450,
    status: "processing" as const,
    items: [{ product: featuredProduct, qty: 1 }],
  },
];

const addresses = [
  {
    id: 1,
    label: "المنزل",
    name: "أحمد محمد",
    phone: "+966 50 000 0000",
    city: "الرياض",
    details: "حي الياسمين، شارع العليا، مبنى 12",
    primary: true,
  },
  {
    id: 2,
    label: "العمل",
    name: "أحمد محمد",
    phone: "+966 50 000 0000",
    city: "الرياض",
    details: "حي الملقا، طريق الملك فهد",
    primary: false,
  },
];

const wishlist: Product[] = [featuredProduct];

const statusMeta = {
  delivered: {
    label: "تم التوصيل",
    color: "bg-badge-green/15 text-badge-green",
    icon: CheckCircle2,
  },
  processing: { label: "قيد التنفيذ", color: "bg-badge-orange/15 text-badge-orange", icon: Clock },
};

function AccountDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-3xl border border-cream-deep p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand rounded-full text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User size={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">تسجيل الدخول</h1>
            <p className="text-muted-foreground mt-2 text-sm">مرحباً بك مجدداً في أورا للعطور</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedIn(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                required
                className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">كلمة المرور</label>
              <input
                type="password"
                required
                className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                placeholder="أدخل كلمة المرور"
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-brand" />
                <span>تذكرني</span>
              </label>
              <a href="#" className="text-brand font-bold hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>
            <button className="w-full bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3 shadow-lg mt-4 transition">
              دخول
            </button>
            <div className="text-center mt-6 text-sm text-muted-foreground">
              ليس لديك حساب؟{" "}
              <a href="#" className="text-brand font-bold hover:underline">
                سجل الآن
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 py-8 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-brand rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <User size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-white/70 text-sm">عضو ذهبي</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="الطلبات" value="12" />
              <Stat label="النقاط" value="450" />
            </div>
          </div>
          <aside className="bg-card rounded-3xl border border-cream-deep p-4 shadow-sm">
            <nav className="space-y-1">
              <button
                onClick={() => setTab("profile")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${tab === "profile" ? "bg-cream-deep/60 text-brand" : "hover:bg-cream-deep/40 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <span>الملف الشخصي</span>
                </div>
                {tab === "profile" && <ChevronRight size={16} />}
              </button>
              <button
                onClick={() => setTab("orders")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${tab === "orders" ? "bg-cream-deep/60 text-brand" : "hover:bg-cream-deep/40 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <Package size={18} />
                  <span>طلباتي</span>
                </div>
                {tab === "orders" && <ChevronRight size={16} />}
              </button>
              <button
                onClick={() => setTab("addresses")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${tab === "addresses" ? "bg-cream-deep/60 text-brand" : "hover:bg-cream-deep/40 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span>العناوين</span>
                </div>
                {tab === "addresses" && <ChevronRight size={16} />}
              </button>
              <button
                onClick={() => setTab("wishlist")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${tab === "wishlist" ? "bg-cream-deep/60 text-brand" : "hover:bg-cream-deep/40 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <Heart size={18} />
                  <span>المفضلة</span>
                </div>
                {tab === "wishlist" && <ChevronRight size={16} />}
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-discount hover:bg-discount/10 mt-4 transition-colors"
              >
                <LogOut size={18} />
                <span>تسجيل خروج</span>
              </button>
            </nav>
          </aside>
        </div>

        <div className="flex-1 space-y-6">
          {tab === "profile" && <ProfileTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "wishlist" && <WishlistTab />}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 text-center border border-white/20">
      <div className="text-xl md:text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-card rounded-2xl border border-cream-deep p-5 md:p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="bg-cream-deep/30 rounded-xl p-4">
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <div className="flex items-center gap-2 font-bold text-foreground">
        {Icon && <Icon size={15} className="text-brand" />}
        <span>{value}</span>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-5">المعلومات الشخصية</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="الاسم الكامل" value={user.name} icon={User} />
        <Field label="البريد الإلكتروني" value={user.email} icon={Mail} />
        <Field label="رقم الجوال" value={user.phone} icon={Phone} />
        <Field label="المنطقة" value={`${user.city} - ${user.country}`} icon={MapPin} />
      </div>
      <button className="mt-6 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-6 py-3 shadow-lg w-full md:w-auto transition-colors">
        تحديث البيانات
      </button>
    </Card>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-1">الطلبات السابقة ({orders.length})</h2>
      {orders.map((o) => {
        const S = statusMeta[o.status];
        return (
          <Card key={o.id}>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-deep">
              <div>
                <p className="font-bold">رقم الطلب {o.id}</p>
                <p className="text-xs text-muted-foreground mt-1">بتاريخ {o.date}</p>
              </div>
              <span
                className={`${S.color} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5`}
              >
                <S.icon size={14} /> {S.label}
              </span>
            </div>
            <div className="py-4 space-y-3">
              {o.items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-contain bg-cream-deep/40 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">الكمية: {qty}</p>
                  </div>
                  <span className="text-brand font-bold text-sm">
                    {fmt(product.price * qty)} ر.س
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-cream-deep">
              <span className="font-bold">الإجمالي</span>
              <span className="text-brand font-bold text-lg">{fmt(o.total)} ر.س</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AddressesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold">عناويني ({addresses.length})</h2>
        <button className="bg-brand text-white text-sm font-bold rounded-full px-4 py-2 shadow-sm">
          + إضافة عنوان
        </button>
      </div>
      {addresses.map((a) => (
        <Card key={a.id}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-brand" />
              <span className="font-bold">{a.label}</span>
              {a.primary && (
                <span className="bg-brand/15 text-brand text-[11px] font-bold px-2 py-0.5 rounded-full">
                  العنوان الافتراضي
                </span>
              )}
            </div>
            <button className="text-xs text-brand flex items-center gap-1 hover:text-brand-dark transition">
              <Copy size={12} /> نسخ
            </button>
          </div>
          <div className="text-sm space-y-1.5 text-foreground/80">
            <p>
              <span className="text-muted-foreground">المستلم:</span> {a.name}
            </p>
            <p>
              <span className="text-muted-foreground">الجوال:</span> {a.phone}
            </p>
            <p>
              <span className="text-muted-foreground">المدينة:</span> {a.city}
            </p>
            <p>
              <span className="text-muted-foreground">العنوان:</span> {a.details}
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-cream-deep/60 text-brand-dark font-bold text-sm rounded-lg py-2 hover:bg-cream-deep transition">
              تعديل
            </button>
            <button className="flex-1 bg-card border border-discount/40 text-discount font-bold text-sm rounded-lg py-2 hover:bg-discount/10 transition">
              حذف
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function WishlistTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-1">قائمة المفضلة ({wishlist.length})</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {wishlist.map((p) => (
          <Card key={p.id}>
            <div className="flex gap-3">
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 object-contain bg-cream-deep/40 rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold line-clamp-2">{p.name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-brand font-bold">{fmt(p.price)} ر.س</span>
                  <span className="text-xs text-muted-foreground line-through">
                    {fmt(p.oldPrice)} ر.س
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                to="/products/$id"
                params={{ id: p.id }}
                className="flex-1 bg-cream-deep/60 text-brand-dark font-bold text-sm rounded-lg py-2 text-center hover:bg-cream-deep transition"
              >
                عرض
              </Link>
              <button className="flex-1 bg-brand text-white font-bold text-sm rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-brand-dark transition">
                <ShoppingBag size={14} /> إضافة للسلة
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
