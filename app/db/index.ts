import Dexie, { type EntityTable } from 'dexie'
import type { Account, FinObject, Party, Rule, Transaction, Workspace } from '~/types'

class PesaDB extends Dexie {
  workspaces!: EntityTable<Workspace, 'id'>
  accounts!: EntityTable<Account, 'id'>
  objects!: EntityTable<FinObject, 'id'>
  parties!: EntityTable<Party, 'id'>
  transactions!: EntityTable<Transaction, 'id'>
  rules!: EntityTable<Rule, 'id'>
  constructor() {
    super('pesa')
    this.version(1).stores({
      workspaces: 'id',
      accounts: 'id, workspaceId, type',
      objects: 'id, workspaceId, type, parentId, *tags',
      parties: 'id, workspaceId, kind, *tags',
      transactions: 'id, workspaceId, date, accountId, partyId, sourceObjectId, *tags',
      rules: 'id, workspaceId',
    })
  }
}
export const db = new PesaDB()
export const uid = () => crypto.randomUUID()

export async function getWorkspaceId(){
  const first = await db.workspaces.toCollection().first()
  if (first) return first.id
  const id = uid()
  await db.workspaces.add({ id, name: 'Personal', currency: 'KES', createdAt: Date.now() })
  return id
}

