import { db, uid } from './index'
import { format, subDays } from 'date-fns'

export async function seedDemo() {
  const w = uid(), cash = uid(), mpesa = uid(), salary = uid(), food = uid(), rent = uid()
  const day = (n: number) => format(subDays(new Date(), n), 'yyyy-MM-dd')
  await db.workspaces.add({ id: w, name: 'Personal', currency: 'KES', createdAt: Date.now() })
  await db.accounts.bulkAdd([
    { id: mpesa, workspaceId: w, name: 'M-Pesa', type: 'mobile_money', currency: 'KES', openingBalance: 1_500_000, status: 'active' },
    { id: cash, workspaceId: w, name: 'Cash', type: 'cash', currency: 'KES', openingBalance: 300_000, status: 'active' },
  ])
  await db.objects.bulkAdd([
    { id: salary, workspaceId: w, type: 'income_source', name: 'Salary', props: {}, tags: [], archived: false },
    { id: food, workspaceId: w, type: 'expense_category', name: 'Food', props: {}, tags: [], archived: false },
    { id: rent, workspaceId: w, type: 'bill', name: 'House rent', props: { dueDay: 5 }, tags: [], archived: false },
  ])
  const tx = (type: 'income' | 'expense', amount: number, d: number, accountId: string, objectId: string, note: string) => ({
    id: uid(), workspaceId: w, type, date: day(d), accountId, amount, splits: [{ objectId, amount }], tags: [], note,
  })
  await db.transactions.bulkAdd([
    tx('income', 8_500_000, 3, mpesa, salary, 'Monthly salary'),
    tx('expense', 2_500_000, 2, mpesa, rent, 'Rent'),
    tx('expense', 450_000, 1, mpesa, food, 'Naivas'),
    tx('expense', 120_000, 0, cash, food, 'Lunch'),
  ])
}
