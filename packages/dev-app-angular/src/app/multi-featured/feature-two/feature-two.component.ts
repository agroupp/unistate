import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'uni-feature-two',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-two.component.html',
  styleUrl: './feature-two.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureTwoComponent {}
