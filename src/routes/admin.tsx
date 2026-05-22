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
  Landmark,
  FileText,
  PieChart,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { allProducts, type Product } from "@/data/products";
import { fmt } from "@/lib/cart";
import { useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getUserProfile, UserProfile, getAllOrders, updateOrderStatus, getBankAccounts, saveBankAccounts, Order, BankAccount } from "@/lib/db";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم الإدارة — أورا للعطور" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type AdminTab = "overview" | "products" | "users" | "tracking" | "shipping" | "orders" | "bank" | "analytics";

function AdminDashboard() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<AdminTab>("overview");
  const [realUsers, setRealUsers] = useState<UserProfile[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

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
        try {
          const profile = await getUserProfile(u.uid);
          if (profile?.role === "admin" || u.email === "waelmoutaz297@gmail.com") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
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
    if (isAdmin) {
      if (tab === "users") {
        const fetchUsers = async () => {
          const q = query(collection(db, "users"));
          const snap = await getDocs(q);
          const usersList: UserProfile[] = [];
          snap.forEach(doc => usersList.push(doc.data() as UserProfile));
          setRealUsers(usersList);
        };
        fetchUsers();
      } else if (tab === "orders" || tab === "overview" || tab === "analytics") {
        getAllOrders().then(setAllOrders);
      } else if (tab === "bank") {
        getBankAccounts().then(setBankAccounts);
      }
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

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    try {
      await updateOrderStatus(orderId, status);
      setAllOrders(allOrders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e) {
      alert("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  const handleSaveBank = async () => {
    try {
      await saveBankAccounts(bankAccounts);
      alert("تم حفظ الحسابات البنكية بنجاح!");
    } catch (e) {
      alert("حدث خطأ أثناء حفظ الحسابات");
    }
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
            onClick={() => setTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "orders"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <FileText size={20} />
            <span>الطلبات</span>
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
          <button
            onClick={() => setTab("bank")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "bank"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <Landmark size={20} />
            <span>الحسابات البنكية</span>
          </button>
          <button
            onClick={() => setTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              tab === "analytics"
                ? "bg-brand text-white shadow-md"
                : "hover:bg-cream-deep text-foreground/80"
            }`}
          >
            <PieChart size={20} />
            <span>التحليلات</span>
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

        {tab === "orders" && (
          <div className="space-y-6 max-w-full">
            <h1 className="text-2xl font-bold">إدارة الطلبات الحقيقية</h1>
            <div className="bg-card rounded-2xl border border-cream-deep shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right min-w-[900px]">
                  <thead className="bg-cream-deep/40 text-muted-foreground border-b border-cream-deep">
                    <tr>
                      <th className="p-3 font-bold">رقم الطلب</th>
                      <th className="p-3 font-bold">العميل</th>
                      <th className="p-3 font-bold">التفاصيل</th>
                      <th className="p-3 font-bold">المبلغ</th>
                      <th className="p-3 font-bold">الحالة</th>
                      <th className="p-3 font-bold">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.length === 0 && (
                      <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">لا توجد طلبات حالياً</td></tr>
                    )}
                    {allOrders.map(o => (
                      <tr key={o.id} className="border-b border-cream-deep hover:bg-cream-deep/20">
                        <td className="p-3 font-bold text-brand">{o.id}</td>
                        <td className="p-3">
                          <div className="font-bold">{o.customerName}</div>
                          <div className="text-xs text-muted-foreground" dir="ltr">{o.customerPhone}</div>
                          <div className="text-xs text-muted-foreground">{o.customerCity}</div>
                        </td>
                        <td className="p-3">
                          <ul className="text-xs space-y-1">
                            {o.items.map((i, idx) => (
                              <li key={idx}>- {i.name} (x{i.qty})</li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-3 font-bold text-brand">{fmt(o.total)} ر.س</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            o.status === "pending" ? "bg-discount/15 text-discount" :
                            o.status === "processing" ? "bg-badge-orange/15 text-badge-orange" :
                            o.status === "delivered" ? "bg-badge-green/15 text-badge-green" :
                            "bg-foreground/15 text-foreground"
                          }`}>
                            {o.status === "pending" ? "قيد التحقق (في انتظار الحوالة)" :
                             o.status === "processing" ? "قيد التنفيذ/الشحن" :
                             o.status === "delivered" ? "تم التوصيل" : "ملغي"}
                          </span>
                        </td>
                        <td className="p-3">
                          <select 
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id!, e.target.value)}
                            className="bg-cream-deep/40 border border-cream-deep rounded-lg px-2 py-1 text-xs outline-none focus:border-brand"
                          >
                            <option value="pending">قيد التحقق</option>
                            <option value="processing">قيد التنفيذ</option>
                            <option value="delivered">تم التوصيل</option>
                            <option value="cancelled">إلغاء الطلب</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "bank" && (
          <div className="space-y-6 max-w-full">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">الحسابات البنكية للمتجر</h1>
              <button onClick={handleSaveBank} className="bg-brand text-white font-bold rounded-xl px-4 py-2 shadow-lg hover:bg-brand-dark transition">حفظ التغييرات</button>
            </div>
            
            <div className="bg-card rounded-2xl border border-cream-deep shadow-sm p-6 space-y-4">
              <p className="text-muted-foreground text-sm">أضف حساباتك البنكية ليتمكن العملاء من التحويل إليها عند الطلب. يمكنك إضافة أكثر من حساب.</p>
              
              {bankAccounts.map((acc, idx) => (
                <div key={idx} className="border border-cream-deep rounded-xl p-4 bg-cream-deep/20 relative grid md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== idx))}
                    className="absolute top-2 left-2 text-discount bg-discount/10 p-1.5 rounded-lg hover:bg-discount/20"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div>
                    <label className="block text-xs font-bold mb-1">اسم البنك</label>
                    <input 
                      value={acc.bankName}
                      onChange={e => { const newAccs = [...bankAccounts]; newAccs[idx].bankName = e.target.value; setBankAccounts(newAccs); }}
                      className="w-full bg-background border border-cream-deep rounded-lg px-3 py-2 outline-none focus:border-brand"
                      placeholder="مثال: البنك الأهلي السعودي"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">اسم صاحب الحساب</label>
                    <input 
                      value={acc.accountName}
                      onChange={e => { const newAccs = [...bankAccounts]; newAccs[idx].accountName = e.target.value; setBankAccounts(newAccs); }}
                      className="w-full bg-background border border-cream-deep rounded-lg px-3 py-2 outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">رقم الحساب</label>
                    <input 
                      value={acc.accountNumber}
                      onChange={e => { const newAccs = [...bankAccounts]; newAccs[idx].accountNumber = e.target.value; setBankAccounts(newAccs); }}
                      className="w-full bg-background border border-cream-deep rounded-lg px-3 py-2 outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">الآيبان (IBAN)</label>
                    <input 
                      value={acc.iban}
                      onChange={e => { const newAccs = [...bankAccounts]; newAccs[idx].iban = e.target.value; setBankAccounts(newAccs); }}
                      className="w-full bg-background border border-cream-deep rounded-lg px-3 py-2 outline-none focus:border-brand text-left"
                      dir="ltr"
                      placeholder="SA..."
                    />
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setBankAccounts([...bankAccounts, { bankName: "", accountName: "", accountNumber: "", iban: "" }])}
                className="w-full border-2 border-dashed border-brand/50 text-brand font-bold py-3 rounded-xl hover:bg-brand/5 transition flex items-center justify-center gap-2"
              >
                <Plus size={18} /> إضافة حساب جديد
              </button>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-6 max-w-full">
            <h1 className="text-2xl font-bold mb-6">التحليلات والرسوم البيانية</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-2xl border border-cream-deep p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-badge-green/15 text-badge-green flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="font-bold text-muted-foreground text-sm">إجمالي الأرباح الشهرية</h3>
                </div>
                <p className="text-2xl font-bold text-brand">{fmt(allOrders.filter(o => o.status !== "cancelled").reduce((acc, curr) => acc + curr.total, 0))} ر.س</p>
                <p className="text-xs text-badge-green font-bold mt-2 flex items-center gap-1"><TrendingUp size={12}/> +12% عن الشهر الماضي</p>
              </div>

              <div className="bg-card rounded-2xl border border-cream-deep p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-badge-orange/15 text-badge-orange flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <h3 className="font-bold text-muted-foreground text-sm">الطلبات المعلقة</h3>
                </div>
                <p className="text-2xl font-bold">{allOrders.filter(o => o.status === "pending").length}</p>
                <p className="text-xs text-muted-foreground mt-2">تحتاج إلى المراجعة وتأكيد الحوالة</p>
              </div>

              <div className="bg-card rounded-2xl border border-cream-deep p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-brand/15 text-brand flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <h3 className="font-bold text-muted-foreground text-sm">أفضل العملاء (شراءً)</h3>
                </div>
                <div className="space-y-2 mt-2">
                  {/* Mock top customers logic based on real users/orders would go here. Showing static for UI demo */}
                  <div className="flex justify-between items-center text-sm"><span className="font-bold">أحمد محمد</span><span className="text-brand">1,450 ر.س</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="font-bold">سارة خالد</span><span className="text-brand">890 ر.س</span></div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-cream-deep p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-discount/15 text-discount flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="font-bold text-muted-foreground text-sm">مصادر الزيارات</h3>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-sm"><span>Instagram</span><span className="font-bold">45%</span></div>
                  <div className="flex justify-between items-center text-sm"><span>WhatsApp</span><span className="font-bold">30%</span></div>
                  <div className="flex justify-between items-center text-sm"><span>Google Search</span><span className="font-bold">25%</span></div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-cream-deep p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-6">المنتجات الأكثر مبيعاً هذا الأسبوع</h3>
                <div className="space-y-4">
                  {/* Mock Bar Chart */}
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>عطر منتصف الليل</span><span className="font-bold">42 طلب</span></div>
                    <div className="w-full h-3 bg-cream-deep rounded-full overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>عود ملكي</span><span className="font-bold">28 طلب</span></div>
                    <div className="w-full h-3 bg-cream-deep rounded-full overflow-hidden">
                      <div className="h-full bg-brand/80 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>زهرة الأوركيد</span><span className="font-bold">15 طلب</span></div>
                    <div className="w-full h-3 bg-cream-deep rounded-full overflow-hidden">
                      <div className="h-full bg-brand/60 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-cream-deep p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex justify-between">
                  <span>رسائل التنبيهات الجماعية</span>
                  <span className="text-xs bg-badge-orange/20 text-badge-orange px-2 py-1 rounded-full">قريباً</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  هذه الميزة ستسمح لك بإرسال رسائل WhatsApp أو إيميلات جماعية لعملائك المميزين لإبلاغهم بالعروض الجديدة. (تتطلب ربط بخدمات خارجية)
                </p>
                <div className="space-y-3 opacity-60 pointer-events-none">
                  <textarea className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl p-3 outline-none" rows={3} placeholder="اكتب رسالتك هنا..."></textarea>
                  <button className="bg-brand text-white font-bold px-6 py-2 rounded-xl w-full">إرسال لجميع العملاء</button>
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
