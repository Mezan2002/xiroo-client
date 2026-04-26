import PolicyPage from "@/components/shared/PolicyPage";

export const metadata = {
  title: "Terms & Conditions | Xiroo Storefront",
  description: "Review the operational terms and conditions of using the Xiroo digital storefront.",
};

export default function TermsAndConditions() {
  return (
    <PolicyPage title="Terms & Conditions" lastUpdated="April 2026">
      <section>
        <h2>System Access</h2>
        <p>
          By accessing the Xiroo storefront, you agree to comply with our operational 
          framework. Users are responsible for maintaining the confidentiality of 
          their identity credentials and for all activities that occur under their account.
        </p>
      </section>

      <section>
        <h2>Inventory & Pricing</h2>
        <p>
          While we strive for precision in our digital registry:
        </p>
        <ul>
          <li>All product specifications and pricing are subject to real-time updates.</li>
          <li>We reserve the right to modify or terminate product availability without prior notice.</li>
          <li>Orders are subject to verification and acceptance by the Xiroo logistics team.</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          All digital assets, including visual designs, typographic elements, and 
          brand signatures, are the exclusive property of Xiroo. Unauthorized 
          reproduction or redistribution is strictly prohibited.
        </p>
      </section>

      <hr />

      <section>
        <h2>Order Execution</h2>
        <p>
          Order confirmation does not constitute a legal contract of sale. Xiroo 
          reserves the architectural right to limit order quantities or refuse 
          service based on security risk assessment.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          Xiroo shall not be liable for any indirect, incidental, or consequential 
          disruptions arising from the use of our digital storefront or the 
          utilization of our physical products.
        </p>
      </section>
    </PolicyPage>
  );
}
