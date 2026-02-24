'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, User, TABLES } from '@/lib/supabase';
import { getGameAssetUrl } from '@/lib/assets';
import { useI18n } from '@/components/I18nProvider';
import { Loader2, MessageCircle, Send } from 'lucide-react';

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

export default function PlayNowPage() {
  const { user: authUser } = useAuth();
  const { locale } = useI18n();
  const [gameLobbies, setGameLobbies] = useState<GameLobby[]>([]);
  const [lobbiesLoading, setLobbiesLoading] = useState(true);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [messagesByGame, setMessagesByGame] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState('');
  const chatChannelRef = useRef<RealtimeChannel | null>(null);

  const selectedLobby = useMemo(
    () => gameLobbies.find((lobby) => lobby.id === selectedGameId) ?? null,
    [gameLobbies, selectedGameId]
  );

  const selectedMessages = selectedGameId ? messagesByGame[selectedGameId] ?? [] : [];

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

    setMessagesByGame((prev) => ({
      ...prev,
      [gameId]: mappedMessages,
    }));
  };

  useEffect(() => {
    if (authUser?.id) {
      void fetchGameLobbies();
    }
  }, [authUser?.id]);

  useEffect(() => {
    if (!selectedGameId) return;

    void fetchLobbyMessages(selectedGameId);

    const channel = supabase.channel(`game-chat:${selectedGameId}`, {
      config: {
        broadcast: {
          self: false,
        },
      },
    });

    chatChannelRef.current = channel;

    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        const incomingMessage = payload as ChatMessage;
        if (!incomingMessage?.id || incomingMessage.gameId !== selectedGameId) {
          return;
        }

        setMessagesByGame((prev) => {
          const existing = prev[selectedGameId] ?? [];
          if (existing.some((msg) => msg.id === incomingMessage.id)) {
            return prev;
          }
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

      if (userGamesError) {
        console.error('Error fetching user games for lobbies:', userGamesError);
      }

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
        if (!existingUsers.some((existingUser) => existingUser.id === user.id)) {
          existingUsers.push(user);
        }
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
      setSelectedGameId((currentSelected) => {
        if (currentSelected && lobbies.some((lobby) => lobby.id === currentSelected)) {
          return currentSelected;
        }
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
      selectedLobby?.participants.find((participant) => participant.id === authUser.id) ?? null;
    const fallbackGamertag = authUser.gamertag || 'Gamer';

    const outgoingMessage: ChatMessage = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      gameId: selectedGameId,
      userId: authUser.id,
      gamertag: currentUserProfile?.gamertag ?? fallbackGamertag,
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

    if (insertError) {
      console.error('Unable to persist lobby message:', insertError);
    }

    const result = await chatChannelRef.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: outgoingMessage,
    });

    if (result !== 'ok') {
      console.error('Unable to send group chat message:', result);
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-15%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[190px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/25 blur-[200px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Play Now</h1>
            <p className="text-white/60">Join game lobbies and chat with gamers who picked the same game.</p>
          </div>
          <Link
            href={`/${locale}/app/matches`}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Back to Matches
          </Link>
        </div>

        {lobbiesLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : gameLobbies.length === 0 ? (
          <p className="text-white/60">No games are available yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-[300px_minmax(0,1fr)]">
            <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
              {gameLobbies.map((lobby) => {
                const isSelected = lobby.id === selectedGameId;
                return (
                  <button
                    key={lobby.id}
                    onClick={() => setSelectedGameId(lobby.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-primary/70 bg-primary/15'
                        : 'border-white/10 bg-white/5 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={getGameAssetUrl(lobby.display_name)}
                        alt={lobby.display_name}
                        width={32}
                        height={32}
                        className="rounded-md"
                        unoptimized
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{lobby.display_name}</p>
                        <p className="text-xs text-white/60">
                          {lobby.participantCount} gamer{lobby.participantCount === 1 ? '' : 's'} in lobby
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-3 md:p-4">
              {selectedLobby ? (
                <div className="flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{selectedLobby.display_name} Group Chat</h3>
                      <p className="text-xs text-white/60">
                        {selectedLobby.participantCount} gamer
                        {selectedLobby.participantCount === 1 ? '' : 's'} selected this game
                      </p>
                    </div>
                    <MessageCircle size={18} className="text-primary" />
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedLobby.participants.slice(0, 10).map((participant) => (
                      <Link
                        key={participant.id}
                        href={`/${locale}/app/profile/${participant.gamertag}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:border-primary/50"
                      >
                        {participant.profile_image_url ? (
                          <Image
                            src={participant.profile_image_url}
                            alt={participant.gamertag}
                            width={18}
                            height={18}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-[18px] w-[18px] rounded-full bg-white/10" />
                        )}
                        @{participant.gamertag}
                      </Link>
                    ))}
                  </div>

                  <div className="h-[52vh] min-h-72 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-3">
                    {selectedMessages.length === 0 ? (
                      <p className="text-sm text-white/50">No messages yet. Start the lobby chat.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedMessages.map((message) => {
                          const isMine = message.userId === authUser?.id;
                          return (
                            <div
                              key={message.id}
                              className={`max-w-[85%] rounded-lg border px-3 py-2 text-sm ${
                                isMine
                                  ? 'ml-auto border-primary/40 bg-primary/25'
                                  : 'border-white/10 bg-white/10'
                              }`}
                            >
                              <p className="mb-0.5 text-xs text-white/60">@{message.gamertag}</p>
                              <p className="break-words">{message.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          void sendGroupMessage();
                        }
                      }}
                      placeholder={`Message ${selectedLobby.display_name} gamers...`}
                      className="h-10 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-primary/60"
                    />
                    <button
                      onClick={() => void sendGroupMessage()}
                      className="inline-flex h-10 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary/90"
                    >
                      <Send size={14} />
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/60">Select a game to open its group chat.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
