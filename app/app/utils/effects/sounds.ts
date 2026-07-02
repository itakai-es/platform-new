/**
 * SFX sintéticos con Web Audio API.
 *
 * No requiere ficheros: cada efecto es un pequeño envelope (attack + decay) sobre
 * uno o varios osciladores. Volumen polite (≈ 0.15) y duración corta (< 500 ms)
 * para que se sientan como notificaciones del UI y no como música.
 *
 * Los gates (mute de usuario y ajustes de clase) se aplican en `useEffects`;
 * este módulo solo conoce de osciladores.
 */

export type SfxName = 'success' | 'coin' | 'level_up' | 'fail' | 'click' | 'sparkle'

const MUTE_KEY = 'effects:soundsMuted'

let ctx: AudioContext | null = null
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  // Algunos navegadores entran 'suspended' hasta el primer gesto; reanudamos por si acaso.
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface Note {
  freq: number
  duration: number // segundos
  type?: OscillatorType
  gain?: number
}

function playNotes(notes: Note[], startOffset = 0) {
  const c = getCtx()
  if (!c) return
  let t = c.currentTime + startOffset
  for (const n of notes) {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = n.type ?? 'sine'
    osc.frequency.value = n.freq
    const peak = n.gain ?? 0.15
    // Attack rápido, decay exponencial: suena como ding/blip, no como pitido sostenido.
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(peak, t + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, t + n.duration)
    osc.connect(gain).connect(c.destination)
    osc.start(t)
    osc.stop(t + n.duration + 0.02)
    t += n.duration * 0.7 // ligera superposición entre notas
  }
}

// Notas en Hz (frecuencias estándar).
const N = {
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  G6: 1567.98,
  C7: 2093,
  G4: 392,
  Eb4: 311.13,
  C4: 261.63,
} as const

const PRESETS: Record<SfxName, () => void> = {
  click: () => playNotes([{ freq: 880, duration: 0.05, type: 'sine', gain: 0.08 }]),
  success: () =>
    playNotes([
      { freq: N.E5, duration: 0.12, type: 'sine' },
      { freq: N.G5, duration: 0.16, type: 'sine' },
    ]),
  coin: () =>
    playNotes([
      { freq: N.B5, duration: 0.07, type: 'square', gain: 0.1 },
      { freq: N.E6, duration: 0.16, type: 'square', gain: 0.1 },
    ]),
  level_up: () =>
    playNotes([
      { freq: N.C5, duration: 0.11, type: 'sine' },
      { freq: N.E5, duration: 0.11, type: 'sine' },
      { freq: N.G5, duration: 0.11, type: 'sine' },
      { freq: N.C6, duration: 0.28, type: 'sine' },
    ]),
  fail: () =>
    playNotes([
      { freq: N.G4, duration: 0.16, type: 'triangle', gain: 0.12 },
      { freq: N.Eb4, duration: 0.18, type: 'triangle', gain: 0.12 },
      { freq: N.C4, duration: 0.24, type: 'triangle', gain: 0.12 },
    ]),
  sparkle: () =>
    playNotes([
      { freq: N.A5, duration: 0.06, type: 'sine', gain: 0.1 },
      { freq: N.C6, duration: 0.06, type: 'sine', gain: 0.1 },
      { freq: N.E6, duration: 0.1, type: 'sine', gain: 0.1 },
    ]),
}

/** Reproduce un SFX por nombre. Silencioso si el usuario tiene el sonido mute. */
export function playSfx(name: SfxName): void {
  if (typeof window === 'undefined') return
  if (window.localStorage?.getItem(MUTE_KEY) === '1') return
  const preset = PRESETS[name]
  if (preset) preset()
}

export function isSoundMuted(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage?.getItem(MUTE_KEY) === '1'
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === 'undefined') return
  if (muted) window.localStorage?.setItem(MUTE_KEY, '1')
  else window.localStorage?.removeItem(MUTE_KEY)
}
