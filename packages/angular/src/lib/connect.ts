import { EffectRef, Injector, computed, effect, inject, runInInjectionContext } from '@angular/core';

import { ConnectOptions } from './connect-options';
import { UniStore } from './uni.store';

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
