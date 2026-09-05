import { Hono } from 'hono'
import { z } from 'zod'

import {
  verifyOperationsToken,
  type OperationsAuthConfig,
} from './auth.ts'
import { RefundReplayStore } from './store.ts'


const replaySchema = z.object({
  orderId: z.string().startsWith('ord_'),
})

export function createApp(auth: OperationsAuthConfig, store: RefundReplayStore) {
  const app = new Hono()

  app.get('/health', (context) =>
    context.json({ service: 'operations-auth-api', status: 'ok' }),
  )

  app.post('/admin/refund-replays', async (context) => {
    const authorization = context.req.header('authorization') ?? ''
    if (!authorization.startsWith('Bearer ')) {
      return context.json({ error: 'missing_operations_token' }, 401)
    }

    let claims
    try {
      claims = await verifyOperationsToken(authorization.slice(7), auth)
    } catch {
      return context.json({ error: 'invalid_operations_token' }, 401)
    }

    const parsed = replaySchema.safeParse(await context.req.json())
    if (!parsed.success) {
      return context.json({ error: 'invalid_refund_replay' }, 400)
    }

    store.enqueue({
      orderId: parsed.data.orderId,
      requestedBy: claims.requested_by,
      tenantId: claims.tenant_id,
    })
    return context.json({ queued: true }, 202)
  })

  return app
}

