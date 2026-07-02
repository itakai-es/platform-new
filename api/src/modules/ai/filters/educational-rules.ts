export interface EducationalFilterContext {
  role: string | null
  assistantId?: string
  originalPrompt: string
}

const DIRECT_ANSWER_PATTERNS = [
  'dame la respuesta',
  'resuelvemelo',
  'hazme el ejercicio',
  'solve it for me',
  'give me the answer',
  'do the exercise for me',
]

export function applyEducationalRules(content: string, context: EducationalFilterContext) {
  if (context.role !== 'student') {
    return content
  }

  const normalizedPrompt = context.originalPrompt
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

  const requestsDirectAnswer = DIRECT_ANSWER_PATTERNS.some(pattern => normalizedPrompt.includes(pattern))

  if (!requestsDirectAnswer) {
    return content
  }

  const mentorName = context.assistantId === 'odiseo' ? 'Odiseo' : 'Atenea'
  return `${mentorName} no puede darte la solucion directa. Te ayudo con el enfoque: identifica lo que te piden, separa los datos clave y prueba un primer paso antes de volver a preguntarme.`
}
