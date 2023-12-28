import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EffectRef, Injector, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { connect, connect$, select } from '@unistate/angular';
import { Subscription, map } from 'rxjs';

import { BasicStore } from './basic.store';
import { ConnectStore, CAPTAINS } from './connect.store';
import { CounterWrapperComponent } from '../ui';

@Component({
  selector: 'uni-basic',
  standalone: true,
  imports: [CommonModule, CounterWrapperComponent, ReactiveFormsModule],
  providers: [BasicStore, ConnectStore],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicComponent {
  private readonly injector = inject(Injector);
  private readonly $query = signal('');

  readonly store = inject(BasicStore);
  readonly connectStore = inject(ConnectStore);

  // Signal Connection
  storeConnection?: EffectRef;
  readonly $captainsList = select(state => CAPTAINS.filter(c => c.match(new RegExp(state.query, 'gi'))), {
    store: this.connectStore,
    initialValue: CAPTAINS,
  });

  // Rx Connection
  readonly rxConnectQuery = new FormControl<string>('', { nonNullable: true });
  storeConnectionRx?: Subscription;

  updateCounter(counter: 'A' | 'B' | 'C', action: '+' | '-'): void {
    this.store.update(state => {
      const curr = state[`counter${counter}`].value;
      action === '+' ? (state[`counter${counter}`] = { value: curr + 1 }) : (state[`counter${counter}`] = { value: curr - 1 });

      return state;
    });
  }

  toggleConnectToStore(): void {
    if (this.storeConnection) {
      this.storeConnection.destroy();
      this.storeConnection = undefined;

      return;
    }

    this.storeConnection = connect(state => ({ ...state, query: this.$query() }), this.connectStore, { injector: this.injector });
  }

  toggleRxConnectToStore(): void {
    if (this.storeConnectionRx) {
      this.storeConnectionRx.unsubscribe();
      this.storeConnectionRx = undefined;

      return;
    }

    this.storeConnectionRx = connect$(
      state =>
        this.rxConnectQuery.valueChanges.pipe(
          map(query => {
            state.query = query;

            return state;
          }),
        ),
      this.connectStore,
      { injector: this.injector },
    );
  }

  signalConnectQuery(value: string): void {
    this.$query.set(value);
  }
}
