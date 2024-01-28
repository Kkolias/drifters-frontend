<template>
  <div class="component-SignUpForm">
    <div class="form-wrapper">
      <h1>Rekisteröidy</h1>
      <form @submit.prevent="(e) => submit(e)">
        <div v-if="overViewErrorMessage.length" class="error-wrapper">
          <p class="error-message">{{ overViewErrorMessage }}</p>
        </div>

        <div class="input-wrapper">
          <label for="firstName">Etunimi:</label>
          <input
            v-model="firstName"
            type="text"
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
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.email" />
        </div>
        <div class="input-wrapper">
          <label for="psw">Salasana:</label>
          <input
            v-model="password"
            type="password"
            id="psw"
            @click="setErrorTextsDefault()"
          />
          <ErrorHover :errorMessage="errorTexts.password" />
        </div>
        <div class="bottom-wrapper">
          <p class="login-user">
            Oletko luonut käyttäjän? Kirjaudu sisään
            <NuxtLink to="login" class="href-btn">tästä</NuxtLink>
          </p>
          <div class="button-wrapper">
            <ButtonWithLoader
              buttonType="submit"
              :loading="loading"
              @click="submit"
            >
              <span> Rekisteröidy </span>
            </ButtonWithLoader>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import apiUser from "~/utils/api-user";

interface ErrorTexts {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  errorTexts: ErrorTexts;
  overViewErrorMessage: string;

  loading: boolean;
}

const ERROR = {
  EMAIL_IN_USE: "email in use",
};

export default {
  data: (): SignUpFormData => ({
    firstName: "",
    lastName: "",
    email: "",
    password: "",

    errorTexts: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    overViewErrorMessage: "",

    loading: false,
  }),
  methods: {
    async submit(e: Event) {
      if (this.loading) return;
      this.setLoading(true);
      e.preventDefault();

      await this.signUp();
      this.setLoading(false);
    },
    async signUp() {
      const isValid = this.validateInputOrFail();
      if (!isValid) return;

      const { firstName, lastName, email, password } = this;

      const error = await apiUser.signUp({
        firstName,
        lastName,
        email,
        password,
      });

      if (error?.length) {
        if (error === ERROR.EMAIL_IN_USE) {
          this.setErrorTextByKey("email", error);
        } else {
          this.setOverViewErrorMessage(
            "Uuden käyttäjän luominen epäonnistui. Yritä uudelleen."
          );
        }
      } else {
        this.$router.push("/");
      }
    },

    validateInputOrFail(): boolean {
      let isValid = true;
      if (!this.firstName?.length) {
        this.setErrorTextByKey("firstName", "Anna etunimi");
        isValid = false;
      }
      if (!this.lastName?.length) {
        this.setErrorTextByKey("lastName", "Anna sukunimi");
        isValid = false;
      }
      if (!this.email?.length) {
        this.setErrorTextByKey("email", "Anna sähköposti");
        isValid = false;
      }
      if (!this.password?.length) {
        this.setErrorTextByKey("password", "Anna salasana");
        isValid = false;
      }

      return isValid;
    },

    setErrorTextsDefault(): void {
      this.setErrorTextByKey("firstName", "");
      this.setErrorTextByKey("lastName", "");
      this.setErrorTextByKey("email", "");
      this.setErrorTextByKey("password", "");
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
.component-SignUpForm {
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

        input {
          width: 350px;
        }
      }

      .bottom-wrapper {
        display: flex;
        justify-content: space-between;
        .login-user {
          font-size: 14px;
          text-align: left;
          margin-top: 4px;

          .href-btn {
            color: var(--green-1);
            
            &:visited {
              color: var(--green-1);
            }
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
}
</style>
