export const UNI_STORE_EVENTS = ['update', 'reset', 'destroy'] as const;
export type UniStoreEvent = (typeof UNI_STORE_EVENTS)[number];
