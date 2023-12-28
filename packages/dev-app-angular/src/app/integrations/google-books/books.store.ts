import { Injectable } from '@angular/core';
import { UniStore } from '@unistate/angular';

import { QueryField } from './entities';

export interface FilterState {
  queryField: QueryField;
  query: string;
}

export interface BooksState {
  filter: FilterState;
}

function createInitialState(): BooksState {
  return {
    filter: {
      queryField: '',
      query: '',
    },
  };
}

@Injectable()
export class BooksStore extends UniStore<BooksState> {
  constructor() {
    super({ initialState: createInitialState(), name: 'Google Books' });
  }
}
