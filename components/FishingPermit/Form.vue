<template>
  <div class="component-FishingPermitForm">
    <div class="form-wrapper">
      <h1>Uusi lupa</h1>
      <form @submit.prevent="(e) => submit(e)">
        <div v-if="overViewErrorMessage.length" class="error-wrapper">
          <p class="error-message">{{ overViewErrorMessage }}</p>
        </div>

        <div class="input-wrapper">
          <label for="lakeId">Järvi:</label>
          <SingleSelect
            class="single-select"
            placeholderOption="Valitse järvi"
            id="lakeId"
            :value="selectedLake"
            :optionList="lakeOptionList"
            @select="selectLakeId"
          />
          <!-- <ErrorHover :errorMessage="errorTexts.firstName" /> -->
        </div>
        <div class="input-wrapper">
          <label for="firstName">Etunimi:</label>
          <input
            v-model="firstName"
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
            v-model="lastName"
            type="text"
            id="lastName"
            :class="{ error: errorTexts.lastName.length }"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.lastName" />
        </div>
        <div class="input-wrapper">
          <label for="email">Sähköposti:</label>
          <input
            v-model="email"
            type="text"
            id="email"
            :class="{ error: errorTexts.email.length }"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.email" />
        </div>
        <div class="input-wrapper">
          <label for="startsAt">Alkamisaika:</label>
          <input
            v-model="startsAt"
            placeholder=""
            :class="{ error: errorTexts.startsAt.length }"
            type="datetime-local"
            id="startsAt"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.startsAt" />
        </div>
        <div class="input-wrapper">
          <label for="endsAt">Päättymisaika:</label>
          <input
            v-model="endsAt"
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
import type { LakeId } from "~/interfaces/fishing-permit.interface";
import userApi from "~/utils/api-user";
import fishingPermitApi from "~/utils/api-fishing-permits";

import { loadStripe } from "@stripe/stripe-js";

interface ErrorTexts {
  firstName: string;
  lastName: string;
  email: string;
  startsAt: string;
  endsAt: string;
}

interface FishingPermitFormData {
  firstName: string;
  lastName: string;
  email: string;
  startsAt: string;
  endsAt: string;
  selectedLake: {
    key: string;
    label: string;
  } | null;

  errorTexts: ErrorTexts;
  overViewErrorMessage: string;

  loading: boolean;
}

export default {
  data: (): FishingPermitFormData => ({
    firstName: "",
    lastName: "",
    email: "",
    startsAt: "",
    endsAt: "",

    selectedLake: null,

    errorTexts: {
      firstName: "",
      lastName: "",
      email: "",
      startsAt: "",
      endsAt: "",
    },
    overViewErrorMessage: "",

    loading: false,
  }),
  computed: {
    lakeOptionList() {
      return [
        {
          label: "Säläisjärvi",
          key: "salaisjarvi",
        },
        {
          label: "Laatokka",
          key: "laatokka",
        },
      ];
    },
    lakeId(): string {
      return this.selectedLake?.key || "";
    },
  },
  async mounted() {
    this.trySetUserInfo();

    const stripe = await loadStripe(
      "pk_test_51OWLk7ICYstWj0ELaJcEiLHw57MCyFAzAxtO4o3rs5oWuConsaGHcEm75bEyoCaROP2y7Y5zplC6MKzVnfjbsOn800vvmi6TuB"
    );
    console.log(stripe)

    if(stripe) {
 
      // stripe.redirectToCheckout({ successUrl: 'http://localhost:3000/fishing-permit/all-permits', cancelUrl: 'http://localhost:3000/profile'})
    }

    // console.log(stripe)
    // if (stripe) {
    //   const elements = stripe;
    //   const card = elements.create("card", {});
    //   // Add an instance of the card Element into the `card-element` <div>
    //   card.mount("#card-element");
    // }
  },
  methods: {
    async trySetUserInfo(): Promise<void> {
      const user = await userApi.getUserByToken();

      if (!user) return;

      const { firstName, lastName, email } = user;

      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
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

      await this.createFishingPermit();
      this.setLoading(false);
    },
    async createFishingPermit() {
      const { firstName, lastName, email, startsAt, endsAt } = this;
      const lakeId = this.lakeId as LakeId;
      console.log(lakeId);
      const newPermit = await fishingPermitApi.createFishingPermit({
        firstName,
        lastName,
        email,
        lakeId,
        startsAt,
        endsAt,
      });

      if (newPermit) {
        this.$router.push(`/fishing-permit/${newPermit?._id}`);
      } else {
        this.setOverViewErrorMessage("Virhe luodessa kalastuslupaa");
      }
    },
    checkInputsForErrors(): boolean {
      let isError = false;
      if (!this.firstName?.length) {
        isError = true;
        this.setErrorTextByKey("firstName", "Etunimi vaaditaan");
      }
      if (!this.lastName?.length) {
        isError = true;
        this.setErrorTextByKey("lastName", "Sukunimi vaaditaan");
      }
      if (!this.email?.length) {
        isError = true;
        this.setErrorTextByKey("email", "Sähköposti vaaditaan");
      }
      if (!this.startsAt?.length) {
        isError = true;
        this.setErrorTextByKey("startsAt", "Anna luvan alkamisaika");
      }
      if (!this.endsAt?.length) {
        isError = true;
        this.setErrorTextByKey("endsAt", "Anna luvan päättymisaika");
      }
      return isError;
    },

    selectLakeId(lakeOption: any): void {
      this.selectedLake = lakeOption;
    },

    setErrorTextsDefault(): void {
      this.setErrorTextByKey("firstName", "");
      this.setErrorTextByKey("lastName", "");
      this.setErrorTextByKey("email", "");
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
.component-FishingPermitForm {
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
