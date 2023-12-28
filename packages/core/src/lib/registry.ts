import { Store } from './store';

export type UniRegistrySnapshot = Record<string, unknown>;
export type UniRegistryEvent = 'add' | 'remove' | 'reset';
export interface UniRegistryEventPayload {
  action: UniRegistryEvent;
  store: Store<unknown>;
}

export class UniRegistry {
  private readonly registry = new Map<string, Store<unknown>>();
  private readonly eventListeners: ((payload: UniRegistryEventPayload) => void)[] = [];

  add(store: Store<unknown>): void {
    this.registry.set(store.uid, store);
    this.eventListeners.forEach(fn => fn({ action: 'add', store }));
  }

  remove(storeId: string): void {
    const store = this.getStore(storeId);

    if (!store) {
      return;
    }

    this.registry.delete(storeId);
    this.eventListeners.forEach(fn => fn({ action: 'remove', store }));
  }

  on(callbackFn: (payload: UniRegistryEventPayload) => void): () => void {
    if (this.eventListeners.indexOf(callbackFn) > -1) {
      throw new Error('The listener has already registered.');
    }

    this.eventListeners.push(callbackFn);

    return () => {
      const index = this.eventListeners.indexOf(callbackFn);

      if (index === undefined || index === -1) {
        return;
      }

      this.eventListeners.splice(index, 1);
    };
  }

  getSnapshot(): UniRegistrySnapshot {
    const snapshot: UniRegistrySnapshot = {};

    for (const [_, store] of this.registry.entries()) {
      snapshot[store.name] = store.state;
    }

    return snapshot;
  }

  getStore<T>(uid: string): Store<T> | undefined {
    const store = this.registry.get(uid);

    if (!store) {
      return undefined;
    }

    return store as Store<T>;
  }
}

const uniRegistry = new UniRegistry();

export function getUniRegistry(): UniRegistry {
  return uniRegistry;
}
