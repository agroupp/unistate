export const QUERY_FIELDS = ['intitle', 'inauthor', 'subject', ''] as const;
export type QueryField = (typeof QUERY_FIELDS)[number];
