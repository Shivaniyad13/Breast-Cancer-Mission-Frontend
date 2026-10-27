export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v");
      } else {
        const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
        if (["embed", "live", "shorts", "v"].includes(pathParts[0])) {
          videoId = pathParts[1] || null;
        }
      }
    }

    return videoId && /^[\w-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}
