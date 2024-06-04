<template>
  <div class="component-DriftEventEditForm">
    <div class="form-wrapper">
      <h1>Uusi Drift sarjan kausi</h1>
      <form @submit.prevent="(e) => submit(e)">
        <div v-if="overViewErrorMessage.length" class="error-wrapper">
          <p class="error-message">{{ overViewErrorMessage }}</p>
        </div>

        <div class="input-wrapper">
          <label for="serie">Sarja:</label>
          <SingleSelect
            class="single-select"
            placeholderOption="Valitse sarja"
            id="serie"
            :value="driftSeason.serie"
            :optionList="serieOptionList"
            @select="selectSerie"
          />
          <ErrorHover :errorMessage="errorTexts.serie" />
        </div>
        <div class="input-wrapper">
          <label for="name">Kauden nimi (pakollinen):</label>
          <input
            v-model="driftSeason.name"
            type="text"
            id="name"
            @keyup="generateSlug()"
            @click="setErrorTextsDefault()"
          />
        </div>
        <div class="input-wrapper">
          <label for="slug">Kauden slug (pakollinen):</label>
          <input
            v-model="driftSeason.slug"
            type="text"
            id="slug"
            @click="setErrorTextsDefault()"
          />
        </div>
        <div class="input-wrapper">
          <label for="year">Vuosi:</label>
          <input
            v-model.number="driftSeason.year"
            type="number"
            id="year"
            :class="{ error: errorTexts.year.length }"
            @keyup="generateSlug()"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.year" />
        </div>

        <div class="button-wrapper">
          <ButtonWithLoader
            buttonType="submit"
            :loading="loading"
            @click="submit"
          >
            <span> Luo </span>
          </ButtonWithLoader>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import driftSeasonApi from "~/utils/drifting/api-drift-season";
import { DriftSerie } from "~/enums/drift-serie.enum";

interface ErrorTexts {
  serie: string;
  year: string;
  slug: string;
}

interface DriftSeasonEditFormData {
  driftSeason: {
    serie: DriftSerie | "";
    name: string;
    year: number;
    slug: string;
  };

  errorTexts: ErrorTexts;
  overViewErrorMessage: string;

  loading: boolean;
}

export default {
  props: {
    initialId: { type: String, default: "" },
  },
  data: (): DriftSeasonEditFormData => ({
    loading: false,

    overViewErrorMessage: "",
    errorTexts: {
      serie: "",
      year: "",
      slug: "",
    },
    driftSeason: {
      serie: "",
      name: "",
      slug: "",
      year: new Date().getFullYear(),
    },
  }),
  computed: {
    serieOptionList(): string[] {
      const r = Object.values(DriftSerie);
      console.log(r);
      return r;
    },
  },
  methods: {
    generateSlug(): void {
      const parsedName =
        this.driftSeason.name
          ?.toLowerCase()
          ?.replace(/ /g, "-")
          ?.replace(/[^a-z0-9-]/g, "") || "";
      const parsedYear = this.driftSeason.year || "";

      this.driftSeason.slug = `${parsedName}-${parsedYear}`;
    },
    selectSerie(serie: DriftSerie) {
      this.driftSeason.serie = serie;
      this.setErrorTextByKey("serie", "");
    },
    async submit(e: Event) {
      if (this.loading) return;
      this.setLoading(true);
      e.preventDefault();

      const isError = this.checkInputsForErrors();
      if (isError) {
        this.setLoading(false);
        return;
      }

      await this.createDriver();
      this.setLoading(false);
    },
    async createDriver() {
      const { serie, name, year, slug } = this.driftSeason;
      const givenSerie = serie as DriftSerie;

      const newEvent = await driftSeasonApi.createDriftSeason({
        serie: givenSerie,
        name,
        year,
        slug,
      });

      if (newEvent) {
        this.$router.push(`/drift-season`);
      } else {
        this.setOverViewErrorMessage("Virhe luodessa kautta");
      }
    },
    checkInputsForErrors(): boolean {
      let isError = false;
      if (!this.driftSeason?.serie?.length) {
        isError = true;
        this.setErrorTextByKey("serie", "Sarja vaaditaan");
      }
      if (!this.driftSeason?.slug?.length) {
        isError = true;
        this.setErrorTextByKey("slug", "Slug vaaditaan");
      }
      if (!this.driftSeason?.year) {
        isError = true;
        this.setErrorTextByKey("year", "Vuosi vaaditaan");
      }
      return isError;
    },
    setErrorTextsDefault(): void {
      this.setErrorTextByKey("serie", "");
      this.setErrorTextByKey("year", "");
      this.setErrorTextByKey("slug", "");
      this.setOverViewErrorMessage("");
    },
    setOverViewErrorMessage(message: string): void {
      this.overViewErrorMessage = message;
    },
    setErrorTextByKey(key: keyof ErrorTexts, text: string): void {
      this.errorTexts[key] = text;
    },
    setLoading(value: boolean): void {
      this.loading = value;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventEditForm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .form-wrapper {
    border: 2px solid var(--black-2);
    border-radius: 10px;
    padding: 24px;

    h1 {
      text-align: center;
    }

    max-width: 350px;
    margin: auto;

    form {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .error-wrapper {
        .error-message {
          text-align: center;
          color: var(--error-color);
          margin: 0;
        }
      }

      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
        position: relative;

        input,
        .single-select {
          width: 350px;
        }
      }

      .button-wrapper {
        margin-top: 4px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

      .car-list {
        margin: 0;
        padding: 0;
        list-style: none;

        li {
          margin: 0;
          padding: 0;
          list-style: none;
        }
      }
    }
  }
}
</style>
