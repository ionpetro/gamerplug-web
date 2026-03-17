'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Copy, Gamepad2 } from 'lucide-react';
import { getGameAssetUrl } from '@/lib/assets';

export function isGameShareMessage(content: string): boolean {
  return content.includes('🎮') && content.includes('Player ID:') && content.includes('Tap to copy!');
}

export function parseGameShareContent(content: string): { gameName: string; playerId: string } {
  const lines = content.split('\n').filter((line) => line.trim());
  const gameName = lines[0]?.replace('🎮 ', '').trim() || '';
  const playerIdLine = lines.find((line) => line.includes('Player ID:'));
  const playerId = playerIdLine?.replace('Player ID:', '').trim() || '';

  return { gameName, playerId };
}

export function createGameShareContent(gameName: string, playerId: string): string {
  return `🎮 ${gameName}\nPlayer ID: ${playerId}\n\nTap to copy!`;
}

interface GameShareMessageProps {
  content: string;
  isOwnMessage: boolean;
}

export function GameShareMessage({ content, isOwnMessage }: GameShareMessageProps) {
  const { gameName, playerId } = parseGameShareContent(content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!playerId) return;

    try {
      await navigator.clipboard.writeText(playerId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy player ID:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`w-full rounded-[24px] px-4 py-3 text-left transition ${
        isOwnMessage
          ? 'rounded-br-md border border-primary/30 bg-gradient-to-r from-primary/90 to-accent/80 text-white shadow-[0_10px_30px_rgba(255,0,52,0.18)]'
          : 'rounded-bl-md border border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.1]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-black/20">
          {gameName ? (
            <Image
              src={getGameAssetUrl(gameName)}
              alt={gameName}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Gamepad2 size={18} className="text-white/50" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{gameName}</p>
          <p className={`mt-1 truncate text-sm ${isOwnMessage ? 'text-white/90' : 'text-primary'}`}>
            @{playerId}
          </p>
        </div>

        <div className={`shrink-0 ${isOwnMessage ? 'text-white' : 'text-primary'}`}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </div>
      </div>
    </button>
  );
}
