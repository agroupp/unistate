import { Injectable } from '@angular/core';
import { UniStore } from '@unistate/angular';

export interface FeatureTwoState {}

@Injectable()
export class FeatureTwoStore extends UniStore<FeatureTwoState> {
  constructor() {
    super({ initialState: {}, name: 'Feat Two' });
  }
}
