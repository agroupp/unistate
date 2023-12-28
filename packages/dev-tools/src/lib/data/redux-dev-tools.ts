export type StoreSnapshot = Record<string, unknown>;
export interface ReduxDevtoolsExtensionConfig {
  name?: string;
  log?: boolean;
}

interface ReduxDevtoolsListenerMessage {
  type: 'START' | 'DISPATCH';
  payload?: { type: 'RESET' | 'ROLLBACK' | 'COMMIT' | 'JUMP_TO_ACTION' };
  state?: string;
}

type ReduxDevtoolsListener = (message: ReduxDevtoolsListenerMessage) => void;
export type ReduxDevtoolsAction = string;

export interface ReduxDevtools {
  subscribe(listener: ReduxDevtoolsListener): () => void;
  unsubscribe(): void;
  init(registrySnapshot: StoreSnapshot): void;
  send(action: ReduxDevtoolsAction, state: StoreSnapshot): void;
}

export interface ReduxDevtoolsExtension {
  connect(config?: ReduxDevtoolsExtensionConfig): ReduxDevtools;
}
