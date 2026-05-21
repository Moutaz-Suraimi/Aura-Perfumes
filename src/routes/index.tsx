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

      <SectionTitle title="Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹" accent="Ù…Ø¨ÙŠØ¹Ø§Ù‹" />
      <ProductRow products={bestSellers} />

      <PromoBanner
        title="Ø¹Ø±ÙˆØ¶ ÙˆØ®ØµÙˆÙ…Ø§Øª Ù…Ù…ÙŠØ²Ø©"
        desc="Ø§ÙƒØªØ´Ù Ø£Ø¬Ù…Ù„ Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„Ø£ØµÙ„ÙŠØ© Ø¨Ø£Ø³Ø¹Ø§Ø± Ø®Ø§ØµØ© Ù„ÙØªØ±Ø© Ù…Ø­Ø¯ÙˆØ¯Ø© ÙˆØ§Ø³ØªÙ…ØªØ¹ Ø¨ØªØ¬Ø±Ø¨Ø© ØªØ³ÙˆÙ‚ ÙØ§Ø®Ø±Ø©."
        cta="ØªØ³ÙˆÙ‚ Ø§Ù„Ø¹Ø±ÙˆØ¶"
      />

      <SectionTitle title="Ø¹Ø±ÙˆØ¶ Ø§Ù„ÙŠÙˆÙ…" accent="Ø§Ù„ÙŠÙˆÙ…" />
      <ProductRow products={todayDeals} />

      <SectionTitle title="Ø£Ø­Ø¯Ø« Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª" accent="Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª" />
      <ProductRow products={newest} />

      <SectionTitle title="Ø¹Ø·ÙˆØ± Ø±Ø¬Ø§Ù„ÙŠØ©" accent="Ø±Ø¬Ø§Ù„ÙŠØ©" />
      <ProductRow products={menPerfumes} />

      <SectionTitle title="Ù…Ø§Ø±ÙƒØ§Øª Ø¹Ø§Ù„Ù…ÙŠØ© Ù…Ø®ØªØ§Ø±Ù‡" accent="Ø¹Ø§Ù„Ù…ÙŠØ©" />
      <BrandsRow />

      <SectionTitle title="Ø£Ù‚Ø³Ø§Ù… Ù…Ù…ÙŠØ²Ø©" accent="Ù…Ù…ÙŠØ²Ø©" />
      <CategoryCircles items={featuredSections} />

      <PromoBanner
        title="Ø¹Ø§Ù„Ù… Ø§Ù„Ø¨Ø®ÙˆØ± Ø§Ù„ÙØ§Ø®Ø±"
        desc="Ø±ÙˆØ§Ø¦Ø­ Ø´Ø±Ù‚ÙŠØ© Ø£ØµÙŠÙ„Ø© ØªØ¶ÙŠÙ Ù„Ù…Ø³Ø© ÙØ®Ø§Ù…Ø© Ù„Ù…Ù†Ø²Ù„Ùƒ"
        cta="ØªØ³ÙˆÙ‚ Ø§Ù„Ø¨Ø®ÙˆØ±"
      />
      <ProductRow products={bakhoor} />

      <PromoBanner
        title="Ø¨Ø§Ù‚Ø§Øª Ø§Ù„Ù‡Ø¯Ø§ÙŠØ§ Ø§Ù„Ø¹Ø·Ø±ÙŠØ©"
        desc="Ø§Ø®ØªØ± Ø§Ù„Ù‡Ø¯ÙŠØ© Ø§Ù„Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù…Ù† ØªØ­Ø¨ â€” Ø¹Ø±Ø¶ Ø®Ø§Øµ Ø¹Ù„Ù‰ Ø¨Ø§Ù‚Ø§Øª Ø§Ù„Ø¹Ø·ÙˆØ±"
        cta="ØªØ³ÙˆÙ‚ Ø§Ù„Ø¢Ù†"
      />
      <ProductRow products={giftSets} />

      <SectionTitle title="Ø¹Ø·ÙˆØ± Ù†Ø³Ø§Ø¦ÙŠØ©" accent="Ù†Ø³Ø§Ø¦ÙŠØ©" />
      <ProductRow products={womenPerfumes} />

      <SectionTitle title="Ø¹Ø·ÙˆØ± Ù„Ù„Ø¬Ù†Ø³ÙŠÙ†" accent="Ù„Ù„Ø¬Ù†Ø³ÙŠÙ†" />
      <ProductRow products={unisex} />

      <PromoBanner
        title="Ø¨Ø§Ù‚Ø§Øª Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„ÙØ§Ø®Ø±Ø©"
        desc="Ø§Ø®ØªØ± Ø§Ù„Ù‡Ø¯ÙŠØ© Ø§Ù„Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù…Ù† ØªØ­Ø¨"
        cta="ØªØ³ÙˆÙ‚ Ø§Ù„Ø¨Ø§Ù‚Ø§Øª"
      />
      <ProductRow products={luxurySets} />

      <SectionTitle title="ØªØ±Ø´ÙŠØ­ Ø§Ù„Ø®Ø¨Ø±Ø§Ø¡" accent="Ø§Ù„Ø®Ø¨Ø±Ø§Ø¡" />
      <ProductRow products={expertPicks} />

      <FeaturesStrip />
    </div>
  );
}
