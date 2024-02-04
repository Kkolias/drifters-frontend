<template>
  <div class="component-QualifyingList">
    <DataTable :headerList="headerList" :dataList="parsedDataList" />
  </div>
</template>

<script lang="ts">
import apiQualifying from "~/utils/drifting/api-qualifying";
import type { IQualifying } from "~/interfaces/qualifying.interface";

interface QualifyingListData {
  qualifyingList: IQualifying[];
  loading: boolean;
}

export default {
  name: "QualifyingList",
  data: (): QualifyingListData => ({
    qualifyingList: [],
    loading: false,
  }),
  computed: {
    headerList() {
      return [
        {
          name: "Id",
          key: "_id",
          isLink: true,
        },
        {
          name: "Tapahtuma",
          key: "eventId",
        },
      ];
    },
    parsedDataList(): any[] {
      return this.qualifyingList.map((q) => ({
        _id: q._id,
        eventId: q.eventId,
      }));
    },
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList(): Promise<void> {
      this.setLoading(true);
      const qualifyings = await apiQualifying.getAllQualifyings();
      this.setQualifyinglist(qualifyings);
      this.setLoading(false);
    },
    setQualifyinglist(qualifyings: IQualifying[]): void {
      this.qualifyingList = qualifyings;
    },
    setLoading(value: boolean): void {
      this.loading = value;
    },
  },
};
</script>
