export interface WebinarLiveLink {
  platform: "YouTube Live" | "Google Meet" | "Zoom";
  url: string;
}

interface WebinarLiveLinkSource {
  meetingLink?: string | null;
  meetingPlatform?: string | null;
  liveLink?: string | null;
  googleMeetLink?: string | null;
  zoomLink?: string | null;
}

export function getWebinarLiveLinks(webinar: WebinarLiveLinkSource): WebinarLiveLink[] {
  const selectedPlatform = webinar.meetingPlatform?.toLowerCase();
  const primaryLink = webinar.meetingLink?.trim() || "";

  const links: WebinarLiveLink[] = [
    {
      platform: "YouTube Live",
      url: webinar.liveLink?.trim() || (selectedPlatform === "youtube live" ? primaryLink : ""),
    },
    {
      platform: "Google Meet",
      url: webinar.googleMeetLink?.trim() || (selectedPlatform === "google meet" ? primaryLink : ""),
    },
    {
      platform: "Zoom",
      url: webinar.zoomLink?.trim() || (selectedPlatform === "zoom" ? primaryLink : ""),
    },
  ];

  return links.filter((link) => link.url);
}
