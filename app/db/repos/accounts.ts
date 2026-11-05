import { db, uid, getWorkspaceId } from "~/db"
import type { Account } from "~/types"

export type AccountInput = Pick<Account, 'name' | 'type' | 'institution' | 'openingBalance' >

export async function createAccount(input: AccountInput) {
    const workspaceId = await getWorkspaceId()
    await db.accounts.add({ id: uid(), workspaceId, currency: 'KES', status: 'active', ...input })
}

export const updateAccount = (id: string, input: Partial<AccountInput>) => db.accounts.update(id, input)

/* delete unused accout */
export async function removeAccount(id:string) {
    const used = await db.transactions.filter((t) => t.accountId === id || t.toAccountId === id).count()
    if(used){
        await db.accounts.update(id, {status: 'archived'})
        return 'archived' as const
    }
    await db.accounts.delete(id)
    return 'deleted' as const
}