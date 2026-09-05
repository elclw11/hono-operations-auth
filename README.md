# Cartlane operations auth API

Hono service protecting refund-replay operations with short-lived ES256 session
tokens. Production verification uses the public key mounted in the application
image. Session minting is restricted to operations tooling with a file-mounted
private key.

## Development

```sh
npm ci
npm run check
```

Local key paths and token scope are documented in `.env.example`. Private key
files stay under the ignored `.secrets/` directory.

