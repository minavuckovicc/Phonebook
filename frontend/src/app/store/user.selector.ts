import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { User } from "../models/user";


export const selectUsersFeature = createSelector(
    (state: AppState) => state.users,
    (users) => users
);

export const selectUsersList = createSelector(
    selectUsersFeature,
    (users) => users.ids.map(id => users.entities[id])
                        .filter(user => user!=null)
                        .map((user)=><User>user)
);

export const selectSelectedUserId = createSelector(
    selectUsersFeature,
    (users) => users.selectedUser
);

export const selectSelectedUser = createSelector(
    selectUsersFeature,
    selectSelectedUserId,
    (users, userId) => users.entities[userId]
);

export const selectLoggedUser = createSelector(
    selectUsersFeature,
    (users) => users.loggedUser
);

export const searchBarValue = createSelector(
    selectUsersFeature,
    (users) => users.searchBarValue
);

/*export const selectLoggedUser = createSelector(
    selectUsersFeature,
    selectLoggedUserId,
    (users, userId) => users.entities[userId]
);*/