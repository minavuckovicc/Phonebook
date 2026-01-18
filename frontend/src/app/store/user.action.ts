import { createAction, props } from "@ngrx/store";
import { User } from "../models/user";
import { UpdateUser } from "../models/updateUser";


export const loadUsers = createAction("Load Users");
export const loadUsersSuccess = createAction("Load Users Success", props<{ users: User[] }>());
export const selectUser = createAction("Select a user", props<{ userId: number }>());
export const loggedUser = createAction("Logged user", props<{ user: User }>());
export const addPhoneNumber = createAction("Add phone number", props<{ userId: number, phoneNumber: string }>());
export const addPhoneNumberSuccess = createAction("Add phone number Success", props<{ user: User }>());
export const removePhoneNumber = createAction("Remove phone number", props<{ phoneId: number, userId: number }>());
export const removePhoneNumberSuccess = createAction("Remove phone number Success", props<{ user: User }>());
export const updateUser = createAction("Update user", props<{ userId: number, addInfosId: number , updateUser: UpdateUser }>());
export const updateUserSuccess = createAction("Update user Success", props<{ user: User }>());
export const searchUsers = createAction("Search users", props<{ text: string }>());
export const searchUsersSuccess = createAction("Search users Success", props<{ users: User[], text: string }>());