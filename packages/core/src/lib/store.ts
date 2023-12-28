import { UniStoreEvent, UniStoreOptions } from './data';

export interface Store<State> {
  readonly options: UniStoreOptions<State>;
  readonly uid: string;
  readonly name: string;
  readonly state: State;

  update(updateFn: (state: State) => State): void;
  on(event: UniStoreEvent, callbackFn: () => void): () => void;
  destroy(): void;
}
