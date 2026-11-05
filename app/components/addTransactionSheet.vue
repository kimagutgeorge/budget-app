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

</template>