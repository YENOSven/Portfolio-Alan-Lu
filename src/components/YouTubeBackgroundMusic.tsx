import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApiPromise: Promise<void> | null = null;

function loadYouTubeIFrameApi(): Promise<void> {
  if (youTubeApiPromise) return youTubeApiPromise;

  youTubeApiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return youTubeApiPromise;
}

type YouTubeBackgroundMusicProps = {
  /** YouTube video id (the part after v= in the URL). */
  videoId?: string;
  /** If true, don't auto-play on first interaction */
  disableAutoplay?: boolean;
};

// Default: Blue Box (Ao no Hako) - "Grateful" (piano cover)
const DEFAULT_VIDEO_ID = "EBsK_40q4ek";

export function YouTubeBackgroundMusic({
  videoId = DEFAULT_VIDEO_ID,
  disableAutoplay = false,
}: YouTubeBackgroundMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const pendingAutoplayRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(!disableAutoplay); // Show as "on" when autoplay enabled
  const [hasInteracted, setHasInteracted] = useState(!disableAutoplay);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIFrameApi().then(() => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setIsReady(true);
            try {
              playerRef.current?.setVolume?.(30);
              playerRef.current?.unMute?.();
              // Auto-play when ready if not disabled
              if (!disableAutoplay) {
                playerRef.current?.playVideo?.();
              }
            } catch {
              // ignore
            }

            if (pendingAutoplayRef.current) {
              pendingAutoplayRef.current = false;
              try {
                playerRef.current?.playVideo?.();
              } catch {
                // ignore
              }
            }
          },
          onStateChange: (e: any) => {
            // 1: PLAYING, 2: PAUSED, 0: ENDED
            const state = e?.data;
            setIsPlaying(state === 1);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        // ignore
      }
      playerRef.current = null;
      setIsReady(false);
      setIsPlaying(false);
    };
  }, [videoId]);

  useEffect(() => {
    if (disableAutoplay) return;

    const handleFirstInteraction = () => {
      if (hasInteracted) return;
      setHasInteracted(true);

      if (!isReady || !playerRef.current) {
        pendingAutoplayRef.current = true;
        return;
      }

      try {
        playerRef.current?.setVolume?.(30);
        playerRef.current?.unMute?.();
        playerRef.current?.playVideo?.();
      } catch {
        // ignore
      }
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [hasInteracted, isReady, disableAutoplay]);

  const toggleMusic = () => {
    if (!hasInteracted) setHasInteracted(true);

    if (!isReady || !playerRef.current) {
      pendingAutoplayRef.current = true;
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current?.pauseVideo?.();
      } else {
        playerRef.current?.setVolume?.(30);
        playerRef.current?.unMute?.();
        playerRef.current?.playVideo?.();
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Must NOT be display:none or the YouTube player may fail to initialize */}
      <div
        className="fixed left-2 top-2 h-1 w-1 opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        <div ref={containerRef} />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}
