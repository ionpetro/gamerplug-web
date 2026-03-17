'use client';

import { useI18n } from '@/components/I18nProvider';
import { Footer } from '@/components/Footer';
import { Shield } from 'lucide-react';

const LAST_UPDATED_BY_LOCALE = {
  en: 'March 17, 2026',
  es: '17 de marzo de 2026',
  ja: '2026年3月17日',
} as const;

type SectionDef =
  | { num: string; titleKey: string; descKey: string }
  | { num: string; titleKey: string; descKey: string; listKeys: string[] };

const sections: SectionDef[] = [
  { num: '01', titleKey: 's01Title', descKey: 's01Desc', listKeys: ['s01L1', 's01L2', 's01L3', 's01L4', 's01L5'] },
  { num: '02', titleKey: 's02Title', descKey: 's02Desc', listKeys: ['s02L1', 's02L2', 's02L3', 's02L4', 's02L5', 's02L6'] },
  { num: '03', titleKey: 's03Title', descKey: 's03Desc', listKeys: ['s03L1', 's03L2', 's03L3', 's03L4'] },
  { num: '04', titleKey: 's04Title', descKey: 's04Desc' },
  { num: '05', titleKey: 's05Title', descKey: 's05Desc' },
  { num: '06', titleKey: 's06Title', descKey: 's06Desc', listKeys: ['s06L1', 's06L2', 's06L3', 's06L4', 's06L5'] },
  { num: '07', titleKey: 's07Title', descKey: 's07Desc' },
  { num: '08', titleKey: 's08Title', descKey: 's08Desc' },
  { num: '09', titleKey: 's09Title', descKey: 's09Desc' },
];

const fallbacks: Record<string, string> = {
  title: 'Privacy',
  titleHighlight: 'Policy',
  lastUpdated: 'Last updated: {date}',
  s01Title: 'Information We Collect',
  s01Desc: 'We collect information you provide directly to us, such as when you create an account, upload gaming clips, or contact us for support.',
  s01L1: 'Account information (username, email address)',
  s01L2: 'Gaming profiles and gamertags',
  s01L3: 'Gaming clips and videos you upload',
  s01L4: 'Profile information and preferences',
  s01L5: 'Communication records with other users',
  s02Title: 'How We Use Your Information',
  s02Desc: 'We use the information we collect to provide, maintain, and improve our services:',
  s02L1: 'To create and manage your account',
  s02L2: 'To enable you to connect with other gamers',
  s02L3: 'To facilitate sharing of gaming content',
  s02L4: 'To send notifications about matches and messages',
  s02L5: 'To improve our app and user experience',
  s02L6: 'To provide customer support',
  s03Title: 'Information Sharing',
  s03Desc: 'We do not sell, trade, or otherwise transfer your personal information to third parties, except:',
  s03L1: 'With your explicit consent',
  s03L2: 'To comply with legal obligations',
  s03L3: 'To protect our rights and the safety of our users',
  s03L4: 'With service providers who assist in operating our platform',
  s04Title: 'Data Security',
  s04Desc: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.',
  s05Title: 'Data Retention',
  s05Desc: 'We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.',
  s06Title: 'Your Rights',
  s06Desc: 'You have the right to:',
  s06L1: 'Access your personal information',
  s06L2: 'Correct inaccurate information',
  s06L3: 'Delete your account and personal information',
  s06L4: 'Opt-out of marketing communications',
  s06L5: 'Export your data',
  s07Title: 'Children\'s Privacy',
  s07Desc: 'Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.',
  s08Title: 'Changes to This Policy',
  s08Desc: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.',
  s09Title: 'Contact Us',
  s09Desc: 'If you have any questions about this privacy policy or our privacy practices, please contact us through our app or social media channels.',
};

function getT(privacy: Record<string, string> | undefined, key: string): string {
  return privacy?.[key] || fallbacks[key] || key;
}

export default function LocalizedPrivacy() {
  const { locale = 'en', t } = useI18n();
  const privacy = t.privacy as Record<string, string> | undefined;

  const lastUpdated = getT(privacy, 'lastUpdated').replace('{date}', LAST_UPDATED_BY_LOCALE[locale as keyof typeof LAST_UPDATED_BY_LOCALE] || LAST_UPDATED_BY_LOCALE.en);

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
            {getT(privacy, 'title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {getT(privacy, 'titleHighlight')}
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
                <span className="text-primary">{sec.num}.</span> {getT(privacy, sec.titleKey)}
              </h2>
              <p className={`text-muted-foreground leading-relaxed relative z-10${'listKeys' in sec ? ' mb-6' : ''}`}>
                {getT(privacy, sec.descKey)}
              </p>
              {'listKeys' in sec && (
                <ul className="space-y-3 relative z-10">
                  {sec.listKeys.map((lk) => (
                    <li key={lk} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-muted-foreground">{getT(privacy, lk)}</span>
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
