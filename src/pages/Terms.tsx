import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tightest text-foreground mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg text-muted-foreground space-y-6">
            <p>
              <strong>Last updated:</strong> January 2025
            </p>
            
            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using NEKO's services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations.
            </p>

            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Use of Services
            </h2>
            <p>
              NEKO provides guidance and educational resources for business formation and personal branding. 
              Our services are for informational purposes only and do not constitute legal, financial, 
              or tax advice.
            </p>

            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Disclaimer
            </h2>
            <p>
              NEKO is not a credit repair service, legal advisor, or financial institution. 
              We do not guarantee specific outcomes. Users are responsible for their own business decisions.
            </p>

            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Limitation of Liability
            </h2>
            <p>
              NEKO shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of our services.
            </p>

            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:hello@helloneko.co" className="text-primary hover:underline">
                hello@helloneko.co
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
