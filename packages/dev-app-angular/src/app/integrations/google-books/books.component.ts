import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { connect$ } from '@unistate/angular';
import { combineLatest, debounceTime, map, startWith, tap } from 'rxjs';

import { BooksService } from './books.service';
import { BooksStore } from './books.store';
import { Book, QueryField } from './entities';

interface QueryFieldsSelectorOption {
  value: QueryField;
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

  readonly booksStore = inject(BooksStore);
  readonly queryFieldsSelector: QueryFieldsSelectorOption[] = [
    { value: '', text: '' },
    { value: 'intitle', text: 'In Title' },
    { value: 'inauthor', text: 'In Author' },
    { value: 'subject', text: 'Subject' },
  ];
  readonly queryFieldsSelectorCtrl = new FormControl<QueryField | ''>('', { nonNullable: true });
  readonly queryCtrl = new FormControl<string>('', { nonNullable: true });
  readonly $books = signal<Book[]>([]);

  constructor() {
    const filter$ = combineLatest({
      queryField: this.queryFieldsSelectorCtrl.valueChanges.pipe(startWith('')),
      query: this.queryCtrl.valueChanges.pipe(debounceTime(700)),
    }).pipe(takeUntilDestroyed());

    connect$(
      state =>
        filter$.pipe(
          map(({ queryField, query }) => {
            state.filter = { queryField: queryField as QueryField, query };

            return state;
          }),
          tap(() => this.refresh()),
        ),
      this.booksStore,
    );
  }

  refresh(): void {
    this.booksService.readMany().subscribe(books => this.$books.set(books));
  }
}
