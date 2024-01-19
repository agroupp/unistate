import { DestroyRef, Injector, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription } from 'rxjs';

import { ConnectOptions } from './connect-options';
import { UniStore } from './uni.store';

/**
 * Connects a function to a UniStore and returns a Subscription.
 *
 * @param connectFn - The function that takes the current state of the UniStore and returns an Observable of the updated state.
 * @param store - The UniStore instance to connect to.
 * @param options - (Optional) Additional options for the connection.
 * @returns A Subscription that can be used to unsubscribe from the connected Observable.
 */
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
