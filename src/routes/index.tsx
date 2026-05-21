import { createFileRoute } from "@tanstack/react-router";
import { HeroBanner, PromoBanner } from "@/components/HeroBanner";
import { CategoryCircles } from "@/components/CategoryCircles";
import { SectionTitle } from "@/components/SectionTitle";
import { ProductRow } from "@/components/ProductRow";
import { BrandsRow } from "@/components/BrandsRow";
import { FeaturesStrip } from "@/components/FeaturesStrip";
import {
  bestSellers,
  todayDeals,
  newest,
  menPerfumes,
  giftSets,
  expertPicks,
  womenPerfumes,
  unisex,
  luxurySets,
  bakhoor,
  featuredSections,
} from "@/data/products";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryCircles />

      <SectionTitle title="الأكثر مبيعاً" accent="مبيعاً" />
      <ProductRow products={bestSellers} />

      <PromoBanner
        title="عروض وخصومات مميزة"
        desc="اكتشف أجمل العطور الأصلية بأسعار خاصة لفترة محدودة واستمتع بتجربة تسوق فاخرة."
        cta="تسوق العروض"
      />

      <SectionTitle title="عروض اليوم" accent="اليوم" />
      <ProductRow products={todayDeals} />

      <SectionTitle title="أحدث المنتجات" accent="المنتجات" />
      <ProductRow products={newest} />

      <SectionTitle title="عطور رجالية" accent="رجالية" />
      <ProductRow products={menPerfumes} />

      <SectionTitle title="ماركات عالمية مختارة" accent="عالمية" />
      <BrandsRow />

      <SectionTitle title="أقسام مميزة" accent="مميزة" />
      <CategoryCircles items={featuredSections} />

      <PromoBanner
        title="عالم البخور الفاخر"
        desc="روائح شرقية أصيلة تضيف لمسة فخامة لمنزلك"
        cta="تسوق البخور"
      />
      <ProductRow products={bakhoor} />

      <PromoBanner
        title="باقات الهدايا العطرية"
        desc="اختر الهدية المثالية لمن تحب — عرض خاص على باقات العطور"
        cta="تسوق الآن"
      />
      <ProductRow products={giftSets} />

      <SectionTitle title="عطور نسائية" accent="نسائية" />
      <ProductRow products={womenPerfumes} />

      <SectionTitle title="عطور للجنسين" accent="للجنسين" />
      <ProductRow products={unisex} />

      <PromoBanner
        title="باقات العطور الفاخرة"
        desc="اختر الهدية المثالية لمن تحب"
        cta="تسوق الباقات"
      />
      <ProductRow products={luxurySets} />

      <SectionTitle title="ترشيح الخبراء" accent="الخبراء" />
      <ProductRow products={expertPicks} />

      <FeaturesStrip />
    </div>
  );
}
