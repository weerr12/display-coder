<script setup lang="ts">
import type { Item } from "@/types";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { TableItem } from "@/types";
import {
  findItemsByIds,
  processJsonData,
  createCodeHighlighter,
  copyToClipboard,
} from "@/utils";

const route = useRoute();
const compareItems = ref<TableItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const highlighter = ref<any>(null);
const itemsData = ref<{ [key: number]: Item[] }>({});

const loadDataFromRoute = async () => {
  try {
    const idsParam = route.query.ids as string;
    if (idsParam) {
      const ids = idsParam.split(",").map((id) => Number(id.trim()));
      console.log("Looking for IDs:", ids);

      const foundItems = findItemsByIds(ids);

      if (foundItems.length >= 2) {
        compareItems.value = foundItems;
        console.log("Found items to compare:", foundItems);

        for (const item of foundItems) {
          if (item.jsonData) {
            itemsData.value[item.id] = await processJsonData(
              item.jsonData,
              highlighter.value
            );
          }
        }
      } else {
        error.value = `พบข้อมูลเพียง ${foundItems.length} รายการ จากที่ร้องขอ ${ids.length} รายการ`;
      }
    } else {
      error.value = "ไม่ได้ระบุ IDs ในพารามิเตอร์";
    }
  } catch (err) {
    console.error("Error loading data:", err);
    error.value = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  highlighter.value = await createCodeHighlighter();
  await loadDataFromRoute();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-6 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">
              เปรียบเทียบข้อมูล
            </h1>
            <p class="text-gray-600">เปรียบเทียบรายการที่เลือก</p>
          </div>
          <RouterLink
            to="/"
            class="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
          >
            กลับไปยังตาราง
          </RouterLink>
        </div>
      </div>
      <div v-if="compareItems.length >= 2" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            กำลังเปรียบเทียบ {{ compareItems.length }} รายการ
          </h2>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in compareItems"
              :key="item.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              <span class="font-medium">{{ item.name }}</span>
              <span class="ml-2 text-xs bg-blue-200 px-2 py-0.5 rounded">
                v{{ item.version }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="(tableItem, index) in compareItems.slice(0, 2)"
            :key="tableItem.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div class="border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ tableItem.name }}
                  </h3>
                  <div class="flex items-center mt-2 space-x-3">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      v{{ tableItem.version }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div
                v-if="
                  itemsData[tableItem.id] && itemsData[tableItem.id].length > 0
                "
              >
                <h4 class="text-sm font-medium text-gray-700 mb-3">
                  ไฟล์และเนื้อหา ({{ itemsData[tableItem.id].length }} รายการ)
                </h4>
                <div class="space-y-3">
                  <div
                    v-for="(item, itemIndex) in itemsData[tableItem.id]"
                    :key="itemIndex"
                    class="border border-gray-200 rounded-lg p-3 bg-gray-50"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-blue-600"
                          >Path:</span
                        >
                        <span
                          v-if="item.language"
                          class="text-xs bg-gray-200 px-1.5 py-0.5 rounded"
                        >
                          {{ item.language }}
                        </span>
                      </div>
                    </div>

                    <div class="bg-white p-2 rounded border mb-2">
                      <code class="text-sm text-gray-800 font-mono">{{
                        item.path
                      }}</code>
                    </div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-green-600"
                        >Content:</span
                      >
                      <button
                        @click="copyToClipboard(item.content)"
                        class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                        title="คัดลอกข้อความ"
                      >
                        Copy
                      </button>
                    </div>
                    <div class="bg-white p-2 rounded border">
                      <div
                        v-if="item.highlightedContent"
                        v-html="item.highlightedContent"
                        class="shiki-container"
                      ></div>
                      <pre
                        v-else
                        class="text-sm text-gray-800 whitespace-pre-wrap font-mono"
                        >{{ item.content }}</pre
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shiki-container {
  font-size: 12px;
  line-height: 1.4;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

.shiki-container pre {
  margin: 0;
  padding: 0;
  background: transparent !important;
}

.shiki-container code {
  display: block;
  white-space: pre;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .shiki-container {
    font-size: 10px;
  }
}
</style>
