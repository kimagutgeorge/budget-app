<script setup lang="ts">
defineProps< {title?:string }>()
const open = defineModel<boolean>({ default: false })

const mounted = ref(false)
const y = ref(0)
const dragging = ref(false)
const sheet = ref<HTMLLIElement>()
const height = () => sheet.value?.offsetHeight || 600
let startY = 0, lastY = 0, lastT = 0, velocity = 0

watch(open, async (isOpen) => {
    if (isOpen) {
        mounted.value = true
        y.value = window.innerHeight
        await nextTick()
        sheet.value?.getBoundingClientRect()
        y.value = 0
    }else{
        y.value = height()
        setTimeout(() => { if (!open.value) mounted.value = false}, 500)
    }
})

const fade = computed(() => (mounted.value ? 1 - Math.min(1, Math.max(0, y.value / height())) : 0))

function down(e: PointerEvent){
    dragging.value = true
    startY = lastY = e.clientY; lastT = e.timeStamp; velocity = 0; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function move(e: PointerEvent) {
    if (!dragging.value) return;
    const dy = e.clientY - startY
    y.value = dy > 0 ? dy : dy /6
    velocity = (e.clientY - lastY)
    lastY = e.clientY; lastT = e.timeStamp
}

function up() {
    if(!dragging.value) return
    dragging.value = false
    if (y.value > height () * 0.3 || velocity > 0.7) open.value = false
    else y.value = 0
}

</script>

<template>
    <Teleport to="body">
        <div v-if="mounted" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-[#0F1B2D]/40" 
            :style="{ opacity: fade, transition: dragging ? 'none' : 'opacity .3s ease' }" 
            @click="open = false"/>
            <div ref="sheet"
            class="absolute inste-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-white after:absolute after:inset-x-0 after:top-full after:h-32 after:bg-white" 
            :style="{ transform: `translateY(${y}px)`, transition: dragging ? 'none' : 'transform .5s cubic-bezier(.34, 1.3,.64,1)' }"
            >
                <div class="shrink-0 cursor-grab touch-none px-5 pb-2 pt-3" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
                    <div class="mx-auto h-1.5 rounded-full bg-[var(--ink)]/15" />
                    <h2 v-if="title" class="font-display mt-3 text-lg font-semibold">{{ title }}</h2>
                </div>
                <div class="overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>