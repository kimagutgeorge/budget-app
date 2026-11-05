<script setup lang="ts">
  import { format as fmtDate, parseISO } from 'date-fns';
  import { deleteTransaction  } from '~/db/repos/transactions';
  import type { Transaction  } from '~/types';
  
  const { format } = useMoney()
  const { accounts, txs } = useLedger()
  const accountName = (id?: string) => accounts.value.find((a) => a.id === id)?.name ?? 'Remove account'

  const groups = computed(() => {
    const byDate = new Map<string, Transaction[]>()
    for (const t of txs.value){
      if (!byDate.has(t.date)) byDate.set(t.date, [])
      byDate.get(t.date)!.push(t)
    }
    return [...byDate].map(([date, items]) => ({ date, label:fmtDate(parseISO(date), 'EEE d MMM'), items }))
  })

  const armedId = ref<string | null>(null)
  async function remove(id: string) {
    if(armedId.value !== id) {armedId.value = id; setTimeout(() => {if (armedId.value === id) armedId.value = null}, 3000); return}
    await deleteTransaction(id)
    armedId.value = null
  }

  const sign = (t: Transaction) => (t.type === 'income' ? '+' :t.type === 'expense' ? '-' : '')
</script>

<template>
  <main class="px-5 pt-8">
    <h1 class="font-display text-2xl font-bold">Activity</h1>

    <div v-if="!groups.length" class="mt-6 rounded-2xl bg-white p-5 text-center">
      <p class="font-medium">Nothing here yet</p>
      <p class="mt-1 text-sm text-[var(--muted)]">Tap the + button to record your first transaction</p>
    </div>

    <section v-for="g in groups" :key="g.date" class="mt-6">
      <h2 class="mb-2 text-sm font-medium text-[var(--muted)]"> {{ g.label }}</h2>
      <TransitionGroup name="list" tag="ul" class="space-y-2">
        <li v-for="t in g.items" :key="t.id" class="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
          <div class="min-2-0 flex-1">
            <p class="truncate font-medium"> {{ t.note || t.type === 'transfer' ? 'Transfer' : t.type === 'income' ? 'Income' : 'Expense' }}</p>
            <p class="truncate text-xs text-[var(--muted)]">
              {{ t.type === 'transfer' ? `${accountName(t.accountId)} to ${accountName(t.toAccountId)}` : accountName(t.accountId) }}
            </p>
          </div>

          <p class="font-display font-semibold" :class="t.type === 'income' ? 'text-[var(--gain)]' : ''"> {{ sign(t) }} {{ format(t.amount) }}</p>
          <button class="press rounded-lg p-1.5 text-[var(--muted)]" :class="armedId === t.id ? 'bg-[var(--loss)] text-white' : ''"
          :aria-label="armedId = t.id ? 'Confirm delete' : 'Delete transaction'" @click="remove(t.id)">
            <Icon name="lucide:trash-2" size="18" />
          </button>
        </li>
      </TransitionGroup>
    </section>
  </main>
</template>