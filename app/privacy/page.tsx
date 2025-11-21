import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Gamerplug",
  description: "Privacy policy for Gamerplug - how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
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
              <Shield size={40} className="text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 uppercase italic tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Policy</span>
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
              <span className="text-primary">01.</span> Information We Collect
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">
              We collect information you provide directly to us, such as when you create an account,
              upload gaming clips, or contact us for support.
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Account information (username, email address)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Gaming profiles and gamertags</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Gaming clips and videos you upload</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Profile information and preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Communication records with other users</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">02.</span> How We Use Your Information
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To create and manage your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To enable you to connect with other gamers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To facilitate sharing of gaming content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To send notifications about matches and messages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To improve our app and user experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To provide customer support</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">03.</span> Information Sharing
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">With your explicit consent</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To comply with legal obligations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">To protect our rights and the safety of our users</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">With service providers who assist in operating our platform</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">04.</span> Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction. However, no internet
              transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">05.</span> Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              We retain your personal information for as long as necessary to provide our services
              and fulfill the purposes outlined in this privacy policy, unless a longer retention
              period is required or permitted by law.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">06.</span> Your Rights
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed relative z-10">You have the right to:</p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Access your personal information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Correct inaccurate information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Delete your account and personal information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Opt-out of marketing communications</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">Export your data</span>
              </li>
            </ul>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">07.</span> Children's Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              Our service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If we become aware that we have
              collected personal information from a child under 13, we will take steps to delete
              such information.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">08.</span> Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new privacy policy on this page and updating the "Last updated"
              date at the top of this policy.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
              <span className="text-primary">09.</span> Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed relative z-10">
              If you have any questions about this privacy policy or our privacy practices,
              please contact us through our app or social media channels.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}