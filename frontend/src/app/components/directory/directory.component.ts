import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, debounceTime, distinctUntilChanged, fromEvent, map, of, tap } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { loadUsers, searchUsers, selectUser, setShowCreateForm } from 'src/app/store/user.action';
import { selectLoggedUser, selectUsersList } from 'src/app/store/user.selector';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  user$: Observable<User[]> = of([]);
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    ){}

  ngOnInit(): void {
    this.user$ = this.store.select(selectUsersList);
    this.store.select(selectLoggedUser).subscribe((user) => {
      this.isAdmin = (user?.role === 'ADMIN');
    });
  }

  selectUser(user: User) {
    this.store.dispatch(
      selectUser({
        userId: user.id
      })
    );
  }

  onSignOut() {
    this.authService.logout();
  }

  onOpenCreateUser() {
    if (!this.isAdmin) return;
    this.store.dispatch(selectUser({ userId: 0 }));
    this.store.dispatch(setShowCreateForm({ show: true }));
  }
}
