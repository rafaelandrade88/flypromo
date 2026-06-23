// FlightWatch - Edge Function: search-flights
// Proxy seguro para Amadeus Flight Offers API
// Versão: 1.0.0

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const AMADEUS_BASE_URL = "https://test.api.amadeus.com"; // trocar para api.amadeus.com em produção
const AMADEUS_CLIENT_ID = Deno.env.get("AMADEUS_CLIENT_ID")!;
const AMADEUS_CLIENT_SECRET = Deno.env.get("AMADEUS_CLIENT_SECRET")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Cache simples de token em memória (válido por ~30min)
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAmadeusToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const res = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    }),
  });

  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: now + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

function getPriceCategory(price: number, avg: number): "low" | "medium" | "high" {
  const ratio = price / avg;
  if (ratio <= 0.85) return "low";
  if (ratio <= 1.15) return "medium";
  return "high";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { originCode, destinationCode, departureDate, returnDate, adults, children } = body;

    // Validação de inputs
    if (!originCode || !destinationCode || !departureDate || !adults) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: originCode, destinationCode, departureDate, adults" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const token = await getAmadeusToken();

    // Monta query params
    const params = new URLSearchParams({
      originLocationCode: originCode.toUpperCase(),
      destinationLocationCode: destinationCode.toUpperCase(),
      departureDate,
      adults: String(adults),
      currencyCode: "BRL",
      max: "20",
    });

    if (returnDate) params.append("returnDate", returnDate);
    if (children && children > 0) params.append("children", String(children));

    const flightRes = await fetch(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!flightRes.ok) {
      const err = await flightRes.json();
      return new Response(JSON.stringify({ error: "Amadeus API error", details: err }), {
        status: flightRes.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const flightData = await flightRes.json();
    const offers = flightData.data || [];

    if (offers.length === 0) {
      return new Response(JSON.stringify({ flights: [], stats: null }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Calcula média de preços para categorização de cores
    const prices = offers.map((o: any) => parseFloat(o.price.total));
    const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Formata resposta enriquecida
    const flights = offers.map((offer: any) => {
      const price = parseFloat(offer.price.total);
      const itinerary = offer.itineraries[0];
      const segment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];

      return {
        id: offer.id,
        price: {
          total: price,
          currency: offer.price.currency,
          category: getPriceCategory(price, avgPrice),
        },
        departure: {
          airport: segment.departure.iataCode,
          time: segment.departure.at,
          terminal: segment.departure.terminal || null,
        },
        arrival: {
          airport: lastSegment.arrival.iataCode,
          time: lastSegment.arrival.at,
          terminal: lastSegment.arrival.terminal || null,
        },
        duration: itinerary.duration,
        stops: itinerary.segments.length - 1,
        airline: segment.carrierCode,
        flightNumber: `${segment.carrierCode}${segment.number}`,
        cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "ECONOMY",
        seatsAvailable: offer.numberOfBookableSeats || null,
        // Link direto para compra via Amadeus (deep link para companhia)
        bookingLink: `https://www.google.com/travel/flights?q=flights+${originCode}+to+${destinationCode}+${departureDate}`,
      };
    });

    return new Response(
      JSON.stringify({
        flights,
        stats: { avgPrice, minPrice, maxPrice, total: flights.length },
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[search-flights] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
