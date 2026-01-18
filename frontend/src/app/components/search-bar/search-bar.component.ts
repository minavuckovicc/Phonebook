import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { loadUsers, searchUsers } from 'src/app/store/user.action';
import { searchBarValue } from 'src/app/store/user.selector';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchBarValue: string = "";

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(searchBarValue).subscribe((text: string) => this.searchBarValue = text);

    const search: HTMLInputElement = document.querySelector(".search")!;
    fromEvent(search, "input").pipe(
      debounceTime(300),
      map((event) => (<HTMLInputElement>event.target).value),
      distinctUntilChanged()
    ).subscribe((text: string)=> this.onSearching(text));
  }

  onSearching(text: string): void {
    if (text !== "") {
      this.store.dispatch(searchUsers({ text }));
    }
    else {
      this.store.dispatch(loadUsers());
    }
  }
}
