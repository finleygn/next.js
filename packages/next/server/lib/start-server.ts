import http, { Server } from 'http'
import http2, { Http2Server } from 'http2'
import next from '../next'
import getCerts from './get-certs'

/**
 * Build next handler and connect http server
 *
 * @throws {Error} Will throw when unable to create server because of port in use
 */
export default async function start(
  serverOptions: any,
  port?: number,
  hostname?: string
) {
  const app = next({
    ...serverOptions,
    customServer: false,
  })

  if (serverOptions.http2) {
    const { key, cert } = getCerts(serverOptions.dir)

    const server: Http2Server = http2.createSecureServer(
      { key, cert, allowHTTP1: true },
      app.getRequestHandler()
    )

    server.on('error', (error: Error) => {
      throw error
    })

    server.listen(port, hostname)
  } else {
    const server: Server = http.createServer(app.getRequestHandler())

    await new Promise((resolve, reject) => {
      server.on('error', reject)
      server.on('listening', () => resolve())
      server.listen(port, hostname)
    })
  }

  // It's up to caller to run `app.prepare()`, so it can notify that the server
  // is listening before starting any intensive operations.
  return app
}
