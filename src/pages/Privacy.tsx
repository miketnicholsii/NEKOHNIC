import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tightest text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg text-muted-foreground space-y-6">
            <p>
              <strong>Last updated:</strong> January 2025
            </p>
            
            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support. This may include your name, email address, 
              and business information.
            </p>

            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              communicate with you, and personalize your experience on our platform.
            </p>

            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
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
