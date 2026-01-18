import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as UsersActions from './user.action';
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { UsersService } from "../services/users.service";

@Injectable()
export class UsersEffects {

    constructor(private actions$: Actions, private usersService: UsersService) {}
    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.loadUsers),
            mergeMap(() => 
                this.usersService.getAll().pipe(
                    map((users) => (UsersActions.loadUsersSuccess({ users: users }))),
                    catchError(() => of({ type: 'load error' }))
                )
            )
        )
    );
    addUserPhone$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.addPhoneNumber),
            mergeMap(({ userId, phoneNumber }) => 
                this.usersService.addPhoneNumber(userId, phoneNumber).pipe(
                    tap((user) => {}), // mozda fja da se azurira localStorage??
                    map((user) => (UsersActions.addPhoneNumberSuccess({ user }))),
                    catchError(() => of({ type: 'add phone error' }))
                )
            )
        )
    );
    removeUserPhone$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.removePhoneNumber),
            mergeMap(({ phoneId, userId }) => 
                this.usersService.removePhoneNumber(phoneId, userId).pipe(
                    map((user) => (UsersActions.removePhoneNumberSuccess({ user }))),
                    catchError(() => of({ type: 'remove phone error' }))
                )
            )
        )
    );
    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.updateUser),
            mergeMap(({ userId, addInfosId, updateUser }) => 
                this.usersService.updateUser(userId, addInfosId, updateUser).pipe(
                    map((user) => (UsersActions.updateUserSuccess({ user }))),
                    catchError(() => of({ type: 'update user error' }))
                )
            )
        )
    );
    searchUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.searchUsers),
            mergeMap(({ text }) => 
                this.usersService.getUsersSearch(text).pipe(
                    map((users) => (UsersActions.searchUsersSuccess({ users, text }))),
                    catchError(() => of({ type: 'search users error' }))
                )
            )
        )
    );
}