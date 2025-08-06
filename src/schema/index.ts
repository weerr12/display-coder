import { z } from "zod";

export const tableSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1, "กรุณากรอกชื่อ"),
    version: z.string().min(1, "กรุณากรอกเวอร์ชัน"),
    checked: z.boolean(),
    jsonData: z.string().optional(),
    content: z.string().optional(),
    path: z.string().optional(),
});