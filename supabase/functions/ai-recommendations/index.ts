// FlightWatch - Edge Function: ai-recommendations
// Recomendações inteligentes de destinos via Claude API
// Versão: 1.0.0

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { origin, budget, travelMonth, adults, children, preferences } = body;

    if (!origin) {
      return new Response(
        JSON.stringify({ error: "Campo obrigatório: origin" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Você é um especialista em viagens aéreas com foco em custo-benefício para brasileiros.

Contexto da busca:
- Origem: ${origin}
- Orçamento estimado: ${budget ? `R$ ${budget}` : "Sem limite definido"}
- Mês de viagem: ${travelMonth || "Flexível"}
- Passageiros: ${adults} adulto(s)${children > 0 ? ` e ${children} criança(s)` : ""}
- Preferências: ${preferences || "Nenhuma preferência específica"}

Retorne APENAS um JSON válido (sem markdown, sem texto adicional) com exatamente este formato:
{
  "recommendations": [
    {
      "rank": 1,
      "destination": "Nome da Cidade",
      "country": "País",
      "iataCode": "CÓDIGO IATA",
      "estimatedPrice": "R$ X.XXX - R$ X.XXX",
      "bestMonths": ["Jan", "Fev"],
      "highlights": ["highlight 1", "highlight 2", "highlight 3"],
      "tip": "Dica específica de economia para este destino",
      "priceCategory": "low",
      "bookingUrl": "https://www.google.com/travel/flights?q=flights+${origin.split(' ')[0].toUpperCase()}+to+IATA"
    }
  ],
  "generalTip": "Dica geral de economia para viagens saindo de ${origin}"
}

Gere exatamente 10 recomendações ordenadas do mais barato ao mais caro. priceCategory deve ser "low", "medium" ou "high". Foque em destinos realistas e acessíveis para brasileiros saindo de ${origin}.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return new Response(JSON.stringify({ error: "Claude API error", details: err }), {
        status: res.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const rawText = data.content[0].text.trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Fallback: tenta extrair JSON de dentro do texto
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Invalid JSON from Claude");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[ai-recommendations] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
