import fs from 'fs'
import { join } from 'path'

function getCerts(dir: string) {
  let key
  let cert

  try {
    key = fs.readFileSync(join(dir, 'certs', 'key.pem'))
    cert = fs.readFileSync(join(dir, 'certs', 'cert.pem'))
  } catch {
    throw new Error(
      `key.pem and/or cert.pem not found in ${join(
        dir,
        'certs'
      )}/. Required for http2.`
    )
  }

  return {
    key,
    cert,
  }
}

export default getCerts
