import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="px-4 md:px-12 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map((p) => (
          <div key={p.id} className="w-full">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
