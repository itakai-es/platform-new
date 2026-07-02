import { vi } from 'vitest'

// Set test environment variables before any module loads
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-minimum-20-chars'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-minimum-20-chars'
process.env.JWT_ACCESS_EXPIRES_IN = '15m'
process.env.JWT_REFRESH_EXPIRES_IN = '7d'
process.env.PORT = '3001'
process.env.CORS_ORIGIN = 'http://localhost:4000'
