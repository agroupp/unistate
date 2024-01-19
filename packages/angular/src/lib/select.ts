import { DestroyRef, Injector, Signal, inject, signal } from '@angular/core';

import { SelectOptions } from './select-options';
import { UniStore } from './uni.store';

/**
 * Returns a Signal that emits the result of the computation function applied to the state of the provided UniStore.
 *
 * @param computation - A function that takes the state of the UniStore as input and returns a value of type T.
 * @param options - An object containing the options for the select function.
 * @param options.store - The UniStore instance to select from.
 * @param options.initialValue - The initial value for the Signal.
 * @param options.injector - (Optional) The Injector instance to use for dependency injection. If not provided, the Injector from the UniStore will be used.
 *
 * @returns A Signal that emits the result of the computation function applied to the state of the UniStore.
 */
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
