<template>
  <div class="component-DriftEventScheduleEdit">
    <h2>Aikataulut</h2>
    <p>
      HUOM! Anna kellonajat omassa lokaalissa ajassasi. Järjestelmä muuttaa ne
      automaattisesti UTC aikaan.
    </p>
    <div v-for="(day, index) in timetable" class="day-schedule-wrapper">
      <!-- <h3>{{ getFormattedDay(day.date) }}</h3> -->
      <input
        class="day-input"
        type="date"
        :value="day.date"
        @change="($event) => setDay(day, $event)"
      />
      <button
        class="blank delete-btn delete-day-btn"
        @click="deleteDay(index)"
      ></button>
      <div
        v-for="(entry, index) in day.entries"
        class="entry-wrapper"
        :class="{ 'delete-row': deleteRowHover === index }"
      >
        <input
          type="datetime-local"
          :value="entry.timeUTC"
          @change="($event) => setEntryTime(entry, $event)"
        />
        <input
          type="text"
          placeholder="kuvaus FI"
          :value="entry.name.fi"
          @change="($event) => setEntryText(entry, 'fi', $event)"
        />
        <input
          type="text"
          placeholder="kuvaus EN"
          :value="entry.name.en"
          @change="($event) => setEntryText(entry, 'en', $event)"
        />
        <button
          class="blank delete-btn delete-entry-btn"
          @mouseover="deleteRowHover = index"
          @mouseleave="deleteRowHover = null"
          @click="deleteEntryFromDay(day, index)"
        ></button>
      </div>
      <button class="secondary" @click="addEntryToDay(day)">
        Lisää aikataulutus
      </button>
    </div>
    <div class="button-wrapper">
      <button class="secondary" @click="addNewDay()">
        <span>Lisää päivä</span>
      </button>

      <ButtonWithLoader @click="formatOutputAndSave()" :loading="loading">
        <span>Tallenna</span>
      </ButtonWithLoader>
    </div>
  </div>
</template>

<script lang="ts">
import type {
  IDayScheduleSchema,
  IDriftEvent,
  ITimetableEntrySchema,
} from "~/interfaces/drift-event.interface";
import apiDriftEvent from "~/utils/drifting/api-drift-event";

interface IData {
  driftEvent: IDriftEvent | null;
  timetable: IDayScheduleSchema[];
  loading: boolean;

  deleteRowHover: number | null;
}

