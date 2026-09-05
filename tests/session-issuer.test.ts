import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

import { verifyOperationsToken } from '../src/auth.ts'
import { mintOperationsSession } from '../src/session-issuer.ts'


const verificationKeyPem = readFileSync(
  new URL('../config/operations-session-es256.pub', import.meta.url),
  'utf8',
)

describe('operations session issuer', () => {
  it('mints a short-lived token accepted by the operations API', async () => {
    const token = await mintOperationsSession({
      requestedBy: 'oncall@cartlane.io',
      tenantId: 'tenant_cartlane_us',
    })
    const claims = await verifyOperationsToken(token, {
      audience: 'cartlane-operations',
      issuer: 'https://identity.cartlane.io',
      verificationKeyPem,
    })

    assert.equal(claims.requested_by, 'oncall@cartlane.io')
    assert.equal(claims.role, 'refund-admin')
    assert.equal(claims.tenant_id, 'tenant_cartlane_us')
    assert.ok(claims.exp - claims.iat <= 300)
  })
})
