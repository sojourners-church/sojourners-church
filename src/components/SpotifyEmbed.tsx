import { CircleX } from "lucide-react";
import { type FC, useEffect, useRef, useState } from "react";

import StyledText from "@/components/StyledText";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpotifyEmbedController, SpotifyIframeApi } from "@/data/types";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

interface SpotifyEmbedProps {
  isCompact: boolean;
  URI: string;
  title: string;
}

const SpotifyEmbed: FC<SpotifyEmbedProps> = ({ isCompact, URI, title }) => {
  const isVideo = !isCompact;
  const isAudio = isCompact;

  const videoURL = `https://open.spotify.com/embed/episode/${URI}/video?utm_source=generator`;

  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const audioFrameRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const [iFrameAPI, setIFrameAPI] = useState<SpotifyIframeApi | null>(null);

  const LOAD_TIMEOUT_MS = 5000;

  // Load Spotify API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;

    script.onerror = () => {
      setHasError(true);
      console.log("script.onerror!");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Wait for API
  useEffect(() => {
    if (iFrameAPI || hasError) return;

    window.onSpotifyIframeApiReady = (SpotifyIframeApi) => {
      setIFrameAPI(SpotifyIframeApi);
    };
  }, [iFrameAPI, hasError]);

  // Create Player
  useEffect(() => {
    if (
      !iFrameAPI ||
      !audioFrameRef.current ||
      !URI ||
      playerLoaded ||
      hasError
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (!playerLoaded) {
        setHasError(true);
      }
    }, LOAD_TIMEOUT_MS);

    iFrameAPI.createController(
      audioFrameRef.current,
      {
        width: isAudio ? "100%" : "0",
        height: isAudio ? "152" : "0",
        uri: `spotify:episode:${URI}`,
      },
      (spotifyEmbedController) => {
        spotifyEmbedController.addListener("ready", () => {
          clearTimeout(timeout);
          setPlayerLoaded(true);
        });

        controllerRef.current = spotifyEmbedController;
      },
    );

    return () => {
      clearTimeout(timeout);
      controllerRef.current?.removeListener("playback_update");
    };
  }, [iFrameAPI, URI, playerLoaded, hasError]);

  return (
    <div className="h-full w-full">
      {/* VIDEO FRAME */}
      {isVideo && URI && (
        <iframe
          title={title}
          src={videoURL}
          className={`h-full w-full ${playerLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ borderRadius: "12px" }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      )}

      {/* AUDIO FRAME */}
      {URI && <div ref={audioFrameRef} className={`${isVideo && "hidden"}`} />}

      {/* SKELETON */}
      {!playerLoaded && !hasError && (
        <Skeleton
          className={`bg-muted absolute top-0 left-0 h-full w-full ${!isCompact && "max-h-90 max-w-160"}`}
          style={{ borderRadius: "12px" }}
        />
      )}

      {/* Error Fallback */}
      {hasError && (
        <StyledText
          as="h3"
          variant={"heading"}
          className="text-primary flex items-center gap-2 px-8 text-center"
        >
          <CircleX className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
          Oops! Error loading media.
        </StyledText>
      )}
    </div>
  );
};

export default SpotifyEmbed;
