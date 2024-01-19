import { Store } from './store';

export type UniRegistrySnapshot = Record<string, unknown>;
export type UniRegistryEvent = 'add' | 'remove' | 'reset';
export interface UniRegistryEventPayload {
  action: UniRegistryEvent;
  store: Store<unknown>;
}

/**
 * Represents a registry for storing and managing instances of the UniStore class.
 * The UniRegistry class provides methods for adding and removing stores, as well as registering and unregistering event listeners.
 * It also allows for retrieving a snapshot of the current state of all registered stores.
 *
 * @example
 * const registry = new UniRegistry();
 *
 * const store = new Store();
 * registry.add(store);
 *
 * const listener = (payload) => {
 *   console.log(payload);
 * };
 *
 * const unregister = registry.on(listener);
 *
 * registry.remove(store.uid);
 *
 * unregister();
 *
 * const snapshot = registry.getSnapshot();
 *
 * @public
 */
export class UniRegistry {
  private readonly registry = new Map<string, Store<unknown>>();
  private readonly eventListeners: ((payload: UniRegistryEventPayload) => void)[] = [];

  /**
   * Adds a store to the registry.
   *
   * @param store - The store to be added.
   * @returns void
   *
   * @remarks
   * This method adds a store to the registry by setting its UID as the key and the store itself as the value in the registry map.
   * It also triggers the 'add' action for all registered event listeners, passing the store as the payload.
   *
   * @example
   * ```typescript
   * const registry = new UniRegistry();
   * const store = new Store();
   * registry.add(store);
   * ```
   */
  add(store: Store<unknown>): void {
    this.registry.set(store.uid, store);
    this.eventListeners.forEach(fn => fn({ action: 'add', store }));
  }

  /**
   * Removes a store from the registry.
   *
   * @param storeId - The ID of the store to be removed.
   * @returns void
   *
   * @remarks
   * This method removes a store from the registry by deleting the store with the specified ID from the registry map.
   * It also triggers the 'remove' action for all registered event listeners, passing the removed store as the payload.
   * If the store with the specified ID does not exist in the registry, the method does nothing.
   *
   * @example
   * ```typescript
   * const registry = new UniRegistry();
   * const store = new Store();
   * registry.add(store);
   * registry.remove(store.uid);
   * ```
   */
  remove(storeId: string): void {
    const store = this.getStore(storeId);

    if (!store) {
      return;
    }

    this.registry.delete(storeId);
    this.eventListeners.forEach(fn => fn({ action: 'remove', store }));
  }

  /**
   * Registers a callback function to be called when an event is triggered.
   *
   * @param callbackFn - The callback function to be registered.
   * @returns A function that can be called to unregister the callback function.
   *
   * @remarks
   * This method registers a callback function to be called when an event is triggered.
   * The callback function will receive a payload object containing the action and the store associated with the event.
   * If the same callback function is already registered, an error will be thrown.
   * To unregister the callback function, call the returned function.
   *
   * @example
   * ```typescript
   * const registry = new UniRegistry();
   * const store = new Store();
   * const unregister = registry.on(payload => {
   *   console.log(payload.action); // 'add'
   *   console.log(payload.store); // the store object
   * });
   * registry.add(store); // the callback function will be called
   * unregister(); // the callback function will no longer be called
   * ```
   */
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

  /**
   * Retrieves a snapshot of the current state of all stores in the registry.
   *
   * @returns A snapshot object containing the name of each store as the key and its current state as the value.
   *
   * @remarks
   * This method iterates over all stores in the registry and creates a snapshot object that maps each store's name to its current state.
   * The snapshot object is then returned.
   *
   * @example
   * ```typescript
   * const registry = new UniRegistry();
   * const store1 = new Store();
   * const store2 = new Store();
   * registry.add(store1);
   * registry.add(store2);
   * const snapshot = registry.getSnapshot();
   * console.log(snapshot); // { store1: state1, store2: state2 }
   * ```
   */
  getSnapshot(): UniRegistrySnapshot {
    const snapshot: UniRegistrySnapshot = {};

    for (const [_, store] of this.registry.entries()) {
      snapshot[store.name] = store.state;
    }

    return snapshot;
  }

  /**
   * Retrieves a store from the registry based on its UID.
   *
   * @param uid - The UID of the store to retrieve.
   * @returns The store with the specified UID, or undefined if the store does not exist in the registry.
   *
   * @remarks
   * This method retrieves a store from the registry based on its UID.
   * If a store with the specified UID exists in the registry, it is returned.
   * If the store does not exist in the registry, undefined is returned.
   *
   * @example
   * ```typescript
   * const registry = new UniRegistry();
   * const store = new Store();
   * registry.add(store);
   * const retrievedStore = registry.getStore(store.uid);
   * console.log(retrievedStore); // the store object
   * ```
   */
  getStore<T>(uid: string): Store<T> | undefined {
    const store = this.registry.get(uid);

    if (!store) {
      return undefined;
    }

    return store as Store<T>;
  }
}

const uniRegistry = new UniRegistry();

/**
 * Retrieves the instance of the UniRegistry class.
 *
 * @returns The instance of the UniRegistry class.
 *
 * @remarks
 * This function returns the instance of the UniRegistry class that is created and exported in the module.
 * The UniRegistry class is a registry that stores and manages instances of the Store class.
 * Use this function to access the UniRegistry instance and perform operations on it.
 *
 * @example
 * ```typescript
 * const registry = getUniRegistry();
 * const store = new Store();
 * registry.add(store);
 * ```
 */
export function getUniRegistry(): UniRegistry {
  return uniRegistry;
}
