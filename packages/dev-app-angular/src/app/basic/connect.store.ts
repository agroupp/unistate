import { Injectable } from '@angular/core';
import { UniStore } from '@unistate/angular';

export const CAPTAINS = [
  'Matthew Decker',
  'Garth',
  'Kathryn Janeway',
  'James T. Kirk',
  'Bob Wesley',
  'Elizabeth Shelby',
  'Jean-Luc Picard',
  'Jonathan Archer',
  'Christopher Pike',
];

export interface ConnectState {
  query: string;
}

function createInitialState(): ConnectState {
  return {
    query: '',
  };
}

@Injectable()
export class ConnectStore extends UniStore<ConnectState> {
  constructor() {
    super({ initialState: createInitialState() });
  }
}
