import { Store, getUniRegistry } from '@unistate/core';

import { ReduxDevtools, ReduxDevtoolsAction, ReduxDevtoolsExtension, ReduxDevtoolsExtensionConfig } from './data';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: ReduxDevtoolsExtension;
  }
}

/**
 * Logs a trace message to the console.
 *
 * @param message - The message to log.
 * @returns void
 */
function logTrace(message: string): void {
  console.groupCollapsed(message);
  console.trace();
  console.groupEnd();
}

/**
 * Represents a DevTools instance for interacting with Redux DevTools extension.
 *
 * @constructor
 * @param {ReduxDevtoolsExtensionConfig} [config] - The configuration options for the Redux DevTools extension.
 */
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

  /**
   * Sends a ReduxDevtoolsAction to the Redux Devtools extension.
   *
   * @param action - The ReduxDevtoolsAction to send.
   * @returns void
   */
  send(action: ReduxDevtoolsAction): void {
    this.reduxDevtools?.send(action, this.registry.getSnapshot());
  }

  /**
   * Adds a store to the DevTools instance.
   *
   * @param store - The store to add.
   * @returns void
   */
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

  /**
   * Removes a store from the DevTools instance.
   *
   * @param store - The store to remove.
   * @returns void
   */
  removeStore(store: Store<unknown>): void {
    const { uid, name } = store;
    const subscriptionKeys = Array.from(this.subscriptions.keys()).filter(key => key.includes(uid));

    subscriptionKeys.forEach(key => {
      this.subscriptions.get(key)?.();
      this.subscriptions.delete(key);
    });
    this.send(`[${name}] - @Remove`);
  }

  /**
   * Subscribes to the Redux Devtools extension and initializes it with the current snapshot of the registry.
   *
   * @private
   * @returns void
   */
  private subscribeToReduxDevTools(): void {
    this.reduxDevtools?.subscribe(message => {
      if (message.type === 'START') {
        this.reduxDevtools?.init(this.registry.getSnapshot());

        return;
      }
    });
  }

  /**
   * Subscribes to the registry and performs actions based on the given action and store.
   *
   * @private
   * @returns void
   */
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

/**
 * Initializes the DevTools instance.
 *
 * @returns {DevTools} The initialized DevTools instance.
 */
export function initDevTools(): DevTools {
  return new DevTools();
}
