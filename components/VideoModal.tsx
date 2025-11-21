'use client';

import { useEffect, useRef } from 'react';
import { Clip } from '@/lib/supabase';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: Clip[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function VideoModal({
  isOpen,
  onClose,
  clips,
  currentIndex,
  onNext,
  onPrev,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentClip = clips[currentIndex];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  // Reset video when clip changes
  useEffect(() => {
    if (videoRef.current && currentClip) {
      videoRef.current.load();
    }
  }, [currentClip]);

  if (!isOpen || !currentClip) return null;

  const hasNext = currentIndex < clips.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
        )}

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        )}

        {/* Video Container */}
        <div className="relative h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] aspect-[9/16] max-w-[calc(100vw-3rem)] bg-black rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            <source src={currentClip.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                {currentClip.title && (
                  <h3 className="text-white text-lg font-semibold mb-1">
                    {currentClip.title}
                  </h3>
                )}
                {currentClip.description && (
                  <p className="text-white/80 text-sm">
                    {currentClip.description}
                  </p>
                )}
              </div>
              <div className="text-white/60 text-sm">
                {currentIndex + 1} of {clips.length}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        {clips.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {clips.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const diff = index - currentIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNext();
                  } else if (diff < 0) {
                    for (let i = 0; i < Math.abs(diff); i++) onPrev();
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[#FF3B30] w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
