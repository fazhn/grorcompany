// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  runtimeConfig: {
    // Variables privadas del servidor (solo disponibles en server-side)
    minioServerUrl: process.env.MINIO_SERVER_URL,
    minioRootUser: process.env.MINIO_ROOT_USER,
    minioRootPassword: process.env.MINIO_ROOT_PASSWORD,
    minioBucket: process.env.MINIO_BUCKET,
  },
})
