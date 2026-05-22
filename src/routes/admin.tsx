import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  Plus,
  Search,
  Lock,
  Mail,
  Edit,
  Trash2,
  X,
  Truck,
  MapPin,
} from "lucide-react";
import { allProducts, type Product } from "@/data/products";
import { fmt } from "@/lib/cart";
import { useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/lib/db";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم الإدارة — أورا للعطور" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type AdminTab = "overview" | "products" | "users" | "tracking" | "shipping";

function AdminDashboard() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<AdminTab>("overview");
  const [realUsers, setRealUsers] = useState<UserProfile[]>([]);

  const [email, setEmail] = useState("waelmoutaz297@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Local state for products to simulate adding/editing without a real DB yet
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchQuery, setSearchQuery] = useState("");

  // Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newOldPrice, setNewOldPrice] = useState("");
  const [newPriceYer, setNewPriceYer] = useState("");
  const [newOldPriceYer, setNewOldPriceYer] = useState("");
  const [newCategory, setNewCategory] = useState("men");
  const [newImage, setNewImage] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        if (profile?.role === "admin" || u.email === "waelmoutaz297@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isAdmin && tab === "users") {
      const fetchUsers = async () => {
        const q = query(collection(db, "users"));
        const snap = await getDocs(q);
        const usersList: UserProfile[] = [];
        snap.forEach(doc => usersList.push(doc.data() as UserProfile));
        setRealUsers(usersList);
      };
      fetchUsers();
    }
  }, [isAdmin, tab]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // If the account does not exist and it's the admin email, create it automatically!
      if (
        (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") &&
        email.toLowerCase() === "waelmoutaz297@gmail.com"
      ) {
        try {
          // It's a new admin, let's create the account for them
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          // Set role to admin in Firestore
          await createUserProfile(cred.user.uid, { name: "المدير العام", email, role: "admin" });
          return; // Success!
        } catch (createErr: any) {
          setError("خطأ أثناء إنشاء حساب الإدارة: " + createErr.message);
        }
      } else {
        setError(err.message);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    if (editingId) {
      setProducts(
        products.map((p) => {
          if (p.id === editingId) {
            return {
              ...p,
              name: newName,
              price: Number(newPrice),
              oldPrice: newOldPrice ? Number(newOldPrice) : Number(newPrice),
              priceYer: newPriceYer ? Number(newPriceYer) : undefined,
              oldPriceYer: newOldPriceYer ? Number(newOldPriceYer) : undefined,
              category: newCategory as Product["category"],
              image: newImage || p.image,
            };
          }
          return p;
        }),
      );
    } else {
      const newProduct: Product = {
        id: "prod-" + Date.now(),
        name: newName,
        price: Number(newPrice),
        oldPrice: newOldPrice ? Number(newOldPrice) : Number(newPrice) + 100,
        priceYer: newPriceYer ? Number(newPriceYer) : undefined,
        oldPriceYer: newOldPriceYer ? Number(newOldPriceYer) : undefined,
        category: newCategory as Product["category"],
        image:
          newImage || `https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600`,
      };
      setProducts([newProduct, ...products]);
    }
    closeForm();
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setNewName("");
    setNewPrice("");
    setNewOldPrice("");
    setNewPriceYer("");
    setNewOldPriceYer("");
    setNewImage("");
  };

  const openEditForm = (p: Product) => {
    setEditingId(p.id);
    setNewName(p.name);
    setNewPrice(p.price.toString());
    setNewOldPrice(p.oldPrice ? p.oldPrice.toString() : "");
    setNewPriceYer(p.priceYer ? p.priceYer.toString() : "");
    setNewOldPriceYer(p.oldPriceYer ? p.oldPriceYer.toString() : "");
    setNewCategory(p.category);
    setNewImage(p.image);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold">جاري التحميل...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-3xl border border-cream-deep p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand rounded-full text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">لوحة تحكم الإدارة</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              أدخل بيانات الاعتماد للوصول للإدارة
            </p>
          </div>
          {error && <div className="bg-discount/10 text-discount p-3 rounded-xl mb-4 text-sm font-bold">{error}</div>}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 pr-11 outline-none focus:border-brand"
                />
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 pr-11 outline-none focus:border-brand"
                />
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
              </div>
            </div>
            <button className="w-full bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3 shadow-lg mt-4 transition">
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-l border-cream-deep shrink-0 flex flex-col shadow-lg z-10 relative">
        <div className="p-6 border-b border-cream-deep flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand">أورا للعطور</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "overview"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <LayoutDashboard size={20} />
            <span>نظرة عامة</span>
          </button>
          <button
            onClick={() => setTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "products"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <Package size={20} />
            <span>المنتجات</span>
          </button>
          <button
            onClick={() => setTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "users"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <Users size={20} />
            <span>المستخدمين</span>
          </button>
          <button
            onClick={() => setTab("tracking")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "tracking"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <MapPin size={20} />
            <span>تتبع الطلبات</span>
          </button>
          <button
            onClick={() => setTab("shipping")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "shipping"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <Truck size={20} />
            <span>إعدادات الشحن</span>
          </button>
        </nav>
        <div className="p-4 border-t border-cream-deep mt-auto">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-discount hover:bg-discount/10 transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        {tab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="إجمالي الإيرادات" value="45,230 ر.س" icon={LayoutDashboard} />
              <StatCard title="عدد الطلبات" value="124" icon={Package} />
              <StatCard title="المنتجات النشطة" value={products.length.toString()} icon={Package} />
              <StatCard title="المستخدمين" value={realUsers.length.toString()} icon={Users} />
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-6 max-w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-brand text-white font-bold rounded-xl px-4 py-2 flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus size={18} />
                إضافة منتج
              </button>
            </div>

            <div className="bg-card rounded-2xl border border-cream-deep shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-cream-deep">
                <div className="relative max-w-sm">
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-2 pr-10 outline-none focus:border-brand"
                  />
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right min-w-[800px]">
                  <thead className="bg-cream-deep/40 text-muted-foreground border-b border-cream-deep">
                    <tr>
                      <th className="p-3 font-bold">المنتج</th>
                      <th className="p-3 font-bold">السعر (سعودي/يمني)</th>
                      <th className="p-3 font-bold">القسم</th>
                      <th className="p-3 font-bold text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-cream-deep last:border-0 hover:bg-cream-deep/20"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-contain bg-cream-deep/30"
                            />
                            <div>
                              <div className="font-bold">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-brand">
                          <div className="flex flex-col gap-1">
                            <span>
                              {fmt(p.price)} ر.س
                              {p.oldPrice > p.price && (
                                <span className="inline-block mr-2 text-[10px] text-muted-foreground line-through">
                                  {fmt(p.oldPrice)} ر.س
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-foreground/80">
                              {fmt(p.priceYer || p.price * 142)} ر.ي
                              {p.oldPriceYer || p.oldPrice > p.price ? (
                                <span className="inline-block mr-2 text-[9px] text-muted-foreground line-through">
                                  {fmt(p.oldPriceYer || p.oldPrice * 142)} ر.ي
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {p.category === "men"
                            ? "رجالي"
                            : p.category === "women"
                              ? "نسائي"
                              : p.category === "unisex"
                                ? "للجنسين"
                                : "بخور"}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditForm(p)}
                              className="w-8 h-8 rounded-lg bg-cream-deep/60 flex items-center justify-center text-brand-dark hover:bg-cream-deep"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="w-8 h-8 rounded-lg bg-discount/10 flex items-center justify-center text-discount hover:bg-discount/20"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-6 max-w-full">
            <h1 className="text-2xl font-bold">المستخدمين المسجلين</h1>
            <div className="bg-card rounded-2xl border border-cream-deep shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right min-w-[700px]">
                  <thead className="bg-cream-deep/40 text-muted-foreground border-b border-cream-deep">
                    <tr>
                      <th className="p-3 font-bold">الاسم</th>
                      <th className="p-3 font-bold">البريد الإلكتروني</th>
                      <th className="p-3 font-bold">الجوال</th>
                      <th className="p-3 font-bold">تاريخ التسجيل</th>
                      <th className="p-3 font-bold">عدد الطلبات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realUsers.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center">لا يوجد مستخدمين بعد</td></tr>
                    ) : realUsers.map((u) => (
                      <tr
                        key={u.uid}
                        className="border-b border-cream-deep last:border-0 hover:bg-cream-deep/20"
                      >
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3 text-muted-foreground">{u.email}</td>
                        <td className="p-3 text-muted-foreground" dir="ltr">
                          {u.phone || "غير محدد"}
                        </td>
                        <td className="p-3 text-muted-foreground">
                           {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('ar-SA') : "جديد"}
                        </td>
                        <td className="p-3 font-bold">0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "tracking" && (
          <div className="space-y-6 max-w-full">
            <h1 className="text-2xl font-bold">إدارة تتبع الطلبات</h1>
            <div className="bg-card rounded-2xl border border-cream-deep shadow-sm p-6">
              <p className="text-muted-foreground mb-6">قم بتحديث حالة شحنات العملاء أو إضافة أرقام التتبع لشركات الشحن.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right min-w-[700px]">
                  <thead className="bg-cream-deep/40 text-muted-foreground border-b border-cream-deep">
                    <tr>
                      <th className="p-3 font-bold">رقم الطلب</th>
                      <th className="p-3 font-bold">العميل</th>
                      <th className="p-3 font-bold">الحالة الحالية</th>
                      <th className="p-3 font-bold">تحديث الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-cream-deep hover:bg-cream-deep/20">
                      <td className="p-3 font-bold">#ORD-88219</td>
                      <td className="p-3">أحمد محمد</td>
                      <td className="p-3"><span className="bg-badge-orange/15 text-badge-orange px-2 py-1 rounded text-xs font-bold">قيد التوصيل</span></td>
                      <td className="p-3">
                        <select className="bg-cream-deep/40 border border-cream-deep rounded-lg px-2 py-1 text-xs">
                          <option>قيد التوصيل</option>
                          <option>تم التوصيل</option>
                          <option>مسترجع</option>
                        </select>
                      </td>
                    </tr>
                    <tr className="border-b border-cream-deep hover:bg-cream-deep/20">
                      <td className="p-3 font-bold">#ORD-88220</td>
                      <td className="p-3">فاطمة علي</td>
                      <td className="p-3"><span className="bg-brand/15 text-brand px-2 py-1 rounded text-xs font-bold">جاري التجهيز</span></td>
                      <td className="p-3">
                        <select className="bg-cream-deep/40 border border-cream-deep rounded-lg px-2 py-1 text-xs">
                          <option>جاري التجهيز</option>
                          <option>تم الشحن</option>
                          <option>ملغي</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "shipping" && (
          <div className="space-y-6 max-w-full">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">إعدادات الشحن والتوصيل</h1>
              <button className="bg-brand text-white font-bold rounded-xl px-4 py-2 shadow-lg">حفظ التغييرات</button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-cream-deep shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="text-brand"/> مناطق التوصيل</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-cream-deep pb-3">
                    <div>
                      <p className="font-bold">الرياض</p>
                      <p className="text-xs text-muted-foreground">توصيل سريع</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue="25" className="w-16 bg-cream-deep/40 border border-cream-deep rounded-lg px-2 py-1 text-center" />
                      <span className="text-xs">ر.س</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-cream-deep pb-3">
                    <div>
                      <p className="font-bold">باقي مدن المملكة</p>
                      <p className="text-xs text-muted-foreground">3 - 5 أيام</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue="35" className="w-16 bg-cream-deep/40 border border-cream-deep rounded-lg px-2 py-1 text-center" />
                      <span className="text-xs">ر.س</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl border border-cream-deep shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Truck className="text-brand"/> شركات الشحن المرتبطة</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-brand bg-brand/5 rounded-xl cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-brand" />
                    <span className="font-bold">أرامكس (Aramex)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-cream-deep rounded-xl cursor-pointer hover:bg-cream-deep/20">
                    <input type="checkbox" defaultChecked className="accent-brand" />
                    <span className="font-bold">سمسا (SMSA)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-cream-deep rounded-xl cursor-pointer hover:bg-cream-deep/20">
                    <input type="checkbox" className="accent-brand" />
                    <span className="font-bold">مندوب خاص (داخل الرياض)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl border border-cream-deep p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={closeForm}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-cream-deep/50 flex items-center justify-center hover:bg-cream-deep"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-6">
              {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المنتج</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-3 py-2 outline-none focus:border-brand"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">السعر (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-3 py-2 outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">السعر القديم (ر.س)</label>
                  <input
                    type="number"
                    value={newOldPrice}
                    onChange={(e) => setNewOldPrice(e.target.value)}
                    placeholder="اختياري"
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-3 py-2 outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">السعر (ر.ي)</label>
                  <input
                    type="number"
                    value={newPriceYer}
                    onChange={(e) => setNewPriceYer(e.target.value)}
                    placeholder="اختياري"
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-3 py-2 outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">السعر القديم (ر.ي)</label>
                  <input
                    type="number"
                    value={newOldPriceYer}
                    onChange={(e) => setNewOldPriceYer(e.target.value)}
                    placeholder="اختياري"
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-3 py-2 outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">القسم</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-3 py-2 outline-none focus:border-brand"
                >
                  <option value="men">رجالي</option>
                  <option value="women">نسائي</option>
                  <option value="unisex">للجنسين</option>
                  <option value="bakhoor">بخور وعود</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">رابط الصورة</label>
                <input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="اختياري"
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-3 py-2 outline-none focus:border-brand"
                />
              </div>
              <button className="w-full bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3 shadow-lg mt-2">
                {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <div className="bg-card rounded-2xl border border-cream-deep p-5 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-cream-deep rounded-xl flex items-center justify-center text-brand">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-muted-foreground text-sm mb-1">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
