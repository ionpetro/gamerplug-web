import { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | Gamerplug",
  description: "Terms and conditions for using Gamerplug - rules, guidelines, and legal agreements.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>
        <p className="text-gray-300 mb-8 text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-8 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Gamerplug ("the Service"), you accept and agree to be bound 
              by the terms and provision of this agreement. If you do not agree to abide by the 
              above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily use Gamerplug for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained in the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Content Guidelines</h2>
            <p className="mb-4">
              When using Gamerplug, you agree not to post, upload, or share content that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Is illegal, harmful, threatening, abusive, or offensive</li>
              <li>Violates any intellectual property rights</li>
              <li>Contains malware or other harmful code</li>
              <li>Is spam or unsolicited promotional material</li>
              <li>Impersonates another person or entity</li>
              <li>Violates privacy rights of others</li>
              <li>Contains explicit or inappropriate material</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Gaming Content</h2>
            <p className="mb-4">
              For gaming clips and content shared on the platform:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain ownership of your original content</li>
              <li>You grant us a license to display and distribute your content on the platform</li>
              <li>Content must comply with game publishers' terms of service</li>
              <li>We reserve the right to remove content that violates these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Prohibited Uses</h2>
            <p className="mb-4">You may not use the Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>For any unlawful purpose or to solicit unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations or laws</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To interfere with or circumvent the security features of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Service Availability</h2>
            <p>
              We strive to keep the Service available at all times, but we do not guarantee 
              uninterrupted access. The Service may be temporarily unavailable due to maintenance, 
              updates, or circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, 
              without prior notice or liability, for any reason, including if you breach the Terms. 
              You may also delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Disclaimer</h2>
            <p>
              The Service is provided "as is" without any representations or warranties. We 
              disclaim all warranties, whether express or implied, including but not limited 
              to implied warranties of merchantability and fitness for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Limitation of Liability</h2>
            <p>
              In no event shall Gamerplug or its suppliers be liable for any damages arising 
              out of or in connection with your use of the Service. This limitation applies 
              to all damages of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the 
              laws and regulations of the jurisdiction where Gamerplug operates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the Service after changes constitutes 
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">13. Contact Information</h2>
            <p>
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