<template>
  <div class="component-DriftEventEditForm">
    <div class="form-wrapper">
      <h1>Uusi Drift event</h1>
      <form @submit.prevent="(e) => submit(e)">
        <div v-if="overViewErrorMessage.length" class="error-wrapper">
          <p class="error-message">{{ overViewErrorMessage }}</p>
        </div>

        <div class="input-wrapper">
          <label for="country">Maa:</label>
          <input
            v-model="driftEvent.country"
            type="text"
            :class="{ error: errorTexts.country.length }"
            id="country"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.country" />
        </div>
        <div class="input-wrapper">
          <label for="name">Nimi:</label>
          <input
            v-model="driftEvent.name"
            type="text"
            id="name"
            :class="{ error: errorTexts.name.length }"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.name" />
        </div>

        <div class="input-wrapper">
          <label for="startsAt">Alkamispäivä:</label>
          <input
            v-model="driftEvent.startsAt"
            placeholder=""
            :class="{ error: errorTexts.startsAt.length }"
            type="datetime-local"
            id="startsAt"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.startsAt" />
        </div>

        <div class="input-wrapper">
          <label for="endsAt">Päättymispäivä:</label>
          <input
            v-model="driftEvent.endsAt"
            placeholder=""
            :class="{ error: errorTexts.endsAt.length }"
            type="datetime-local"
            id="endsAt"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.endsAt" />
        </div>

        <div class="button-wrapper">
          <ButtonWithLoader
            buttonType="submit"
            :loading="loading"
            @click="submit"
          >
            <span> Tilaa </span>
          </ButtonWithLoader>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import driftEventApi from "../../utils/drifting/api-drift-event";

interface ErrorTexts {
  country: string;
  name: string;
  startsAt: string;
  endsAt: string;
}

interface DriftEventEditFormData {
  driftEvent: {
    id: string;
    country: string;
    name: string;
    startsAt: string;
    endsAt: string;
    seasonId: string;
  };

  errorTexts: ErrorTexts;
  overViewErrorMessage: string;

  loading: boolean;
}

export default {
  props: {
    initialId: { type: String, default: "" },
  },
  data: (): DriftEventEditFormData => ({
    loading: false,

    overViewErrorMessage: "",
    errorTexts: {
      name: "",
      country: "",
      startsAt: "",
      endsAt: "",
    },
    driftEvent: {
      id: "",
      country: "",
      name: "",
      startsAt: "",
      endsAt: "",
      seasonId: "",
    },
  }),
  methods: {
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
      const {
        country,
        name,
        startsAt,
        endsAt,
        seasonId,
      }: {
        country: string;
        name: string;
        startsAt: string;
        endsAt: string;
        seasonId: string;
      } = this.driftEvent;

      const newEvent = await driftEventApi.createDriftEvent({
        country,
        name,
        startsAt,
        endsAt,
        seasonId,
      });

      if (newEvent) {
        this.$router.push(`/drift-event`);
      } else {
        this.setOverViewErrorMessage("Virhe luodessa tapahtumaa");
      }
    },
    checkInputsForErrors(): boolean {
      let isError = false;
      if (!this.driftEvent?.name?.length) {
        isError = true;
        this.setErrorTextByKey("name", "Nimi vaaditaan");
      }
      if (!this.driftEvent?.country?.length) {
        isError = true;
        this.setErrorTextByKey("country", "maa vaaditaan");
      }
      return isError;
    },
    setErrorTextsDefault(): void {
      this.setErrorTextByKey("name", "");
      this.setErrorTextByKey("country", "");
      this.setErrorTextByKey("startsAt", "");
      this.setErrorTextByKey("endsAt", "");
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
