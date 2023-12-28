import { Injectable } from '@angular/core';
import { UniStore } from '@unistate/angular';

export interface CounterValue {
  value: number;
}
export interface BasicState {
  counterA: CounterValue;
  counterB: CounterValue;
  counterC: CounterValue;
}

function createInitialState(): BasicState {
  return {
    counterA: { value: 0 },
    counterB: { value: 0 },
    counterC: { value: 0 },
  };
}

@Injectable()
export class BasicStore extends UniStore<BasicState> {
  constructor() {
    super({ initialState: createInitialState() });
  }
}
