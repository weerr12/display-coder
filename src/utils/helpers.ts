import { createHighlighter } from "shiki";

/**
 * ฟังก์ชันสำหรับสร้าง Shiki highlighter
 */
export const createCodeHighlighter = async () => {
    return await createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: [
            "javascript",
            "typescript",
            "jsx",
            "tsx",
            "go",
            "html",
            "css",
            "scss",
            "sass",
            "less",
            "vue",
            "svelte",
            "json",
            "xml",
            "yaml",
            "toml",
            "python",
            "java",
            "kotlin",
            "scala",
            "groovy",
            "c",
            "cpp",
            "rust",
            "php",
            "ruby",
            "bash",
            "fish",
            "powershell",
            "sql",
            "dockerfile",
            "markdown",
            "swift",
            "dart",
            "r",
            "lua",
            "vim",
            "ini",
            "plaintext",
        ],
    });
};

/**
 * ฟังก์ชันสำหรับคัดลอกข้อความไปยัง clipboard
 */
export const copyToClipboard = async (content: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(content);
        return true;
    } catch (error) {
        console.error("Failed to copy text:", error);
        return false;
    }
};

/**
 * ฟังก์ชันสำหรับ format JSON string
 */
export const formatJsonString = (jsonString: string): string => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch (error) {
        return jsonString;
    }
};

/**
 * ฟังก์ชันสำหรับ validate JSON string
 */
export const isValidJson = (jsonString: string): boolean => {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
};
