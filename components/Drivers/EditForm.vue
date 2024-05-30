<template>
  <div class="component-DriversEditForm">
    <div class="form-wrapper">
      <h1>Uusi Kuski</h1>
      <form @submit.prevent="(e) => submit(e)">
        <div v-if="overViewErrorMessage.length" class="error-wrapper">
          <p class="error-message">{{ overViewErrorMessage }}</p>
        </div>

        <div class="input-wrapper">
          <label for="firstName">Etunimi:</label>
          <input
            v-model="driver.firstName"
            type="text"
            :class="{ error: errorTexts.firstName.length }"
            id="firstName"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.firstName" />
        </div>
        <div class="input-wrapper">
          <label for="lastName">Sukunimi:</label>
          <input
            v-model="driver.lastName"
            type="text"
            id="lastName"
            :class="{ error: errorTexts.lastName.length }"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.lastName" />
        </div>
        <div class="input-wrapper">
          täs: {{ driver.birthday }}
          <label for="birthday">Syntymäpäivä:</label>
          <input
            v-model="driver.birthday"
            placeholder=""
            :class="{ error: errorTexts.birthday.length }"
            type="datetime-local"
            id="birthday"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.birthday" />
        </div>
        <div class="input-wrapper">
          <label for="raceNumber">Numero:</label>
          <input
            v-model.number="driver.raceNumber"
            type="number"
            id="raceNumber"
            :class="{ error: errorTexts.raceNumber.length }"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.raceNumber" />
        </div>
        <div class="input-wrapper">
          <label for="nationality">Maa:</label>
          <input
            v-model="driver.nationality"
            type="text"
            :class="{ error: errorTexts.nationality.length }"
            id="nationality"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.nationality" />
        </div>

        <ul class="car-list">
          <li v-for="car in driver.cars">
            <span>{{ car.model }} {{ car.engine }}</span>
          </li>
        </ul>
        <button
          class="primary"
          type="button"
          @click="setNewCareModalOpen(true)"
        >
          Lisää auto
        </button>

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
    <DriversNewCarModal
      :modalOpen="newCarModalOpen"
      @closeModal="setNewCareModalOpen(false)"
      @addCar="addCar"
    />
  </div>
</template>

<script lang="ts">
import type { ICar } from "~/interfaces/driver.interface";
import apiDrivers from "../../utils/drifting/api-drivers";

interface ErrorTexts {
  firstName: string;
  lastName: string;
  birthday: string;
  raceNumber: string;
  nationality: string
}

interface DriverEditFormData {
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    birthday: string;
    cars: ICar[];
    raceNumber: number;
    nationality: string
  };

  errorTexts: ErrorTexts;
  overViewErrorMessage: string;

  loading: boolean;
  newCarModalOpen: boolean;
}

export default {
  props: {
    initialId: { type: String, default: "" },
  },
  data: (): DriverEditFormData => ({
    loading: false,

    overViewErrorMessage: "",
    errorTexts: {
      firstName: "",
      lastName: "",
      birthday: "",
      raceNumber: "",
      nationality: ''
    },
    driver: {
      id: "",
      firstName: "",
      lastName: "",
      birthday: "",
      raceNumber: 0,
      cars: [],
      nationality: ''
    },
    newCarModalOpen: false,
  }),
  methods: {
    addCar(car: ICar): void {
      const cars = [...this.driver.cars, car];
      this.driver = {
        ...this.driver,
        cars,
      };
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
      const {
        firstName,
        lastName,
        birthday,
        cars,
        raceNumber,
        nationality
      }: {
        firstName: string;
        lastName: string;
        birthday: string;
        cars: ICar[];
        raceNumber: number;
        nationality: string
      } = this.driver;

      const newDriver = await apiDrivers.createDriver({
        firstName,
        lastName,
        birthday,
        raceNumber,
        cars,
        nationality
      });

      if (newDriver) {
        this.$router.push(`/drivers/${newDriver?._id}`);
      } else {
        this.setOverViewErrorMessage("Virhe luodessa kuskia");
      }
    },
    checkInputsForErrors(): boolean {
      let isError = false;
      if (!this.driver?.firstName?.length) {
        isError = true;
        this.setErrorTextByKey("firstName", "Etunimi vaaditaan");
      }
      if (!this.driver?.lastName?.length) {
        isError = true;
        this.setErrorTextByKey("lastName", "Sukunimi vaaditaan");
      }
      if (!this.driver?.nationality?.length) {
        isError = true;
        this.setErrorTextByKey("nationality", "Maa vaaditaan");
      }
      return isError;
    },
    setErrorTextsDefault(): void {
      this.setErrorTextByKey("firstName", "");
      this.setErrorTextByKey("lastName", "");
      this.setErrorTextByKey("birthday", "");
      this.setErrorTextByKey("nationality", "");
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
    setNewCareModalOpen(val: boolean): void {
      this.newCarModalOpen = val;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DriversEditForm {
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
