import { Injectable } from '@angular/core';
import { UniStore } from '@unistate/angular';

export interface FeatureOneState {}

@Injectable()
export class FeatureOneStore extends UniStore<FeatureOneState> {
  constructor() {
    super({ initialState: {}, name: 'Feat One' });
  }
}
