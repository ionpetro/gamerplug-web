'use client';

import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, MessageCircle, Sparkles, Users } from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/components/I18nProvider';
import { getPlatformAssetUrl } from '@/lib/assets';
import { getMatchConversations, MatchConversation } from '@/lib/chat';

interface MatchesShellProps {
  activeMatchId?: string;
  children: ReactNode;
}

function formatRelativeLabel(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getPreviewText(match: MatchConversation) {
  if (!match.last_message) {
    return 'You matched. Say hello to start the chat.';
  }

  return match.last_message.content;
}

export function MatchesShell({ activeMatchId, children }: MatchesShellProps) {
  const { user } = useAuth();
  const { locale } = useI18n();
  const [matches, setMatches] = useState<MatchConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadMatches = async () => {
      setLoading(true);
      try {
        const conversations = await getMatchConversations(user.id);
        setMatches(conversations);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadMatches();
  }, [user?.id]);

  const needsReply = (match: MatchConversation) =>
    !!user?.id &&
    !!match.last_message &&
    match.last_message.sender_id !== user.id &&
    match.unread_count > 0;

  const filteredMatches = matches.filter((match) => {
    const matchesFilter = filter === 'all' || needsReply(match);
    const haystack = `${match.matched_user.gamertag} ${getPreviewText(match)}`.toLowerCase();
    const matchesSearch = haystack.includes(search.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-background">
      <div className="flex h-full items-center justify-center px-6 py-10 xl:hidden">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageCircle size={30} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-white">Use the app to chat</h1>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Matches and messaging work best in the GamerPlug mobile app. Open the app to reply faster, share gamertags, and keep conversations in sync.
          </p>
          <div className="mt-6">
            <DownloadButton />
          </div>
          <Link
            href={`/${locale}/app/explore`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
          >
            <Users size={14} />
            Back to Explore
          </Link>
        </div>
      </div>

      <div className="relative mx-auto hidden h-full min-h-0 w-full max-w-[1400px] flex-1 px-4 py-4 sm:px-6 sm:py-6 xl:flex">
        <div className="grid h-full min-h-0 w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#09090b]/90 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex h-full min-h-0 flex-col overflow-hidden border-b border-white/10 bg-white/[0.03] xl:border-b-0 xl:border-r">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold text-white">Chat</h1>
                  <p className="text-sm text-white/45">Your matches and active threads</p>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-white/[0.05] px-4 py-3 text-white/50 ring-1 ring-white/8 transition focus-within:ring-primary/40">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filter === 'all' ? 'bg-white text-black' : 'bg-white/[0.05] text-white/60 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filter === 'unread' ? 'bg-white text-black' : 'bg-white/[0.05] text-white/60 hover:text-white'
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex h-full items-center justify-center py-16">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
              ) : filteredMatches.length ? (
                <div className="divide-y divide-white/6">
                  {filteredMatches.map((match) => {
                    const isActive = match.id === activeMatchId;
                    const previewText = getPreviewText(match);
                    const showUnreadDot = needsReply(match);

                    return (
                      <Link
                        key={match.id}
                        href={`/${locale}/app/matches/${match.id}`}
                        className={`flex items-center gap-3 px-4 py-4 transition ${
                          isActive ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="relative shrink-0">
                          {match.matched_user.profile_image_url ? (
                            <Image
                              src={match.matched_user.profile_image_url}
                              alt={match.matched_user.gamertag}
                              width={50}
                              height={50}
                              className="h-[50px] w-[50px] rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white/10">
                              <Users size={20} className="text-white/40" />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#09090b] bg-primary">
                            <Sparkles size={8} />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {match.matched_user.gamertag}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs text-white/35">
                              {formatRelativeLabel(match.last_message?.created_at ?? match.created_at)}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center gap-2">
                            {match.matched_user.platform && Array.isArray(match.matched_user.platform) ? (
                              <div className="flex shrink-0 gap-1">
                                {match.matched_user.platform.slice(0, 2).map((platform) => {
                                  const iconUrl = getPlatformAssetUrl(platform);
                                  return iconUrl ? (
                                    <Image
                                      key={platform}
                                      src={iconUrl}
                                      alt={platform}
                                      width={12}
                                      height={12}
                                      className="rounded-sm opacity-80"
                                      unoptimized
                                    />
                                  ) : null;
                                })}
                              </div>
                            ) : null}

                            <p className="truncate text-sm text-white/50">{previewText}</p>
                          </div>
                        </div>

                        {showUnreadDot ? (
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_rgba(255,0,52,0.55)]" />
                        ) : (
                          <MessageCircle size={16} className="text-white/18" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center px-6 py-16 text-center">
                  <div>
                    <p className="text-base font-semibold text-white">No conversations found</p>
                    <p className="mt-2 text-sm text-white/45">
                      Try a different search or start matching more gamers.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section className="flex h-full min-h-0 flex-col overflow-hidden">{children}</section>
        </div>
      </div>
    </div>
  );
}
