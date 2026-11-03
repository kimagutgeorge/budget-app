export default defineNuxtConfig({
  ssr: false, // SPA: required for a Capacitor webview
  compatibilityDate: '2025-07-01',
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/icon', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: { meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }] },
  },
  fonts: { families: [{ name: 'Bricolage Grotesque' }, { name: 'Instrument Sans' }] },
  icon: { serverBundle: 'local', clientBundle: { scan: true } }, // bundle icons: app must work offline
  devtools: { enabled: true },
})
