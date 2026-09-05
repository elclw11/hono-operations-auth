export interface RefundReplay {
  orderId: string
  requestedBy: string
  tenantId: string
}

export class RefundReplayStore {
  readonly requests: RefundReplay[] = []

  enqueue(replay: RefundReplay): void {
    this.requests.push(replay)
  }
}

