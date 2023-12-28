import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, effect, inject } from '@angular/core';
import { select, select$ } from '@unistate/angular';

import { BasicState, BasicStore } from '../../basic/basic.store';

@Component({
  selector: 'uni-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  private readonly ngZone = inject(NgZone);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _cdCount = 0;
  get cdCount(): number {
    this.ngZone.runOutsideAngular(() => {
      this.elementRef.nativeElement.style.backgroundColor = '#ff33dd';
      setTimeout(() => (this.elementRef.nativeElement.style.backgroundColor = '#85f6a9'), 150);
    });
    return ++this._cdCount;
  }

  @Input({ required: true }) name!: string;
  readonly store = inject(BasicStore);
  readonly $count = select(state => state[`counter${this.name}` as keyof BasicState], { store: this.store, initialValue: { value: 0 } });
  readonly count$ = select$(state => state[`counter${this.name}` as keyof BasicState].value, { store: this.store });

  constructor() {
    this.count$.subscribe({ next: x => console.log('Subscription:', x), complete: () => console.log('complete') });
    effect(() => console.log('Effect:', this.$count()));
  }
}
