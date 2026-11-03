export type ID = string
export type Money = number // integer minor units (cents). Never floats.

export type AccountType = 'cash' | 'mobile_money' | 'bank' | 'savings' | 'credit_card' | 'loan' | 'investment'
export type ObjectType = 'income_source' | 'expense_category' | 'bill' | 'goal' | 'debt' | 'investment'
  | 'tax' | 'subscription' | 'project' | 'custom'
export type TxType = 'income' | 'expense' | 'transfer'

export interface Workspace { id: ID; name: string; currency: string; icon?: string; createdAt: number }
export interface Account {
  id: ID; workspaceId: ID; name: string; type: AccountType; institution?: string
  currency: string; openingBalance: Money; status: 'active' | 'archived'; color?: string; icon?: string
}
export interface FinObject {
  id: ID; workspaceId: ID; type: ObjectType; customTypeName?: string; name: string
  parentId?: ID            // Housing -> Rent
  props: Record<string, unknown> // validated per type (Zod schemas in utils/objectSchemas.ts, M2)
  tags: string[]; archived: boolean
}
export interface Party { id: ID; workspaceId: ID; name: string; kind: 'person' | 'organization'; role?: string; tags: string[] }
export interface TxSplit { objectId: ID; amount: Money }
export interface Transaction {
  id: ID; workspaceId: ID; type: TxType; date: string // ISO yyyy-mm-dd
  accountId: ID; toAccountId?: ID // transfers only
  amount: Money               // always positive; `type` gives direction
  partyId?: ID; sourceObjectId?: ID // bill/goal/debt/income source that created it
  splits: TxSplit[]; tags: string[]; note?: string
}
export interface Rule { id: ID; workspaceId: ID; name: string; when: Record<string, unknown>; then: Record<string, unknown>; enabled: boolean }
