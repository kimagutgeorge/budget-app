import { db, uid, getWorkspaceId } from '~/db'
import type { TxType } from '~/types'

export interface TxInput {
    type: TxType; amount: number; date: string
    accountId: string; toAccountId?: string; note?: string
}

export async function createTransaction(input: TxInput) {
    const workspaceId = await getWorkspaceId()
    await db.transactions.add( {id: uid(), workspaceId, splits: [], tags: [], ...input } )

}

export const deleteTransaction = (id: string) => db.transactions.delete(id)