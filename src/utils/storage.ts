import type { TableItem } from "@/types";

/**
 * ฟังก์ชันสำหรับโหลดข้อมูลจาก localStorage
 */
export const loadDataFromStorage = (): TableItem[] => {
    try {
        const savedData = localStorage.getItem("tableData");
        if (savedData) {
            return JSON.parse(savedData);
        }
        return [];
    } catch (error) {
        console.error("Error loading data from localStorage:", error);
        return [];
    }
};

/**
 * ฟังก์ชันสำหรับบันทึกข้อมูลลง localStorage
 */
export const saveDataToStorage = (data: TableItem[]): boolean => {
    try {
        localStorage.setItem("tableData", JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Error saving data to localStorage:", error);
        return false;
    }
};

/**
 * ฟังก์ชันสำหรับหาข้อมูลตาม ID
 */
export const findItemById = (id: number): TableItem | null => {
    const data = loadDataFromStorage();
    return data.find(item => item.id === id) || null;
};

/**
 * ฟังก์ชันสำหรับหาข้อมูลหลาย ID
 */
export const findItemsByIds = (ids: number[]): TableItem[] => {
    const data = loadDataFromStorage();
    return data.filter(item => ids.includes(item.id));
};

/**
 * ฟังก์ชันสำหรับลบข้อมูลตาม ID
 */
export const deleteItemById = (id: number): boolean => {
    try {
        const data = loadDataFromStorage();
        const filteredData = data.filter(item => item.id !== id);
        return saveDataToStorage(filteredData);
    } catch (error) {
        console.error("Error deleting item:", error);
        return false;
    }
};

/**
 * ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่
 */
export const addNewItem = (item: Omit<TableItem, 'id'>): TableItem => {
    const data = loadDataFromStorage();
    const newItem: TableItem = {
        ...item,
        id: Date.now()
    };
    data.push(newItem);
    saveDataToStorage(data);
    return newItem;
};
