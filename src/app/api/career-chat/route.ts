import { readFileSync } from "node:fs";
import { join } from "node:path";
import { profileContext } from "@/lib/profile";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openai/gpt-5.3-chat";
const MAX_COMPLETION_TOKENS = 350;

function readOpenRouterKey() {
  if (process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }

  const candidates = [
    join(/* turbopackIgnore: true */ process.cwd(), ".env.local"),
    join(/* turbopackIgnore: true */ process.cwd(), ".env"),
    join(/* turbopackIgnore: true */ process.cwd(), "..", ".env.local"),
    join(/* turbopackIgnore: true */ process.cwd(), "..", ".env"),
  ];

  for (const filePath of candidates) {
    try {
      const contents = readFileSync(filePath, "utf8");
      const match = contents.match(
        /^OPENROUTER_API_KEY\s*=\s*("?)(.+?)\1\s*$/m,
      );

      if (match?.[2]) {
        return match[2];
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function POST(request: Request) {
  const apiKey = readOpenRouterKey();

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing OPENROUTER_API_KEY. Add it to website/.env.local or the workspace root .env file.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = body.messages?.slice(-10) ?? [];

  if (!messages.length) {
    return Response.json(
      { error: "At least one user message is required." },
      { status: 400 },
    );
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://127.0.0.1:3000",
      "X-Title": "Nguyen Quang Career Site",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.5,
      max_tokens: MAX_COMPLETION_TOKENS,
      messages: [
        {
          role: "system",
          content: profileContext,
        },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage =
      errorText || "OpenRouter request failed while generating a response.";

    try {
      const parsed = JSON.parse(errorText) as {
        error?: { message?: string };
      };
      errorMessage = parsed.error?.message || errorMessage;
    } catch {
      // Keep the original text when the provider does not return JSON.
    }

    return Response.json(
      {
        error: errorMessage,
      },
      { status: response.status },
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    return Response.json(
      { error: "The model returned an empty response." },
      { status: 502 },
    );
  }

  return Response.json({ answer: content });
}
