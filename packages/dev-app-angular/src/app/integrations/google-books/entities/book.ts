import { ImageLinks } from './image-links';

export interface Book {
  title: string;
  subtitle: string;
  description: string;
  authors: string[];
  id: string;
  imageLinks?: ImageLinks;
  categories: string[];
}
