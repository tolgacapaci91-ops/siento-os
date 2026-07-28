"use client";

import React, { useRef, useState, useEffect } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LessonVideoPlayerProps {
  embedUrl: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onVideoEnd?: () => void;
  isCompleted?: boolean;
}

export const LessonVideoPlayer = React.memo(function LessonVideoPlayer({
  embedUrl,
  onPrevious,
  onNext,
  onVideoEnd,
  isCompleted = false,
}: LessonVideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const [videoId, setVideoId] = useState<string>("");
  const [maxTimeWatched, setMaxTimeWatched] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Extract video ID from embed URL
    // e.g. https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ
    const match = embedUrl.match(/\/embed\/([^?]+)/);
    if (match && match[1]) {
      setVideoId(match[1]);
      setMaxTimeWatched(0); // Reset max time when video changes
    }
  }, [embedUrl]);

  // Player Options
  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 1, // Disable keyboard controls
      modestbranding: 1,
      rel: 0,
      fs: 1,
    },
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
    // If video ends
    if (event.data === 0) {
      if (onVideoEnd) onVideoEnd();
    }
    // If playing, ensure playback rate is 1 (prevent speeding up)
    if (event.data === 1 && playerRef.current) {
      playerRef.current.setPlaybackRate(1);
    }
  };

  const onPlaybackRateChange: YouTubeProps["onPlaybackRateChange"] = (event) => {
    if (playerRef.current && playerRef.current.getPlaybackRate() > 1 && !isCompleted) {
      playerRef.current.setPlaybackRate(1);
      triggerWarning();
    }
  };

  // Monitor playback time to prevent skipping
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getPlayerState() === 1 && !isCompleted) {
        const currentTime = playerRef.current.getCurrentTime();
        
        // If user jumped ahead by more than 2 seconds from their max watched time
        if (currentTime > maxTimeWatched + 2) {
          playerRef.current.seekTo(maxTimeWatched, true);
          triggerWarning();
        } else {
          // Update max watched time
          if (currentTime > maxTimeWatched) {
            setMaxTimeWatched(currentTime);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [maxTimeWatched, isCompleted]);

  const triggerWarning = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Strict Mode Warning */}
      {showWarning && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          Sistem Uyarısı: İleri sarma ve hızlandırma yapılamaz. Lütfen dersi atlamadan izleyin.
        </div>
      )}

      {/* Video Player container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-indigo-500/30 shadow-2xl bg-black">
        {videoId ? (
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onPlaybackRateChange={onPlaybackRateChange}
            className="w-full h-full absolute inset-0"
            iframeClassName="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            Video yükleniyor...
          </div>
        )}
      </div>

      {/* Navigation */}
      {(onPrevious || onNext) && (
        <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            Önceki Ders
          </Button>

          {/* Sadece sonuna gelindiyse veya daha önceden tamamlandıysa "Sonraki Derse Geç" çıkar */}
          {isCompleted && onNext ? (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={onNext}
              className="bg-emerald-600 hover:bg-emerald-500 animate-in fade-in"
            >
              Sonraki Derse Geç
            </Button>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Dersin bitmesi bekleniyor...
            </div>
          )}
        </div>
      )}
    </div>
  );
});
