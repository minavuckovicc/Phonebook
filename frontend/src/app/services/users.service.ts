import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { evnironment } from 'src/environments/environment';
import { Observable, take } from 'rxjs';
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
    return this.httpClient
    .get<User[]>(evnironment.api + "/users");
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
    return this.httpClient
    .get<User[]>(evnironment.api + `/users/search/${text}`);
  }

}
