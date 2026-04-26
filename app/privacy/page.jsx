import PolicyPage from "@/components/shared/PolicyPage";

export const metadata = {
  title: "Privacy Policy | Xiroo Storefront",
  description: "Learn how Xiroo protects and manages your personal data and identity.",
};

export default function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy" lastUpdated="April 2026">
      <section>
        <h2>Protocol Overview</h2>
        <p>
          At Xiroo, we prioritize the architectural integrity of your personal data. 
          This Privacy Policy outlines the protocols we implement to collect, utilize, 
          and safeguard your identity within our digital ecosystem.
        </p>
      </section>

      <section>
        <h2>Data Collection</h2>
        <p>
          We collect essential information to facilitate your experience:
        </p>
        <ul>
          <li><strong>Identity Data:</strong> Name, email address, and demographic information.</li>
          <li><strong>Transactional Data:</strong> Billing details and order history.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, and device identifiers for security and optimization.</li>
        </ul>
      </section>

      <section>
        <h2>Utilization Protocol</h2>
        <p>
          Your data is utilized strictly for the following purposes:
        </p>
        <ul>
          <li>Order fulfillment and logistics synchronization.</li>
          <li>Security authentication and fraud prevention.</li>
          <li>Service optimization and personalized storefront discovery.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Encryption & Security</h2>
        <p>
          We employ professional-grade SSL/TLS encryption for all data transfers. 
          Your sensitive information is stored in high-security, distributed data 
          registries with strict access control protocols.
        </p>
      </section>

      <section>
        <h2>Third-Party Synchronization</h2>
        <p>
          Xiroo does not monetize your identity. We only share data with verified 
          logistics partners (e.g., shipping carriers) and financial processors 
          necessary to complete your transactions.
        </p>
      </section>
    </PolicyPage>
  );
}
