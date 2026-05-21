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
} from "lucide-react";
import { allProducts, type Product } from "@/data/products";
import { fmt } from "@/lib/cart";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم الإدارة — أورا للعطور" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type AdminTab = "overview" | "products" | "users";

const mockUsers = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966-500000001",
    date: "2026/05/15",
    orders: 3,
  },
  {
    id: 2,
    name: "سالم عبدالله",
    email: "salim@example.com",
    phone: "+966-500000002",
    date: "2026/05/10",
    orders: 1,
  },
  {
    id: 3,
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966-500000003",
    date: "2026/04/28",
    orders: 5,
  },
  {
    id: 4,
    name: "عمر خالد",
    email: "omar@example.com",
    phone: "+966-500000004",
    date: "2026/04/12",
    orders: 0,
  },
];

function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [tab, setTab] = useState<AdminTab>("overview");

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

  if (!isAdminLoggedIn) {
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAdminLoggedIn(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  defaultValue="admin@store.com"
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
                  defaultValue="admin123"
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
        </nav>
        <div className="p-4 border-t border-cream-deep mt-auto">
          <button
            onClick={() => setIsAdminLoggedIn(false)}
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
              <StatCard title="المستخدمين" value={mockUsers.length.toString()} icon={Users} />
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
                    {mockUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-cream-deep last:border-0 hover:bg-cream-deep/20"
                      >
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3 text-muted-foreground">{u.email}</td>
                        <td className="p-3 text-muted-foreground" dir="ltr">
                          {u.phone}
                        </td>
                        <td className="p-3 text-muted-foreground">{u.date}</td>
                        <td className="p-3 font-bold">{u.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
