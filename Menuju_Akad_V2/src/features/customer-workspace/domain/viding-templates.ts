import rawData from "../data/viding-templates.json";
import type { VidingTemplate, CategoryFilter } from "../types/viding-template";

export const vidingTemplates: VidingTemplate[] = rawData as VidingTemplate[];

export const TEMPLATES_PER_PAGE = 12;

export const numericCategories: CategoryFilter[] = [
  { id: 0, label: "Semua", rangeText: "1 - 167", count: vidingTemplates.length },
  { id: 1, label: "1 - 20", rangeText: "Tema 1 - 20", count: 20 },
  { id: 2, label: "21 - 40", rangeText: "Tema 21 - 40", count: 20 },
  { id: 3, label: "41 - 60", rangeText: "Tema 41 - 60", count: 20 },
  { id: 4, label: "61 - 80", rangeText: "Tema 61 - 80", count: 20 },
  { id: 5, label: "81 - 100", rangeText: "Tema 81 - 100", count: 20 },
  { id: 6, label: "101 - 120", rangeText: "Tema 101 - 120", count: 20 },
  { id: 7, label: "121 - 140", rangeText: "Tema 121 - 140", count: 20 },
  { id: 8, label: "141 - 160", rangeText: "Tema 141 - 160", count: 20 },
  { id: 9, label: "161 - 167", rangeText: "Tema 161 - 167", count: 7 },
];

export function getFilteredTemplates(
  selectedCategory: number,
  searchQuery: string,
): VidingTemplate[] {
  let result = vidingTemplates;
  if (selectedCategory > 0) {
    result = result.filter((t) => t.categoryGroup === selectedCategory);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        String(t.themeNumber).includes(q),
    );
  }
  return result;
}

