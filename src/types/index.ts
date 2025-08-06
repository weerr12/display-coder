import type { z } from "zod";
import type { tableSchema } from "@/schema/index";

export type TableItem = z.infer<typeof tableSchema>;

export interface Item {
    path: string;
    content: string;
    highlightedContent?: string;
    language?: string;
}