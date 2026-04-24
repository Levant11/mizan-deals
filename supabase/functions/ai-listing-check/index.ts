// AI listing integrity check edge function
// Uses Lovable AI Gateway (LOVABLE_API_KEY auto-provisioned)
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, description, category, asking_price, city, lang } = await req.json();
    if (!title || !description) {
      return new Response(JSON.stringify({ error: "title and description required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = lang === "ar"
      ? "أنت مدقق إعلانات لمنصة 'ميزان' للأصول المتعثرة في العراق. قيّم نزاهة وجودة الإعلان من 0 إلى 100 وقدّم ملاحظات موجزة بالعربية. ابحث عن: الوضوح، الصدق الظاهر، اكتمال المعلومات، الإشارات المشبوهة (وعود مبالغ بها، نقص في التفاصيل، لغة احتيالية)."
      : "You are a listing integrity checker for MIZAN, a distressed assets marketplace in Iraq. Score listing integrity 0-100 and give brief notes. Look for: clarity, apparent honesty, completeness, suspicious signals (exaggerated promises, missing details, scam language).";

    const userPrompt = `Title: ${title}\nCategory: ${category}\nCity: ${city || "?"}\nAsking price: ${asking_price || "?"}\n\nDescription:\n${description}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        tools: [{
          type: "function",
          function: {
            name: "report_integrity",
            description: "Return integrity assessment",
            parameters: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 100 },
                notes: { type: "string", description: "2-4 short sentences with feedback" },
              },
              required: ["score", "notes"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "report_integrity" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI gateway error", status, text);
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const call = result.choices?.[0]?.message?.tool_calls?.[0];
    const args = call?.function?.arguments ? JSON.parse(call.function.arguments) : { score: 50, notes: "Could not assess." };

    return new Response(JSON.stringify(args), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-listing-check error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
