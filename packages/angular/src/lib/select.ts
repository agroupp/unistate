import { DestroyRef, Injector, Signal, inject, signal } from '@angular/core';

import { SelectOptions } from './select-options';
import { UniStore } from './uni.store';

export function select<T, State>(
  computation: (state: State) => T,
  options: SelectOptions & { store: UniStore<State>; initialValue: T },
): Signal<T> {
  const { initialValue, store } = options;
  const injector = options?.injector || inject(Injector, { optional: true }) || store.injector;
  const destroyRef = injector.get(DestroyRef);
  const $result = signal(initialValue);
  const eventRef = store.on('update', () => $result.set(computation(store.state)));
  destroyRef.onDestroy(() => eventRef());

  return $result;
}
