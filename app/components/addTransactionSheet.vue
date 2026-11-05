<script setup lang="ts">
    import { z } from 'zod'
    import { format } from 'date-fns'
    import { db } from '~/db';
    import { createTransaction } from '~/db/repos/transactions';
    import type { Account, TxType } from '~/types'

    const open = useState('addTxopen', () => false)
    const { toMinor } = useMoney()
    const haptics = useHaptics()
    const accounts = useLive(() => db.accounts.filter((a) => a.status === 'active').toArray(), [] as Account[])

    const types: { id: TxType; label: string} [] = [
        {id: 'expense', label: 'Expense'}, { id: 'income', label: 'Income'}, {id: 'transfer', label: 'Transfer'}
    ]

    const type = ref<TxType>('expense')
    const typeIndex = computed(() => types.findIndex((t) => t.id === type.value))
    const amount = ref(''), accountId = ref(''), toAccountId = ref(''), note = ref(''), error = ref('')
    const date = ref(format(new Date(), 'yyyy-MM-dd'))

    watch(open, (o) => {
        if (!o) return
        type.value = 'expense'; amount.value = ''; note.value = ''; error.value = ''
        date.value =format(new Date(), 'yyyy-MM-dd')
        accountId.value = accounts.value[0]?.id ?? ''
        toAccountId.value = accounts.value[1]?.id ?? ''
    })

    const schema = z.object({
        amount: z.number({ invalid_type_error: 'Enter a valid amount'}).int().positive('Enter an amount above zero'),
        accountId:z.string().min(1, 'Choose an account'),
        date: z.string().regex(/^(\d{4}-\d{2}-\d{2})$/, 'Choose a date')
    })

    async function save(){
        const parsed = schema.safeParse({
            amount: toMinor(amount.value.replace(/,/g, '')),
            accountId: accountId.value,
            date: date.value,
        })

        if(!parsed.success) { error.value = parsed.error.issues[0]?.message ?? 'Please check your inputs'; haptics.tap(); return}
        if(type.value === 'transfer' && (!toAccountId.value || toAccountId.value === accountId.value)){
            error.value = 'Choose two different accounts'; haptics.tap(); return
        }

        await createTransaction({
            type: type.value,
            ...parsed.data,
            toAccountId: type.value === 'transfer' ? toAccountId.value : undefined,
            note: note.value.trim() || undefined
        })
        haptics.success()
        open.value =false
    }

</script>

<template>
    <BottomSheet v-model="open" title="New transaction">
        <div v-if="!accounts.length" class="py-6 text-center">
            <p class="font-medium">Add an account first</p>
            <p class="mt-1 text-sm text-[var(--muted)]">Money has to move in or out of account</p>
            <NuxtLink to="/accounts" class="press mt-4 inline-block roeunded-xl bg-[var--(teal)] px-5 py-2.5 text-white" @click="open = false">
                Go to account
            </NuxtLink>
        </div>

        <form v-else class="space-y-4" @submit.prevent="save">
            <div class="relative grid grid-cols-3 rounded-2xl bg-[var(--paper)] p-1">
                <div class="absolute inste-y-1 left-1 rounded-xl bg-white shadow transition-transform duratin-300 ease-[cubic-bezier(.34,1.3,.64,1)]"
                :style="{width: 'calc((100% - 8px) / 3)', transform: `translateX(${typeIndex * 100}%)`}" />
                <button v-for="t in types" :key="t.id" type="button" 
                class="relative z-10 py-2 text-sm font-medium transition-colors" 
                :class="type === t.id ? '' : 'text-[var(--muted)]' "
                @click="type = t.id; haptics.tap()"
                >
                    {{ t.label }}
                </button>
            </div>

            <label class="block">
                <span class="text-sm text-var[(--muted)]">Amount (kes)</span>
                <input v-model="amount" inputmode="decimal" placeholder="0"
                class="font-display mt-1 w-full bg-transparent text-4xl font-bold outline-none"
                :class="type === 'income' ? 'text-[var(--gain)]' : type === 'expense' ? 'text-[var(--loss)]' : '' " />
            </label>

            <label class="block">
                <span class="text-sm text-var[(--muted)]">{{ type === 'transfer' ? 'From account' : 'Account' }}</span>
                <select v-model="accountId" class="field -mt-1">
                    <option v-for="a in accounts" :key="a.id" value="a.id"> {{ a.name }}</option>
                </select>
            </label>

            <label class="block">
                <span class="text-sm text-var[(--muted)]">To account</span>
                <select class="field -mt-1">
                    <option v-for="a in accounts" :key="a.id" :value="a.id"> {{ a.name }}</option>
                </select>
            </label>

            <div class="grid grid-cols-2 gap-3">
                <label class="block"><span class="text-sm text-[var(--muted)]">Date</span>
                    <input v-model="date" type="date" class="field mt-1" />
                </label>
                <label class="block"><span class="text-sm text-[var(--muted)]">Note</span>
                    <input v-model="date" placeholder="Optional" class="field mt-1" />
                </label>
            </div>

            <p v-if="error" role="alert" class="text-sm text-[var--(loss)]"> {{ error }} </p>
            <button type="submit" class="press w-full rounded-2xl bg-[var(--teal)] py-3.5 font-semibold text-white"> Save transactions</button>
        </form>
    </BottomSheet>
</template>