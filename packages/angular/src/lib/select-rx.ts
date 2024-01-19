import { DestroyRef, Injector, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { SelectOptions } from './select-options';
import { UniStore } from './uni.store';

/**
 * Returns an Observable that emits the result of a computation function applied to the state of a UniStore.
 *
 * @template T The type of the computed value.
 * @template State The type of the UniStore state.
 * @param {function(state: State): T} computation The computation function to be applied to the state.
 * @param {SelectOptions & { store: UniStore<State> }} options The options object containing the UniStore and additional options.
 * @returns {Observable<T>} An Observable that emits the computed value.
 */
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
