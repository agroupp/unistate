import { Book } from './book';
import { ImageLinks } from './image-links';

export const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1';

export interface VolumesResponseItemVolumeInfo {
  title: string;
  subtitle: string;
  authors: string[];
  description: string;
  imageLinks: ImageLinks;
  categories?: string[];
}

export interface VolumesResponseItem {
  id: string;
  volumeInfo: VolumesResponseItemVolumeInfo;
}

export interface VolumesResponse {
  totalItems: number;
  items: VolumesResponseItem[];
}

export function mapVolumesResItemToBook(item: VolumesResponseItem): Book {
  return {
    title: item.volumeInfo.title,
    subtitle: item.volumeInfo.subtitle,
    description: item.volumeInfo.description,
    authors: item.volumeInfo.authors ? [...item.volumeInfo.authors] : [],
    id: item.id,
    imageLinks: item.volumeInfo.imageLinks,
    categories: item.volumeInfo.categories || [],
  };
}
