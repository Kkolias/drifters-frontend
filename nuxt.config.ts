// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@pinia/nuxt"],

  // default title for all pages
  app: {
    head: {
      title: "DrifDataan - Drifting tilastot ja tulokset",
      meta: [
        // default meta tags:
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "DriftDataan tarjoaa kattavat tilastot ja tulokset Drift Masters Europe sarjasta. Seuraa driftaustapahtumien kuumimpia hetkiä ja tutustu huippuluokan driftaajiin!",
        },
      ],
    },
  },
  css: ["~/assets/less/main.less"],
});
