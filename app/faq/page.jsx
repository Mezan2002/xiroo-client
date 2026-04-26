import PolicyPage from "@/components/shared/PolicyPage";
import Accordion from "@/components/ui/Accordion";

export const metadata = {
  title: "FAQ | Frequently Asked Protocols",
  description: "Find answers to the most common questions regarding Xiroo products and services.",
};

const FAQ_DATA = [
  {
    category: "Orders & Logistics",
    questions: [
      {
        q: "How do I monitor my order synchronization?",
        a: "Upon dispatch, a unique tracking signature is sent to your registered email. You can utilize this signature on our Logistics page for real-time coordinate updates."
      },
      {
        q: "Can I modify a confirmed order configuration?",
        a: "Order configurations can be modified within 2 hours of synchronization. After this window, the logistics protocol moves into the fulfillment phase and changes are no longer architectural."
      }
    ]
  },
  {
    category: "Product Architecture",
    questions: [
      {
        q: "Are Xiroo artifacts covered by a warranty?",
        a: "Every Xiroo artifact comes with a 1-year limited architectural warranty covering technical defects and material integrity."
      },
      {
        q: "Where are Xiroo products designed?",
        a: "Our vision originates in our Studio in Bangladesh, with technical engineering finalized in collaboration with global specialized labs."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <PolicyPage title="FAQ" lastUpdated="April 2026">
      <div className="space-y-16">
        {FAQ_DATA.map((group, idx) => (
          <div key={idx} className="space-y-6">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2">
              {group.category}
            </h2>
            <div className="flex flex-col">
              {group.questions.map((item, qIdx) => (
                <Accordion key={qIdx} title={item.q}>
                  {item.a}
                </Accordion>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PolicyPage>
  );
}
