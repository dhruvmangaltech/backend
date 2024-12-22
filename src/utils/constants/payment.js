export const STATUS = {
  NONE: 'none',
  SHORT: 'short',
  HOLD: 'hold',
  GOOD: 'good',
  INVALID: 'invalid',
  NEW: 'new',
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
  UNPAID: 'unpaid',
  PAID: 'paid',
  PENDING: 'pending',
  PROCESSED: 'processed',
  FAILED: 'failed',
  DONE: 'done',
  REFUND_FAILED: 'refund failed',
  REFUNDED: 'refunded',
  REFUND_PENDING: 'refund pending'
}

export const EVENT_TYPE = {
  PAYMENT: 'payment',
  PAYOUT: 'payout',
  WITHDRAW: 'withdraw',
  TRANSACTION_STATUS: 'transaction.status'
}

export const TRANSACTION_PROVIDER = {
  TRIPLE_A: 'Triple A',
  PAYNOTE: 'Paynote',
  PRIZEOUT: 'Prizeout'
}

export const PROVIDER_ACTION_STATUS = {
  ENABLE: 'ENABLED',
  DISABLE: 'DISABLED'
}

export const PRIZEOUT_ACTION_STATUS = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

export const PAYNOTE_FAILED_TRANSACTION_COUNT = 5
