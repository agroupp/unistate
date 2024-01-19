import { getUniRegistry } from '@unistate/core';
import { VoidFn } from 'packages/core/src/lib/data';

export const LOG_LEVELS = ['INFO', 'WARN'] as const;
export type UniLogLevel = (typeof LOG_LEVELS)[number];
type Styles = Record<'common' | 'uniStateLogger' | UniLogLevel, string>;
const STYLES: Styles = {
  common: [].join(';'),
  uniStateLogger: ['color: #ff33dd'].join(';'),
  INFO: ['color: #00ff33'].join(';'),
  WARN: ['color: #ffeb3b'].join(';'),
};

/**
 * Represents a logger for UniState.
 *
 * This logger is used to log messages and events related to UniState.
 * It provides methods for logging different levels of messages and subscribing to the UniRegistry.
 *
 * @constructor
 * Creates a new instance of UniStateLogger.
 *
 * @method log
 * Logs a message with the specified level.
 *
 * @param level - The level of the message to be logged.
 * @param message - The message to be logged.
 *
 * @method subscribeToRegistry
 * Subscribes to the UniRegistry and logs events related to store actions.
 *
 * @private
 * @property registry - The UniRegistry instance.
 * @property subscriptions - A map of store subscriptions.
 */
export class UniStateLogger {
  private readonly registry = getUniRegistry();
  private readonly subscriptions = new Map<string, VoidFn>();

  constructor() {
    this.log('WARN', `The logger can have a significant impact on application performance. Please don't use it in production.`);
    this.subscribeToRegistry();
  }

  /**
   * Logs a message with the specified log level.
   *
   * @param level - The log level.
   * @param message - The message to be logged.
   * @returns void
   */
  log(level: UniLogLevel, message: string): void {
    const m = `%c[UniStateLogger]: %c${level}: %c${message}`;
    console.log(
      m,
      `${STYLES['common']};${STYLES['uniStateLogger']}`,
      `${STYLES['common']};${STYLES[level]};font-weight: 600;`,
      `${STYLES['common']};${STYLES[level]}`,
    );
  }

  /**
   * Subscribes to the UniRegistry and logs information based on the action performed.
   *
   * @returns void
   */
  private subscribeToRegistry(): void {
    this.registry.on(({ action, store }) => {
      switch (action) {
        case 'add':
          this.log('INFO', `[${store?.name}] - Added to UniRegistry`);
          store &&
            this.subscriptions.set(
              store.uid,
              store?.on('update', () => {
                this.log('INFO', `[${store?.name}] - UPDATE`);
                console.log(`%c[UniStateLogger]:`, `${STYLES['common']};${STYLES['uniStateLogger']}`, store.state);
              }),
            );
          break;
        case 'remove':
          this.log('INFO', `[${store?.name}] - Removed from UniRegistry`);
          this.subscriptions.get(store.uid)?.();
          this.subscriptions.delete(store.uid);
      }
    });
  }
}

/**
 * Creates and returns an instance of UniStateLogger.
 *
 * @returns {UniStateLogger} - The UniStateLogger instance.
 */
export function runUniStateLogger(): UniStateLogger {
  return new UniStateLogger();
}
