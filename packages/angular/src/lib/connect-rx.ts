import { DestroyRef, Injector, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription } from 'rxjs';

import { ConnectOptions } from './connect-options';
import { UniStore } from './uni.store';

export function connect$<State>(
  connectFn: (state: State) => Observable<State>,
  store: UniStore<State>,
  options?: ConnectOptions,
): Subscription {
  const injector = options?.injector || inject(Injector, { optional: true }) || store.injector;
  const destroyRef = injector.get(DestroyRef);

  return connectFn(store.state)
    .pipe(takeUntilDestroyed(destroyRef))
    .subscribe(state => store.update(() => state));
}
