import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Minus, Plus } from "lucide-react";
import { allProducts, featuredProduct } from "@/data/products";
import { useCart, fmt } from "@/lib/cart";

export const Route = createFileRoute("/products/$id")({ component: ProductDetail });

function ProductDetail() {
  const { id } = Route.useParams();
  const product = allProducts.find((p) => p.id === id) || featuredProduct;
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const saved = product.oldPrice - product.price;

  return (
    <div className="px-3 md:px-6 py-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="relative bg-card rounded-3xl border border-cream-deep p-8 shadow-sm">
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center">
            <Search size={18} />
          </button>
          <img src={product.image} alt={product.name} className="w-full h-[420px] object-contain" />
        </div>

        {/* Info */}
        <div className="bg-card rounded-3xl border border-cream-deep p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
            {product.name}
          </h1>

          <div className="mt-5 bg-cream-deep/40 rounded-2xl px-5 py-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground line-through text-sm">
                {fmt(product.oldPrice)} ر.س
              </span>
              <span className="text-brand text-3xl font-bold">{fmt(product.price)} ر.س</span>
            </div>
            <div className="flex items-center justify-between border-t border-cream-deep/50 pt-2">
              <span className="text-muted-foreground/70 line-through text-xs">
                {fmt(product.oldPriceYer || product.oldPrice * 142)} ر.ي
              </span>
              <span className="text-foreground/80 text-lg font-bold">
                {fmt(product.priceYer || product.price * 142)} ر.ي
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center bg-card border border-cream-deep rounded-xl">
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center"
              >
                <Minus size={16} />
              </button>
            </div>
            <button
              onClick={() => add(product, qty)}
              className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3 shadow-lg"
            >
              إضافة إلى السلة
            </button>
          </div>

          <div className="mt-6 text-sm space-y-1 border-t border-dashed border-cream-deep pt-5">
            <p>
              <span className="text-muted-foreground">رمز المنتج:</span> {product.id}
            </p>
            <p>
              <span className="text-muted-foreground">التصنيفات:</span> أمواج، الأكثر مبيعا، عطور
              النيش، عطور مميزة
            </p>
            <p>
              <span className="text-muted-foreground">العلامة التجارية:</span>{" "}
              {product.brand || "أورا للعطور"}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm">
            <span>وفر {fmt(saved)} ر.س</span>
            <span className="bg-cream-deep text-brand-dark font-bold rounded-full px-3 py-1">
              خصم {discount}%
            </span>
          </div>

          <div className="mt-6 border-2 border-cream-deep rounded-2xl p-5">
            <h3 className="text-brand font-bold mb-2">الوصف المختصر :</h3>
            <p className="text-sm leading-relaxed text-foreground/80">
              {product.shortDescription ||
                "عطر فاخر يجسد الرقي والأناقة، مصمم خصيصاً ليترك أثراً لا ينسى ويعكس شخصيتك الفريدة."}
            </p>
          </div>
        </div>
      </div>

      {/* Description sections */}
      <div className="max-w-6xl mx-auto mt-8 bg-card rounded-3xl border border-cream-deep p-6 md:p-10">
        <div className="flex justify-end mb-6">
          <span className="bg-brand text-white px-6 py-1.5 rounded-full font-bold">الوصف</span>
        </div>

        <Section title="الوصف التفصيلي:">
          عطر حصري وجذاب يمزج بين النفحات العطرية الفاخرة التي تدوم طويلاً، مما يمنحك شعوراً بالثقة
          والانتعاش طوال اليوم. مصمم بعناية فائقة من أجود المكونات الطبيعية والزيوت العطرية النقية
          ليكون رفيقك في جميع المناسبات الرسمية والخاصة.
        </Section>
        <Section title="تركيبة العطر:">
          <p>المقدمة: الحمضيات والبرغموت لافتتاحية منعشة</p>
          <p>القلب: مزيج الزهور الشرقية والأخشاب النادرة</p>
          <p>القاعدة: العنبر والفانيليا والمسك الأبيض لثبات يدوم طويلاً</p>
        </Section>
        <Section title="مميزات العطر:">
          <ul className="list-disc pr-5 space-y-1">
            <li>ثبات ممتاز وفوحان عالٍ يلفت الانتباه</li>
            <li>طابع عطري يناسب أصحاب الذوق الرفيع</li>
            <li>زجاجة أنيقة وعصرية تناسب الإهداء</li>
          </ul>
        </Section>
        <Section title="استخدامات العطر:">مناسب للاستخدام اليومي وللمناسبات الخاصة.</Section>
        <Section title="الفئة المستهدفة:">مناسب لكلا الجنسين (حسب تشكيلة العطر).</Section>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/cart"
          className="inline-block bg-brand text-white rounded-full px-8 py-3 font-bold"
        >
          عرض السلة
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-cream-deep py-5">
      <h3 className="text-brand font-bold mb-3 text-lg">{title}</h3>
      <div className="text-sm leading-relaxed text-foreground/80 space-y-2">{children}</div>
    </div>
  );
}
