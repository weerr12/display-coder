<script setup lang="ts">
import type { Item } from "@/types";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { TableItem } from "@/types";
import {
  findItemById,
  processJsonData,
  createCodeHighlighter,
  copyToClipboard,
} from "@/utils";

const route = useRoute();
const tableData = ref<TableItem | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const highlighter = ref<any>(null);
const items = ref<Item[]>([]);

const loadDataFromRoute = async () => {
  try {
    const id = route.query.id ? Number(route.query.id) : null;
    console.log("Looking for ID:", id);

    if (id) {
      const foundItem = findItemById(id);
      if (foundItem) {
        tableData.value = foundItem;
        console.log("Found item:", foundItem);

        if (foundItem.jsonData) {
          items.value = await processJsonData(
            foundItem.jsonData,
            highlighter.value
          );
        }
      } else {
        error.value = `ไม่พบข้อมูลที่มี ID: ${id}`;
      }
    } else {
      error.value = "ไม่ได้ระบุ ID ในพารามิเตอร์";
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
    <div class="container mx-auto px-6 py-8 max-w-4xl">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">
              รายละเอียดข้อมูล
            </h1>
            <p class="text-gray-600">แสดงข้อมูลรายการที่เลือก</p>
          </div>
          <RouterLink
            to="/"
            class="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
          >
            กลับไปยังตาราง
          </RouterLink>
        </div>
      </div>

      <div
        v-if="tableData"
        class="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-medium text-gray-900">
                {{ tableData.name }}
              </h2>
              <div class="flex items-center mt-2 space-x-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  เวอร์ชัน: {{ tableData.version }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-6">
            <div v-if="items.length > 0">
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                ไฟล์และเนื้อหา ({{ items.length }} รายการ)
              </h3>
              <div class="space-y-4">
                <div
                  v-for="(item, index) in items"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
                >
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-blue-600"
                          >Path:</span
                        >
                        <span
                          v-if="item.language"
                          class="text-xs bg-gray-200 px-2 py-1 rounded"
                        >
                          {{ item.language }}
                        </span>
                      </div>
                      <button
                        @click="copyToClipboard(item.content)"
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs transition-colors flex items-center gap-1"
                        title="คัดลอกข้อความ"
                      >
                        Copy
                      </button>
                    </div>

                    <div class="bg-white p-3 rounded border">
                      <code class="text-sm text-gray-800 font-mono">{{
                        item.path
                      }}</code>
                    </div>

                    <div class="space-y-2">
                      <span class="text-sm font-medium text-green-600"
                        >Content:</span
                      >
                      <div class="bg-white p-3 rounded border">
                        <div
                          v-if="item.highlightedContent"
                          v-html="item.highlightedContent"
                          class="shiki-container"
                        ></div>
                        <pre
                          v-else
                          class="text-xs text-gray-800 whitespace-pre-wrap font-mono"
                          >{{ item.content }}</pre
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="tableData.jsonData">
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                ข้อมูล JSON
              </h3>
              <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre
                  class="text-sm text-green-400 font-mono whitespace-pre-wrap"
                  >{{
                    typeof tableData.jsonData === "string"
                      ? JSON.stringify(JSON.parse(tableData.jsonData), null, 2)
                      : JSON.stringify(tableData.jsonData, null, 2)
                  }}</pre
                >
              </div>
            </div>

            <div v-if="tableData.content">
              <h3 class="text-sm font-medium text-gray-700 mb-3">เนื้อหา</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <pre
                  class="text-sm text-gray-800 whitespace-pre-wrap font-mono"
                  >{{ tableData.content }}</pre
                >
              </div>
            </div>

            <div v-if="tableData.path">
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                เส้นทางไฟล์
              </h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <code class="text-sm text-gray-800 font-mono">{{
                  tableData.path
                }}</code>
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
