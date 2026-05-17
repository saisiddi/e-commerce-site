const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-v4-flash:free";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function askAI({
  system,
  messages,
  json = true,
}: {
  system: string;
  messages: Omit<Message, "role">[];
  json?: boolean;
}): Promise<string> {
  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [
      { role: "system", content: system },
      ...messages.map((m) => ({ ...m, role: "user" })),
    ],
    temperature: 0.3,
  };

  if (json) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://atelier-mode.app",
      "X-Title": "Atelier Mode",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export function parseJSON<T>(raw: string): T | null {
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}
