import { DestroyRef, Injector, inject } from '@angular/core';
import { UniStore as UniStoreCore, UniStoreOptions } from '@unistate/core';

/**
 * Represents a UniStore class.
 *
 * @template State The type of the state managed by the UniStore.
 * @extends UniStoreCore<State>
 */
export abstract class UniStore<State> extends UniStoreCore<State> {
  protected readonly destroyRef = inject(DestroyRef, { optional: true });

  readonly injector = inject(Injector);

  constructor(override readonly options: UniStoreOptions<State>) {
    super(options);
    this.destroyRef?.onDestroy(() => this.destroy());
  }
}
