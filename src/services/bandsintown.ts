export const BANDSINTOWN_CONFIG = {
  appId: "11ab644dad7910986a2637013082f920",
  artistId: "15578008",
  artistName: "Elegia L.C",
  baseUrl: "https://rest.bandsintown.com",
};

export interface BandsintownVenue {
  location: string;
  name: string;
  latitude: string;
  longitude: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
  region: string;
}

export interface BandsintownArtist {
  id: string;
  name: string;
  url: string;
  mbid: string;
  image_url: string;
  thumb_url: string;
  facebook_page_url: string;
  tracker_count: number;
  upcoming_event_count: number;
}

export interface BandsintownOffer {
  type: string;
  url: string;
  status: string;
}

export interface BandsintownEvent {
  id: string;
  url: string;
  datetime: string;
  title: string;
  description: string;
  artist: BandsintownArtist;
  venue: BandsintownVenue;
  lineup: string[];
  offers: BandsintownOffer[];
  free: boolean;
  artist_id: string;
  on_sale_datetime: string;
  festival_start_date: string;
  festival_end_date: string;
  festival_datetime_display_rule: string;
  starts_at: string;
  ends_at: string;
  datetime_display_rule: string;
  bandsintown_plus: boolean;
  presale: string;
  sold_out: boolean;
}

export interface UnifiedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url: string;
  ticket_link: string;
  source: "api" | "bandsintown";
  ticket_cta: string;
  bandsintown_url?: string;
  formatted_date: string;
}

export const fetchBandsintownEvents = async (
  dateRange: "upcoming" | "past" | "all" = "upcoming"
): Promise<BandsintownEvent[]> => {
  const url = new URL(
    `${BANDSINTOWN_CONFIG.baseUrl}/artists/id_${BANDSINTOWN_CONFIG.artistId}/events`
  );
  url.searchParams.set("app_id", BANDSINTOWN_CONFIG.appId);
  url.searchParams.set("date", dateRange);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Bandsintown API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const fetchBandsintownArtist = async (): Promise<BandsintownArtist> => {
  const url = new URL(
    `${BANDSINTOWN_CONFIG.baseUrl}/artists/id_${BANDSINTOWN_CONFIG.artistId}`
  );
  url.searchParams.set("app_id", BANDSINTOWN_CONFIG.appId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Bandsintown API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const normalizeBandsintownEvent = (event: BandsintownEvent): UnifiedEvent => {
  const venue = event.venue;
  const artist = event.artist;

  const locationParts = [venue.name, venue.city, venue.region, venue.country].filter(Boolean);
  const location = locationParts.join(", ");

  const ticketOffer = event.offers.find((offer) => offer.type === "Tickets" || offer.url);
  const ticketLink = ticketOffer?.url || `${event.url}&trigger=notify_me`;
  const hasTickets = Boolean(ticketOffer?.url);

  const rawTitle = event.title?.trim() || `${artist.name} @ ${venue.name}`;
  const title = rawTitle.startsWith(`${artist.name} @ `)
    ? rawTitle.slice(`${artist.name} @ `.length).trim()
    : rawTitle;
  const date = event.starts_at || event.datetime;

  return {
    id: `bit-${event.id}`,
    title,
    date,
    formatted_date: formatEventDate(date),
    location,
    description: event.description || `Show com ${event.lineup?.join(", ") || artist.name}.`,
    image_url: artist.image_url || artist.thumb_url,
    ticket_link: ticketLink,
    source: "bandsintown",
    ticket_cta: hasTickets ? "Comprar Ingressos" : "Avise-me",
    bandsintown_url: event.url,
  };
};

export const normalizeApiEvent = (event: {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url: string;
  ticket_link: string;
}): UnifiedEvent => ({
  ...event,
  source: "api",
  ticket_cta: "Comprar Ingressos",
  formatted_date: formatEventDate(event.date),
});

export const mergeEvents = (
  apiEvents: {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    image_url: string;
    ticket_link: string;
  }[],
  bandsintownEvents: BandsintownEvent[]
): UnifiedEvent[] => {
  const safeApiEvents = Array.isArray(apiEvents) ? apiEvents : [];
  const safeBandsintownEvents = Array.isArray(bandsintownEvents) ? bandsintownEvents : [];

  const normalizedApi = safeApiEvents.map(normalizeApiEvent);
  const normalizedBandsintown = safeBandsintownEvents.map(normalizeBandsintownEvent);

  const allEvents = [...normalizedApi, ...normalizedBandsintown];

  // Sort by date ascending
  allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return allEvents;
};
