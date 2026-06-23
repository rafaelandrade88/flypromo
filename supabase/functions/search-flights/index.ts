// FlightWatch - Edge Function: search-flights
// Provider: SerpApi Google Flights
// Versão: 1.2.0

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SERPAPI_KEY   = Deno.env.get("SERPAPI_KEY")!;
const SERPAPI_URL   = "https://serpapi.com/search.json";
const CURRENCY      = "BRL";
const MAX_RESULTS   = 20;
const PRICE_LOW     = 0.85;
const PRICE_HIGH    = 1.15;

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type":                 "application/json",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type PriceCategory = "low" | "medium" | "high";

interface SearchRequest {
  originCode:      string;
  destinationCode: string;
  departureDate:   string; // YYYY-MM-DD
  returnDate?:     string; // YYYY-MM-DD
  adults:          number;
  children?:       number;
}

interface FlightResult {
  id:          string;
  price: {
    total:     number;
    currency:  string;
    category:  PriceCategory;
    savings:   number | null;
  };
  departure: {
    airport:   string;
    city:      string;
    time:      string;
    terminal:  string | null;
  };
  arrival: {
    airport:   string;
    city:      string;
    time:      string;
    terminal:  string | null;
  };
  returnFlight?: {
    departure: { airport: string; city: string; time: string };
    arrival:   { airport: string; city: string; time: string };
  };
  duration:        string;
  durationMinutes: number;
  stops:           number;
  airlines:        string[];
  flightNumbers:   string[];
  cabin:           string;
  bookingLink:     string;
  extensions:      string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPriceCategory(price: number, avg: number): PriceCategory {
  const r = price / avg;
  if (r <= PRICE_LOW)  return "low";
  if (r >= PRICE_HIGH) return "high";
  return "medium";
}

function parseDurationToMinutes(dur: string): number {
  // "2 hr 30 min" ou "1 hr" ou "45 min"
  const h = dur.match(/(\d+)\s*hr/);
  const m = dur.match(/(\d+)\s*min/);
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
}

function formatDuration(dur: string): string {
  // Normaliza para "2h 30min"
  return dur
    .replace(/\s*hr\s*/g, "h ")
    .replace(/\s*min\s*/g, "min")
    .trim();
}

/**
 * Extrai companhias e números de voo de um array de legs do SerpApi
 */
function extractFlightInfo(flights: any[]): { airlines: string[]; flightNumbers: string[] } {
  const airlines     = [...new Set(flights.map((f: any) => f.airline).filter(Boolean))] as string[];
  const flightNumbers = flights
    .map((f: any) => f.flight_number)
    .filter(Boolean) as string[];
  return { airlines, flightNumbers };
}

/**
 * Normaliza um "best_flight" ou "other_flight" do SerpApi para FlightResult
 */
function normalizeOffer(offer: any, idx: number, avgPrice: number): FlightResult | null {
  try {
    const price = offer.price as number;
    if (!price) return null;

    const category = getPriceCategory(price, avgPrice);
    const savings  = Math.round(avgPrice - price);

    // SerpApi retorna "flights" como array de legs da ida
    const legs: any[]        = offer.flights || [];
    const returnLegs: any[]  = offer.layovers?.return_flights || [];

    const firstLeg  = legs[0];
    const lastLeg   = legs[legs.length - 1];

    const { airlines, flightNumbers } = extractFlightInfo(legs);

    const totalDur     = offer.total_duration || legs.reduce((acc: number, l: any) => acc + (l.duration || 0), 0);
    const durMinutes   = typeof totalDur === "number" ? totalDur : parseDurationToMinutes(String(totalDur));
    const durFormatted = formatDuration(offer.duration || `${Math.floor(durMinutes / 60)}h ${durMinutes % 60}min`);

    // Link de booking: SerpApi retorna booking_token para deep link
    const bookingLink = offer.booking_token
      ? `https://www.google.com/travel/flights?tfs=${offer.booking_token}`
      : `https://www.google.com/travel/flights?q=flights+from+${firstLeg?.departure_airport?.id}+to+${lastLeg?.arrival_airport?.id}`;

    const result: FlightResult = {
      id:    `${firstLeg?.departure_airport?.id}-${lastLeg?.arrival_airport?.id}-${idx}`,
      price: {
        total:    price,
        currency: CURRENCY,
        category,
        savings:  savings !== 0 ? savings : null,
      },
      departure: {
        airport:  firstLeg?.departure_airport?.id   || "",
        city:     firstLeg?.departure_airport?.name || "",
        time:     firstLeg?.departure_airport?.time || "",
        terminal: firstLeg?.departure_airport?.terminal || null,
      },
      arrival: {
        airport:  lastLeg?.arrival_airport?.id   || "",
        city:     lastLeg?.arrival_airport?.name || "",
        time:     lastLeg?.arrival_airport?.time || "",
        terminal: lastLeg?.arrival_airport?.terminal || null,
      },
      duration:        durFormatted,
      durationMinutes: durMinutes,
      stops:           Math.max(0, legs.length - 1),
      airlines,
      flightNumbers,
      cabin:           firstLeg?.travel_class || "Economy",
      bookingLink,
      extensions:      offer.extensions || [],
    };

    // Voo de volta (round-trip)
    if (returnLegs.length > 0) {
      const firstReturn = returnLegs[0];
      const lastReturn  = returnLegs[returnLegs.length - 1];
      result.returnFlight = {
        departure: {
          airport: firstReturn?.departure_airport?.id   || "",
          city:    firstReturn?.departure_airport?.name || "",
          time:    firstReturn?.departure_airport?.time || "",
        },
        arrival: {
          airport: lastReturn?.arrival_airport?.id   || "",
          city:    lastReturn?.arrival_airport?.name || "",
          time:    lastReturn?.arrival_airport?.time || "",
        },
      };
    }

    return result;
  } catch (err) {
    console.warn(`[normalizeOffer] Skipping offer idx=${idx}:`, err);
    return null;
  }
}

// ─── Validação ────────────────────────────────────────────────────────────────

function validate(body: any): string | null {
  if (!body.originCode || body.originCode.trim().length !== 3)
    return "originCode inválido. Use código IATA de 3 letras (ex: GRU)";
  if (!body.destinationCode || body.destinationCode.trim().length !== 3)
    return "destinationCode inválido. Use código IATA de 3 letras (ex: MIA)";
  if (!body.departureDate || !/^\d{4}-\d{2}-\d{2}$/.test(body.departureDate))
    return "departureDate inválido. Use YYYY-MM-DD";
  if (body.returnDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.returnDate))
    return "returnDate inválido. Use YYYY-MM-DD";
  if (!body.adults || body.adults < 1 || body.adults > 9)
    return "adults deve ser entre 1 e 9";
  return null;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const rid = crypto.randomUUID().slice(0, 8);
  const log = (level: string, msg: string, data?: unknown) =>
    console.log(JSON.stringify({ rid, level, msg, data, ts: new Date().toISOString() }));

