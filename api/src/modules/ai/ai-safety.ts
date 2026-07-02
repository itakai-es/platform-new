const BLOCKED_PATTERNS = [
  /\bporno\b/i,
  /\bpornografia\b/i,
  /\bsexual\b/i,
  /\bsexo\b/i,
  /\bviolaci(?:on|ones?)\b/i,
  /\bviolencia\b/i,
  /\basesina(?:r|to)?\b/i,
  /\bmatar\b/i,
  /\bsuicid/i,
  /\bautoles/i,
  /\bdroga(?:s)?\b/i,
  /\bcocaina\b/i,
  /\bheroina\b/i,
  /\bmetanfet/i,
  /\bodi(?:o|ar)\b/i,
  /\bracis/i,
  /\bnazi\b/i,
  /\bterroris/i,
  /\bbomba\b/i,
  /\barma(?:s)?\b/i,
]

export function normalizePrompt(content: string) {
  return content
    .trim()
    .replace(/\s+/g, ' ')
}

export function ensureSafeEducationalPrompt(content: string) {
  const normalized = normalizePrompt(content)

  if (!normalized) {
    throw new Error('El prompt no puede estar vacio')
  }

  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(normalized))) {
    throw new Error('El prompt contiene contenido no permitido para el entorno educativo')
  }

  return normalized
}
