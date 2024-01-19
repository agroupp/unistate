import { EffectRef, Injector, computed, effect, inject, runInInjectionContext } from '@angular/core';

import { ConnectOptions } from './connect-options';
import { UniStore } from './uni.store';

/**
 * Connects a function containing a signal to a UniStore and returns an EffectRef.
 *
 * @param connectFn - The function that contains one or more signals and maps the store state to a new state.
 * @param store - The UniStore instance.
 * @param options - Optional options for the connection.
 * @returns An EffectRef that represents the connection.
 */
export function connect<State>(connectFn: (state: State) => State, store: UniStore<State>, options?: ConnectOptions): EffectRef {
  const injector = options?.injector || inject(Injector, { optional: true }) || store.injector;
  let wasUpdated = false;
  const $computedSource = computed(() => {
    wasUpdated = false;

    return connectFn(store.state);
  });

  return runInInjectionContext(injector, () =>
    effect(
      () => {
        $computedSource();

        if (wasUpdated) {
          return;
        }

        store.update(() => $computedSource());
        wasUpdated = true;
      },
      { allowSignalWrites: true },
    ),
  );
}
