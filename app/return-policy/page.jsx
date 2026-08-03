import PolicyPage from "@/components/shared/PolicyPage";

export const metadata = {
  title: "Return Policy | Xiroo Storefront",
  description: "Xiroo satisfaction guarantee and return protocols.",
};

export default function ReturnPolicy() {
  return (
    <PolicyPage title="Return Policy" lastUpdated="August 2026">
      <section>
        <h2>Inspect Before You Accept</h2>
        <p>
          At Xiroo, we want you to be completely confident in your purchase.
          We strongly encourage you to inspect your product in front of the
          delivery person at the time of delivery.
        </p>
      </section>

      <section>
        <h2>Return at the Doorstep</h2>
        <p>
          If you notice any issues with the product — whether it's a quality
          concern or a sizing problem — you can return the product immediately
          to the delivery person. No questions asked, no hassle involved.
        </p>
      </section>

      <section>
        <h2>Already Accepted the Delivery?</h2>
        <p>
          If you discover any problems after accepting the delivery, don't
          worry. Simply reach out to us through our social media channels
          (Facebook, Instagram) or contact our support team. We will listen
          to your concern and work with you to resolve it.
        </p>
      </section>

      <hr />

      <section>
        <h2>Exchange Policy</h2>
        <p>
          If the issue is a valid mistake on our part — such as a defective
          product, wrong item, or size discrepancy — we will happily exchange
          the product for you. Your satisfaction is our priority.
        </p>
      </section>

      <section>
        <h2>How to Reach Us</h2>
        <p>
          For any post-delivery concerns, you can contact us through:
        </p>
        <ul>
          <li>Facebook Messenger — DM us directly</li>
          <li>Instagram — Send us a message</li>
          <li>Email — Our support team responds within 24 hours</li>
        </ul>
      </section>
    </PolicyPage>
  );
}
