import type { IncomingMessage } from 'http'

export const getBaseUrl = (req: IncomingMessage) => {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'http'
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host

  return `${proto}://${host}`
}
