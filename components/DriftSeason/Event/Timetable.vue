<template>
  <div class="component-DriftSeasonEventTimetable">
    <div class="schedule-wrapper">
      <h2 class="title">{{ textContent.timeAsYourTime }}</h2>
      <div v-if="noSchedule" class="no-schedule">
        <p>{{ textContent.noSchedule }}</p>
      </div>
      <div class="timetable-wrapper">
        <div
          v-for="daySchedule in timetable"
          :key="daySchedule.date"
          class="day-schedule"
        >
          <h3>{{ getDayFormatted(daySchedule.date) }}</h3>
          <div
            v-for="(schedule, index) in daySchedule.entries"
            :key="index"
            class="schedule"
          >
            <p class="time">{{ getClockTime(schedule.timeUTC) }}</p>
            <p>{{ getEntryName(schedule.name) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { IDayScheduleSchema } from "~/interfaces/drift-event.interface";
import Language from "~/mixins/language.vue";

const dayForIndex: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
}

const translations = {
  en: {
    noSchedule: "No schedule available",
    timeAsYourTime: "Event schedules in your timezone",
    sunday: "Sun",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
  },
  fi: {
    noSchedule: "Aikataulua ei saatavilla",
    timeAsYourTime: "Tapahtuman aikataulut aikavyöhykkeesi mukaan",
    sunday: "Su",
    monday: "Ma",
    tuesday: "Ti",
    wednesday: "Ke",
    thursday: "To",
    friday: "Pe",
    saturday: "La",

  },
};

export default {
  mixins: [Language],
  props: {
    driftEvent: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    noSchedule(): boolean {
      return !this.timetable.length;
    },
    timetable(): IDayScheduleSchema[] {
      return this.driftEvent?.timetable || [];
    },
  },
  methods: {
    getEntryName(name: { en: string; fi: string }): string {
      return this.getTranslation(name);
    },
    getDayFormatted(day: string): string {
      const date = new Date(day)
      const dayFormatted = date.toLocaleDateString();
      const dayName = this.getDayNameShort(date);
      return `${dayName} ${dayFormatted}`;
    },
    getDayNameShort(date: Date): string {
      const dayNumber = date.getDay()
      if(dayNumber > 6 || dayNumber < 0) return ''

      const keyForDay = dayForIndex?.[dayNumber] || null
      if(!keyForDay) return ''
      return this.textContent?.[keyForDay] || ''
    },
    getClockTime(dayWithTime: string): string {
      const utcDate = new Date(dayWithTime);
      return utcDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriftSeasonEventTimetable {
  p {
    text-align: center;
    padding: 20px;
  }

  .title {
    text-align: center;
    font-size: 24px;
    color: var(--green-1);
  }

  .timetable-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;

    .day-schedule {
      border: 2px solid var(--black-2);
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 20px;
      max-width: 400px;
      min-width: 200px;
      width: 100%;

      h3 {
        font-size: 1.5rem;
        margin-bottom: 5px;
        text-align: center;
        margin-top: 5px;
      }

      .schedule {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        // border: 1px solid #ccc;
        border-radius: 5px;
        position: relative;

        p {
          padding: 0;
          margin: 6px 4px;
        }

        .time {
          font-weight: bold;
        }

        &:after {
          content: "";
          display: block;
          width: 100%;
          height: 1px;
          background-color: var(--black-2);
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }

  @media only screen and (max-width: 400px) {
    .timetable-wrapper {
      .schedule {
        p {
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>
