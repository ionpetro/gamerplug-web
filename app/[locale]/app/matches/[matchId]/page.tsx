'use client';

import { FormEvent, startTransition, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Gamepad2, Loader2, Send, Sparkles, Users, X } from 'lucide-react';
import { createGameShareContent, GameShareMessage, isGameShareMessage } from '@/components/matches/GameShareMessage';
import { useAuth } from '@/contexts/AuthContext';
import {
  getMatchById,
  getMessages,
  markMessagesAsRead,
  Message,
  sendMessage,
  subscribeToMessages,
} from '@/lib/chat';
import { supabase, TABLES, User } from '@/lib/supabase';
import { useI18n } from '@/components/I18nProvider';

interface PendingMessage extends Message {
  pending?: boolean;
}

interface UserGameWithGame {
  id: string;
  game_id: string;
  player_id?: string | null;
  games?: {
    id: string;
    display_name: string;
    name: string;
  } | null;
}

function formatMessageTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function MatchChatPage() {
  const params = useParams<{ matchId: string }>();
  useI18n();
  const { user } = useAuth();
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<PendingMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGameSharePicker, setShowGameSharePicker] = useState(false);
  const [shareableGames, setShareableGames] = useState<UserGameWithGame[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const matchId = params?.matchId;

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
    });
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadUserGames = async () => {
      setLoadingGames(true);

      const { data, error: gamesError } = await supabase
        .from(TABLES.USER_GAMES)
        .select('id, game_id, player_id, games(id, display_name, name)')
        .eq('user_id', user.id)
        .not('player_id', 'is', null);

      if (gamesError) {
        console.error('Failed to load user games:', gamesError);
        setShareableGames([]);
      } else {
        const normalizedGames = (data ?? [])
          .filter((item) => item.player_id)
          .map((item) => ({
            id: item.id,
            game_id: item.game_id,
            player_id: item.player_id,
            games: Array.isArray(item.games) ? item.games[0] ?? null : item.games ?? null,
          }));

        setShareableGames(normalizedGames);
      }

      setLoadingGames(false);
    };

    void loadUserGames();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !matchId) {
      return;
    }

    let cancelled = false;

    const loadChat = async () => {
      setLoading(true);
      setError(null);

      try {
        const [match, messageHistory] = await Promise.all([
          getMatchById(matchId),
          getMessages(matchId),
        ]);

        if (!match) {
          throw new Error('Match not found.');
        }

        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const { data: otherUser, error: otherUserError } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .eq('id', otherUserId)
          .single();

        if (otherUserError) {
          throw new Error(otherUserError.message);
        }

        if (cancelled) {
          return;
        }

        setMatchedUser(otherUser);
        setMessages(messageHistory);
        await markMessagesAsRead(matchId, user.id);
        setError(null);
        scrollToBottom('auto');
      } catch (loadError) {
        console.error('Failed to load chat:', loadError);
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load chat.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadChat();

    const unsubscribe = subscribeToMessages(matchId, (message) => {
      startTransition(() => {
        setMessages((current) => {
          if (current.some((candidate) => candidate.id === message.id)) {
            return current;
          }

          return [...current, message];
        });
      });
      scrollToBottom();

      if (message.sender_id !== user.id) {
        void markMessagesAsRead(matchId, user.id);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [matchId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id || !matchId || !draft.trim() || sending) {
      return;
    }

    const content = draft.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: PendingMessage = {
      id: tempId,
      match_id: matchId,
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
      is_read: false,
      sender_gamertag: user.gamertag,
      sender_avatar: user.profile_image_url,
      pending: true,
    };

    setDraft('');
    setError(null);
    setSending(true);
    setMessages((current) => [...current, optimisticMessage]);
    scrollToBottom();

    try {
      const result = await sendMessage({
        matchId,
        senderId: user.id,
        content,
      });

      if (!result.success || !result.message) {
        throw new Error(result.error ?? 'Failed to send message.');
      }

      startTransition(() => {
        setMessages((current) => {
          const withoutTemp = current.filter((message) => message.id !== tempId);
          if (withoutTemp.some((message) => message.id === result.message!.id)) {
            return withoutTemp;
          }

          return [...withoutTemp, result.message!];
        });
      });
    } catch (sendError) {
      console.error('Failed to send message:', sendError);
      setMessages((current) => current.filter((message) => message.id !== tempId));
      setDraft(content);
      setError(sendError instanceof Error ? sendError.message : 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleGameShare = async (game: UserGameWithGame) => {
    if (!user?.id || !matchId || !game.player_id) {
      return;
    }

    const gameName = game.games?.display_name || game.games?.name || 'Game';
    const content = createGameShareContent(gameName, game.player_id);
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: PendingMessage = {
      id: tempId,
      match_id: matchId,
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
      is_read: false,
      sender_gamertag: user.gamertag,
      sender_avatar: user.profile_image_url,
      pending: true,
    };

    setShowGameSharePicker(false);
    setError(null);
    setMessages((current) => [...current, optimisticMessage]);
    scrollToBottom();

    try {
      const result = await sendMessage({
        matchId,
        senderId: user.id,
        content,
      });

      if (!result.success || !result.message) {
        throw new Error(result.error ?? 'Failed to share gamertag.');
      }

      startTransition(() => {
        setMessages((current) => {
          const withoutTemp = current.filter((message) => message.id !== tempId);
          if (withoutTemp.some((message) => message.id === result.message!.id)) {
            return withoutTemp;
          }

          return [...withoutTemp, result.message!];
        });
      });
    } catch (shareError) {
      console.error('Failed to share gamertag:', shareError);
      setMessages((current) => current.filter((message) => message.id !== tempId));
      setError(shareError instanceof Error ? shareError.message : 'Failed to share gamertag.');
    }
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_35%)]">
        <div className="border-b border-white/10 px-5 py-4 sm:px-7">
          {matchedUser ? (
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                {matchedUser.profile_image_url ? (
                  <Image
                    src={matchedUser.profile_image_url}
                    alt={matchedUser.gamertag}
                    width={52}
                    height={52}
                    className="h-[52px] w-[52px] rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/10">
                    <Users size={22} className="text-white/40" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#09090b] bg-primary">
                  <Sparkles size={10} />
                </div>
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-white">{matchedUser.gamertag}</p>
                <p className="truncate text-sm text-white/45">
                  @{matchedUser.gamertag} • lock in a game and keep the chat moving
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/50">Loading conversation...</p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error && !messages.length ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <div>
              <p className="text-lg font-semibold text-white">Unable to open this chat</p>
              <p className="mt-2 text-sm text-white/55">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
              {messages.length ? (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-[85%] sm:max-w-[70%]">
                          {isGameShareMessage(message.content) ? (
                            <GameShareMessage content={message.content} isOwnMessage={isOwnMessage} />
                          ) : (
                            <div
                              className={`rounded-[24px] px-4 py-3 ${
                                isOwnMessage
                                  ? 'rounded-br-md border border-primary/30 bg-gradient-to-r from-primary/90 to-accent/80 text-white shadow-[0_10px_30px_rgba(255,0,52,0.18)]'
                                  : 'rounded-bl-md border border-white/10 bg-white/[0.08] text-white'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                {message.content}
                              </p>
                            </div>
                          )}
                          <div
                            className={`mt-1.5 px-1 text-[11px] ${
                              isOwnMessage ? 'text-right text-white/50' : 'text-left text-white/35'
                            }`}
                          >
                            {message.pending ? 'Sending... • ' : ''}
                            {formatMessageTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center px-6 text-center">
                  <div>
                    <p className="text-lg font-semibold text-white">No messages yet</p>
                    <p className="mt-2 text-sm text-white/55">
                      Start the chat and set up your first session together.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-10 border-t border-white/10 bg-[#09090b]/95 px-4 py-4 backdrop-blur sm:px-6">
              {showGameSharePicker ? (
                <div className="mb-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <div>
                      <p className="text-sm font-semibold text-white">Share your gamertag</p>
                      <p className="text-xs text-white/45">Send one of your saved player IDs</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGameSharePicker(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                    {loadingGames ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 size={18} className="animate-spin text-primary" />
                      </div>
                    ) : shareableGames.length ? (
                      shareableGames.map((game) => {
                        const gameName = game.games?.display_name || game.games?.name || 'Game';
                        return (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => void handleGameShare(game)}
                            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-primary/30 hover:bg-white/[0.06]"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{gameName}</p>
                              <p className="truncate text-sm text-primary">@{game.player_id}</p>
                            </div>
                            <Gamepad2 size={16} className="shrink-0 text-white/35" />
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-white/50">
                        No saved player IDs yet. Add your gamertags on your profile first.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowGameSharePicker((current) => !current)}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition ${
                    showGameSharePicker
                      ? 'bg-primary/15 text-primary'
                      : 'bg-white/[0.06] text-white/70 hover:text-white'
                  }`}
                >
                  <Gamepad2 size={18} />
                </button>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      if (draft.trim() && !sending) {
                        event.currentTarget.form?.requestSubmit();
                      }
                    }
                  }}
                  placeholder={`Message ${matchedUser?.gamertag ?? ''}`}
                  rows={1}
                  className="min-h-12 flex-1 resize-none rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-primary/40"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_30px_rgba(255,0,52,0.22)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
              {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
            </div>
          </>
        )}
      </div>
  );
}
