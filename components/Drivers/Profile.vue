<template>
  <div class="component-DriverProfile">
    <NuxtLink to="/drivers" class="back-to-drivers"
      >{{ textContent.back }}</NuxtLink
    >
    <div class="profile-wrapper">
      <h1 class="driver-name">
        {{ fullName }}
        <span class="race-number" v-if="raceNumber">{{ raceNumber }}</span>
      </h1>

      <p>{{ textContent.age }} {{ age }}</p>

      <p>{{ textContent.country }} {{ country }}</p>
    </div>
    <div class="cars-wrapper">
      <h2>{{ textContent.cars }}</h2>
      <ul>
        <li v-for="car in driver.cars" :key="car._id">
          <p>{{ textContent.model }} {{ carModel(car) }}</p>
          <p>{{ textContent.engine }} {{ carEngine(car) }}</p>
          <p>{{ textContent.torque }} {{ carTorque(car) }}</p>
          <p>{{ textContent.power }} {{ carHorsePower(car) }}</p>
        </li>
      </ul>
    </div>
    <DriversDriverSeasonsSection
      v-if="!!driverStats"
      class="seasons-wrapper"
      :driverName="fullName"
      :driverId="driverId"
      :driverStats="driverStats"
      :loading="statsLoading"
    />
  </div>
</template>

<script lang="ts">
import type { IDriverSeasonStats } from "~/interfaces/drift-season.interface";
import type { ICar, IDriver } from "~/interfaces/driver.interface";
import Language from "~/mixins/language.vue";
import apiDrivers from "~/utils/drifting/api-drivers";
import { getAgeFromDate } from "~/utils/getAgeFromDate";
import { getCountryName } from "~/utils/getCountryName";
import translations from "~/lang/components/DriversProfile.lang";
import countryLang from "~/lang/country.lang";

interface IData {
  driverStats: IDriverSeasonStats | null;
  statsLoading: boolean;
}

export default {
  mixins: [Language],
  props: {
    driver: {
      type: Object as () => IDriver,
      required: true,
    },
  },
  data: (): IData => ({
    driverStats: null,
    statsLoading: true,
  }),
  computed: {
    textContent() {
      return this.getTranslation(translations);
    },
    countryTextContent() {
      return this.getTranslation(countryLang);
    },
    country(): string {
      const nationality = this.driver?.nationality;
      return getCountryName(nationality, this.countryTextContent);
    },
    age(): string {
      const birthday = this.driver?.birthday;
      return getAgeFromDate(birthday);
    },
    fullName(): string {
      const firstName = this.driver?.firstName;
      const lastName = this.driver?.lastName;
      return `${firstName} ${lastName}`;
    },
    raceNumber(): string {
      const number = this.driver?.raceNumber;
      if (!number) return "";
      return `#${number}`;
    },
    driverId(): string {
      return this.driver?._id || "";
    },
  },
  watch: {
    driverId: {
      immediate: true,
      handler() {
        this.fetchDriverStats();
      },
    },
  },
  methods: {
    carModel(car: ICar): string {
      return car.model;
    },
    carEngine(car: ICar): string {
      return car.engine;
    },
    carTorque(car: ICar): string {
      const torque = car.torque;
      return `${torque} Nm`;
    },
    carHorsePower(car: ICar): string {
      const horsePower = car.hp;
      return `${horsePower} hv`;
    },

    async fetchDriverStats() {
      if (!this.driverId) {
        this.statsLoading = false;
        return;
      }
      this.statsLoading = true;
      const r = await apiDrivers.getDriverStats(this.driverId);
      this.driverStats = r;
      this.statsLoading = false;
    },
  },
};
</script>

<style scoped lang="less">
.component-DriverProfile {
  padding: 12px;

  .back-to-drivers {
    position: absolute;
    top: 70px;
    left: 30px;
    padding-left: 20px;
    font-size: 16px;
    transition: 0.25s ease-in-out;

    &:before {
      content: "";
      position: absolute;
      background: url("~/assets/svg/arrow-grey.svg") no-repeat;
      background-size: contain;
      background-position: center;
      width: 20px;
      height: 20px;
      left: 0;
      top: 50%;
      transform: translateY(-50%) rotate(180deg);
      transition: 0.25s ease-in-out;
    }

    &:hover {
      color: var(--green-1);

      &:before {
        background-image: url("~/assets/svg/arrow-green.svg");
        transform: translateY(-50%) rotate(180deg) scale(1.05);
      }
    }
  }
  h1,
  p {
    display: inline-block;
  }

  p {
    font-size: 18px;

    @media only screen and (max-width: 500px) {
      font-size: 16px;
    }
  }
  h1 {
    @media only screen and (max-width: 500px) {
      font-size: 26px;
    }
    @media only screen and (max-width: 400px) {
      font-size: 22px;
    }
  }

  .driver-name {
    .race-number {
      color: var(--green-1);
    }
  }

  .profile-wrapper,
  .cars-wrapper {
    max-width: 500px;
    margin: auto;
    margin-top: 12px;

    border: 2px solid var(--black-2);
    padding: 12px;
    border-radius: 10px;
    padding-left: 24px;
    padding-right: 24px;

    h2 {
      text-align: center;
      font-size: 30px;

      @media only screen and (max-width: 500px) {
        font-size: 24px;
      }
      @media only screen and (max-width: 400px) {
        font-size: 20px;
      }
    }

    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    p {
      display: block;
    }
  }
  .profile-wrapper {
    display: flex;
    flex-direction: column;
  }

  .seasons-wrapper {
    margin-top: 48px;
    &:before {
      display: block;
      content: '';
      width: 100%;
      height: 2px;
      background: var(--green-1);
      
    }
  }
}
</style>
