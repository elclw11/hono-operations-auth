import { readFileSync } from 'node:fs'


export interface OperationsSigningKeyEnvironment {
  OPERATIONS_SIGNING_KEY_FILE?: string
  OPERATIONS_SIGNING_KEY_PEM?: string
}

export function loadOperationsSigningKey(
  environment: OperationsSigningKeyEnvironment = process.env,
): string {
  const inlineKey = environment.OPERATIONS_SIGNING_KEY_PEM?.trim()
  if (inlineKey) {
    return `${inlineKey}\n`
  }

  const keyFile = environment.OPERATIONS_SIGNING_KEY_FILE?.trim()
  if (keyFile) {
    return readFileSync(keyFile, 'utf8')
  }

  throw new Error(
    'OPERATIONS_SIGNING_KEY_PEM or OPERATIONS_SIGNING_KEY_FILE is required',
  )
}

