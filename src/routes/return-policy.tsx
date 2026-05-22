import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/return-policy")({
  head: () => ({
    meta: [
      { title: "سياسة الاسترجاع — أورا للعطور" },
      { name: "description", content: "سياسة الاسترجاع والاستبدال في متجر أورا للعطور." },
    ],
  }),
  component: ReturnPolicyPage,
});

function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-12">
      <div className="max-w-4xl mx-auto bg-card border border-cream-deep rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-brand mb-8 text-center">
          سياسة الاسترجاع والاستبدال
        </h1>
        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. الشروط العامة للاسترجاع</h2>
            <p>
              نحن في أورا للعطور نضمن لك جودة جميع منتجاتنا. إذا لم تكن راضياً عن مشترياتك، يمكنك إرجاع
              المنتج خلال 7 أيام من تاريخ الاستلام، بشرط أن يكون المنتج في حالته الأصلية ولم يتم فتحه
              أو استخدامه.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. المنتجات غير القابلة للاسترجاع</h2>
            <p>
              حفاظاً على الصحة العامة، لا يمكننا استرجاع أو استبدال العطور التي تم فتح غلافها البلاستيكي
              الأصلي (السلوفان)، أو المنتجات التي تم استخدامها، باستثناء المنتجات التي بها عيب مصنعي.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. خطوات الاسترجاع</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>تواصل مع خدمة العملاء عبر صفحة "تواصل معنا" أو رقم الواتساب.</li>
              <li>زوّد فريقنا برقم الطلب وصور للمنتج إن كان به عيب.</li>
              <li>سيتم إرسال بوليصة استرجاع لك لتسليم المنتج لشركة الشحن.</li>
              <li>بعد وصول المنتج لمستودعاتنا وفحصه، سيتم إرجاع المبلغ لحسابك.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. استرداد المبالغ</h2>
            <p>
              يتم استرداد المبلغ إلى نفس وسيلة الدفع التي تم استخدامها عند الشراء. قد تستغرق عملية
              استرداد المبلغ من 7 إلى 14 يوم عمل حسب سياسة البنك الخاص بك.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
