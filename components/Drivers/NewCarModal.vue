<template>
  <div class="component-NewCarModal">
    <Modal :value="modalOpen" @close="closeModal()">
      <div class="form-wrapper">
        <h1>Lisää auto</h1>
        <div class="form">
          <div class="input-wrapper">
            <label for="model">Malli:</label>
            <input v-model="model" type="text" id="model" />
          </div>
          <div class="input-wrapper">
            <label for="engine">Moottori:</label>
            <input v-model="engine" type="text" id="weight" />
          </div>
          <div class="input-wrapper">
            <label for="torque">Vääntö:</label>
            <input v-model="torque" type="text" id="torque" />
          </div>
          <div class="input-wrapper">
            <label for="hp">Hevosvoimat:</label>
            <input v-model="hp" type="text" id="hp" />
          </div>
          <div class="input-wrapper">
            <label for="activeFrom">Aktiivinen lähtien:</label>
            <input
              v-model="activeFrom"
              placeholder=""
              type="datetime-local"
              id="activeFrom"
            />
          </div>

          <div class="button-wrapper">
            <button type="button" class="primary" @click="createCar()">
              <span> Luo </span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    modalOpen: { type: Boolean, default: false },
  },
  data: () => ({
    model: "",
    engine: "",
    torque: "",
    hp: "",
    activeFrom: "",
  }),
  methods: {
    createCar() {
      const car = {
        model: this.model,
        engine: this.engine,
        torque: this.torque,
        hp: this.hp,
        activeFrom: this.activeFrom,
      };
      this.$emit("addCar", car);
      this.closeModal();
    },
    closeModal(): void {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="less" scoped>
.component-NewCarModal {
  .form-wrapper {
    padding: 16px;
    width: 350px;
    height: 450px;
    background: var(--black-1);
    border: 2px solid var(--black-2);
    border-radius: 10px;
    box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.5);

    h1 {
      text-align: center;
    }

    .form {
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
