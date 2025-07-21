import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VoltMarketTermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to GridBazaar
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">GridBazaar Terms of Use</h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Effective Date: 6/27/2025</span>
            <span>Last Updated: 7/21/2025</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <div className="space-y-8">
            <div className="bg-muted/30 p-6 rounded-lg border">
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Use ("Terms") govern your access to and use of the GridBazaar platform (the "Platform"), 
                which includes our website, services, tools, data, APIs, and any associated applications. By registering for, 
                accessing, or using GridBazaar, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the Platform.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Eligibility and Account Registration</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• You must be at least 18 years old to use the Platform.</li>
                <li>• You agree to provide accurate, complete, and current information during registration and keep it updated.</li>
                <li>• You are responsible for maintaining the confidentiality of your credentials and all activity under your account.</li>
                <li>• You may not share your account credentials with others. You are responsible for any use of the Platform through your account.</li>
                <li>• GridBazaar reserves the right to suspend or terminate accounts that provide false or misleading information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Platform Use and Purpose</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GridBazaar provides an open infrastructure marketplace to:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>• List and browse infrastructure assets for sale, lease, or hosting</li>
                <li>• Upload due diligence materials and request access to confidential documents</li>
                <li>• Submit or receive Letters of Intent (LOIs)</li>
                <li>• Buy, sell, or inquire about energy-related equipment</li>
                <li>• Communicate securely with other users through in-app messaging</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                All use of the Platform must comply with applicable laws, these Terms, and industry best practices. 
                Users are solely responsible for verifying the accuracy, legality, and completeness of listings and associated data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Roles and Responsibilities</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">a. Sellers, Brokers, and Site Owners:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Listings must include accurate, up-to-date, and complete information.</li>
                    <li>• Sellers must have the legal right to represent, market, or transfer the listed asset.</li>
                    <li>• Sellers are encouraged to upload supporting documentation such as title records, permits, utility agreements, and site plans.</li>
                    <li>• Sellers must review and manage buyer access requests to due diligence materials in compliance with applicable NDA conditions.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">b. Buyers:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Buyers must use due diligence materials solely for evaluation purposes.</li>
                    <li>• All NDA agreements must be reviewed and accepted before accessing protected content.</li>
                    <li>• Any LOI submitted must be made in good faith and include accurate terms.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">c. All Users:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Users must not post or upload illegal, fraudulent, or misleading content.</li>
                    <li>• Users must not engage in harassment, abuse, spam, or unsolicited marketing through the Platform.</li>
                    <li>• Users may not resell, scrape, harvest, or redistribute content or listings from the Platform without written permission.</li>
                    <li>• All users agree to abide by community standards of professional and respectful conduct.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Listings and Transactions</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• GridBazaar is a neutral platform and does not act as a broker or agent for any listing unless separately contracted.</li>
                <li>• Users are solely responsible for negotiating, conducting, and completing any transaction initiated via the Platform.</li>
                <li>• GridBazaar is not responsible for failed transactions, misrepresentations, or disputes between users.</li>
                <li>• We reserve the right to remove or disable any listing that violates these Terms or is flagged by the community.</li>
                <li>• Listings must not contain any malicious code, tracking scripts, or unauthorized third-party integrations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Due Diligence & NDAs</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Sellers may choose to restrict document access behind NDA approval workflows.</li>
                <li>• Buyers requesting access must review and agree to NDA terms, either standard or seller-provided.</li>
                <li>• Sellers may approve or deny access requests at their sole discretion.</li>
                <li>• Buyers must not download, share, or forward NDA-protected materials without written authorization.</li>
                <li>• GridBazaar may log NDA acceptance, access timestamps, and usage patterns to support compliance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Consulting Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                GridBazaar may offer optional consulting, listing optimization, document preparation, or brokerage services. 
                These are subject to additional agreements and fees. No consulting relationship is formed unless explicitly contracted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• All GridBazaar branding, design, user interface, software, and code are the intellectual property of GridBazaar or its licensors.</li>
                <li>• Users retain rights to any content or documents they upload but grant GridBazaar a license to store, display, and share those materials for platform functionality.</li>
                <li>• Users may not duplicate, reverse engineer, republish, or exploit any part of the Platform without express written consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Suspension & Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GridBazaar may suspend, limit, or terminate your access if:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>• You violate these Terms or any applicable law</li>
                <li>• You misuse platform resources or features</li>
                <li>• You attempt to manipulate listing visibility, impersonate others, or interfere with other users</li>
                <li>• Legal authorities request action</li>
                <li>• Your account has been inactive for over 12 months</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We may provide notice, but in urgent cases (e.g., fraud, abuse), we may act immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Disclaimers</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• GridBazaar provides the Platform "as is" without warranties of any kind.</li>
                <li>• We do not warrant that listings are accurate, complete, or up to date.</li>
                <li>• GridBazaar does not guarantee uptime, uninterrupted service, or data availability.</li>
                <li>• Any decision to engage in a deal is made solely at your own risk.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To the fullest extent allowed by law, GridBazaar shall not be liable for:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li>• Indirect, incidental, punitive, or consequential damages</li>
                <li>• Loss of business opportunity, data, profits, or goodwill</li>
                <li>• Platform outages, bugs, or lost documents</li>
                <li>• Errors made by users in listings, NDAs, or LOIs</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                If liability is found, it is capped at the amount paid by you (if any) in the previous 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree to defend, indemnify, and hold harmless GridBazaar and its officers, employees, contractors, 
                and agents from any claims or disputes arising from:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Your use or misuse of the Platform</li>
                <li>• Your violation of these Terms or applicable laws</li>
                <li>• Any information, documents, or content you upload or transmit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Governing Law & Dispute Resolution</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• These Terms are governed by the laws of [Insert Jurisdiction].</li>
                <li>• Any disputes will be resolved through arbitration or the courts of [Insert Jurisdiction], unless otherwise agreed.</li>
                <li>• You agree not to initiate class-action claims or mass arbitration against GridBazaar.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Changes to These Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GridBazaar may revise these Terms at any time. Updates will be posted with an updated effective date. 
                If material changes are made, we will notify users via email or platform alerts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Continued use of the Platform after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Questions about these Terms? Contact us at:
              </p>
              <div className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-foreground font-medium">GridBazaar Legal Team</p>
                <p className="text-muted-foreground">Email: legal@Gridbazaar.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};