import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Book, GOOGLE_BOOKS_API, VolumesResponse, mapVolumesResItemToBook } from './entities';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly http = inject(HttpClient);

  readMany(q: string): Observable<Book[]> {
    const params = new HttpParams({ fromObject: { q, maxResults: 10 } });

    return this.http.get<VolumesResponse>(`${GOOGLE_BOOKS_API}/volumes`, { params }).pipe(
      map(res => {
        return res.items.map(mapVolumesResItemToBook);
      }),
    );
  }
}
