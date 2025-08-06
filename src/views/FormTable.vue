<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { TableItem } from "@/types";
import { loadDataFromStorage, deleteItemById } from "@/utils";
import { useToast } from "@/composables/useToast";

const tableData = ref<TableItem[]>([]);
const { showSuccess, showError, showWarning } = useToast();

const loadData = () => {
  tableData.value = loadDataFromStorage();
};

onMounted(() => {
  loadData();
});

const deleteItem = (id: number) => {
  if (confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
    const success = deleteItemById(id);
    if (success) {
      loadData(); // โหลดข้อมูลใหม่หลังจากลบ
      showSuccess("ลบข้อมูลสำเร็จ!");
    } else {
      showError("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  }
};

const getSelectedItems = () => {
  return tableData.value.filter((item) => item.checked);
};

const compareSelected = () => {
  const selected = getSelectedItems();
  if (selected.length !== 2) {
    showWarning("กรุณาเลือก 2 รายการเท่านั้น");
    return;
  }

  const ids = selected.map((item) => item.id).join(",");
  window.location.href = `/compare?ids=${ids}`;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-6 py-8 max-w-6xl">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">จัดการข้อมูล</h1>
        <p class="text-gray-600">ตารางแสดงข้อมูล JSON ทั้งหมด</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="px-6 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                ทั้งหมด {{ tableData.length }} รายการ
              </span>
              <span
                v-if="getSelectedItems().length > 0"
                class="text-sm text-blue-600"
              >
                เลือกแล้ว {{ getSelectedItems().length }} รายการ
              </span>
            </div>

            <div class="flex items-center space-x-3">
              <RouterLink to="/compare">
                <div
                  v-if="getSelectedItems().length == 2"
                  class="flex items-center"
                >
                  <button
                    @click="compareSelected"
                    :disabled="getSelectedItems().length < 2"
                    :class="[
                      'px-4 py-2 text-sm rounded-md transition-colors duration-200 border',
                      getSelectedItems().length >= 2
                        ? 'text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200'
                        : 'text-gray-400 border-gray-200 cursor-not-allowed',
                    ]"
                  >
                    เปรียบเทียบ
                  </button>
                </div>
              </RouterLink>
              <RouterLink to="/add-data">
                <button
                  class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                >
                  เพิ่มข้อมูล
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
                เลือก
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
                ชื่อ
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
                เวอร์ชัน
              </th>

              <th
                class="px-6 py-3 text-right text-sm font-medium text-gray-700"
              >
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="item in tableData"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors duration-150"
              :class="{ 'bg-blue-50': item.checked }"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  v-model="item.checked"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ item.name }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ item.version }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-3">
                  <RouterLink
                    :to="`/result?id=${item.id}`"
                    class="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    ดูรายละเอียด
                  </RouterLink>
                  <button
                    @click="deleteItem(item.id)"
                    class="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="tableData.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4"></div>
          <h3 class="text-sm font-medium text-gray-900 mb-1">ไม่มีข้อมูล</h3>
          <p class="text-sm text-gray-500 mb-4">เพิ่มข้อมูลทางขวาบน</p>
        </div>
      </div>
    </div>
  </div>
</template>
