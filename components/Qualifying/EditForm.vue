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
            placeholderOption="Valitse tapahtuma"
            id="event"
            :value="selectedEvent"
            :optionList="filteredEventList"
            @select="selectEvent"
          />
          <ErrorHover :errorMessage="errorTexts.eventId" />
        </div>
        <div class="input-wrapper">
          <label for="date">Päivämäärä:</label>
          <input
            v-model="qualifying.date"
            placeholder=""
            :class="{ error: errorTexts.date.length }"
            type="datetime-local"
            id="date"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.date" />
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
  date: string;
}

interface QualifyingEditFormData {
  qualifying: {
    eventId: string;
    date: string;
  };

  eventList: IDriftEvent[];

  errorTexts: ErrorTexts;
  overViewErrorMessage: string;

  loading: boolean;
}

export default {
  props: {
    initialId: { type: String, default: "" },
    initialEventId: { type: String, default: "" },
    emitSuccess: { type: Boolean, default: false },
  },
  data: (): QualifyingEditFormData => ({
    loading: false,

    overViewErrorMessage: "",
    errorTexts: {
      eventId: "",
      date: "",
    },
    qualifying: {
      eventId: "",
      date: "",
    },

    eventList: [],
  }),
  computed: {
    selectedEvent(): string {
      return (
        this.parsedEventList?.find(
          (event) => event.key === this.qualifying.eventId
        )?.label || ""
      );
    },
    parsedEventList(): Partial<ParsedDriftEvent>[] {
      return this.eventList.map((event) => ({
        key: event._id,
        label: event.name,
      }));
    },
    filteredEventList(): Partial<ParsedDriftEvent>[] {
      if (!this.eventList) return this.parsedEventList;
      return this.parsedEventList.filter(
        (event) => event.key !== this.initialEventId
      );
    },
  },
  async mounted() {
    await this.fetchEventList();

    if (this.initialEventId) this.qualifying.eventId = this.initialEventId;
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
      const { eventId, date } = this.qualifying;

      const dateUtc = `${date}:00.000Z`;

      const newQualifying = await qualifyingApi.createQualifying(eventId, dateUtc);

      if (newQualifying) {
        if (this.emitSuccess) this.$emit("success");
        else this.$router.push(`/qualifying`);
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
      if (!this.qualifying?.date?.length) {
        isError = true;
        this.setErrorTextByKey("date", "Päivämäärä vaaditaan");
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
