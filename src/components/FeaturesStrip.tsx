import { Check, Truck, DollarSign, MessageSquare } from "lucide-react";
const features = [
  { icon: Check, label: "منتجات أصلية" },
  { icon: Truck, label: "توصيل لجميع المدن" },
  { icon: DollarSign, label: "أسعار مميزة" },
  { icon: MessageSquare, label: "خدمة عملاء سريعة" },
];
export function FeaturesStrip() {
  return (
    <div className="px-3 md:px-6 my-10 grid grid-cols-2 md:grid-cols-4 gap-3">
      {features.map((f) => (
        <div
          key={f.label}
          className="bg-card border border-cream-deep rounded-full px-4 py-3 flex items-center gap-3 shadow-sm"
        >
          <span className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
            <f.icon size={16} />
          </span>
          <span className="text-sm font-medium">{f.label}</span>
        </div>
      ))}
    </div>
  );
}
