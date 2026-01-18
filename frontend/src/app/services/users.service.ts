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
