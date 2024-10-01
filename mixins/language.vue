<script lang="ts">
export default {
  methods: {
    getTranslation(translations: any) {
      const hasEnPrefix = this.$route.path.includes("/en/");
      const isEnIndex = this.$route.path === "/en";

      const isEn = hasEnPrefix || isEnIndex;

      return isEn ? translations.en : translations.fi;
    },
  },
};
</script>
