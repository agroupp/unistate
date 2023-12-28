import { Store, getUniRegistry } from '@unistate/core';

import { ReduxDevtools, ReduxDevtoolsAction, ReduxDevtoolsExtension, ReduxDevtoolsExtensionConfig } from './data';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevtoolsExtension;
  }
}

function logTrace(message: string): void {
  console.groupCollapsed(message);
  console.trace();
  console.groupEnd();
}

export class DevTools {
  private readonly reduxDevtoolsExtension?: ReduxDevtoolsExtension;
  private readonly reduxDevtools?: ReduxDevtools;
  private readonly registry = getUniRegistry();
  private readonly subscriptions = new Map<string, () => void>();
  private blockSend = false;

  constructor(config?: ReduxDevtoolsExtensionConfig) {
    if (!window.__REDUX_DEVTOOLS_EXTENSION__) {
      logTrace(`The redux dev-tools extension wasn't detected. Did you install it? 😉`);

      return;
    }

    this.reduxDevtoolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
    this.reduxDevtools = this.reduxDevtoolsExtension.connect(config);
    this.subscribeToReduxDevTools();
    this.subscribeToRegistry();
  }

  send(action: ReduxDevtoolsAction): void {
    this.reduxDevtools?.send(action, this.registry.getSnapshot());
  }

  addStore(store: Store<unknown>): void {
    this.subscriptions.set(
      `${store.uid} - update`,
      store.on('update', () => {
        if (this.blockSend) {
          this.blockSend = false;

          return;
        }

        this.send(`[${store.name}] - @Update`);
      }),
    );

    this.send(`[${store.name}] - @Init`);
  }

  removeStore(store: Store<unknown>): void {
    const { uid, name } = store;
    const subscriptionKeys = Array.from(this.subscriptions.keys()).filter(key => key.includes(uid));

    subscriptionKeys.forEach(key => {
      this.subscriptions.get(key)?.();
      this.subscriptions.delete(key);
    });
    this.send(`[${name}] - @Remove`);
  }

  private subscribeToReduxDevTools(): void {
    this.reduxDevtools?.subscribe(message => {
      if (message.type === 'START') {
        this.reduxDevtools?.init(this.registry.getSnapshot());

        return;
      }
    });
  }

  private subscribeToRegistry(): void {
    this.registry.on(({ action, store }) => {
      if (!store) {
        return;
      }

      switch (action) {
        case 'add':
          this.addStore(store);
          break;
        case 'remove':
          this.removeStore(store);
          break;
      }
    });
  }
}

export function initDevTools(): DevTools {
  return new DevTools();
}