export default {
  props: {
    eventId: {
      type: String,
      default: "",
    },
  },
  data: (): IData => ({
    driftEvent: null,
    timetable: [],
    loading: false,

    deleteRowHover: null,
  }),
  computed: {
    currentTimetable(): IDayScheduleSchema[] {
      return this.driftEvent?.timetable || [];
    },
    formattedDayOption(): string {
      if (!this.timetable?.length) {
        const today = new Date();
        return today.toISOString().split("T")[0];
      }

      const lastDay = this.timetable[this.timetable.length - 1];
      const lastDate = new Date(lastDay.date);
      const nextDay = new Date(lastDate.setDate(lastDate.getDate() + 1));
      return nextDay.toISOString().split("T")[0];
    },
  },
  mounted() {
    this.getDriftEvent();
  },
  methods: {
    async getDriftEvent() {
      this.loading = true;
      const r = await apiDriftEvent.getDriftEventById(this.eventId);
      this.driftEvent = r;
      this.setInitial();
      this.loading = false;
    },
    getFormattedDay(date: string) {
      const day = new Date(date);
      return day.toLocaleDateString("fi-FI");
    },
    addNewDay() {
      const todayFormatted = this.formattedDayOption;

      this.timetable = [
        ...this.timetable,
        {
          date: todayFormatted,
          entries: [],
        },
      ];
    },
    addEntryToDay(day: IDayScheduleSchema) {
      const selectedDay = day.date
      const defaultTimeUTC = convertUtcToLocal(selectedDay);
      console.log(defaultTimeUTC);
      day.entries.push({
        timeUTC: defaultTimeUTC,
        name: {
          en: "",
          fi: "",
        },
      });
    },

    setDay(day: IDayScheduleSchema, event: Event): void {
      const target = event.target as HTMLInputElement;
      const date = target?.value;
      if (!date) return;

      //   const dateISO = new Date(date).toISOString();
      day.date = date;
    },
    setEntryTime(entry: ITimetableEntrySchema, event: Event): void {
      const target = event.target as HTMLInputElement;
      const time = target?.value;
      if (!time) return;

      entry.timeUTC = time;
      console.log(this.timetable);
    },
    setEntryText(
      entry: ITimetableEntrySchema,
      lang: "fi" | "en",
      event: Event
    ): void {
      const target = event.target as HTMLInputElement;
      const text = target?.value;
      if (!text) return;

      const name = {
        ...entry.name,
        [lang]: text,
      };

      entry.name = name;
    },

    deleteEntryFromDay(day: IDayScheduleSchema, index: number): void {
      day.entries.splice(index, 1);
    },
    deleteDay(index: number): void {
      this.timetable.splice(index, 1);
    },

    setInitial(): void {
      const formatted = this.driftEvent?.timetable?.map((day) => {
        const entries = day?.entries?.map((entry) => {
          const timeUTC = entry.timeUTC;
          const timeLocal = convertUtcToLocal(timeUTC);

          console.log(timeLocal);
          return {
            ...entry,
            timeUTC: timeLocal,
            name: entry.name,
          };
        });

        const date = new Date(day.date).toISOString().split("T")[0];

        return {
          ...day,
          date,
          entries,
        };
      });

      this.timetable = formatted || [];
    },

    formatOutputAndSave() {
      if (!this.timetable?.length) return;
      const output =
        this.timetable?.map((day) => {
          const entries = day?.entries?.map((entry) => {
            const timeUTC = new Date(entry.timeUTC).toISOString();
            return {
              ...entry,
              timeUTC,
              name: entry.name,
            };
          });

          return {
            ...day,
            date: day.date,
            entries,
          };
        }) || [];

      this.save(output);
    },
    async save(formattedTimetable: IDayScheduleSchema[]) {
      this.loading = true;
      await apiDriftEvent.addDaySchedule(this.eventId, formattedTimetable);
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftEventScheduleEdit {
  max-width: 400px;
  padding-top: 20px;

  h2 {
    text-align: center;
  }

  .day-schedule-wrapper {
    border: 2px solid var(--black-2);
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    padding-right: 30px;
    position: relative;

    .delete-btn {
      position: absolute;
      width: 20px;
      height: 20px;
      background-image: url("/assets/svg/delete-icon.svg");
      background-size: cover;
      background-repeat: no-repeat;
      transform: translate(0, -50%);
      transition: all 0.2s;
      display: none;

      &:hover {
        transform: translate(0, -50%) scale(1.1);
        cursor: pointer;
      }
    }

    .delete-day-btn {
      top: 5px;
      right: 5px;
    }
    &:has(.delete-day-btn:hover) {
      background-color: rgba(126, 49, 49, 0.3);
    }

    .delete-entry-btn {
      top: calc(50% - 16px);
      right: -25px;
    }

    &:hover {
      .delete-day-btn,
      .delete-entry-btn {
        display: block;
      }

      .delete-row {
        display: block;
      }
    }

    

    button {
      margin-top: 10px;
    }

    input {
      margin-bottom: 8px;
      width: 100%;
    }

    .day-input {
      width: 200px;
      margin-bottom: 10px;
      margin-right: 10px;
    }

    .entry-wrapper {
      position: relative;
      &:after {
        content: "";
        width: 100%;
        height: 1px;
        background-color: var(--black-2);
        display: block;
        margin-bottom: 12px;
      }
    }

    .delete-row {
      display: none;
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: -10px;
        width: 100%;
        height: 100%;
        background-color: rgba(126, 49, 49, 0.3);
        padding: 0px 30px 0px 10px;
      }
    }
  }

  .button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
  }
}
</style>
