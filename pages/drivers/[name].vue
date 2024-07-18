<template>
  <div class="page-driver">
    <LoadingIndicator v-if="loading" />
    <div v-if="!loading">
      <!-- <pre>
                {{ driverData }}
            </pre> -->
      <DriversProfile :driver="(driverData as IDriver)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import apiDrivers from "../../utils/drifting/api-drivers";
import type { IDriver } from "~/interfaces/driver.interface";

const route = useRoute();
const driverData = ref<IDriver | null>(null);
const loading = ref(true);

const name = computed(() => {
  return (route.params?.name as string) || "";
});

const driverName = computed(() => {
  if (!driverData.value) return "";

  return `${driverData.value.firstName} ${driverData.value.lastName}`;
});

// watchEffect(() => {
//   useHead({
//     title: `DriftDataan - ${driverName.value} Kuljettajaprofiili`,
//     meta: [
//       {
//         hid: "description",
//         name: "description",
//         content: `Tutustu kuljettajan ${driverName.value} kilpailuhistoriaan. Näe sarjat ja kaudet, joissa hän on mukana, sekä hänen sijoituksensa eri kilpailuissa.`,
//       },
//     ],
//   });
// });

// useHead({
//   title: `DriftDataan - ${driverName.value} Kuljettajaprofiili`,
//   meta: [
//     {
//       hid: "description",
//       name: "description",
//       content: `Tutustu kuljettajan ${driverName.value} kilpailuhistoriaan. Näe sarjat ja kaudet, joissa hän on mukana, sekä hänen sijoituksensa eri kilpailuissa.`,
//     },
//   ],
// });

// const driverNameSet = ref(false);
const defaultTitle = ref("DriftDataan - Kuljettajaprofiili");

const defaultDescription = ref(
  "Tutustu kuljettajan kilpailuhistoriaan. Näe sarjat ja kaudet, joissa hän on mukana, sekä hänen sijoituksensa eri kilpailuissa."
);

const title = computed(() => {
  return `DriftDataan - ${driverName.value} Kuljettajaprofiili`;
});

const description = computed(() => {
  return `Tutustu kuljettajan ${driverName.value} kilpailuhistoriaan. Näe sarjat ja kaudet, joissa hän on mukana, sekä hänen sijoituksensa eri kilpailuissa.`;
});


onMounted(async () => {
  await fetchDriver();
});

async function fetchDriver() {
  setLoading(true);
  const driver = await apiDrivers.getDriverByName(name.value);
  setDriverData(driver);
  setLoading(false);
}

function setDriverData(data: IDriver | null) {
  driverData.value = data;
}

function setLoading(value: boolean) {
  loading.value = value;
}

// PASKAA EI TOIMI VITUN NUXT3 SAIS POISTAA JA TAKAS 2
useHead({
  title: title?.value || defaultTitle,
  meta: [
    {
      name: "description",
      content: description?.value || defaultDescription,
    },
  ],
});
</script>

<!-- <script lang="ts">
// import authenticatedView from '../../mixins/authenticatedView.vue'
import apiDrivers from "../../utils/drifting/api-drivers";
import type { IDriver } from "~/interfaces/driver.interface";

interface DriverByIdPageData {
  driverData: IDriver | null;
  loading: boolean;
}
export default {
  // mixins: [authenticatedView],
  head() {
    return {
      title: `DriftDataan - Kuskin Profiili`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: 'Description of the page',
        },
      ],
    };
  },
  data: (): DriverByIdPageData => ({
    driverData: null,
    loading: true,
  }),
  computed: {
    name(): string {
      const name = (this.$route?.params?.name as string) || "";
      return name;
    },
  },
  mounted() {
    this.fetchDriver();
  },
  methods: {
    async fetchDriver() {
      this.setLoading(true);
      const driver = await apiDrivers.getDriverByName(this.name);
      this.setDriverData(driver);
      this.setLoading(false);
    },
    setDriverData(data: IDriver | null): void {
      this.driverData = data;
    },
    setLoading(value: boolean): void {
      this.loading = value;
    },
  },
};
</script> -->
