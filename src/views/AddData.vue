<script setup lang="ts">
import { ref } from "vue";
import type { TableItem } from "@/types";
import { useRouter } from "vue-router";
import { addNewItem, isValidJson } from "@/utils";

const router = useRouter();

const formData = ref({
  name: "",
  version: "",
  path: "",
  content: "",
  jsonData: "",
});

const handleSubmit = () => {
  if (!formData.value.name.trim() || !formData.value.version.trim()) {
    alert("กรุณากรอกชื่อและเวอร์ชัน");
    return;
  }

  // ตรวจสอบ JSON format ถ้ามีข้อมูล
  if (formData.value.jsonData && !isValidJson(formData.value.jsonData)) {
    alert("รูปแบบ JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
    return;
  }

  try {
    const newItem = addNewItem({
      name: formData.value.name,
      version: formData.value.version,
      checked: false,
      path: formData.value.path || undefined,
      content: formData.value.content || undefined,
      jsonData: formData.value.jsonData || undefined,
    });

    console.log("Data saved to localStorage:", newItem);
    alert("บันทึกข้อมูลสำเร็จ!");

    resetForm();
    router.push("/");
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};

const resetForm = () => {
  formData.value = {
    name: "",
    version: "",
    path: "",
    content: "",
    jsonData: "",
  };
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 flex items-center justify-center"
  >
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">เพิ่มข้อมูลใหม่</h1>
          <p class="text-gray-600 mt-1">
            กรอกข้อมูลรายการใหม่เพื่อเพิ่มเข้าระบบ
          </p>
        </div>

        <RouterLink to="/" class="text-blue-600 hover:underline">
          <button
            class="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
          >
            ย้อนกลับ
          </button>
        </RouterLink>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                ชื่อ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none hover:border-gray-400"
                placeholder="กรอกชื่อรายการ"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                เวอร์ชัน <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.version"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none hover:border-gray-400"
                placeholder="เช่น 1.0.0"
              />
            </div>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                JSON Data <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.jsonData"
                rows="10"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none resize-none hover:border-gray-400 font-mono text-sm"
                placeholder="ข้อมูล JSON เพิ่มเติม..."
              ></textarea>
            </div>
          </div>

          <div class="pt-6 flex gap-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span class="flex items-center justify-center space-x-2">
                <span>เพิ่มข้อมูล</span>
              </span>
            </button>

            <button
              type="button"
              @click="resetForm"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              รีเซ็ต
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
