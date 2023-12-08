export const QUERY_FIELDS = ['intitle', 'inauthor', 'subject'] as const;
export type QueryFields = (typeof QUERY_FIELDS)[number];
