import { db } from '~/db'
import type { Account, Transaction } from '~/types'

/** Pure math: balance of one account from its opening balance + transactions. */
export function accountBalance(a: Account, txs: Transaction[]): number {
  let b = a.openingBalance
  for (const t of txs) {
    if (t.type === 'income' && t.accountId === a.id) b += t.amount
    else if (t.type === 'expense' && t.accountId === a.id) b -= t.amount
    else if (t.type === 'transfer') {
      if (t.accountId === a.id) b -= t.amount
      if (t.toAccountId === a.id) b += t.amount
    }
  }
  return b
}

/** Everything here is derived from transactions. Nothing stores totals. */
export function useLedger() {
  const accounts = useLive(() => db.accounts.toArray(), [] as Account[])
  const txs = useLive(() => db.transactions.orderBy('date').reverse().toArray(), [] as Transaction[])

  // Net worth: loans/credit cards hold debt, so their (negative) balance subtracts naturally.
  const netWorth = computed(() => accounts.value.reduce((s, a) => s + accountBalance(a, txs.value), 0))
  const month = computed(() => {
    const prefix = new Date().toISOString().slice(0, 7)
    const m = txs.value.filter((t) => t.date.startsWith(prefix))
    const sum = (type: string) => m.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0)
    return { income: sum('income'), expense: sum('expense') }
  })
  return { accounts, txs, netWorth, month }
}
