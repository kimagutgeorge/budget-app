<script setup lang="ts">
const route = useRoute()
const tabs = [
  { to: '/', label: 'Home', icon: 'lucide:layout-dashboard' },
  { to: '/transactions', label: 'Activity', icon: 'lucide:arrow-left-right' },
  { to: '/accounts', label: 'Accounts', icon: 'lucide:wallet' },
  { to: '/objects', label: 'Things', icon: 'lucide:shapes' },
  { to: '/reports', label: 'Reports', icon: 'lucide:chart-no-axes-column' },
]
const index = computed(() => Math.max(0, tabs.findIndex((t) => (t.to === '/' ? route.path === '/' : route.path.startsWith(t.to)))))
const addOpen = useState('addTxOpen', () => false)
</script>

<template>
  <div class="min-h-dvh pb-28" style="padding-top: env(safe-area-inset-top)">
    <slot />
    <button class="press fixed right-5 z-40 grid h-14 w-14 place-items-cener rounded-2xl bg-[var(--ink)] text-white shadow-lg"
    style="bottom:calc(6.25rem + env(safe-area-inset-bottom))"
    aria-label="Add transaction" @click="addOpen = true"
    >
    <Icon name="lucide:plus" size="26" />
    </button>
    <AddTransactionSheet />
    <nav class="fixed inset-x-3 bottom-3 rounded-3xl bg-white/90 backdrop-blur shadow-[0_8px_30px_rgba(15,27,45,.12)]"
         style="margin-bottom: env(safe-area-inset-bottom)">
      <div class="relative grid grid-cols-5 p-1.5">
        <!-- sliding pill: transform only (GPU), springy overshoot easing -->
        <div class="absolute top-1.5 bottom-1.5 left-1.5 rounded-2xl bg-[var(--teal)] transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
             :style="{ width: 'calc((100% - 12px) / 5)', transform: `translateX(${index * 100}%)` }" />
        <NuxtLink v-for="(t, i) in tabs" :key="t.to" :to="t.to"
                  class="press relative z-10 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors duration-300"
                  :class="i === index ? 'text-white' : 'text-[var(--muted)]'">
          <Icon :name="t.icon" size="22" />{{ t.label }}
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
