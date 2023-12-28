import { DestroyRef, Injector, inject } from '@angular/core';
import { UniStore as UniStoreCore, UniStoreOptions } from '@unistate/core';

export abstract class UniStore<State> extends UniStoreCore<State> {
  protected readonly destroyRef = inject(DestroyRef, { optional: true });

  readonly injector = inject(Injector);

  constructor(override readonly options: UniStoreOptions<State>) {
    super(options);
    this.destroyRef?.onDestroy(() => this.destroy());
  }
}
