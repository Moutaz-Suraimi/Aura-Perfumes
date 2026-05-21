import { brands } from "@/data/products";
export function BrandsRow() {
  return (
    <div className="px-4 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-4">
      {brands.map((b) => (
        <div
          key={b.id}
          className="bg-card border border-cream-deep rounded-2xl p-4 shadow-sm flex flex-col items-center"
        >
          <div className="w-full h-28 flex items-center justify-center bg-cream-deep/30 rounded-xl">
            <img src={b.logo} alt={b.name} className="max-h-full object-contain" />
          </div>
          <p className="text-xs md:text-sm text-center mt-3 text-foreground/80">{b.name}</p>
        </div>
      ))}
    </div>
  );
}
