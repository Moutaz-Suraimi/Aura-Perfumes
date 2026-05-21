import { Check, Truck, DollarSign, MessageSquare } from "lucide-react";
const features = [
  { icon: Check, label: "Ù…Ù†ØªØ¬Ø§Øª Ø£ØµÙ„ÙŠØ©" },
  { icon: Truck, label: "ØªÙˆØµÙŠÙ„ Ù„Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ø¯Ù† Ø§Ù„ÙŠÙ…Ù†ÙŠØ©" },
  { icon: DollarSign, label: "Ø£Ø³Ø¹Ø§Ø± Ù…Ù…ÙŠØ²Ø©" },
  { icon: MessageSquare, label: "Ø®Ø¯Ù…Ø© Ø¹Ù…Ù„Ø§Ø¡ Ø³Ø±ÙŠØ¹Ø©" },
];
export function FeaturesStrip() {
  return (
    <div className="px-3 md:px-6 my-10 grid grid-cols-2 md:grid-cols-4 gap-3">
      {features.map((f) => (
        <div
          key={f.label}
          className="bg-white border border-cream-deep rounded-full px-4 py-3 flex items-center gap-3 shadow-sm"
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
