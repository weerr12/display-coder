import type { Item } from "@/types";

/**
 * Map ของ file extensions และ programming languages สำหรับ syntax highlighting
 */
export const languageMap: { [key: string]: string } = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",
    go: "go",
    mod: "go",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    vue: "vue",
    svelte: "svelte",
    json: "json",
    jsonc: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    py: "python",
    pyx: "python",
    pyi: "python",
    pyw: "python",
    java: "java",
    kt: "kotlin",
    kts: "kotlin",
    scala: "scala",
    groovy: "groovy",
    c: "c",
    cpp: "cpp",
    cxx: "cpp",
    cc: "cpp",
    "c++": "cpp",
    h: "c",
    hpp: "cpp",
    hxx: "cpp",
    rs: "rust",
    php: "php",
    phtml: "php",
    rb: "ruby",
    rbw: "ruby",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    fish: "fish",
    ps1: "powershell",
    sql: "sql",
    mysql: "sql",
    pgsql: "sql",
    dockerfile: "dockerfile",
    env: "dotenv",
    gitignore: "gitignore",
    md: "markdown",
    mdx: "mdx",
    txt: "plaintext",
    log: "log",
    swift: "swift",
    dart: "dart",
    r: "r",
    lua: "lua",
    vim: "vim",
    ini: "ini",
    cfg: "ini",
    conf: "ini",
};

/**
 * ฟังก์ชันสำหรับได้ language จาก file path
 */
export const getLanguageFromPath = (path: string): string => {
    const extension = path.split(".").pop()?.toLowerCase();
    return languageMap[extension || ""] || "plaintext";
};

/**
 * ฟังก์ชันสำหรับ highlight code ด้วย highlighter
 */
export const highlightCode = async (
    content: string,
    language: string,
    highlighter: any
): Promise<string> => {
    if (!highlighter) return content;
    try {
        return highlighter.codeToHtml(content, {
            lang: language,
            theme: "github-light",
        });
    } catch (error) {
        console.warn("Failed to highlight code:", error);
        return content;
    }
};

/**
 * ฟังก์ชันสำหรับสร้าง Item object จาก path และ content
 */
export const createItem = async (
    path: string,
    content: string,
    highlighter: any
): Promise<Item> => {
    const language = getLanguageFromPath(path);
    const highlightedContent = await highlightCode(content, language, highlighter);

    return {
        path: path || "Unknown path",
        content: content || "No content",
        highlightedContent,
        language,
    };
};

/**
 * ฟังก์ชันสำหรับประมวลผล array ของข้อมูล
 */
export const processDataArray = async (
    dataArray: any[],
    highlighter: any
): Promise<Item[]> => {
    const processedItems = await Promise.all(
        dataArray.map((item) => createItem(item.path, item.content, highlighter))
    );
    return processedItems;
};

/**
 * ฟังก์ชันสำหรับประมวลผล object ทั่วไป
 */
export const processObject = async (
    obj: any,
    highlighter: any
): Promise<Item[]> => {
    const entries = Object.entries(obj);
    const processedItems = await Promise.all(
        entries.map(([key, value]) =>
            createItem(
                key,
                typeof value === "string" ? value : JSON.stringify(value, null, 2),
                highlighter
            )
        )
    );
    return processedItems;
};

/**
 * ฟังก์ชันหลักสำหรับประมวลผล JSON data
 */
export const processJsonData = async (
    jsonDataString: string,
    highlighter: any
): Promise<Item[]> => {
    try {
        const jsonData = JSON.parse(jsonDataString);

        // กรณีที่ 1: Object ที่มี property "data" เป็น array
        if (jsonData.data && Array.isArray(jsonData.data)) {
            return await processDataArray(jsonData.data, highlighter);
        }
        // กรณีที่ 2: Array โดยตรง
        else if (Array.isArray(jsonData)) {
            return await processDataArray(jsonData, highlighter);
        }
        // กรณีที่ 3: Object เดียวที่มี path และ content
        else if (jsonData.path && jsonData.content) {
            return [await createItem(jsonData.path, jsonData.content, highlighter)];
        }
        // กรณีที่ 4: Object ทั่วไป
        else if (typeof jsonData === "object" && jsonData !== null) {
            return await processObject(jsonData, highlighter);
        }

        return [];
    } catch (error) {
        console.error("Error processing JSON data:", error);
        return [];
    }
};
