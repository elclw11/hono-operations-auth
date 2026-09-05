import { importPKCS8, SignJWT } from 'jose'

import { loadOperationsSigningKey } from './session-keys.ts'


export interface OperationsSessionRequest {
  requestedBy: string
  tenantId: string
}

export async function mintOperationsSession(
  request: OperationsSessionRequest,
): Promise<string> {
  const privateKey = await importPKCS8(loadOperationsSigningKey(), 'ES256')
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({
    requested_by: request.requestedBy,
    role: 'refund-admin',
    tenant_id: request.tenantId,
  })
    .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
    .setIssuer('https://identity.cartlane.io')
    .setAudience('cartlane-operations')
    .setSubject('operations-session-cli')
    .setIssuedAt(now)
    .setExpirationTime(now + 300)
    .sign(privateKey)
}

