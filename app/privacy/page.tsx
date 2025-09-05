import { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Gamerplug",
  description: "Privacy policy for Gamerplug - how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="text-gray-300 mb-8 text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-8 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              upload gaming clips, or contact us for support.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (username, email address)</li>
              <li>Gaming profiles and gamertags</li>
              <li>Gaming clips and videos you upload</li>
              <li>Profile information and preferences</li>
              <li>Communication records with other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To create and manage your account</li>
              <li>To enable you to connect with other gamers</li>
              <li>To facilitate sharing of gaming content</li>
              <li>To send notifications about matches and messages</li>
              <li>To improve our app and user experience</li>
              <li>To provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and the safety of our users</li>
              <li>With service providers who assist in operating our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no internet 
              transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this privacy policy, unless a longer retention 
              period is required or permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If we become aware that we have 
              collected personal information from a child under 13, we will take steps to delete 
              such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new privacy policy on this page and updating the "Last updated" 
              date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Us</h2>
            <p>
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