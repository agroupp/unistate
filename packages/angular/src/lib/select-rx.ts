import { DestroyRef, Injector, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { SelectOptions } from './select-options';
import { UniStore } from './uni.store';

export function select$<T, State>(computation: (state: State) => T, options: SelectOptions & { store: UniStore<State> }): Observable<T> {
  const { store } = options;
  const injector = options?.injector || inject(Injector, { optional: true }) || store.injector;
  const destroyRef = injector.get(DestroyRef);
  const result$ = new ReplaySubject<T>(1);
  const eventRef = store.on('update', () => result$.next(computation(store.state)));
  destroyRef.onDestroy(() => {
    eventRef();
    result$.complete();
  });

  return result$.asObservable();
}
