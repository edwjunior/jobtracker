// Cliente mínimo de la API nativa de Gemini (generateContent), sin SDK.
// Es el único módulo que conoce el formato de la API: si Google lo cambia, se toca solo aquí.

import { UserError } from "./errors";

export type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

export class GeminiError extends UserError {}

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const RETRYABLE_STATUS = new Set([500, 502, 503, 504]);
const RETRY_DELAYS_MS = [2000, 4000];

type GenerateOptions = {
  system: string;
  parts: GeminiPart[];
  // Pide la respuesta como JSON (application/json); si no, texto libre.
  json?: boolean;
};

type GenerateResponse = {
  promptFeedback?: { blockReason?: string };
  candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[];
};

function messageForStatus(status: number) {
  if (status === 400) return "Gemini rechazó la petición: revisa que GEMINI_API_KEY sea válida.";
  if (status === 403) return "Gemini denegó el acceso: revisa la clave y que tu región tenga acceso a la API.";
  if (status === 404) return "El modelo configurado en GEMINI_MODEL no existe. Comprueba su id.";
  if (status === 429) return "Se ha alcanzado el límite del plan gratuito de Gemini. Espera un poco e inténtalo de nuevo.";
  if (status >= 500) {
    return "El modelo de Gemini está saturado ahora mismo (se reintentó varias veces). Prueba en unos minutos o cambia GEMINI_MODEL por otro modelo.";
  }
  return `Gemini devolvió un error inesperado (${status}).`;
}

export async function generate({ system, parts, json = false }: GenerateOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  if (!apiKey || !model) {
    throw new GeminiError("Falta configurar GEMINI_API_KEY y GEMINI_MODEL en .env.local.");
  }

  const request = {
    method: "POST",
    // La clave va en cabecera, no en la URL, para que no acabe en logs.
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts }],
      generationConfig: { temperature: 0.2, ...(json ? { responseMimeType: "application/json" } : {}) },
    }),
  };

  let response: Response;
  for (let attempt = 0; ; attempt++) {
    try {
      response = await fetch(`${BASE_URL}/models/${encodeURIComponent(model)}:generateContent`, {
        ...request,
        signal: AbortSignal.timeout(90_000),
      });
    } catch (error) {
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
        throw new GeminiError("Gemini tardó demasiado en responder. Inténtalo de nuevo.");
      }
      throw new GeminiError("No se pudo conectar con Gemini. Revisa tu conexión.");
    }

    // Los 5xx de Gemini son picos de demanda "normalmente temporales": se reintenta con espera.
    if (response.ok || !RETRYABLE_STATUS.has(response.status) || attempt >= RETRY_DELAYS_MS.length) break;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
  }

  if (!response.ok) {
    // Solo el código: el cuerpo podría reflejar el contenido enviado.
    console.error("Gemini HTTP", response.status);
    throw new GeminiError(messageForStatus(response.status));
  }

  const data = (await response.json()) as GenerateResponse;

  if (data.promptFeedback?.blockReason) {
    throw new GeminiError("Gemini bloqueó la petición por sus filtros de seguridad.");
  }

  const candidate = data.candidates?.[0];
  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new GeminiError("La respuesta de Gemini se cortó por longitud. Inténtalo con un texto más corto.");
  }
  if (candidate?.finishReason && candidate.finishReason !== "STOP") {
    throw new GeminiError("Gemini no pudo completar la respuesta (filtros de seguridad).");
  }

  const text = (candidate?.content?.parts ?? []).map((part) => part.text ?? "").join("");
  if (!text.trim()) throw new GeminiError("Gemini devolvió una respuesta vacía.");

  return text;
}
