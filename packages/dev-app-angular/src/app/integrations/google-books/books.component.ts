import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, startWith, switchMap } from 'rxjs';

import { BooksService } from './books.service';
import { Book, QueryFields } from './entities';

interface QueryFieldsSelectorOption {
  value: QueryFields | '';
  text: string;
}

@Component({
  selector: 'uni-books',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent {
  private readonly booksService = inject(BooksService);

  readonly queryFieldsSelector: QueryFieldsSelectorOption[] = [
    { value: '', text: '' },
    { value: 'intitle', text: 'In Title' },
    { value: 'inauthor', text: 'In Author' },
    { value: 'subject', text: 'Subject' },
  ];
  readonly queryFieldsSelectorCtrl = new FormControl<QueryFields | ''>('', { nonNullable: true });
  readonly queryCtrl = new FormControl<string>('', { nonNullable: true });
  readonly $books = signal<Book[]>([]);

  constructor() {
    combineLatest({
      queryFieldsSelector: this.queryFieldsSelectorCtrl.valueChanges.pipe(startWith('')),
      query: this.queryCtrl.valueChanges,
    })
      .pipe(switchMap(({ query }) => this.booksService.readMany(query)))
      .subscribe(books => {
        this.$books.set(books);
      });
  }
}
