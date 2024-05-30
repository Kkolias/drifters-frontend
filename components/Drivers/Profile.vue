<template>
  <div class="component-DriverProfile">
    <div class="profile-wrapper">
      <h1 class="driver-name">
        {{ fullName }}
        <span class="race-number" v-if="raceNumber">{{ raceNumber }}</span>
      </h1>

      <p>Ikä: {{ age }}</p>

      <p>Maa: {{ country }}</p>
    </div>
    <div class="cars-wrapper">
      <h2>Autot</h2>
      <ul>
        <li v-for="car in driver.cars" :key="car._id">
          <p>Malli: {{ carModel(car) }}</p>
          <p>Moottori: {{ carEngine(car) }}</p>
          <p>Vääntö: {{ carTorque(car) }}</p>
          <p>Hevosvoimat: {{ carHorsePower(car) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import type { ICar, IDriver } from "~/interfaces/driver.interface";
import { getAgeFromDate } from "~/utils/getAgeFromDate";
import { getCountryName } from "~/utils/getCountryName";
export default {
  props: {
    driver: {
      type: Object as () => IDriver,
      required: true,
    },
  },
  computed: {
    country(): string {
      const nationality = this.driver?.nationality;
      return getCountryName(nationality);
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
      if (!number) return "#69";
      return `#${number}`;
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
  },
};
</script>

<style scoped lang="less">
.component-DriverProfile {
  padding: 12px;
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
}
</style>
