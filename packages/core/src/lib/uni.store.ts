import { UniStoreEvent, UniStoreOptions, VoidFn } from './data';
import { getUniRegistry } from './registry';
import { Store } from './store';

/**
 * Represents a generic store implementation for managing state in a TypeScript application.
 *
 * @typeParam State - The type of the state managed by the store.
 */
export abstract class UniStore<State> implements Store<State> {
  protected _state = this.options.initialState;
  protected _prevState?: State;
  protected readonly eventListeners = new Map<UniStoreEvent, VoidFn[]>();
  protected readonly registry = getUniRegistry();

  get state(): State {
    return this._state;
  }

  readonly uid = crypto?.randomUUID ? crypto.randomUUID() : `${Math.ceil(Math.random() * 1000000)}.${Date.now()}`;
  readonly name = this.options.name || this.constructor.name;

  constructor(readonly options: UniStoreOptions<State>) {
    this.registry.add(this);
  }

  /**
   * Updates the state of the UniStore by applying the provided update function.
   *
   * @param updateFn - The function that takes the current state as input and returns the updated state.
   * @returns void
   *
   * @example
   *
   * // Define a UniStore instance
   * const store = new UniStore({ initialState: { count: 0 } });
   *
   * // Define an update function
   * const increment = (state) => {
   *   return { count: state.count + 1 };
   * };
   *
   * // Update the state using the update function
   * store.update(increment);
   *
   * // The state will be updated to { count: 1 }
   */
  update(updateFn: (state: State) => State): void {
    this.updatePrevState();
    this._state = updateFn(this._state);
    this.eventListeners.get('update')?.forEach(fn => fn());
  }

  /**
   * Registers a callback function to be executed when the specified event occurs.
   *
   * @param event - The event to listen for.
   * @param callbackFn - The callback function to be executed when the event occurs.
   * @returns A function that can be called to remove the registered callback function.
   *
   * @example
   *
   * // Define a UniStore instance
   * const store = new UniStore({ initialState: { count: 0 } });
   *
   * // Define a callback function
   * const callback = () => {
   *   console.log('Event occurred!');
   * };
   *
   * // Register the callback function for the 'update' event
   * const removeListener = store.on('update', callback);
   *
   * // When the 'update' event occurs, the callback function will be executed
   *
   * // Remove the registered callback function
   * removeListener();
   *
   * // The callback function will no longer be executed when the 'update' event occurs
   */
  on(event: UniStoreEvent, callbackFn: () => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }

    this.eventListeners.get(event)?.push(callbackFn);

    return () => {
      const index = this.eventListeners.get(event)?.indexOf(callbackFn);

      if (index === undefined || index === -1) {
        return;
      }

      this.eventListeners.get(event)?.splice(index, 1);
    };
  }

  /**
   * Destroys the UniStore instance by removing all event listeners and unregistering from the registry.
   *
   * @returns void
   *
   * @example
   *
   * // Define a UniStore instance
   * const store = new UniStore({ initialState: { count: 0 } });
   *
   * // Define a callback function
   * const callback = () => {
   *   console.log('Event occurred!');
   * };
   *
   * // Register the callback function for the 'destroy' event
   * const removeListener = store.on('destroy', callback);
   *
   * // Destroy the UniStore instance
   * store.destroy();
   *
   * // The callback function will be executed and the UniStore instance will be removed from the registry
   */
  destroy(): void {
    this.eventListeners.get('destroy')?.forEach(fn => fn());
    this.registry.remove(this.uid);
  }

  /**
   * Updates the previous state of the UniStore.
   * If the current state is an object, the previous state will be a shallow copy of the current state.
   * If the current state is not an object, the previous state will be the same as the current state.
   *
   * @returns void
   *
   * @example
   *
   * // Define a UniStore instance
   * const store = new UniStore({ initialState: { count: 0 } });
   *
   * // Update the state
   * store.update({ count: 1 });
   *
   * // The previous state will be a shallow copy of the current state, { count: 1 }
   */
  protected updatePrevState(): void {
    if (typeof this._state === 'object') {
      this._prevState = Array.isArray(this._state) ? ([...this._state] as State) : { ...this._state };
    } else {
      this._prevState = this._state;
    }
  }
}
