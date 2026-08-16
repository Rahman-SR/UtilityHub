import { ToolMetadata } from '@/types/tool';
import { TOOLS } from '@/data/tools';

export function searchTools(query: string, categoryFilter?: string): ToolMetadata[] {
  const cleanQuery = query.trim().toLowerCase();

  let pool = TOOLS;
  if (categoryFilter && categoryFilter !== 'all') {
    pool = pool.filter((tool) => tool.category === categoryFilter);
  }

  if (!cleanQuery) {
    return pool;
  }

  return pool.filter((tool) => {
    const nameMatch = tool.name.toLowerCase().includes(cleanQuery);
    const descMatch = tool.description.toLowerCase().includes(cleanQuery);
    const categoryMatch = tool.category.toLowerCase().includes(cleanQuery);
    const keywordMatch = tool.keywords.some((kw) => kw.toLowerCase().includes(cleanQuery));

    return nameMatch || descMatch || categoryMatch || keywordMatch;
  });
}
