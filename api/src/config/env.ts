import 'dotenv/config'
import { z } from 'zod'

const envSchema = z
  .object({
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string().min(20),
    JWT_REFRESH_SECRET: z.string().min(20),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    PORT: z.string().default('3001').transform(Number),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: z.string().default('http://localhost:4000'),

    // Email (Resend)
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().default('ITAKAI <noreply@itakai.es>'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGIN'],
        message: 'CORS_ORIGIN is required in production',
      })
    }
  })

export const env = envSchema.parse(process.env)
