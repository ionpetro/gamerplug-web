import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Gamerplug",
  description: "Terms and conditions for using Gamerplug - rules, guidelines, and legal agreements.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-accent/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 py-32 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center border border-border shadow-lg">
              <FileText size={40} className="text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 uppercase italic tracking-tight">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Conditions</span>
          </h1>
          <p className="text-muted-foreground text-lg border-l-2 border-border pl-6 inline-block">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">01.</span> Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              By accessing and using Gamerplug ("the Service"), you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree to abide by the
              above, please do not use this service.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">02.</span> Use License
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">
              Permission is granted to temporarily use Gamerplug for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Modify or copy the materials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Use the materials for any commercial purpose or for any public display</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Attempt to reverse engineer any software contained in the Service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Remove any copyright or other proprietary notations from the materials</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">03.</span> User Accounts
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">
              To access certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Provide accurate, current, and complete information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Maintain the security of your password</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Accept responsibility for all activities under your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Notify us immediately of any unauthorized use of your account</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">04.</span> Content Guidelines
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">
              When using Gamerplug, you agree not to post, upload, or share content that:
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Is illegal, harmful, threatening, abusive, or offensive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Violates any intellectual property rights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Contains malware or other harmful code</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Is spam or unsolicited promotional material</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Impersonates another person or entity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Violates privacy rights of others</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Contains explicit or inappropriate material</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">05.</span> Gaming Content
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">
              For gaming clips and content shared on the platform:
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">You retain ownership of your original content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">You grant us a license to display and distribute your content on the platform</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Content must comply with game publishers' terms of service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">We reserve the right to remove content that violates these terms</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">06.</span> Prohibited Uses
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">You may not use the Service:</p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">For any unlawful purpose or to solicit unlawful acts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To violate any international, federal, provincial, or state regulations or laws</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To submit false or misleading information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To interfere with or circumvent the security features of the Service</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">07.</span> Service Availability
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              We strive to keep the Service available at all times, but we do not guarantee
              uninterrupted access. The Service may be temporarily unavailable due to maintenance,
              updates, or circumstances beyond our control.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">08.</span> Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              We may terminate or suspend your account and access to the Service immediately,
              without prior notice or liability, for any reason, including if you breach the Terms.
              You may also delete your account at any time.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">09.</span> Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              The Service is provided "as is" without any representations or warranties. We
              disclaim all warranties, whether express or implied, including but not limited
              to implied warranties of merchantability and fitness for a particular purpose.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">10.</span> Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              In no event shall Gamerplug or its suppliers be liable for any damages arising
              out of or in connection with your use of the Service. This limitation applies
              to all damages of any kind.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">11.</span> Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              These terms and conditions are governed by and construed in accordance with the
              laws and regulations of the jurisdiction where Gamerplug operates.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">12.</span> Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the Service after changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">13.</span> Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              If you have any questions about these Terms & Conditions, please contact us
              through our app or official social media channels.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}