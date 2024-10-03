<template>
    <div class="page-driver">
      <LoadingIndicator v-if="loading" />
      <div v-if="!loading">
        <DriversProfile :driver="(driverData as IDriver)" />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  import apiDrivers from "../../../utils/drifting/api-drivers";
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
  
  const defaultTitle = ref("DriftDataan - Driver Profile");
  
  const defaultDescription = ref(
    "Explore the driver's competition history. See the series and seasons they’ve participated in, as well as their rankings in various competitions."
  );
  
  const title = computed(() => {
    return `DriftDataan - ${driverName.value} Driver Profile`;
  });
  
  const description = computed(() => {
    return `Explore the driver's ${driverName.value} competition history. See the series and seasons they’ve participated in, as well as their rankings in various competitions.`;
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
  
  