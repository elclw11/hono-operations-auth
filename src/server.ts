import { readFileSync } from 'node:fs'

import { serve } from '@hono/node-server'

import { createApp } from './app.ts'
import { RefundReplayStore } from './store.ts'


const verificationKeyFile =
  process.env.OPERATIONS_VERIFY_KEY_FILE ??
  'config/operations-session-es256.pub'
const app = createApp(
  {
    audience: process.env.OPERATIONS_TOKEN_AUDIENCE ?? 'cartlane-operations',
    issuer:
      process.env.OPERATIONS_TOKEN_ISSUER ?? 'https://identity.cartlane.io',
    verificationKeyPem: readFileSync(verificationKeyFile, 'utf8'),
  },
  new RefundReplayStore(),
)

const port = Number.parseInt(process.env.PORT ?? '3000', 10)
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`operations auth API listening on http://127.0.0.1:${info.port}`)
})

