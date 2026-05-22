import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة — أورا للعطور" },
      { name: "description", content: "إجابات على الأسئلة الشائعة حول أورا للعطور." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const faqs = [
    {
      question: "هل جميع عطور أورا أصلية 100%؟",
      answer: "نعم، جميع العطور المعروضة في متجرنا أصلية 100% ونستوردها من الوكلاء المعتمدين والموردين الموثوقين.",
    },
    {
      question: "كم تستغرق عملية التوصيل؟",
      answer: "تستغرق عملية التوصيل من 2 إلى 5 أيام عمل داخل المملكة العربية السعودية، وقد تختلف المدة لباقي الدول.",
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نوفر طرق دفع متعددة وآمنة تشمل: مدى، فيزا، ماستركارد، آبل باي (Apple Pay)، بالإضافة إلى الدفع عند الاستلام (لبعض المناطق).",
    },
    {
      question: "هل يمكنني إرجاع عطر قمت بفتحه واستخدامه؟",
      answer: "للأسف، بناءً على تعليمات وزارة التجارة والصحة العامة، لا يمكننا استرجاع العطور بعد فتح غلافها الأصلي (السلوفان).",
    },
    {
      question: "كيف يمكنني تتبع طلبي؟",
      answer: "بمجرد شحن طلبك، ستصلك رسالة نصية وبريد إلكتروني يحتويان على رقم التتبع، ويمكنك أيضاً تتبع الطلب من خلال لوحة تحكم حسابك في قسم 'الطلبات'.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-12">
      <div className="max-w-3xl mx-auto bg-card border border-cream-deep rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-brand mb-8 text-center">
          الأسئلة الشائعة
        </h1>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-cream-deep">
              <AccordionTrigger className="text-right text-base font-bold hover:text-brand transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
