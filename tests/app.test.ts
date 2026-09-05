import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

import { createApp } from '../src/app.ts'
import { RefundReplayStore } from '../src/store.ts'


const verificationKeyPem = readFileSync(
  new URL('../config/operations-session-es256.pub', import.meta.url),
  'utf8',
)
const auth = {
  audience: 'cartlane-operations',
  issuer: 'https://identity.cartlane.io',
  verificationKeyPem,
}

describe('operations auth API', () => {
  it('reports service health', async () => {
    const response = await createApp(auth, new RefundReplayStore()).request(
      '/health',
    )
    assert.equal(response.status, 200)
  })

  it('requires a bearer token for refund replay', async () => {
    const store = new RefundReplayStore()
    const response = await createApp(auth, store).request(
      '/admin/refund-replays',
      {
        body: JSON.stringify({ orderId: 'ord_01K5PN6G4M2RX0V7W9D8Q3JHAT' }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      },
    )
    assert.equal(response.status, 401)
    assert.equal(store.requests.length, 0)
  })

  it('rejects malformed bearer tokens', async () => {
    const store = new RefundReplayStore()
    const response = await createApp(auth, store).request(
      '/admin/refund-replays',
      {
        body: JSON.stringify({ orderId: 'ord_01K5PN6G4M2RX0V7W9D8Q3JHAT' }),
        headers: {
          authorization: 'Bearer not-a-jwt',
          'content-type': 'application/json',
        },
        method: 'POST',
      },
    )
    assert.equal(response.status, 401)
    assert.equal(store.requests.length, 0)
  })
})

