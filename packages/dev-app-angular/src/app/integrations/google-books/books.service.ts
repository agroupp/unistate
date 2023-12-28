import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BooksStore } from './books.store';
import { Book, GOOGLE_BOOKS_API, VolumesResponse, mapVolumesResItemToBook } from './entities';

@Injectable()
export class BooksService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(BooksStore);

  readMany(): Observable<Book[]> {
    const { filter } = this.store.state;
    let q = filter.queryField ? `${filter.queryField}:` : ``;
    q += filter.query;
    const params = new HttpParams({ fromObject: { q, maxResults: 10 } });

    return this.http.get<VolumesResponse>(`${GOOGLE_BOOKS_API}/volumes`, { params }).pipe(
      map(res => {
        return res.items.map(mapVolumesResItemToBook);
      }),
    );
  }
}
