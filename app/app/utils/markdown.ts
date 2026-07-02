import { Marked } from 'marked'
import _DOMPurify from 'dompurify'

// --- DOMPurify ---
let purifyInstance: { sanitize: (html: string, config?: object) => string } | null = null
try {
  const dp = (_DOMPurify as unknown as Record<string, unknown>).default || _DOMPurify
  purifyInstance =
    typeof dp === 'function'
      ? (dp as (win: Window) => typeof purifyInstance)(window)
      : (dp as unknown as typeof purifyInstance)
} catch {
  // SSR or test environment — DOMPurify unavailable
  purifyInstance = null
}

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'br',
  'hr',
  'strong',
  'em',
  'del',
  's',
  'u',
  'ul',
  'ol',
  'li',
  'a',
  'code',
  'pre',
  'blockquote',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class']

const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript):/i

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br />')
}

function sanitize(html: string): string {
  if (purifyInstance?.sanitize) {
    return purifyInstance.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
  }
  // DOMPurify unavailable (SSR) — escape raw input as safe fallback
  return escapeHtml(html)
}

// --- Single marked instance ---
const md = new Marked({
  breaks: true,
  gfm: true,
  renderer: {
    link({ href, text }: { href: string; text: string }) {
      if (DANGEROUS_PROTOCOLS.test(href.trim())) {
        return escapeHtml(text)
      }
      const safeHref = href.replace(/"/g, '&quot;')
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`
    },
  },
})

function parse(raw: string): string {
  const html = md.parse(raw, { async: false }) as string
  return sanitize(html)
}

/**
 * Render markdown for chat messages (headings clamped to h3-h4).
 */
export function renderMarkdown(raw: string): string {
  if (!raw) return ''
  try {
    return parse(raw)
      .replace(/<h[12][^>]*>/g, '<h3>')
      .replace(/<\/h[12]>/g, '</h3>')
  } catch {
    return escapeHtml(raw)
  }
}

/**
 * Render markdown for page content (full headings).
 */
export function renderPageMarkdown(raw: string): string {
  if (!raw) return ''
  try {
    return parse(raw)
  } catch {
    return escapeHtml(raw)
  }
}
