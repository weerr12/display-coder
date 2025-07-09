<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createHighlighter } from 'shiki';

// Types
interface Item {
  path: string;
  content: string;
  highlightedContent?: string;
  language?: string;
}

const items = ref<Item[]>([]);     // เก็บรายการไฟล์ที่ประมวลผลแล้ว
const text = ref("");              // เก็บข้อความ JSON ที่ user ใส่
const highlighter = ref<any>(null); // เก็บ Shiki highlighter instance

onMounted(async () => {
  // เมื่อ component โหลดเสร็จ จะสร้าง highlighter
  highlighter.value = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    // รายการภาษาที่รองรับ
    langs: [
      'javascript', 'typescript', 'jsx', 'tsx',
      'go', 'html', 'css', 'scss', 'sass', 'less',
      'vue', 'svelte', 'json', 'xml', 'yaml', 'toml',
      'python', 'java', 'kotlin', 'scala', 'groovy',
      'c', 'cpp', 'rust', 'php', 'ruby',
      'bash', 'fish', 'powershell', 'sql',
      'dockerfile', 'markdown', 'swift', 'dart',
      'r', 'lua', 'vim', 'ini', 'plaintext'
    ]
  });
});

// Helper Functions
const getLanguageFromPath = (path: string): string => {
  // แยกนามสกุลไฟล์ (.go, .js, .py เป็นต้น)
  const extension = path.split('.').pop()?.toLowerCase();
  const languageMap: { [key: string]: string } = {
    // JavaScript/TypeScript
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'mjs': 'javascript',
    'cjs': 'javascript',
    
    // Go
    'go': 'go',
    'mod': 'go',
    
    // Web
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    'vue': 'vue',
    'svelte': 'svelte',
    
    // Data
    'json': 'json',
    'jsonc': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    
    // Python
    'py': 'python',
    'pyx': 'python',
    'pyi': 'python',
    'pyw': 'python',
    
    // Java/JVM
    'java': 'java',
    'kt': 'kotlin',
    'kts': 'kotlin',
    'scala': 'scala',
    'groovy': 'groovy',
    
    // C/C++
    'c': 'c',
    'cpp': 'cpp',
    'cxx': 'cpp',
    'cc': 'cpp',
    'c++': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'hxx': 'cpp',
    
    // Rust
    'rs': 'rust',
    
    // PHP
    'php': 'php',
    'phtml': 'php',
    
    // Ruby
    'rb': 'ruby',
    'rbw': 'ruby',
    
    // Shell
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'fish': 'fish',
    'ps1': 'powershell',
    
    // SQL
    'sql': 'sql',
    'mysql': 'sql',
    'pgsql': 'sql',
    
    // Config files
    'dockerfile': 'dockerfile',
    'env': 'dotenv',
    'gitignore': 'gitignore',
    'md': 'markdown',
    'mdx': 'mdx',
    'txt': 'plaintext',
    'log': 'log',
    
    // Mobile
    'swift': 'swift',
    'dart': 'dart',
    
    // Other
    'r': 'r',
    'lua': 'lua',
    'vim': 'vim',
    'ini': 'ini',
    'cfg': 'ini',
    'conf': 'ini'
  };
  
  return languageMap[extension || ''] || 'plaintext';
};

const highlightCode = async (content: string, language: string): Promise<string> => {
  if (!highlighter.value) return content;
  
  try {
    return highlighter.value.codeToHtml(content, {
      lang: language,
      theme: 'github-light'
    });
  } catch (error) {
    console.warn('Failed to highlight code:', error);
    return content;
  }
};

const createItem = async (path: string, content: string): Promise<Item> => {
  const language = getLanguageFromPath(path); // หาภาษาจาก path 
  const highlightedContent = await highlightCode(content, language); 
  
  return {
    path: path || 'Unknown path',
    content: content || 'No content',
    highlightedContent,
    language
  };
};

const processDataArray = async (dataArray: any[]): Promise<Item[]> => {
  // ใช้ Promise.all เพื่อประมวลผลทุกไฟล์พร้อมกัน
  const items = await Promise.all(
    dataArray.map(item => createItem(item.path, item.content))
  );
  return items;
};

const processObject = async (obj: any): Promise<Item[]> => {
  const entries = Object.entries(obj);
  const items = await Promise.all(
    entries.map(([key, value]) => 
      createItem(key, typeof value === 'string' ? value : JSON.stringify(value, null, 2))
    )
  );
  return items;
};

const extractItemsFromJSON = async (jsonData: any) => {
  // กรณีที่ 1: Object ที่มี property "data" เป็น array
  if (jsonData.data && Array.isArray(jsonData.data)) {
    return await processDataArray(jsonData.data);
  }
  
  // กรณีที่ 2: Array โดยตรง
  if (Array.isArray(jsonData)) {
    return await processDataArray(jsonData);
  }
  
  // กรณีที่ 3: Object เดียวที่มี path และ content
  if (jsonData.path && jsonData.content) {
    return [await createItem(jsonData.path, jsonData.content)];
  }
  
  // กรณีที่ 4: Object ทั่วไป (แปลง key-value เป็น path-content)
  if (typeof jsonData === 'object' && jsonData !== null) {
    return await processObject(jsonData);
  }
  
  return []; // ถ้าไม่ตรงกรณีไหน return array ว่าง
};

// Main Functions
const generateJSON = async () => {
  if (!text.value.trim()) {
    return;
  }

  try {
    const jsonData = JSON.parse(text.value);
    items.value = await extractItemsFromJSON(jsonData);
  } catch (error) {
    console.error("Invalid JSON format:", error);
  }
};

const clearData = () => {
  text.value = '';
  items.value = [];
};

const copyToClipboard = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-6 max-w-7xl">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Input JSON Data</h2>
        <div class="space-y-4">
          <textarea
            v-model="text"
            class="w-full h-48 border-2 border-gray-300 rounded-lg p-4 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="วางข้อมูล JSON ที่นี่..."
          ></textarea>
          <div class="flex gap-4 justify-center">
            <button
              @click="generateJSON"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate
            </button>
            <button
              @click="clearData"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          ผลลัพธ์
        </h2>
        
        <div v-if="items.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">ยังไม่มีข้อมูล</p>
          <p class="text-gray-400">วาง JSON ข้อมูลแล้วกด Generate เพื่อดูผลลัพธ์</p>
        </div>
        
        <div v-else class="space-y-6">
          <div 
            v-for="(item, index) in items" 
            :key="index"
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50"
          >
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-blue-600">
                    Path:
                  </span>
                  <span v-if="item.language" class="text-xs bg-gray-200 px-2 py-1 rounded">
                    {{ item.language }}
                  </span>
                </div>
                <div class="bg-white p-3 rounded border">
                  <code class="text-sm text-gray-800 font-mono">{{ item.path }}</code>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-green-600">Content:</span>
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
                  <div 
                    v-if="item.highlightedContent"
                    v-html="item.highlightedContent"
                    class="shiki-container"
                  ></div>
                  <pre 
                    v-else
                    class="text-xs text-gray-800 whitespace-pre-wrap font-mono"
                  >{{ item.content }}</pre>
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
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .shiki-container {
    font-size: 10px;
  }
}
</style>
