import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart, fmt } from "@/lib/cart";
import { useState, useEffect } from "react";
import { getBankAccounts, createOrder, getUserProfile, BankAccount } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Building2, Landmark, CheckCircle2, User, ChevronRight, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "إتمام الطلب — أورا للعطور" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const STORE_WHATSAPP = "+966500000000"; // يمكن تغييره لاحقاً

  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate({ to: "/cart" });
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUserId(u.uid);
        const profile = await getUserProfile(u.uid);
        if (profile) {
          if (!name) setName(profile.name);
          if (!phone) setPhone(profile.phone || "");
          if (!city) setCity(profile.city || "");
        }
      }
    });

    getBankAccounts().then((accounts) => setBankAccounts(accounts || []));

    return unsub;
  }, [items.length, navigate, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        userId: userId || "guest",
        customerName: name,
        customerPhone: phone,
        customerCity: city,
        customerAddress: address,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          qty: i.qty,
          image: i.product.image
        })),
        total,
        status: "pending" as const,
      };

      const newOrderId = await createOrder(orderData);
      setOrderId(newOrderId);
      setSuccess(true);
      clear();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إتمام الطلب، يرجى المحاولة لاحقاً.");
    }
    setLoading(false);
  };

  const handleWhatsApp = () => {
    const text = `مرحباً أورا للعطور،\nأريد تأكيد طلبي رقم: ${orderId}\nالإجمالي: ${fmt(total)} ر.س\n\nالاسم: ${name}\nالمدينة: ${city}\nالهاتف: ${phone}`;
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-24 h-24 bg-badge-green/20 rounded-full flex items-center justify-center text-badge-green mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-center">تم استلام طلبك بنجاح!</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
          شكراً لتسوقك معنا. طلبك الآن قيد المراجعة. رقم الطلب الخاص بك هو <span className="font-bold text-foreground text-brand">{orderId}</span>
        </p>

        <div className="bg-card border border-cream-deep p-6 rounded-2xl w-full max-w-md mb-8 space-y-4">
          <h3 className="font-bold text-lg mb-4 text-center">الخطوة الأخيرة</h3>
          <p className="text-sm text-center mb-4 text-muted-foreground">
            يرجى إرسال إيصال الحوالة البنكية وتأكيد الطلب عبر الواتساب للبدء في تجهيز شحنتك فوراً.
          </p>
          <button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl py-4 shadow-lg transition flex items-center justify-center gap-3"
          >
            <MessageCircle size={24} />
            أرسل الطلب وإيصال الدفع عبر الواتساب
          </button>
        </div>

        <Link
          to="/"
          className="text-brand font-bold hover:underline"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 py-8 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate({ to: "/cart" })} className="flex items-center gap-2 text-muted-foreground hover:text-brand font-bold mb-6 transition">
          <ChevronRight size={20} /> العودة للسلة
        </button>
        <h1 className="text-2xl md:text-3xl font-bold mb-8">إتمام الطلب</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-1 space-y-8">
            {/* Customer Details */}
            <div className="bg-card rounded-3xl border border-cream-deep p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                بيانات المستلم
              </h2>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                    placeholder="أدخل الاسم الثلاثي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">رقم الجوال</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand text-left"
                    dir="ltr"
                    placeholder="+966 50 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">المدينة</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                    placeholder="مثال: الرياض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">العنوان التفصيلي</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                    placeholder="اسم الشارع، الحي، رقم المبنى"
                  />
                </div>
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="bg-card rounded-3xl border border-cream-deep p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                  <Landmark size={20} />
                </div>
                الحسابات البنكية للمتجر
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                يرجى تحويل إجمالي مبلغ الطلب ({fmt(total)} ر.س) إلى أحد حساباتنا البنكية التالية. بعد إتمام التحويل اضغط على تأكيد الطلب للبدء بالتجهيز.
              </p>

              {bankAccounts.length === 0 ? (
                <div className="p-4 bg-discount/10 text-discount rounded-xl text-sm font-bold text-center">
                  يتم حالياً تحديث الحسابات البنكية، يمكنك تأكيد الطلب وسنتواصل معك لتزويدك بالحساب.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {bankAccounts.map((account, idx) => (
                    <div key={idx} className="border border-cream-deep bg-cream-deep/20 rounded-2xl p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition"></div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Building2 size={18} className="text-brand" />
                        {account.bankName}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">اسم الحساب:</span>
                          <span className="font-bold">{account.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">رقم الحساب:</span>
                          <span className="font-bold">{account.accountNumber}</span>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-muted-foreground">الآيبان:</span>
                          <span className="font-bold text-left bg-background p-2 rounded-lg border border-cream-deep text-xs" dir="ltr">{account.iban}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-bold rounded-xl py-4 shadow-lg transition-transform active:scale-[0.98] text-lg"
            >
              {loading ? "جاري المعالجة..." : "تأكيد الطلب"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="w-full lg:w-[350px] shrink-0">
            <div className="bg-card rounded-3xl border border-cream-deep p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} className="w-16 h-16 bg-cream-deep/30 rounded-xl object-contain" alt="" />
                    <div className="flex-1 min-w-0 py-1">
                      <p className="text-sm font-bold line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">الكمية: {item.qty}</p>
                      <p className="text-brand font-bold text-sm mt-1">{fmt(item.product.price * item.qty)} ر.س</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm mb-6 border-t border-cream-deep pt-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-bold">{fmt(total)} ر.س</span>
                </div>
                <div className="flex justify-between text-badge-green font-bold">
                  <span>رسوم الشحن</span>
                  <span>مجاني</span>
                </div>
              </div>
              <div className="border-t border-dashed border-cream-deep pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">الإجمالي المطلوب</span>
                  <span className="font-bold text-brand text-2xl">{fmt(total)} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
