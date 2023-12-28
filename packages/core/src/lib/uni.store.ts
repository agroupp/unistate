import { UniStoreEvent, UniStoreOptions, VoidFn } from './data';
import { getUniRegistry } from './registry';
import { Store } from './store';

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

  update(updateFn: (state: State) => State): void {
    this.updatePrevState();
    this._state = updateFn(this._state);
    this.eventListeners.get('update')?.forEach(fn => fn());
  }

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

  destroy(): void {
    this.eventListeners.get('destroy')?.forEach(fn => fn());
    this.registry.remove(this.uid);
  }

  protected updatePrevState(): void {
    if (typeof this._state === 'object') {
      this._prevState = Array.isArray(this._state) ? ([...this._state] as State) : { ...this._state };
    } else {
      this._prevState = this._state;
    }
  }
}
