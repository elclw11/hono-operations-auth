import { mintOperationsSession } from '../src/session-issuer.ts'


const requestedBy = process.argv[2]
const tenantId = process.argv[3]
if (!requestedBy || !tenantId) {
  throw new Error(
    'usage: tsx tools/mint-operations-session.ts <operator-email> <tenant-id>',
  )
}

console.log(await mintOperationsSession({ requestedBy, tenantId }))

