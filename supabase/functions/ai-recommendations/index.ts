// FlightWatch - Edge Function: ai-recommendations
// Recomendações inteligentes de destinos via Google Gemini API
// Versão: 2.0.0

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

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

Retorne APENAS um JSON válido (sem markdown, sem blocos de código, sem texto adicional) com exatamente este formato:
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
      "bookingUrl": "https://www.google.com/travel/flights?q=voos+de+${encodeURIComponent(origin)}+para+IATA"
    }
  ],
  "generalTip": "Dica geral de economia para viagens saindo de ${origin}"
}

Gere exatamente 10 recomendações ordenadas do mais barato ao mais caro. priceCategory deve ser "low", "medium" ou "high". Foque em destinos realistas e acessíveis para brasileiros saindo de ${origin}.`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      const message =
        err?.error?.message?.includes("quota")
          ? "Serviço de IA temporariamente indisponível. Tente novamente mais tarde."
          : err?.error?.message ?? "Gemini API error";
      return new Response(JSON.stringify({ error: message }), {
        status: res.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    let parsed;
    try {
      // Remove markdown code blocks if Gemini wraps in ```json ... ```
      const clean = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      // Fallback: extrai JSON do texto
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Invalid JSON from Gemini");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[ai-recommendations] Error:", err);
    return new Response(JSON.stringify({ error: "Erro interno ao gerar recomendações" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
