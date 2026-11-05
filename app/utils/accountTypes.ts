import type { AccountType } from "~/types";

export const accountKinds: { id: AccountType; label: string} [] = [
    {id: 'mobile_money', label: 'Mobile Money'},
    {id: 'cash', label: 'Cash'},
    {id: 'bank', label: 'Bank'},
    {id: 'savings', label: 'Savings'},
    {id: 'credit_card', label: 'Credit Card'},
    {id: 'loan', label: 'Loan'},
    {id: 'investment', label: 'Investment'},
]

export const kindLabel = (t:AccountType) => accountKinds.find((k) => k.id === t)?.label ?? t
export const isDebtType = (t:AccountType) => t === 'loan' || t === 'credit_card' 