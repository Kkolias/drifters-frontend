<template>
  <div class="component-QualifyingEditForm">
    <div class="form-wrapper">
      <h1>Uusi Lajittelu</h1>
      <form @submit.prevent="(e) => submit(e)">
        <div v-if="overViewErrorMessage.length" class="error-wrapper">
          <p class="error-message">{{ overViewErrorMessage }}</p>
        </div>

        <div class="input-wrapper">
          <label for="event">Tapahtuma:</label>
          <SingleSelect
            class="single-select"
            placeholderOption="Valitse sarja"
            id="event"
            :value="qualifying.eventId"
            :optionList="parsedEventList"
            @select="selectEvent"
          />
          <ErrorHover :errorMessage="errorTexts.eventId" />
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
import type { IDriftEvent } from "~/interfaces/drift-event.interface";
import qualifyingApi from "~/utils/drifting/api-qualifying";
import driftEventApi from "~/utils/drifting/api-drift-event";

interface ParsedDriftEvent extends IDriftEvent {
  key: string;
  label: string;
}

interface ErrorTexts {
  eventId: string;
}

interface QualifyingEditFormData {
  qualifying: {
    eventId: string;
  };

  eventList: IDriftEvent[];

  errorTexts: ErrorTexts;
  overViewErrorMessage: string;

  loading: boolean;
}

export default {
  props: {
    initialId: { type: String, default: "" },
  },
  data: (): QualifyingEditFormData => ({
    loading: false,

    overViewErrorMessage: "",
    errorTexts: {
      eventId: "",
    },
    qualifying: {
      eventId: "",
    },

    eventList: [],
  }),
  computed: {
    parsedEventList(): Partial<ParsedDriftEvent>[] {
      return this.eventList.map((event) => ({
        key: event._id,
        label: event.name,
      }));
    },
  },
  mounted() {
    this.fetchEventList();
  },
  methods: {
    async fetchEventList() {
      const r = await driftEventApi.getAllDriftEvents();
      this.eventList = r;
    },
    selectEvent(event: ParsedDriftEvent) {
      this.qualifying.eventId = event?.key;
      this.setErrorTextByKey("eventId", "");
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

      await this.create();
      this.setLoading(false);
    },
    async create() {
      const { eventId } = this.qualifying;

      const newQualifying = await qualifyingApi.createQualifying(eventId);

      if (newQualifying) {
        this.$router.push(`/qualifying`);
      } else {
        this.setOverViewErrorMessage("Virhe luodessa lajittelua");
      }
    },
    checkInputsForErrors(): boolean {
      let isError = false;
      if (!this.qualifying?.eventId?.length) {
        isError = true;
        this.setErrorTextByKey("eventId", "Sarja vaaditaan");
      }

      return isError;
    },
    setErrorTextsDefault(): void {
      this.setErrorTextByKey("eventId", "");
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
.component-QualifyingEditForm {
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
    }
  }
}
</style>
