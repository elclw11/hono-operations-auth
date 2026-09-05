import { importSPKI, jwtVerify } from 'jose'
import { z } from 'zod'


const claimsSchema = z.object({
  exp: z.number().int(),
  iat: z.number().int(),
  iss: z.string(),
  requested_by: z.string().email(),
  role: z.literal('refund-admin'),
  sub: z.string(),
  tenant_id: z.string(),
})

export type OperationsClaims = z.infer<typeof claimsSchema>

export interface OperationsAuthConfig {
  audience: string
  issuer: string
  verificationKeyPem: string
}

export async function verifyOperationsToken(
  token: string,
  config: OperationsAuthConfig,
): Promise<OperationsClaims> {
  const publicKey = await importSPKI(config.verificationKeyPem, 'ES256')
  const { payload } = await jwtVerify(token, publicKey, {
    algorithms: ['ES256'],
    audience: config.audience,
    issuer: config.issuer,
  })
  return claimsSchema.parse(payload)
}

