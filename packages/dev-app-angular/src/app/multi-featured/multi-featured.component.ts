import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'uni-multi-featured',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './multi-featured.component.html',
  styleUrl: './multi-featured.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiFeaturedComponent {}
