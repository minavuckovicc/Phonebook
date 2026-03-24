import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { evnironment } from 'src/environments/environment';
import { Observable, from, of, take, zip } from 'rxjs';
import { map } from 'rxjs';
import { UpdateUser } from '../models/updateUser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) { }

  getAll(){
    // fetch API (umesto HttpClient) - demonstrira async poziv i Promise.
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return from(
      fetch(evnironment.api + "/users", { headers }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load users");
        }
        return res.json() as Promise<User[]>;
      })
    );
  }

  createUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate?: string;
    description?: string;
    phoneNumbers?: string[];
  }): Observable<User> {
    return this.httpClient
    .post<User>(
      `${evnironment.api}/users`,
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        additionalInfos: {
          birthDate: payload.birthDate ?? null,
          description: payload.description ?? "",
        },
        phones: (payload.phoneNumbers ?? [])
          .filter((p) => !!p)
          .map((p) => ({ number: p })),
      },
      this.httpOptions
    ).pipe(take(1));
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient
    .delete(`${evnironment.api}/users/${userId}`)
    .pipe(take(1));
  }

  addPhoneNumber(userId: number, phoneNumber: string): Observable<User> {
    return this.httpClient
    .post<User>(
      `${evnironment.api}/users/${userId}`, 
      { number: phoneNumber }, 
      this.httpOptions
    ).pipe(take(1));
  }

  removePhoneNumber(phoneId: number, userId: number): Observable<User> {
    return this.httpClient
    .delete<User>(
      `${evnironment.api}/users/removePhone/${phoneId}/${userId}`
    ).pipe(take(1));
  }

  updateUser(userId: number, addInfosId: number, updateUser: UpdateUser): Observable<User> {
    return this.httpClient
    .put<User>(
      `${evnironment.api}/users/${userId}/${addInfosId}`, 
      { 
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        additionalInfos: {
          birthDate: updateUser.updateAdditionalInfos.birthDate,
          description: updateUser.updateAdditionalInfos.description
        }
      }, 
      this.httpOptions
    ).pipe(take(1));
  }

  getUsersSearch(text: string){
    const users$ = this.httpClient.get<User[]>(
      evnironment.api + `/users/search/${text}`
    );
    // Zip spaja dva izvora (rezultat pretrage + prosledjeni tekst) u jedan stream.
    return zip(users$, of(text)).pipe(
      map(([users]) => users)
    );
  }

}
