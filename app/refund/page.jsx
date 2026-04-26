import PolicyPage from "@/components/shared/PolicyPage";

export const metadata = {
  title: "Refund & Returns | Xiroo Storefront",
  description: "Xiroo satisfaction guarantee and return protocols.",
};

export default function RefundPolicy() {
  return (
    <PolicyPage title="Refund & Returns" lastUpdated="April 2026">
      <section>
        <h2>Satisfaction Guarantee</h2>
        <p>
          At Xiroo, we stand by the quality of our curated selections. If the 
          product does not meet your architectural standards, we offer a 
          streamlined return and refund protocol.
        </p>
      </section>

      <section>
        <h2>Return Conditions</h2>
        <p>
          To be eligible for a return, the following criteria must be met:
        </p>
        <ul>
          <li>Request must be initiated within 14 days of receipt.</li>
          <li>Products must be in original, unutilized condition.</li>
          <li>All original packaging and tags must be intact.</li>
          <li>Proof of purchase is required for verification.</li>
        </ul>
      </section>

      <section>
        <h2>Refund Processing</h2>
        <p>
          Once your return is verified by our quality control team:
        </p>
        <ul>
          <li>Refunds are processed to the original payment source.</li>
          <li>Please allow 5-10 business days for financial synchronization.</li>
          <li>Shipping costs are non-refundable unless the return is due to a Xiroo error.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Exchanges</h2>
        <p>
          We currently facilitate exchanges for size or color variations, subject 
          to real-time inventory availability. Please initiate an exchange 
          request through our support portal.
        </p>
      </section>

      <section>
        <h2>Non-Returnable Items</h2>
        <p>
          Select products, including limited-edition collaborations and custom 
          configurations, may be excluded from the standard return protocol. 
          This will be clearly indicated on the product profile.
        </p>
      </section>
    </PolicyPage>
  );
}
