import { Link } from "@tanstack/react-router";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl mx-3 md:mx-6 mt-4 md:mt-6 bg-gradient-to-r from-cream-deep to-cream h-[400px] md:h-[500px] flex items-center shadow-sm">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000"
          alt="Aura Perfumes"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 px-8 md:px-16 md:w-2/3">
        <div className="inline-block bg-brand text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          تشكيلة العيد 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-brand mb-4">أورا للعطور</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
          اكتشف مجموعة فاخرة من العطور التي تعبر عن شخصيتك وتترك أثراً لا ينسى في كل مكان.
        </p>

        <div className="flex gap-4">
          <Link
            to="/products"
            className="bg-brand text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:bg-brand-dark transition-all transform hover:scale-105"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
