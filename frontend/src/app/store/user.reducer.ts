import { createReducer, on } from "@ngrx/store";
import * as Actions from "./user.action";
import { User } from "../models/user";
import { EntityState, createEntityAdapter } from "@ngrx/entity";

export interface UsersState extends EntityState<User> {
    selectedUser: number;
    loggedUser: User | null;
    searchBarValue: string;
}

export const adapter = createEntityAdapter<User>();

export const initialState: UsersState = adapter.getInitialState({
    selectedUser: 0,
    loggedUser: null,
    searchBarValue: ""
});

export const usersReducer = createReducer(
    initialState,
    on(Actions.selectUser, (state, {userId}) => {
        return {
            ...state,
            selectedUser: userId
        };
    }),
    on(Actions.loggedUser, (state, {user}) => {
        return {
            ...state,
            loggedUser: user
        };
    }),
    on(Actions.loadUsersSuccess, (state, {users}) => 
        adapter.setAll(users, state)
    ),
    on(Actions.addPhoneNumberSuccess, (state, {user}) => 
        adapter.updateOne({
            id: user.id,
            changes: {
                phones: user.phones
            }
        }, {...state, loggedUser: user})
    ),
    on(Actions.removePhoneNumberSuccess, (state, {user}) => 
        adapter.updateOne({
            id: user.id,
            changes: {
                phones: user.phones
            }
        }, {...state, loggedUser: user})
    ),
    on(Actions.updateUserSuccess, (state, {user}) => 
        adapter.updateOne({
            id: user.id,
            changes: {
                firstName: user.firstName,
                lastName: user.lastName,
                additionalInfos: user.additionalInfos,
            }
        }, {...state, loggedUser: user})
    ),
    on(Actions.searchUsersSuccess, (state, {users, text}) => 
        adapter.setAll(users, {...state, searchBarValue: text})
    ),
);