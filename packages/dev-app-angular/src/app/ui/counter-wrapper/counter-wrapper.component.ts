import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CounterComponent } from '../counter/counter.component';

@Component({
  selector: 'uni-counter-wrapper',
  standalone: true,
  imports: [CommonModule, CounterComponent],
  templateUrl: './counter-wrapper.component.html',
  styleUrl: './counter-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterWrapperComponent {
  private _cdCount = 0;
  get cdCount(): number {
    return ++this._cdCount;
  }

  @Input({ required: true }) counterName!: string;
}
