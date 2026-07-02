import type { FastifyPluginCallback } from 'fastify'

// Ambient module declarations for packages without proper types
declare module '@fastify/multipart' {
  export interface MultipartFile {
    type: 'file'
    toBuffer(): Promise<Buffer>
    file: NodeJS.ReadableStream
    fieldname: string
    filename: string
    encoding: string
    mimetype: string
    fields: Record<string, MultipartFile | MultipartValue>
  }

  export interface MultipartValue {
    type: 'field'
    fieldname: string
    value: string | number | boolean
    fields: Record<string, MultipartFile | MultipartValue>
  }

  export interface MultipartOptions {
    limits?: {
      fileSize?: number
      files?: number
      fieldSize?: number
      fields?: number
      headerPairs?: number
    }
  }

  const multipart: FastifyPluginCallback<MultipartOptions>
  export default multipart
}

declare module '@fastify/static' {
  export interface StaticOptions {
    root: string
    prefix?: string
    decorateReply?: boolean
    serve?: boolean
    redirect?: boolean
  }

  const fastifyStatic: FastifyPluginCallback<StaticOptions>
  export default fastifyStatic
}

declare module 'fastify' {
  interface FastifyRequest {
    file(): Promise<import('@fastify/multipart').MultipartFile | undefined>
    files(): AsyncIterableIterator<import('@fastify/multipart').MultipartFile>
    parts(): AsyncIterableIterator<import('@fastify/multipart').MultipartFile | import('@fastify/multipart').MultipartValue>
  }
}