  log("INFO", "search-flights invoked");

  try {
    const body: SearchRequest = await req.json().catch(() => ({}));

    const validationError = validate(body);
    if (validationError) {
      log("WARN", "Validation failed", { error: validationError });
      return new Response(JSON.stringify({ error: validationError }), { status: 400, headers: CORS });
    }

    const { originCode, destinationCode, departureDate, returnDate, adults, children = 0 } = body;
    const isRoundTrip = !!returnDate;

    // ── Monta params SerpApi ──
    const params = new URLSearchParams({
      engine:          "google_flights",
      api_key:         SERPAPI_KEY,
      departure_id:    originCode.toUpperCase(),
      arrival_id:      destinationCode.toUpperCase(),
      outbound_date:   departureDate,
      currency:        CURRENCY,
      hl:              "pt",       // interface em português
      gl:              "br",       // resultados do Brasil
      adults:          String(adults),
      type:            isRoundTrip ? "1" : "2", // 1=round-trip, 2=one-way
      max_price:       "99999",
    });

    if (isRoundTrip && returnDate)  params.append("return_date",  returnDate);
    if (children > 0)               params.append("children",     String(children));

    const serpUrl = `${SERPAPI_URL}?${params.toString()}`;
    log("INFO", "Calling SerpApi", { origin: originCode, dest: destinationCode, date: departureDate });

    const serpRes = await fetch(serpUrl);
    if (!serpRes.ok) {
      const errText = await serpRes.text();
      log("ERROR", "SerpApi HTTP error", { status: serpRes.status, body: errText });
      return new Response(
        JSON.stringify({ error: "Erro ao consultar Google Flights", details: errText }),
        { status: serpRes.status, headers: CORS }
      );
    }

    const data = await serpRes.json();

    // Verifica erro retornado no payload
    if (data.error) {
      log("ERROR", "SerpApi payload error", { error: data.error });
      return new Response(
        JSON.stringify({ error: data.error }),
        { status: 400, headers: CORS }
      );
    }

    // SerpApi retorna best_flights e other_flights
    const rawOffers: any[] = [
      ...(data.best_flights  || []),
      ...(data.other_flights || []),
    ].slice(0, MAX_RESULTS);

    log("INFO", "SerpApi raw results", { count: rawOffers.length });

    if (rawOffers.length === 0) {
      return new Response(
        JSON.stringify({ flights: [], stats: null }),
        { headers: CORS }
      );
    }

    // ── Estatísticas de preço ──
    const prices   = rawOffers.map(o => o.price as number).filter(Boolean);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const flights = rawOffers
      .map((o, i) => normalizeOffer(o, i, avgPrice))
      .filter((f): f is FlightResult => f !== null);

    log("INFO", "search-flights completed", { results: flights.length, avgPrice: Math.round(avgPrice) });

    return new Response(
      JSON.stringify({
        flights,
        stats: {
          total:    flights.length,
          avgPrice: Math.round(avgPrice),
          minPrice: Math.round(minPrice),
          maxPrice: Math.round(maxPrice),
          currency: CURRENCY,
        },
      }),
      { headers: CORS }
    );

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ rid, level: "ERROR", msg: "Unhandled error", error: message }));
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor", details: message }),
      { status: 500, headers: CORS }
    );
  }
});
