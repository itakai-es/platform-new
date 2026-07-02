/**
 * Declaraciones de tipos para Google Identity Services
 * Extiende el objeto window para incluir la API de Google
 */

import type { CredentialResponse, GoogleIdentityConfig } from './auth.types'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdentityConfig) => void
          prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void
          renderButton: (parent: HTMLElement | null, options: GoogleButtonConfig) => void
          disableAutoSelect: () => void
          cancel: () => void
          revoke: (email: string, callback: (response: RevokeResponse) => void) => void
        }
        oauth2: {
          initCodeClient: (config: GoogleCodeClientConfig) => GoogleCodeClient
          initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient
        }
      }
    }
  }

  interface PromptMomentNotification {
    isDisplayMoment: () => boolean
    isDisplayed: () => boolean
    isNotDisplayed: () => boolean
    getNotDisplayedReason: () =>
      | 'browser_not_supported'
      | 'invalid_client'
      | 'missing_client_id'
      | 'opt_out_or_no_session'
      | 'secure_http_required'
      | 'suppressed_by_user'
      | 'unregistered_origin'
      | 'unknown_reason'
    isSkippedMoment: () => boolean
    getSkippedReason: () => 'auto_cancel' | 'user_cancel' | 'tap_outside' | 'issuing_failed'
    isDismissedMoment: () => boolean
    getDismissedReason: () => 'credential_returned' | 'cancel_called' | 'flow_restarted'
    getMomentType: () => 'display' | 'skipped' | 'dismissed'
  }

  interface GoogleButtonConfig {
    type?: 'standard' | 'icon'
    theme?: 'outline' | 'filled_blue' | 'filled_black'
    size?: 'large' | 'medium' | 'small'
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
    shape?: 'rectangular' | 'pill' | 'circle' | 'square'
    logo_alignment?: 'left' | 'center'
    width?: number
    locale?: string
  }

  interface RevokeResponse {
    successful: boolean
    error?: string
  }

  interface GoogleCodeClientConfig {
    client_id: string
    scope: string
    ux_mode?: 'popup' | 'redirect'
    redirect_uri?: string
    state?: string
    callback: (response: { code: string; scope?: string; state?: string; error?: string }) => void
    error_callback?: (error: { type?: string; message?: string }) => void
  }

  interface GoogleCodeClient {
    requestCode: () => void
  }

  interface GoogleTokenClientConfig {
    client_id: string
    scope: string
    callback: (response: {
      access_token: string
      expires_in: number
      scope: string
      token_type: string
      error?: string
    }) => void
    error_callback?: (error: { type?: string; message?: string }) => void
  }

  interface GoogleTokenClient {
    requestAccessToken: () => void
  }
}

export {}
