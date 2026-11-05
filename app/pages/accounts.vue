
<script setup lang="ts">
import { accountBalance  } from '~/composables/useLedger';
import type { Account  } from '~/types';

const { format } = useMoney()
const { accounts, txs } = useLedger()
const active = computed(() => accounts.value.filter((a) => a.status === 'active'))

const sheetOpen = ref(false)
const editing = ref<Account | null>(null)
function openSheet(a:Account | null) { editing.value = a; sheetOpen.value = true }
</script>

<template>
  <main class="px-5 pt-8">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-bold">Accounts</h1>
      <button class="press rounded-xl bg-[var(--teal)] px-4 py-2 text-sm font-medium text-white" @click="openSheet(null)">
        Add account
      </button>
    </div>

    <div v-if="!active.length" class="mt-5 rounded-2xl bg-white p-6 text-center">
      <p class="font-medium">No accounts yet</p>
      <p class="mt-1 text-sm text-[var(--muted)]">Add M-pesa, your bank or cash to start tracking</p>
    </div>

    <TransitionGroup v-else name="list" tag="ul" class="t-6 space-y-2">
      <li v-for="a in active" :key="a.id">
        <button class="press flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 text-left" @click="openSheet(a)">
          <div>
            <p class="font-medium">{{ a.name }}</p>
            <p class="text-xs text-[var(--muted)]">{{ kindLabel(a.type) }}<span v-if="a.institution">, {{ a.institution }}</span></p>
          </div>
          <p class="font-display font-semibold" :class="accountBalance(a, txs) < 0 ? 'text-[var(--loss)]' : ''">
            {{ format(accountBalance(a, txs)) }}
          </p>
        </button>
      </li>
    </TransitionGroup>
  </main>
</template>