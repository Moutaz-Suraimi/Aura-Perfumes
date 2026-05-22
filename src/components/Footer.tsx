import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0e0e0e] text-white pt-16 pb-8 px-4 border-t border-cream-deep/20 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <Card title="أورا للعطور">
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            وجهتك الأولى للعطور الفاخرة. نقدم لك تشكيلة واسعة من أرقى العطور التي تناسب جميع الأذواق
            والمناسبات.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-brand transition"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-brand transition"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-brand transition"
            >
              <Facebook size={18} />
            </a>
          </div>
        </Card>

        <Card title="أقسام المتجر">
          <ul className="space-y-3 text-white/70 text-sm">
            <li>
              <Link
                to="/products"
                search={{ category: "men" }}
                className="hover:text-brand transition"
              >
                عطور رجالية
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: "women" }}
                className="hover:text-brand transition"
              >
                عطور نسائية
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: "unisex" }}
                className="hover:text-brand transition"
              >
                عطور للجنسين
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: "bakhoor" }}
                className="hover:text-brand transition"
              >
                بخور وعود
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: "all" }}
                className="hover:text-brand transition"
              >
                جميع المنتجات
              </Link>
            </li>
          </ul>
        </Card>

        <Card title="خدمة العملاء">
          <ul className="space-y-3 text-white/70 text-sm">
            <li>
              <Link to="/account" className="hover:text-brand transition">
                تتبع الطلب
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-brand transition">
                الشحن والتوصيل
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-brand transition">
                سياسة الاسترجاع
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-brand transition">
                الأسئلة الشائعة
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand transition">
                تواصل معنا
              </Link>
            </li>
          </ul>
        </Card>

        <Card title="تواصل معنا">
          <ul className="space-y-4 text-white/70 text-sm">
            <li className="flex gap-3">
              <Phone className="text-brand shrink-0" size={18} />
              <span dir="ltr">+966 50 000 0000</span>
            </li>
            <li className="flex gap-3">
              <Mail className="text-brand shrink-0" size={18} />
              <span>support@auraperfumes.com</span>
            </li>
            <li className="flex gap-3">
              <MapPin className="text-brand shrink-0" size={18} />
              <span>الرياض، المملكة العربية السعودية</span>
            </li>
          </ul>
        </Card>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/50 text-xs">© 2026 أورا للعطور. جميع الحقوق محفوظة.</p>
        <div className="flex gap-4 opacity-50">
          <div className="w-10 h-6 bg-card border-t border-border/20 rounded"></div>
          <div className="w-10 h-6 bg-card border-t border-border/20 rounded"></div>
          <div className="w-10 h-6 bg-card border-t border-border/20 rounded"></div>
        </div>
      </div>
    </footer>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-6 relative inline-block">
        {title}
        <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-brand"></span>
      </h3>
      {children}
    </div>
  );
}
