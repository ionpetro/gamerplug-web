import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ProfileUserPage from "../../../profile/[username]/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: user } = await supabase
    .from('users')
    .select('gamertag, bio, platform')
    .ilike('gamertag', username)
    .single();

  const gamertag = user?.gamertag || username;
  const platforms: string[] = user?.platform || [];
  const platformText = platforms.length > 0 ? ` | ${platforms.join(', ')}` : '';
  const description = user?.bio || `Check out @${gamertag}'s gaming profile on GamerPlug${platformText}`;

  return {
    title: `@${gamertag} — GamerPlug`,
    description,
    openGraph: {
      title: `@${gamertag} — GamerPlug`,
      description,
      type: 'profile',
      username: gamertag,
    },
    twitter: {
      card: 'summary_large_image',
      title: `@${gamertag} — GamerPlug`,
      description,
    },
  };
}

export default function LocalizedProfileUser(props: any) {
  return <ProfileUserPage {...props} />;
}
