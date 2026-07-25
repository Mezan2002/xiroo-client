"use client";

import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ChevronDown } from "lucide-react";
import { useStoreSettings } from "@/hooks/api/useStoreSettings";

export default function FaqPage() {
  const { settings: storeSettings } = useStoreSettings();
  const supportEmail = storeSettings?.contact?.supportEmail || "support@xirooshop.com";
  const domain = storeSettings?.identity?.domain || "xirooshop.com";

  const FAQS = [
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD), bKash, Nagad, and all major credit/debit cards. All online payments are processed through secure SSL encryption.",
    },
    {
      q: "How long does shipping take?",
      a: "Standard delivery within Dhaka takes 1-2 business days. Outside Dhaka, delivery takes 3-5 business days. You'll receive a tracking number once your order is dispatched.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a hassle-free 7-day return policy. If you're not satisfied with your purchase, you can return or exchange any unworn item within 7 days of delivery.",
    },
    {
      q: "Are your products authentic?",
      a: "Yes, 100%. All XIROO products are designed and manufactured by us. We use premium fabrics and maintain strict quality control throughout production.",
    },
    {
      q: "Do you offer nationwide shipping?",
      a: "Yes, we ship all across Bangladesh. Shipping is free for orders above ৳2000. For orders below that, a minimal delivery fee applies.",
    },
    {
      q: "How can I contact customer support?",
      a: `You can reach us via our Contact page, send us a message on Facebook or Instagram, or email us at ${supportEmail}. We respond within 24 hours.`,
    },
    {
      q: "Do you have physical stores?",
      a: `Currently, we operate exclusively online through our website ${domain}. This allows us to offer premium quality at better prices by cutting middlemen costs.`,
    },
  ];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-sm md:text-base font-medium text-black pr-8 group-hover:text-gray-600 transition-colors">
          {faq.q}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-sm text-gray-500 font-light leading-relaxed">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto font-montserrat">
      {/* Header */}
      <div className="max-w-[800px] mx-auto mb-20">
        <div className="flex flex-col gap-6 items-center text-center">
          <Breadcrumb />
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-black uppercase leading-tight">
            FAQ
          </h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            <span className="w-8 h-px bg-gray-200" />
            Frequently Asked Questions
            <span className="w-8 h-px bg-gray-200" />
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-[700px] mx-auto">
        {FAQS.map((faq, idx) => (
          <FaqItem key={idx} faq={faq} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-[700px] mx-auto mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Still have questions?
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 border border-black px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
