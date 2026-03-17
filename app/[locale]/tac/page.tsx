'use client';

import { useI18n } from '@/components/I18nProvider';
import { Footer } from '@/components/Footer';
import { FileText } from 'lucide-react';

const LAST_UPDATED_BY_LOCALE = {
  en: 'March 17, 2026',
  es: '17 de marzo de 2026',
  ja: '2026年3月17日',
} as const;

type SectionDef =
  | { num: string; titleKey: string; descKey: string }
  | { num: string; titleKey: string; descKey: string; listKeys: string[] };

const sections: SectionDef[] = [
  { num: '01', titleKey: 's01Title', descKey: 's01Desc' },
  { num: '02', titleKey: 's02Title', descKey: 's02Desc', listKeys: ['s02L1', 's02L2', 's02L3', 's02L4'] },
  { num: '03', titleKey: 's03Title', descKey: 's03Desc', listKeys: ['s03L1', 's03L2', 's03L3', 's03L4'] },
  { num: '04', titleKey: 's04Title', descKey: 's04Desc', listKeys: ['s04L1', 's04L2', 's04L3', 's04L4', 's04L5', 's04L6', 's04L7'] },
  { num: '05', titleKey: 's05Title', descKey: 's05Desc', listKeys: ['s05L1', 's05L2', 's05L3', 's05L4'] },
  { num: '06', titleKey: 's06Title', descKey: 's06Desc', listKeys: ['s06L1', 's06L2', 's06L3', 's06L4', 's06L5'] },
  { num: '07', titleKey: 's07Title', descKey: 's07Desc' },
  { num: '08', titleKey: 's08Title', descKey: 's08Desc' },
  { num: '09', titleKey: 's09Title', descKey: 's09Desc' },
  { num: '10', titleKey: 's10Title', descKey: 's10Desc' },
  { num: '11', titleKey: 's11Title', descKey: 's11Desc' },
  { num: '12', titleKey: 's12Title', descKey: 's12Desc' },
  { num: '13', titleKey: 's13Title', descKey: 's13Desc' },
];

const fallbacks: Record<string, string> = {
  title: 'Terms &',
  titleHighlight: 'Conditions',
  lastUpdated: 'Last updated: {date}',
  s01Title: 'Acceptance of Terms',
  s01Desc: 'By accessing and using Gamerplug ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
  s02Title: 'Use License',
  s02Desc: 'Permission is granted to temporarily use Gamerplug for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
  s02L1: 'Modify or copy the materials',
  s02L2: 'Use the materials for any commercial purpose or for any public display',
  s02L3: 'Attempt to reverse engineer any software contained in the Service',
  s02L4: 'Remove any copyright or other proprietary notations from the materials',
  s03Title: 'User Accounts',
  s03Desc: 'To access certain features of the Service, you must create an account. You agree to:',
  s03L1: 'Provide accurate, current, and complete information',
  s03L2: 'Maintain the security of your password',
  s03L3: 'Accept responsibility for all activities under your account',
  s03L4: 'Notify us immediately of any unauthorized use of your account',
  s04Title: 'Content Guidelines',
  s04Desc: 'When using Gamerplug, you agree not to post, upload, or share content that:',
  s04L1: 'Is illegal, harmful, threatening, abusive, or offensive',
  s04L2: 'Violates any intellectual property rights',
  s04L3: 'Contains malware or other harmful code',
  s04L4: 'Is spam or unsolicited promotional material',
  s04L5: 'Impersonates another person or entity',
  s04L6: 'Violates privacy rights of others',
  s04L7: 'Contains explicit or inappropriate material',
  s05Title: 'Gaming Content',
  s05Desc: 'For gaming clips and content shared on the platform:',
  s05L1: 'You retain ownership of your original content',
  s05L2: 'You grant us a license to display and distribute your content on the platform',
  s05L3: 'Content must comply with game publishers\' terms of service',
  s05L4: 'We reserve the right to remove content that violates these terms',
  s06Title: 'Prohibited Uses',
  s06Desc: 'You may not use the Service:',
  s06L1: 'For any unlawful purpose or to solicit unlawful acts',
  s06L2: 'To violate any international, federal, provincial, or state regulations or laws',
  s06L3: 'To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate',
  s06L4: 'To submit false or misleading information',
  s06L5: 'To interfere with or circumvent the security features of the Service',
  s07Title: 'Service Availability',
  s07Desc: 'We strive to keep the Service available at all times, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.',
  s08Title: 'Termination',
  s08Desc: 'We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach the Terms. You may also delete your account at any time.',
  s09Title: 'Disclaimer',
  s09Desc: 'The Service is provided "as is" without any representations or warranties. We disclaim all warranties, whether express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.',
  s10Title: 'Limitation of Liability',
  s10Desc: 'In no event shall Gamerplug or its suppliers be liable for any damages arising out of or in connection with your use of the Service. This limitation applies to all damages of any kind.',
  s11Title: 'Governing Law',
  s11Desc: 'These terms and conditions are governed by and construed in accordance with the laws and regulations of the jurisdiction where Gamerplug operates.',
  s12Title: 'Changes to Terms',
  s12Desc: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the new terms.',
  s13Title: 'Contact Information',
  s13Desc: 'If you have any questions about these Terms & Conditions, please contact us through our app or official social media channels.',
};

function getT(tac: Record<string, string> | undefined, key: string): string {
  return tac?.[key] || fallbacks[key] || key;
}

export default function LocalizedTac() {
  const { locale = 'en', t } = useI18n();
  const tac = t.tac as Record<string, string> | undefined;

  const lastUpdated = getT(tac, 'lastUpdated').replace('{date}', LAST_UPDATED_BY_LOCALE[locale as keyof typeof LAST_UPDATED_BY_LOCALE] || LAST_UPDATED_BY_LOCALE.en);

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
            {getT(tac, 'title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {getT(tac, 'titleHighlight')}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg border-l-2 border-border pl-6 inline-block">
            {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {sections.map((sec) => (
            <section
              key={sec.num}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h2 className="text-3xl font-bold mb-6 text-foreground relative z-10 uppercase tracking-tight">
                <span className="text-primary">{sec.num}.</span> {getT(tac, sec.titleKey)}
              </h2>
              <p className={`text-muted-foreground leading-relaxed relative z-10${'listKeys' in sec ? ' mb-6' : ''}`}>
                {getT(tac, sec.descKey)}
              </p>
              {'listKeys' in sec && (
                <ul className="space-y-3 relative z-10">
                  {sec.listKeys.map((lk) => (
                    <li key={lk} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-muted-foreground">{getT(tac, lk)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
