import { EccentricNavbar } from "@/components/EccentricNavbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using NÈKO's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: "Description of Services",
    content: `NÈKO provides educational guidance and tools for building businesses and personal brands. Our services include:

• Business formation guidance and checklists
• Business credit building resources and tracking
• Personal brand development tools
• Progress tracking and milestone management

NÈKO is NOT a credit repair service, legal advisor, financial advisor, or get-rich-quick program. We provide educational content and structured guidance only.`,
  },
  {
    title: "User Accounts",
    content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized access

We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: "Subscription and Payments",
    content: `Some features of NÈKO require a paid subscription. By subscribing to a paid plan:

• You authorize us to charge your payment method on a recurring basis
• You may cancel your subscription at any time
• Refunds are provided in accordance with our refund policy
• Prices may change with reasonable notice

Free tier features are provided as-is and may be modified or discontinued.`,
  },
  {
    title: "Disclaimer of Warranties",
    content: `NÈKO provides services on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding:

• The accuracy or completeness of any content
• The results you may obtain from using our services
• The reliability or availability of our platform

We are not responsible for any business decisions you make based on our educational content.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, NÈKO shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

• Loss of profits or revenue
• Loss of business opportunities
• Business interruption
• Loss of data

Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.`,
  },
  {
    title: "Intellectual Property",
    content: `All content, features, and functionality of NÈKO are owned by us and are protected by intellectual property laws. You may not:

• Copy, modify, or distribute our content without permission
• Use our trademarks without written consent
• Reverse engineer or attempt to extract source code
• Use automated systems to access our services`,
  },
  {
    title: "User Content",
    content: `You retain ownership of any content you submit to NÈKO. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content as necessary to provide our services.

You are responsible for ensuring your content does not violate any laws or third-party rights.`,
  },
  {
    title: "Termination",
    content: `We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including breach of these Terms.

Upon termination, your right to use the services will immediately cease. All provisions of these Terms which should survive termination shall survive.`,
  },
  {
    title: "Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date.

Your continued use of the services after changes constitutes acceptance of the new Terms.`,
  },
  {
    title: "Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which NÈKO operates, without regard to its conflict of law provisions.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about these Terms of Service, please contact us at:

Email: neko@helloneko.co`,
  },
];

export default function Terms() {
  return (
    <main className="min-h-screen bg-background">
      <EccentricNavbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-8 sm:pb-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-3">
              Legal
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tightest text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-muted-foreground mb-12 leading-relaxed">
              Please read these Terms of Service carefully before using NÈKO. By using our services, you agree to be bound by these terms.
            </p>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
