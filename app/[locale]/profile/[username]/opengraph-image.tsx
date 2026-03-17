import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const alt = 'GamerPlug Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CLOUDFRONT_DOMAIN = 'd11fcxbq4rxmpu.cloudfront.net';
const RED = '#FF0034';

const platformFileMap: Record<string, string> = {
  PC: 'PC.png',
  PS5: 'PS.png',
  Xbox: 'Xbox.png',
  'Nintendo Switch': 'Nitendo.png',
};

function getPlatformUrl(name: string) {
  const file = platformFileMap[name] || `${name}.png`;
  return `https://${CLOUDFRONT_DOMAIN}/assets/${file}`;
}

async function loadGoogleFont(family: string, weight: number, text?: string) {
  const params = new URLSearchParams({
    family: `${family}:wght@${weight}`,
    ...(text ? { text } : {}),
  });

  const css = await fetch(
    `https://fonts.googleapis.com/css2?${params}`,
    {
      headers: {
        // Use a browser-like UA so Google returns a .ttf URL (not woff2)
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    }
  ).then((res) => res.text());

  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) {
    throw new Error(`Could not find font URL for ${family}:${weight}`);
  }

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

async function loadFonts(text: string) {
  const [interBold, spaceMono] = await Promise.all([
    loadGoogleFont('Inter', 700),
    loadGoogleFont('Space Mono', 400, text),
  ]);

  return [
    { name: 'Inter', data: interBold, style: 'normal' as const, weight: 700 as const },
    { name: 'Space Mono', data: spaceMono, style: 'normal' as const, weight: 400 as const },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}) {
  const { username } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [fonts, userData] = await Promise.all([
    loadFonts(`@${username}`),
    supabase
      .from('users')
      .select('id, gamertag, profile_image_url, platform, referred_by_user_id')
      .ilike('gamertag', username)
      .single()
      .then((res) => res.data),
  ]);

  const gamertag = userData?.gamertag || username;
  const profileImage = userData?.profile_image_url;
  const platforms: string[] = userData?.platform || [];

  // Fetch referral data in parallel
  const [referrerData, referredUsersData] = await Promise.all([
    userData?.referred_by_user_id
      ? supabase
          .from('users')
          .select('gamertag, profile_image_url')
          .eq('id', userData.referred_by_user_id)
          .maybeSingle()
          .then((res) => res.data)
      : Promise.resolve(null),
    userData?.id
      ? supabase
          .from('users')
          .select('id, profile_image_url')
          .eq('referred_by_user_id', userData.id)
          .order('created_at', { ascending: false })
          .limit(5)
          .then((res) => res.data || [])
      : Promise.resolve([]),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D0D0D',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Red gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'linear-gradient(135deg, #0D0D0D 0%, #1a0008 35%, #2a0010 50%, #1a0008 65%, #0D0D0D 100%)',
          }}
        />

        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(to right, #202020 1px, transparent 1px), linear-gradient(to bottom, #202020 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            opacity: 0.35,
          }}
        />

        {/* Top-left logo */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://gamerplug.app/logo.png"
            alt=""
            width={48}
            height={48}
          />
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: 'Inter',
              letterSpacing: '-0.02em',
              color: '#fff',
              display: 'flex',
            }}
          >
            GAMER
            <span style={{ color: RED }}>PLUG</span>
          </span>
        </div>

        {/* Profile picture */}
        <div
          style={{
            display: 'flex',
            width: 148,
            height: 148,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `3px solid ${RED}`,
            boxShadow: `0 0 40px ${RED}33, 0 0 80px ${RED}18`,
            marginBottom: 24,
          }}
        >
          {profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileImage}
              alt=""
              width={148}
              height={148}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#141414',
                fontSize: 56,
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              ?
            </div>
          )}
        </div>

        {/* Username + referrer badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 48,
              fontWeight: 400,
              fontFamily: 'Space Mono',
              color: '#fff',
            }}
          >
            @{gamertag}
          </div>
          {referrerData && (
            <div
              style={{
                display: 'flex',
                width: 36,
                height: 36,
                borderRadius: 8,
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.15)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  referrerData.profile_image_url ||
                  'https://gamerplug.app/images/logo-no-back.png'
                }
                alt=""
                width={36}
                height={36}
                style={{
                  objectFit: referrerData.profile_image_url
                    ? 'cover'
                    : 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          )}
        </div>

        {/* Platforms */}
        {platforms.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 12,
            }}
          >
            {platforms.map((p) => (
              <div
                key={p}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 20px',
                  borderRadius: 10,
                  backgroundColor: '#141414',
                  border: '1px solid #262626',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPlatformUrl(p)}
                  alt=""
                  width={22}
                  height={22}
                  style={{ objectFit: 'contain' }}
                />
                <span
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: 'Inter',
                  }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${RED}, transparent)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
