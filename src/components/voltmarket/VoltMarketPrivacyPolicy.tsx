import React from 'react';

export const VoltMarketPrivacyPolicy = () => {
  return (
    <div className="container-responsive py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            GridBazaar Privacy Policy
          </h1>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Effective Date:</strong> 6/27/2025</p>
            <p><strong>Last Updated:</strong> 7/21/2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <p className="text-foreground leading-relaxed mb-0">
              GridBazaar ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, share, and safeguard your personal information when you visit or use our platform, services, and website (collectively, the "Platform"). It also explains your rights and choices regarding your personal data. By accessing or using GridBazaar, you consent to the practices described in this policy.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              1. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">a. Information You Provide to Us</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We collect personal and business-related information when you:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Create an account (name, email, phone number, role, company name, address, password)</li>
                  <li>Complete your profile (bio, service areas, professional licenses, ID verification)</li>
                  <li>List a site or equipment (property description, pricing, location, documentation, images)</li>
                  <li>Upload Due Diligence (DD) documents (title certificates, utility bills, NDAs, permits, interconnect agreements, etc.)</li>
                  <li>Send messages or submit Letters of Intent (LOIs)</li>
                  <li>Contact support or fill out inquiry/contact forms</li>
                  <li>Use our consulting services (via intake or advisory request forms)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">b. Information We Collect Automatically</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We automatically collect:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>IP address, browser type, operating system, access times, referring URLs</li>
                  <li>Device identifiers (such as UUID, MAC address)</li>
                  <li>Usage data (pages viewed, listings clicked, files accessed, time spent)</li>
                  <li>Analytics through cookies and third-party tools (e.g., Google Analytics, PostHog, Plausible)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">c. Cookies and Tracking Technologies</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Authenticate users</li>
                  <li>Maintain session state</li>
                  <li>Track analytics</li>
                  <li>Improve user experience</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  You can manage cookie preferences via your browser settings.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">d. Information from Third Parties</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We may receive data from:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Identity verification providers</li>
                  <li>Payment processors (e.g., Stripe, crypto wallet integrations)</li>
                  <li>Utility/energy data sources</li>
                  <li>Government registries (title searches, zoning info)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Register and manage your user account</li>
              <li>Enable and manage listings, transactions, and LOI flows</li>
              <li>Facilitate NDA-protected due diligence workflows</li>
              <li>Provide messaging and communication tools between buyers and sellers</li>
              <li>Deliver customer service and respond to inquiries</li>
              <li>Send alerts, transactional notifications, and platform updates</li>
              <li>Monitor, secure, and troubleshoot our platform</li>
              <li>Analyze trends and user behavior to improve the Platform</li>
              <li>Promote trust and verify legitimate activity</li>
              <li>Comply with legal, tax, and regulatory obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              3. Legal Basis for Processing (if applicable)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you are located in the EEA, UK, or other jurisdictions with data protection laws:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>We rely on your consent for marketing and NDA workflows</li>
              <li>We process data to fulfill our contractual obligations (e.g., account management)</li>
              <li>We process data for our legitimate interests (e.g., fraud detection, service improvement)</li>
              <li>We may process data to comply with legal obligations (e.g., subpoenas, taxes)</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              4. Sharing Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal data. We may share information:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">a. With Other Users</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>If you list a property or equipment, information is made publicly visible</li>
                  <li>If you request DD access or send a message/LOI, your contact details are shared with the listing owner</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">b. With Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We share information with vendors who help us operate GridBazaar, including:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Hosting and infrastructure providers (e.g., Supabase, AWS)</li>
                  <li>Analytics services</li>
                  <li>Customer support platforms</li>
                  <li>Identity and verification services</li>
                  <li>File storage/CDN (for DD document hosting)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">c. Legal Compliance</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We may disclose your data when:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Required by law or regulation</li>
                  <li>Responding to lawful requests by public authorities</li>
                  <li>Enforcing our Terms of Use or investigating potential violations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-foreground mb-3">d. Business Transfers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In case of merger, sale, or acquisition, personal data may be transferred as part of the transaction.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              5. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We retain your data as long as:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Your account is active</li>
              <li>Required to maintain an auditable record of platform activity</li>
              <li>Needed to meet our legal, tax, or regulatory obligations</li>
              <li>Required for ongoing support, dispute resolution, or fraud prevention</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              You may request deletion of your data, subject to limitations above.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              6. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We implement reasonable safeguards to protect your data, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>HTTPS and SSL/TLS encryption</li>
              <li>Supabase Row-Level Security (RLS) enforcement</li>
              <li>Signed URLs for private DD file access</li>
              <li>Admin-level permission gating for sensitive workflows</li>
              <li>Access logging and anomaly detection</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              While we follow industry best practices, no system is 100% secure. Please use strong passwords and secure your devices.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              7. Your Rights and Choices
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Depending on your location, you may have rights to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Restrict or object to processing</li>
              <li>Withdraw consent (for marketing or optional services)</li>
              <li>Port your data (where applicable)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, contact us at legal@GridBazaar.com.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              8. International Data Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              GridBazaar is operated in [Insert Country]. Your data may be transferred and stored in countries with different data protection laws. Where required, we use safeguards like Standard Contractual Clauses (SCCs) or equivalent mechanisms.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              9. Children's Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              GridBazaar is not intended for individuals under the age of 18. We do not knowingly collect data from minors. If you believe we have collected data from a child, please contact us to request deletion.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              10. Third-Party Links
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party websites or services (e.g., utility databases, external verification tools). We are not responsible for the privacy practices of those third parties.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy to reflect legal, technical, or business changes. If we make material changes, we will notify you via email or platform notification. Continued use of GridBazaar constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              12. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              For questions, data requests, or privacy concerns, contact us at:
            </p>
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <p className="text-foreground font-medium mb-2">GridBazaar Privacy Team</p>
              <p className="text-muted-foreground">Email: legal@GridBazaar.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};