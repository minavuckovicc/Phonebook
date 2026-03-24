import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { User } from "../models/user";

//vraća deo globalnog stanja koji se odnosi na korisnike
export const selectUsersFeature = createSelector(
    (state: AppState) => state.users,
    (users) => users
);
//selector transformiše entitete u niz pogodan za prikaz u UI-ju(koristim NgRX entity)
export const selectUsersList = createSelector(
    selectUsersFeature,
    (users) => {
        const loggedUser = users.loggedUser;
        return users.ids
            .map(id => users.entities[id])
            .filter(user => user != null)
            .map((user) => <User>user)
            .filter((user) => {
                // Obican korisnik ne vidi sebe u imeniku.
                if (!loggedUser) return true;
                if (loggedUser.role === 'ADMIN') return true;
                return user.id !== loggedUser.id;
            });
    }
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
//Ovaj selector omogućava čitanje trenutne vrednosti search bara iz store-a.
export const searchBarValue = createSelector(
    selectUsersFeature,
    (users) => users.searchBarValue
);

export const selectShowCreateForm = createSelector(
    selectUsersFeature,
    (users) => users.showCreateForm
);

/*export const selectLoggedUser = createSelector(
    selectUsersFeature,
    selectLoggedUserId,
    (users, userId) => users.entities[userId]
);*/