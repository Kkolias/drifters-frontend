<template>
  <div class="component-DataTable">
    <div class="content-wrapper">
      <div v-if="showSearch" class="input-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Etsi..."
          class="search-input"
        />
      </div>
      <div class="scroll-wrapper">
        <table>
          <thead>
            <tr>
              <th v-if="selectable"></th>
              <th
                v-for="(header, key) in headerList"
                :key="key"
                :class="{
                  selected: isHeaderSelected(header),
                  reversed: isReversedSort,
                }"
              >
                <button class="blank" @click="handleSetSortHeader(header)">
                  {{ header.name }}
                </button>
              </th>
              <th v-if="draggable"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, key) in filteredDataList" :key="key">
              <td v-if="selectable">
                <input
                  type="checkbox"
                  :checked="isSelected(data)"
                  @click="itemClick(data)"
                />
              </td>
              <td v-for="header in headerList" :key="header.key">
                <button
                  v-if="isClickable(header)"
                  class="blank"
                  @click="handleClick(data, header.key)"
                >
                  {{ data[header.key] }}
                </button>
                <NuxtLink v-else-if="isLinkColumn(header)" :to="data.link">
                  {{ data[header.key] }}
                </NuxtLink>
                <span v-else>
                  {{ data[header.key] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";

interface DataTableData {
  sortByHeader: any;
  isReversedSort: boolean;
  searchTerm: string;
}

interface HeaderItem {
  key: string;
  name: string;
  isLink?: boolean;
}

export default {
  props: {
    headerList: {
      type: Array as PropType<HeaderItem[]>,
      default: () => [],
    },
    dataList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  data: (): DataTableData => ({
    sortByHeader: null,
    isReversedSort: false,

    searchTerm: "",
  }),
  computed: {
    filteredDataList() {
      if (!this.searchTerm) return this.dataList;
      const searchTermLower = this.searchTerm
        .toLowerCase()
        ?.replaceAll(/\s/g, "");
      return this.dataList.filter((item: any) => {
        return Object.values(item).some((value: any) =>
          String(value)
            .toLowerCase()
            ?.replaceAll(" ", "")
            .includes(searchTermLower)
        );
      });
    },
    sortedDataList() {
      if (!this.sortByHeader) return this.dataList;
      const list = this.dataList;
      const sorted =
        list?.sort((a: any, b: any) => {
          const sortByKey = this.sortByHeader?.key || "";
          const valueA = a?.[sortByKey];
          const valueB = b?.[sortByKey];

          return valueA.localeCompare(valueB);
        }) || [];

      if (this.isReversedSort) return sorted?.reverse() || [];
      return sorted;
    },
  },
  methods: {
    isClickable(header: any): boolean {
      return !!header.clickable;
    },
    handleClick(data: any, key: string): void {
      this.$emit("cellClick", { data, key });
    },
    itemClick(data: any): void {
      this.searchTerm = "";
      this.$emit("itemClick", data);
    },
    isLinkColumn(header: HeaderItem): boolean {
      return header?.isLink || false;
    },
    isHeaderSelected(header: HeaderItem) {
      return header?.key === this.sortByHeader?.key;
    },
    isSelected(data: any): boolean {
      return data.selected;
    },
    handleSetSortHeader(header: HeaderItem): void {
      if (this.isHeaderSelected(header)) {
        this.setIsReversedSort(!this.isReversedSort);
      } else {
        this.setIsReversedSort(false);
        this.setSortByHeader(header);
      }
    },
    setSortByHeader(key: HeaderItem): void {
      this.sortByHeader = key;
    },
    setIsReversedSort(value: boolean): void {
      this.isReversedSort = value;
    },
  },
};
</script>

<style lang="less" scoped>
.component-DataTable {
  margin: auto;
  text-align: center;
  .content-wrapper {
    display: inline-block;
    position: relative;
    .input-container {
      position: absolute;
      top: 0px;
      left: 0;
    }
    .scroll-wrapper {
      margin-top: 50px;
    }
    table {
      
      margin: auto;
      border-spacing: 0px;

      tbody {
        tr {
          &:hover {
            background: var(--black-2);

            td {
              &:hover {
                border: 1px solid var(--green-1);
              }
            }
          }

          .draggable-handle {
            cursor: grab;
            width: 20px;
            text-align: center;
          }
        }
      }

      th {
        border: 1px solid var(--green-1-50);

        button {
          width: calc(100% - 30px);
          height: 100%;
          padding: 4px 26px 4px 4px;
        }

        &.selected {
          background: var(--green-1-50);
          position: relative;

          &:before {
            content: "";
            background: url("~/assets/svg/arrow.svg");
            background-repeat: no-repeat;
            background-size: 20px;
            width: 20px;
            height: 20px;
            position: absolute;
            top: 50%;
            right: 5px;
            transform: translateY(-50%) rotate(270deg);
            transition: 0.25s ease-in-out;
          }

          &.reversed {
            &:before {
              transform: translateY(-50%) rotate(90deg);
            }
          }
        }
      }

      td {
        border: 1px solid var(--green-1-50);
        padding: 4px;

        a {
          text-decoration: none;
          color: var(--white-1);
        }
      }
    }
  }

  &.modal-scrollable {
    .content-wrapper {
      .scroll-wrapper {
        max-height: 50vh;
        overflow-y: auto;
      }
    }
  }
}
</style>
