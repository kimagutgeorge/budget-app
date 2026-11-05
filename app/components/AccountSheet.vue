<script setup lang="ts">
import { strictObject, z } from 'zod'
import { createAccount, updateAccount, removeAccount } from '~/db/repos/accounts';
import type { Account, AccountType } from '~/types'

const props = defineProps<{account: Account | null}>()
const open = defineModel<boolean>({ default: false })
const { toMinor } = useMoney()
const haptics = useHaptics()

const name = ref(''), type = ref<AccountType>('mobile_money'), institution = ref(''), balance = ref('')
const error = ref(''), armed = ref(false)

watch(open, (o) => {
    if(!o) return
    const a = props.account
    name.value = a?.name ?? ''; type.value = a?.type ?? 'mobile_money'
    institution.value = a?.institution ?? ''
    balance.value = a ? String(Math.abs(a.openingBalance) / 100) : ''
    error.value = ''; armed.value = false
})

const schema = z.object({
    name: z.string().trim().min(1, 'Give the account a name'),
    balance: z.number({ invalid_type_error: 'Enter a valid amount'}).min(0, 'Enter zero or more')
})

async function save(){
    const raw = balance.value.replace(/,/g, '').trim()
    const parsed = schema.safeParse({ name: name.value, balance: raw === '' ? 0 : Number(raw) })
    if(!parsed.success) {
        const issue = parsed.error.issues[0]
        error.value = issue?.message ?? 'Enter valid account details'
        haptics.tap()
        return
    }

    const minor = toMinor(parsed.data.balance)
    const input = {
        name: parsed.data.name, type: type.value,
        institution: institution.value.trim() || undefined,
        openingBalance: isDebtType(type.value) ?-minor : minor,
    }

    if (props.account) await updateAccount(props.account.id, input)
    else await createAccount(input)
    haptics.success()
    open.value = false
}

async function remove() {
    if(!props.account) return
    if(!armed.value) { armed.value = true;  setTimeout(() => (armed.value = false), 300); return }
    await removeAccount(props.account.id)
    open.value = false
}

</script>

<template>
    <BottomSheet v-model="open" :title="account ? 'Edit account' : 'New account'">
        <form class="space-y-4" @submit.prevent="save">
            <label class="block">
                <span class="text-sm text-[var(--muted)]">Name</span>
                <input v-model="name" placeholder="M-pesa, Equity, Cash" class="field mt-1" />
            </label>
            <label class="block">
                <span class="text-sm text-[var(--muted)]">Type</span>
                <select v-model="type" class="field -mt-1">
                    <option v-for="k in accountKinds" :key="k.id" value="k.id"> {{ k.label }}</option>
                </select>
            </label>
            <label class="block">
                <span class="text-sm text-[var(--muted)]">Instituition</span>
                <input v-model="institution" placeholder="Optional" class="field mt-1" />
            </label>
            <label class="block">
                <span class="text-sm text-[var(--muted)]">{{ isDebtType(type) ? 'Amount owed (KES)' : 'Balance today(kes)' }}</span>
                <input v-model="balance" inputmode="decimal" placeholder="0" class="field mt-1" />
            </label>
            <p v-if="error" role="alert" class="text-sm text-[var(--loss)]">{{ error }}</p>
            <button type="submit" class="press w-full rounded-2xl bg-[var(--teal)] py-3.5 font-semibold text-white">
                {{ account ? 'Save changes' : 'Add account' }}
            </button>

            <template v-if="account">
                <button type="button" class="press w-full rounded-2xl py-3 font-medium text-[var(--loss)]" @click="remove">
                    {{ armed ? 'Tap again to confirm' : 'Delete account' }}
                </button>
            </template>
        </form>
    </BottomSheet>
</template>