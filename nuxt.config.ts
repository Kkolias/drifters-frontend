// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  plugins: ["~/plugins/socket.io.ts"],

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
        // application name
        { name: "application-name", content: "DriftDataan" },
        // og tags:
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://driftdataan.fi" },
        {
          property: "og:title",
          content: "DriftDataan - Drifting tulokset ja tilastot",
        },
        {
          property: "og:description",
          content:
            "DriftDataan tarjoaa kattavat tulokset ja tilastot Drift Masters Europe sekä Suomen Drift SM sarjasta. Seuraa driftaustapahtumien kuumimpia hetkiä ja tutustu huippuluokan driftaajiin!",
        },
        { property: "og:site:name", content: "DriftDataan" },
      ],
      script: [
        {
          src: "https://fundingchoicesmessages.google.com/i/pub-9719911928704123?ers=1",
          async: true,
        },
        {
          hid: "adsense",
          async: true,
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9719911928704123",
          crossorigin: "anonymous",
        },
      ],
      // __dangerouslyDisableSanitizers: ['script']
    },
  },

  css: ["~/assets/less/main.less"],
  compatibilityDate: "2025-02-04",
});
