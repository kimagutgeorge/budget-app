<script setup lang="ts">
import { seedDemo } from '~/db/seed'
const { format } = useMoney()
const { netWorth, month, txs } = useLedger()
const shown = useTransition(netWorth, { duration: 900, transition: [0.22, 1, 0.36, 1] }) // balance tween
const recent = computed(() => txs.value.slice(0, 6))
</script>

<template>
  <main class="px-5 pt-8">
    <p class="text-sm text-[var(--muted)]">Net worth</p>
    <h1 class="font-display text-5xl font-bold tracking-tight text-[var(--saffron)] drop-shadow-[0_1px_0_rgba(15,27,45,.15)]">
      {{ format(Math.round(shown)) }}
    </h1>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <div class="rounded-2xl bg-white p-4">
        <p class="text-sm text-[var(--muted)]">Income this month</p>
        <p class="font-display mt-1 text-xl font-semibold text-[var(--gain)]">{{ format(month.income) }}</p>
      </div>
      <div class="rounded-2xl bg-white p-4">
        <p class="text-sm text-[var(--muted)]">Spent this month</p>
        <p class="font-display mt-1 text-xl font-semibold text-[var(--loss)]">{{ format(month.expense) }}</p>
      </div>
    </div>

    <h2 class="font-display mt-8 mb-3 text-lg font-semibold">Recent activity</h2>
    <div v-if="!recent.length" class="rounded-2xl bg-white p-6 text-center">
      <p class="font-medium">No transactions yet</p>
      <p class="mt-1 text-sm text-[var(--muted)]">Add your first one, or load sample data to explore.</p>
      <button class="press mt-4 rounded-xl bg-[var(--teal)] px-5 py-2.5 text-white" @click="seedDemo()">Load sample data</button>
    </div>
    <TransitionGroup v-else name="list" tag="ul" class="space-y-2">
      <li v-for="t in recent" :key="t.id" class="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
        <div><p class="font-medium">{{ t.note || t.type }}</p><p class="text-xs text-[var(--muted)]">{{ t.date }}</p></div>
        <p class="font-display font-semibold" :class="t.type === 'income' ? 'text-[var(--gain)]' : ''">
          {{ t.type === 'income' ? '+' : t.type === 'expense' ? '−' : '' }}{{ format(t.amount) }}
        </p>
      </li>
    </TransitionGroup>
  </main>
</template>

<style>
.list-enter-active { transition: all .35s cubic-bezier(.22,1,.36,1); }
.list-enter-from { opacity: 0; transform: translateY(10px); }
</style>
