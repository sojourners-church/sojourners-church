import type { FC } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import EmptyEmbed from "@/components/EmptyEmbed";
import SpotifyEmbed from "@/components/SpotifyEmbed";

interface SermonMediaEmbedProps {
  url?: string;
  title: string;
  isCompact: boolean;
  youtubeFallbackSearch: string | null;
}

const SermonMediaEmbed: FC<SermonMediaEmbedProps> = ({
  url,
  title,
  isCompact,
  youtubeFallbackSearch,
}) => {
  if (!url)
    return (
      <div className={`flex items-center ${isCompact ? "h-38" : "h-90"}`}>
        <EmptyEmbed isCompact youtubeFallbackSearch={youtubeFallbackSearch} />
      </div>
    );

  const isYouTube = url.includes("youtube.com");
  const isSpotify = url.includes("spotify.com");

  const match = isYouTube
    ? url.match(/(?<=v=|live\/)[a-zA-Z0-9_-]{11}/)
    : url.match(/(?<=\/episode\/|spotify\.com\/)[a-zA-Z0-9]{22}/);
  const URI = match ? match[0] : null;

  if (!URI) {
    console.error(
      `Invalid URL. Expected a YouTube or Spotify URL, but received: "${url}"`,
    );
    return (
      <div className={`flex items-center ${isCompact ? "h-38" : "h-90"}`}>
        <EmptyEmbed isCompact youtubeFallbackSearch={youtubeFallbackSearch} />
      </div>
    );
  }

  return (
    <div
      className={`relative h-full w-full ${!isCompact && "max-h-90 max-w-160"}`}
    >
      {isSpotify && URI && (
        <div className={`${!isCompact && "h-90"}`}>
          <SpotifyEmbed URI={URI} title={title} isCompact={isCompact} />
        </div>
      )}

      {isYouTube && URI && (
        <div className="max-w-160">
          <LiteYouTubeEmbed
            id={URI}
            title={title}
            rel="preload"
            webp={true}
            lazyLoad={false}
          />
        </div>
      )}
    </div>
  );
};

export default SermonMediaEmbed;
