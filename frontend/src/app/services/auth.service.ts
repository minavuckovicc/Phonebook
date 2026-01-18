import { Injectable } from '@angular/core';
import { NewUser } from '../models/newUser';
import { BehaviorSubject, Observable, from, map, of, switchMap, take, tap } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { evnironment } from 'src/environments/environment';
import { UserResponse } from '../models/userResponse';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    )
  }

  constructor(private http: HttpClient, private router: Router) { }

  register(newUser: NewUser): Observable<User> {
    return this.http
    .post<User>(
      `${evnironment.api}/auth/register`, 
      newUser, 
      this.httpOptions
    ).pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
    .post<{ token: string }>(
      `${evnironment.api}/auth/login`, 
      { email, password }, 
      this.httpOptions
    )
    .pipe(
      take(1),
      tap((response: { token: string }) => {
        localStorage.setItem(
          'token',
          response.token,
        );
        const decodedToken: UserResponse = jwt_decode(response.token);
        this.user$.next(decodedToken.user);
      })
    );
  }

  isTokenInStorage(): Observable<boolean> {
    return of(localStorage.getItem('token')).pipe(
      map((value: string | null) => {
        if (!value) return false;

        const decodedToken: UserResponse = jwt_decode(value);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if(isExpired) return false;
        if(decodedToken.user) {
          this.user$.next(decodedToken.user);
        }
        return true;
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth');
  }
}

