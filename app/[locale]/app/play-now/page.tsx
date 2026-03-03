'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, User, TABLES } from '@/lib/supabase';
import { getGameAssetUrl } from '@/lib/assets';
import { useI18n } from '@/components/I18nProvider';
import { Hash, Send, Users } from 'lucide-react';
// ── CALENDAR PANEL — remove this import to disable ──────────────────────────
import { PlayNowCalendar } from './PlayNowCalendar';
// ────────────────────────────────────────────────────────────────────────────

interface GameLobby {
  id: string;
  name: string;
  display_name: string;
  participantCount: number;
  participants: User[];
}

interface ChatMessage {
  id: string;
  gameId: string;
  userId: string;
  gamertag: string;
  profileImageUrl?: string;
  text: string;
  createdAt: string;
}

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PlayNowPage() {
  const { user: authUser } = useAuth();
  const { locale } = useI18n();
  const [gameLobbies, setGameLobbies] = useState<GameLobby[]>([]);
  const [lobbiesLoading, setLobbiesLoading] = useState(true);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [messagesByGame, setMessagesByGame] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState('');
  const chatChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const selectedLobby = useMemo(
    () => gameLobbies.find((lobby) => lobby.id === selectedGameId) ?? null,
    [gameLobbies, selectedGameId]
  );

  const selectedMessages = selectedGameId ? messagesByGame[selectedGameId] ?? [] : [];

  // Scroll to bottom inside the messages container — never touches the page scroll
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedMessages.length, selectedGameId]);

  const fetchLobbyMessages = async (gameId: string) => {
    const { data, error } = await supabase
      .from(TABLES.PLAY_NOW_MESSAGES)
      .select('id,game_id,user_id,gamertag,profile_image_url,message_text,created_at')
      .eq('game_id', gameId)
      .order('created_at', { ascending: true })
      .limit(150);

    if (error) {
      console.error('Error fetching play now messages:', error);
      return;
    }

    const mappedMessages: ChatMessage[] = (data ?? []).map((row) => ({
      id: row.id,
      gameId: row.game_id,
      userId: row.user_id,
      gamertag: row.gamertag,
      profileImageUrl: row.profile_image_url ?? undefined,
      text: row.message_text,
      createdAt: row.created_at,
    }));

    setMessagesByGame((prev) => ({ ...prev, [gameId]: mappedMessages }));
  };

  useEffect(() => {
    if (authUser?.id) void fetchGameLobbies();
  }, [authUser?.id]);

  useEffect(() => {
    if (!selectedGameId) return;

    void fetchLobbyMessages(selectedGameId);

    const channel = supabase.channel(`game-chat:${selectedGameId}`, {
      config: { broadcast: { self: false } },
    });

    chatChannelRef.current = channel;

    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        const incomingMessage = payload as ChatMessage;
        if (!incomingMessage?.id || incomingMessage.gameId !== selectedGameId) return;

        setMessagesByGame((prev) => {
          const existing = prev[selectedGameId] ?? [];
          if (existing.some((msg) => msg.id === incomingMessage.id)) return prev;
          return {
            ...prev,
            [selectedGameId]: [...existing, incomingMessage].slice(-150),
          };
        });
      })
      .subscribe();

    return () => {
      chatChannelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [selectedGameId]);

  const fetchGameLobbies = async () => {
    try {
      setLobbiesLoading(true);

      const { data: gamesData, error: gamesError } = await supabase
        .from(TABLES.GAMES)
        .select('id,name,display_name')
        .order('display_name', { ascending: true });

      if (gamesError) {
        console.error('Error fetching games for lobbies:', gamesError);
        setGameLobbies([]);
        return;
      }

      const { data: userGamesData, error: userGamesError } = await supabase
        .from(TABLES.USER_GAMES)
        .select('game_id,user_id');

      if (userGamesError) console.error('Error fetching user games for lobbies:', userGamesError);

      const userGameRows = userGamesData ?? [];
      const uniqueUserIds = [...new Set(userGameRows.map((row) => row.user_id).filter(Boolean))];

      let usersById: Record<string, User> = {};

      if (uniqueUserIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from(TABLES.USERS)
          .select('id,gamertag,profile_image_url,age,platform,created_at')
          .in('id', uniqueUserIds);

        if (usersError) {
          console.error('Error fetching lobby users:', usersError);
        } else {
          usersById = (usersData ?? []).reduce<Record<string, User>>((acc, current) => {
            acc[current.id] = current as User;
            return acc;
          }, {});
        }
      }

      const participantsByGame = userGameRows.reduce<Record<string, User[]>>((acc, row) => {
        const user = usersById[row.user_id];
        if (!user) return acc;
        const existingUsers = acc[row.game_id] ?? [];
        if (!existingUsers.some((u) => u.id === user.id)) existingUsers.push(user);
        acc[row.game_id] = existingUsers;
        return acc;
      }, {});

      const lobbies: GameLobby[] = (gamesData ?? []).map((game) => {
        const participants = participantsByGame[game.id] ?? [];
        return {
          id: game.id,
          name: game.name,
          display_name: game.display_name,
          participantCount: participants.length,
          participants,
        };
      });

      setGameLobbies(lobbies);
      setSelectedGameId((current) => {
        if (current && lobbies.some((l) => l.id === current)) return current;
        return lobbies[0]?.id ?? null;
      });
    } catch (error) {
      console.error('Error while building game lobbies:', error);
      setGameLobbies([]);
    } finally {
      setLobbiesLoading(false);
    }
  };

  const sendGroupMessage = async () => {
    if (!authUser?.id || !selectedGameId) return;

    const text = chatInput.trim();
    if (!text) return;

    const currentUserProfile =
      selectedLobby?.participants.find((p) => p.id === authUser.id) ?? null;

    const outgoingMessage: ChatMessage = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      gameId: selectedGameId,
      userId: authUser.id,
      gamertag: currentUserProfile?.gamertag ?? authUser.gamertag ?? 'Gamer',
      profileImageUrl: currentUserProfile?.profile_image_url,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessagesByGame((prev) => ({
      ...prev,
      [selectedGameId]: [...(prev[selectedGameId] ?? []), outgoingMessage].slice(-150),
    }));
    setChatInput('');

    const { error: insertError } = await supabase.from(TABLES.PLAY_NOW_MESSAGES).insert({
      id: outgoingMessage.id,
      game_id: outgoingMessage.gameId,
      user_id: outgoingMessage.userId,
      gamertag: outgoingMessage.gamertag,
      profile_image_url: outgoingMessage.profileImageUrl ?? null,
      message_text: outgoingMessage.text,
      created_at: outgoingMessage.createdAt,
    });

    if (insertError) console.error('Unable to persist lobby message:', insertError);

    const result = await chatChannelRef.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: outgoingMessage,
    });

    if (result !== 'ok') console.error('Unable to send group chat message:', result);
  };

  if (lobbiesLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
        {/* Icon strip skeleton */}
        <div className="flex w-20 flex-shrink-0 flex-col items-center gap-3 border-r border-border bg-card py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
          ))}
        </div>

        {/* Chat skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden bg-card">
          {/* Header */}
          <div className="flex h-12 flex-shrink-0 items-center gap-3 border-b border-border px-6">
            <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-6 px-6 py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-12 animate-pulse rounded bg-white/5" />
                  </div>
                  <div className={`h-3 animate-pulse rounded bg-white/10 ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
                  {i % 3 === 0 && <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-6 pb-6 pt-3">
            <div className="h-11 animate-pulse rounded-lg bg-white/5 border border-border" />
          </div>
        </div>

        {/* Calendar skeleton */}
        <div className="hidden w-72 flex-shrink-0 flex-col border-l border-border bg-card lg:flex">
          <div className="flex h-12 items-center justify-between border-b border-border px-4">
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
          </div>
          <div className="border-b border-border px-4 py-3 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-10 animate-pulse rounded bg-white/10" />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="mx-auto h-7 w-7 animate-pulse rounded-full bg-white/5" />
              ))}
            </div>
          </div>
          <div className="flex-1 px-4 py-3 space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
      {/* ── Game icon strip ── */}
      <div className="flex w-20 flex-shrink-0 flex-col items-center gap-3 overflow-y-auto border-r border-border bg-card py-4">
        {gameLobbies.map((lobby) => {
          const isSelected = lobby.id === selectedGameId;
          return (
            <div key={lobby.id} className="group relative flex w-full items-center justify-center py-1">
              {/* Brand-red active/hover pill indicator */}
              <span
                className={`absolute left-0 w-1 rounded-r-full bg-primary transition-all duration-300 ${
                  isSelected
                    ? 'h-10 opacity-100'
                    : 'h-5 opacity-0 group-hover:opacity-100'
                }`}
              />
              <button
                onClick={() => setSelectedGameId(lobby.id)}
                title={lobby.display_name}
                className={`h-12 w-12 cursor-pointer overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'rounded-2xl ring-2 ring-primary/70'
                    : 'rounded-full group-hover:rounded-2xl group-hover:ring-2 group-hover:ring-primary/40'
                }`}
              >
                <Image
                  src={getGameAssetUrl(lobby.display_name)}
                  alt={lobby.display_name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Main chat area ── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-card">
        {/* Header */}
        <div className="flex h-12 flex-shrink-0 items-center gap-2 border-b border-border px-6 shadow-sm">
          <Hash size={20} className="text-primary" strokeWidth={2.5} />
          <span className="font-bold text-white">
            {selectedLobby?.display_name ?? 'Play Now'}
          </span>
          {selectedLobby && (
            <>
              <div className="mx-2 h-5 w-px bg-border" />
              <Users size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {selectedLobby.participantCount} online
              </span>
            </>
          )}
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {!selectedLobby ? (
            <p className="text-sm text-muted-foreground">Select a game to open its lobby chat.</p>
          ) : selectedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-primary/40">
                <Image
                  src={getGameAssetUrl(selectedLobby.display_name)}
                  alt={selectedLobby.display_name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              <p className="font-bold text-white">
                Welcome to{' '}
                <span className="text-primary">#{selectedLobby.display_name}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This is the start of the {selectedLobby.display_name} lobby. Be the first to say something!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {selectedMessages.map((message, i) => {
                const isMine = message.userId === authUser?.id;
                const prevMessage = selectedMessages[i - 1];
                const isGrouped =
                  prevMessage?.userId === message.userId &&
                  new Date(message.createdAt).getTime() -
                    new Date(prevMessage.createdAt).getTime() <
                    5 * 60 * 1000;

                return (
                  <div
                    key={message.id}
                    className={`group flex items-start gap-4 rounded-lg px-3 py-1 transition-all duration-300 hover:bg-secondary/50 ${
                      !isGrouped ? 'mt-4' : ''
                    }`}
                  >
                    {/* Avatar or spacer */}
                    <div className="w-10 flex-shrink-0 pt-0.5">
                      {!isGrouped ? (
                        message.profileImageUrl ? (
                          <Image
                            src={message.profileImageUrl}
                            alt={message.gamertag}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold uppercase text-primary ring-1 ring-primary/30">
                            {message.gamertag[0]}
                          </div>
                        )
                      ) : null}
                    </div>

                    {/* Message content */}
                    <div className="min-w-0 flex-1">
                      {!isGrouped && (
                        <div className="mb-1 flex items-baseline gap-2">
                          <Link
                            href={`/${locale}/app/profile/${message.gamertag}`}
                            className={`cursor-pointer text-sm font-semibold leading-none transition-all duration-300 hover:underline ${
                              isMine ? 'text-primary' : 'text-white hover:text-primary'
                            }`}
                          >
                            {message.gamertag}
                          </Link>
                          <span className="text-[11px] text-muted-foreground">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      )}
                      <p className="break-words text-sm leading-relaxed text-white/90">
                        {message.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Input bar */}
        {selectedLobby && (
          <div className="flex-shrink-0 px-6 pb-6 pt-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-input px-4 py-3 transition-all duration-300 focus-within:border-primary/60">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void sendGroupMessage();
                  }
                }}
                placeholder={`Message #${selectedLobby.display_name}`}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => void sendGroupMessage()}
                disabled={!chatInput.trim()}
                className="cursor-pointer text-muted-foreground transition-all duration-300 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CALENDAR PANEL — remove this block + the import above to disable ── */}
      <PlayNowCalendar />
      {/* ──────────────────────────────────────────────────────────────────── */}
    </div>
  );
}
