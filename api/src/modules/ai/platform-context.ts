/**
 * Compact platform context for AI agent system prompts.
 * Optimized for minimal token usage in production (NFR18).
 * Single source of truth — update here when platform features change.
 */

/** Map assistant IDs to display names for mythological skins */
const SKIN_NAMES: Record<string, string> = {
  atenea: 'Atenea',
  odiseo: 'Odiseo',
  penelope: 'Penélope',
  polifemo: 'Polifemo',
  poseidon: 'Poseidón',
}

/** Get the display name for a mythological skin */
export function getSkinName(assistantId: string): string {
  return SKIN_NAMES[assistantId] || assistantId
}

// ~150 tokens shared + ~80 tokens per role = ~230 tokens total per prompt
// vs ~400+ tokens in the verbose version

const CONTEXT = {
  es: {
    shared: [
      'ITAKAI: plataforma gamificacion educativa, tematica mitologica griega.',
      'Clase: profesor crea, codigo invitacion 6 chars, alumnos se unen con codigo.',
      'Mision: dentro de clase, tiene titulo/descripcion/rareza(comun|rara|epica|legendaria)/deadline/XP.',
      'Enigma: tarea dentro de mision, objetivos + XP propio.',
      'Entrega: alumno envia texto+archivo por enigma. Profesor aprueba(+XP) o rechaza(+feedback).',
      'Todos enigmas aprobados = mision completa + insignias.',
      'Niveles 1-50: Mortal>Heroe Novato>Bronce>Plata>Oro>Semidios>Titan>Olimpico Menor>Mayor>Avatar Divino>Dios del Olimpo.',
    ].join(' '),
    teacher: [
      'Nav profesor: Dashboard|Mis Clases|Misiones|Estudiantes|Asistente IA.',
      'Crear clase: Mis Clases>Nueva Clase. Crear mision: dentro de clase>Misiones>Nueva Mision.',
      'Formularios tienen asistente IA lateral (sugiere, no crea directo).',
      'Revisar entregas: dentro de mision>entregas pendientes>aprobar/rechazar.',
    ].join(' '),
    student: [
      'Nav alumno: Dashboard|Mis Clases|Misiones|Logros|Ranking|Asistente IA.',
      'Unirse: Mis Clases>Unirse a Clase>codigo invitacion.',
      'Completar mision: Misiones>elegir mision>ver enigmas>Enviar entrega(texto+archivo).',
      'Profesor revisa: aprueba(+XP) o rechaza(+feedback). Todos enigmas OK = mision completa.',
    ].join(' '),
  },
  en: {
    shared: [
      'ITAKAI: gamified educational platform, Greek mythology theme.',
      'Class: teacher creates, 6-char invite code, students join with code.',
      'Mission: inside class, has title/description/rarity(common|rare|epic|legendary)/deadline/XP.',
      'Enigma: task inside mission, objectives + own XP.',
      'Submission: student sends text+file per enigma. Teacher approves(+XP) or rejects(+feedback).',
      'All enigmas approved = mission complete + badges.',
      'Levels 1-50: Mortal>Hero Novice>Bronze>Silver>Gold>Demigod>Titan>Minor Olympian>Major>Divine Avatar>God of Olympus.',
    ].join(' '),
    teacher: [
      'Teacher nav: Dashboard|My Classes|Missions|Students|AI Assistant.',
      'Create class: My Classes>New Class. Create mission: inside class>Missions>New Mission.',
      'Forms have AI assistant sidebar (suggests, does not create directly).',
      'Review submissions: inside mission>pending submissions>approve with a completion %.',
    ].join(' '),
    student: [
      'Student nav: Dashboard|My Classes|Missions|Achievements|Leaderboard|AI Assistant.',
      'Join: My Classes>Join Class>invitation code.',
      'Complete mission: Missions>choose mission>view enigmas>Submit deliverable(text+file).',
      'Teacher reviews: approves(+XP) or rejects(+feedback). All enigmas OK = mission complete.',
    ].join(' '),
  },
} as const

/**
 * Get compact platform context for an agent system prompt.
 * ~230 tokens total — optimized for production at scale.
 */
export function getPlatformContext(role: 'teacher' | 'student', locale: string): string {
  const lang = locale.startsWith('en') ? CONTEXT.en : CONTEXT.es
  return `${lang.shared}\n${role === 'teacher' ? lang.teacher : lang.student}`
}
