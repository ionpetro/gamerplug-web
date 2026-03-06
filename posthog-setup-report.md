<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into GamerPlug Web. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using Next.js 15.3+ instrumentation API. Initializes `posthog-js` with reverse proxy, exception capture, and debug mode in development.
- `lib/posthog-server.ts` — Singleton server-side PostHog client (`posthog-node`) for use in API routes.

**Updated config:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect: true` to route PostHog traffic through the app domain, reducing ad-blocker interception.
- `.env.local` — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` confirmed set.

**Client-side events instrumented:**

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User initiated email sign up (confirmation email sent) | `app/[locale]/login/page.tsx`, `app/[locale]/signup/page.tsx` |
| `user_signed_in` | User successfully signed in with email | `app/[locale]/login/page.tsx`, `app/[locale]/signup/page.tsx` |
| `user_signed_in_google` | User initiated Google OAuth sign in | `app/[locale]/login/page.tsx`, `app/[locale]/signup/page.tsx` |
| `onboarding_completed` | User completed the full onboarding flow and saved their profile | `app/[locale]/app/onboarding/page.tsx` |
| `user_swiped_right` | User liked/swiped right on a gamer in the explore feed | `app/[locale]/app/explore/page.tsx` |
| `user_swiped_left` | User passed/swiped left on a gamer in the explore feed | `app/[locale]/app/explore/page.tsx` |
| `match_occurred` | A mutual match happened between two users | `app/[locale]/app/explore/page.tsx` |
| `pay_to_play_listing_clicked` | User clicked a pay-to-play listing card | `app/[locale]/app/pay-to-play/page.tsx` |
| `pay_to_play_booking_requested` | User submitted a booking request on a listing | `app/[locale]/app/pay-to-play/[identifier]/page.tsx` |

**Server-side events instrumented (posthog-node):**

| Event | Description | File |
|---|---|---|
| `referral_submitted` | User submitted their email via a referral link | `app/api/referrals/route.ts` |
| `waitlist_joined` | User successfully joined the waitlist | `app/api/waitlist/route.ts` |

**User identification:** `posthog.identify()` is called on successful email sign up and sign in (using email as distinct ID), and again on onboarding completion (switching to gamertag). This ensures user journeys are correlated across events.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/333740/dashboard/1337490
- **Signup → Onboarding Completion Funnel:** https://us.posthog.com/project/333740/insights/MMr0PB8D
- **Pay-to-Play Conversion Funnel:** https://us.posthog.com/project/333740/insights/8WMYGEF1
- **Daily Signups & Onboardings:** https://us.posthog.com/project/333740/insights/3zlLJ1NU
- **Daily Swipes & Matches:** https://us.posthog.com/project/333740/insights/wOAmqmvo
- **Referral & Waitlist Signups:** https://us.posthog.com/project/333740/insights/QV8lLEw6

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
