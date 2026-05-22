import { createFileRoute } from "@tanstack/react-router";
import { allProducts, categories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Search } from "lucide-react";

interface ProductsSearch {
  q?: string;
  category?: string;
}

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    return {
      q: (search.q as string) || undefined,
      category: (search.category as string) || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "المتجر — أورا للعطور" },
      { name: "description", content: "تصفح جميع منتجات أورا للعطور الفاخرة." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q, category } = Route.useSearch();

  let filtered = allProducts;
  if (category && category !== "all" && category !== "all-view") {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)),
    );
  }

  // Remove duplicates
  const uniqueProducts = Array.from(new Map(filtered.map((item) => [item.id, item])).values());

  const categoryName = categories.find((c) => c.id === category)?.name || "جميع المنتجات";
  const title = q ? `نتائج البحث عن: "${q}"` : categoryName;

  return (
    <div className="px-4 md:px-12 py-8 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-brand rounded-full hidden md:block"></div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
        <span className="text-sm text-muted-foreground mr-auto bg-cream-deep/50 px-3 py-1 rounded-full">
          {uniqueProducts.length} منتج
        </span>
      </div>

      {uniqueProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {uniqueProducts.map((p) => (
            <div key={p.id} className="w-full">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-cream-deep rounded-full flex items-center justify-center text-brand mb-4">
            <Search size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">لم يتم العثور على أي منتج</h2>
          <p className="text-muted-foreground max-w-md">
            عذراً، لم نتمكن من العثور على أي منتجات تطابق بحثك أو القسم المحدد. حاول استخدام كلمات
            بحث مختلفة.
          </p>
        </div>
      )}
    </div>
  );
}
