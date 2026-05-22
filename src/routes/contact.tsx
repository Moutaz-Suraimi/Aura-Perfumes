import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا — أورا للعطور" },
      { name: "description", content: "تواصل مع فريق أورا للعطور عبر الهاتف، البريد، أو نموذج الاتصال." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brand mb-4">تواصل معنا</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لخدمتك! إذا كان لديك أي استفسارات أو ملاحظات، لا تتردد في التواصل معنا. فريق خدمة
            العملاء لدينا متواجد دائماً للرد على أسئلتك.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-card border border-cream-deep p-6 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 bg-cream-deep rounded-full flex items-center justify-center shrink-0 text-brand">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">اتصل بنا</h3>
                <p className="text-muted-foreground text-sm mb-2">من الأحد إلى الخميس، 9 صباحاً - 9 مساءً</p>
                <p className="font-bold" dir="ltr">+966 50 000 0000</p>
              </div>
            </div>

            <div className="bg-card border border-cream-deep p-6 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 bg-cream-deep rounded-full flex items-center justify-center shrink-0 text-brand">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                <p className="text-muted-foreground text-sm mb-2">للاستفسارات العامة والدعم الفني</p>
                <p className="font-bold">support@auraperfumes.com</p>
              </div>
            </div>

            <div className="bg-card border border-cream-deep p-6 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 bg-cream-deep rounded-full flex items-center justify-center shrink-0 text-brand">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">مقرنا</h3>
                <p className="text-muted-foreground text-sm">
                  الرياض، المملكة العربية السعودية<br />
                  شارع العليا، حي الياسمين
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-cream-deep rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">أرسل رسالة</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد"
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">رقم الطلب (اختياري)</label>
                <input
                  type="text"
                  placeholder="#ORD-12345"
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">الرسالة</label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full bg-cream-deep/40 border border-cream-deep rounded-xl px-4 py-3 outline-none focus:border-brand resize-none"
                ></textarea>
              </div>
              <button className="w-full bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3 shadow-lg flex items-center justify-center gap-2 transition">
                <Send size={18} />
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
