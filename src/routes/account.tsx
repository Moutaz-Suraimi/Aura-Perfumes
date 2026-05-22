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
  Truck,
  Search,
} from "lucide-react";
import { featuredProduct, type Product } from "@/data/products";
import { fmt } from "@/lib/cart";
import { useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile, getUserProfile, UserProfile } from "@/lib/db";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم — أورا للعطور" },
      { name: "description", content: "إدارة حسابك وطلباتك وعناوينك في المتجر." },
    ],
  }),
  component: AccountDashboard,
});

type Tab = "profile" | "orders" | "tracking" | "shipping" | "addresses" | "wishlist";

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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<Tab>("profile");

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        try {
          const profile = await getUserProfile(u.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(cred.user.uid, { name, email });
        await sendEmailVerification(cred.user);
        setSuccessMsg("تم إنشاء الحساب! يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccessMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      // Check if this is the first time logging in by creating profile if it doesn't exist
      await createUserProfile(cred.user.uid, {
        name: cred.user.displayName || "مستخدم جوجل",
        email: cred.user.email || "",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center font-bold">جاري التحميل...</div>;
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-3xl border border-cream-deep p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand rounded-full text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User size={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{isLoginMode ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{isLoginMode ? "مرحباً بك مجدداً في أورا للعطور" : "انضم إلينا الآن"}</p>
          </div>
          {error && <div className="bg-discount/10 text-discount p-3 rounded-xl mb-4 text-sm font-bold">{error}</div>}
          {successMsg && <div className="bg-badge-green/10 text-badge-green p-3 rounded-xl mb-4 text-sm font-bold">{successMsg}</div>}

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-cream-deep hover:bg-cream-deep/40 text-foreground font-bold rounded-xl py-3 shadow-sm mb-6 flex items-center justify-center gap-3 transition"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            <span>{isLoginMode ? "تسجيل الدخول باستخدام جوجل" : "إنشاء حساب باستخدام جوجل"}</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-cream-deep"></div>
            <span className="text-xs text-muted-foreground font-bold">أو باستخدام البريد</span>
            <div className="flex-1 h-px bg-cream-deep"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-bold mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                  placeholder="أدخل اسمك"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                placeholder="أدخل كلمة المرور"
              />
            </div>
            {isLoginMode && (
              <div className="flex items-center justify-between mt-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-brand" />
                  <span>تذكرني</span>
                </label>
                <a href="#" className="text-brand font-bold hover:underline">نسيت كلمة المرور؟</a>
              </div>
            )}
            <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3 shadow-lg mt-4 transition">
              {isLoginMode ? "دخول" : "تسجيل حساب"}
            </button>
            <div className="text-center mt-6 text-sm text-muted-foreground">
              {isLoginMode ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-brand font-bold hover:underline">
                {isLoginMode ? "سجل الآن" : "تسجيل الدخول"}
              </button>
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-card/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-card/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <User size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">{userProfile?.name || firebaseUser.email}</h2>
                <p className="text-white/70 text-sm">{userProfile?.role === "admin" ? "مدير النظام" : "عضو حالي"}</p>
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
                onClick={() => setTab("tracking")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${tab === "tracking" ? "bg-cream-deep/60 text-brand" : "hover:bg-cream-deep/40 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <Search size={18} />
                  <span>تتبع الطلب</span>
                </div>
                {tab === "tracking" && <ChevronRight size={16} />}
              </button>
              <button
                onClick={() => setTab("shipping")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${tab === "shipping" ? "bg-cream-deep/60 text-brand" : "hover:bg-cream-deep/40 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <Truck size={18} />
                  <span>الشحن والتوصيل</span>
                </div>
                {tab === "shipping" && <ChevronRight size={16} />}
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
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-discount hover:bg-discount/10 mt-4 transition-colors"
              >
                <LogOut size={18} />
                <span>تسجيل خروج</span>
              </button>
            </nav>
          </aside>
        </div>

        <div className="flex-1 space-y-6">
          {tab === "profile" && <ProfileTab profile={userProfile} firebaseUser={firebaseUser} />}
          {tab === "orders" && <OrdersTab />}
          {tab === "tracking" && <TrackingTab />}
          {tab === "shipping" && <ShippingTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "wishlist" && <WishlistTab />}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/10 backdrop-blur rounded-xl px-3 py-2 text-center border border-white/20">
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

function ProfileTab({ profile, firebaseUser }: { profile: UserProfile | null, firebaseUser: FirebaseUser }) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-5">المعلومات الشخصية</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="الاسم الكامل" value={profile?.name || "غير محدد"} icon={User} />
        <Field label="البريد الإلكتروني" value={firebaseUser.email || ""} icon={Mail} />
        <Field label="رقم الجوال" value={profile?.phone || "غير محدد"} icon={Phone} />
        <Field label="المنطقة" value={profile?.city ? `${profile.city} - ${profile.country}` : "غير محدد"} icon={MapPin} />
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

function TrackingTab() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <Card>
      <h2 className="text-xl font-bold mb-5">تتبع الطلب</h2>
      <p className="text-muted-foreground text-sm mb-6">
        أدخل رقم الطلب لتتبع حالة شحنتك ومعرفة موعد التوصيل المتوقع.
      </p>
      
      <form 
        onSubmit={(e) => { e.preventDefault(); setSearched(true); }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="رقم الطلب (مثال: #ORD-12345)"
          className="flex-1 bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
          required
        />
        <button type="submit" className="bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-6 py-3 transition shrink-0 flex items-center justify-center gap-2">
          <Search size={18} />
          تتبع الآن
        </button>
      </form>

      {searched && (
        <div className="border border-cream-deep rounded-2xl p-6 bg-cream-deep/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-bold text-lg">الطلب {orderId}</p>
              <p className="text-sm text-muted-foreground">شركة الشحن: أرامكس</p>
            </div>
            <span className="bg-badge-orange/15 text-badge-orange font-bold px-3 py-1 rounded-full text-sm">
              قيد التوصيل
            </span>
          </div>

          <div className="relative border-r-2 border-brand/30 pr-6 space-y-6">
            <div className="relative">
              <span className="absolute -right-[29px] top-1 w-4 h-4 rounded-full bg-brand ring-4 ring-background"></span>
              <p className="font-bold">تم خروج الشحنة للتوصيل</p>
              <p className="text-xs text-muted-foreground mt-1">اليوم، 09:30 صباحاً</p>
            </div>
            <div className="relative opacity-60">
              <span className="absolute -right-[29px] top-1 w-4 h-4 rounded-full bg-brand ring-4 ring-background"></span>
              <p className="font-bold">وصلت الشحنة لمدينة الرياض</p>
              <p className="text-xs text-muted-foreground mt-1">الأمس، 14:00 مساءً</p>
            </div>
            <div className="relative opacity-60">
              <span className="absolute -right-[29px] top-1 w-4 h-4 rounded-full bg-brand ring-4 ring-background"></span>
              <p className="font-bold">تم تأكيد الطلب وتجهيزه</p>
              <p className="text-xs text-muted-foreground mt-1">2026/05/18</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function ShippingTab() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-5">الشحن والتوصيل</h2>
      <div className="space-y-6">
        <div className="bg-cream-deep/30 rounded-2xl p-5 border border-cream-deep">
          <div className="flex items-center gap-3 mb-3">
            <Truck className="text-brand" size={24} />
            <h3 className="font-bold text-lg">خيارات الشحن المتاحة</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            نوفر خيارات شحن متعددة تناسب احتياجاتك. اختر ما يناسبك عند إتمام الطلب.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-cream-deep rounded-xl p-4">
            <h4 className="font-bold mb-2">توصيل سريع (داخل الرياض)</h4>
            <p className="text-xs text-muted-foreground mb-3">توصيل خلال 24 ساعة</p>
            <p className="text-brand font-bold">25 ر.س</p>
          </div>
          <div className="border border-cream-deep rounded-xl p-4">
            <h4 className="font-bold mb-2">توصيل عادي (باقي المدن)</h4>
            <p className="text-xs text-muted-foreground mb-3">من 3 إلى 5 أيام عمل</p>
            <p className="text-brand font-bold">35 ر.س</p>
          </div>
        </div>

        <div className="bg-badge-green/10 text-badge-green rounded-xl p-4 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span>شحن مجاني للطلبات التي تزيد عن 500 ر.س</span>
        </div>
      </div>
    </Card>
  );
}
