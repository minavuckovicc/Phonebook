import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { loadUsers, loggedUser } from 'src/app/store/user.action';
import jwt_decode from 'jwt-decode';
import { UserResponse } from 'src/app/models/userResponse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadUsers());
    const value = localStorage.getItem('token');
    const decodedToken: UserResponse = jwt_decode(value!);
    this.store.dispatch(
      loggedUser({
        user: decodedToken.user
      })
    );
  }

}
