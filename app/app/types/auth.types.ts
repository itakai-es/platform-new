export interface User {
  id: string
  email: string
  name: string
  username?: string
  role: 'teacher' | 'student' | 'admin' | null
  avatar?: string
  isOnboarded: boolean
  createdAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  name: string
  acceptTerms?: boolean
  // role se selecciona en onboarding, no en signup
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string // Optional: refreshToken is stored in HttpOnly cookie, not returned to client
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
}

export interface OnboardingData {
  username?: string
  avatar?: string
  preferences?: Record<string, any>
}

/**
 * Google Identity Services Types
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference
 */

export interface CredentialResponse {
  credential: string
  select_by: string
  clientId?: string
}

export interface GoogleIdentityConfig {
  client_id: string
  callback: (response: CredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
  prompt_parent_id?: string
  nonce?: string
  context?: 'signin' | 'signup' | 'use'
  state_cookie_domain?: string
  ux_mode?: 'popup' | 'redirect'
  allowed_parent_origin?: string | string[]
  intermediate_iframe_close_callback?: () => void
}
