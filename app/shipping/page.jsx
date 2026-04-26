import PolicyPage from "@/components/shared/PolicyPage";

export const metadata = {
  title: "Shipping & Delivery | Xiroo Storefront",
  description: "View our logistics protocols for domestic and international delivery.",
};

export default function ShippingPolicy() {
  return (
    <PolicyPage title="Shipping & Delivery" lastUpdated="April 2026">
      <section>
        <h2>Logistics Framework</h2>
        <p>
          Xiroo operates a high-precision fulfillment network. Our goal is to 
          ensure your curated selections reach their destination with maximum 
          architectural safety and efficiency.
        </p>
      </section>

      <section>
        <h2>Dispatch Timelines</h2>
        <p>
          Our standard fulfillment protocol is as follows:
        </p>
        <ul>
          <li><strong>Processing:</strong> Orders are verified and dispatched within 24-48 business hours.</li>
          <li><strong>Domestic Delivery:</strong> 3-5 business days via premium carriers.</li>
          <li><strong>Priority Shipping:</strong> 1-2 business days for select regions.</li>
        </ul>
      </section>

      <section>
        <h2>Real-Time Tracking</h2>
        <p>
          Upon dispatch, you will receive a digital tracking signature via email. 
          You can monitor the real-time coordinates of your package through our 
          integrated logistics portal.
        </p>
      </section>

      <hr />

      <section>
        <h2>Shipping Costs</h2>
        <p>
          Shipping calculations are synchronized based on destination and package 
          volume. Total logistics costs are displayed during the final checkout protocol.
        </p>
      </section>

      <section>
        <h2>Damaged Deliveries</h2>
        <p>
          In the rare event of a logistics failure resulting in damaged goods, 
          please contact our support team within 48 hours of receipt to initiate 
          the recovery protocol.
        </p>
      </section>
    </PolicyPage>
  );
}
