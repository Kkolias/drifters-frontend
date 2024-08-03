// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@pinia/nuxt"],

  
  // pwa: { icon: { source: "/favicon.svg?v1" } },
  
  // default title for all pages
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg", href: "/favicon.svg" }],
      title: "DriftDataan - Drifting tulokset ja tilastot",
      meta: [
        // default meta tags:
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "DriftDataan tarjoaa kattavat tulokset ja tilastot Drift Masters Europe sekä Suomen Drift SM sarjasta. Seuraa driftaustapahtumien kuumimpia hetkiä ja tutustu huippuluokan driftaajiin!",
        },
      ],
      script: [
        {
          src: 'https://fundingchoicesmessages.google.com/i/pub-9719911928704123?ers=1',
          async: true
        }
      ],
      // __dangerouslyDisableSanitizers: ['script']
    },
  },
  css: ["~/assets/less/main.less"],
});
