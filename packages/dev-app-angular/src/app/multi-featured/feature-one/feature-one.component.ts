import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FeatureOneStore } from './feature-one.store';

@Component({
  selector: 'uni-feature-one',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-one.component.html',
  styleUrl: './feature-one.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeatureOneStore],
})
export class FeatureOneComponent {
  readonly store = inject(FeatureOneStore);
}
