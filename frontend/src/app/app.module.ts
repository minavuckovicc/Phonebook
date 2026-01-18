import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { HttpClientModule } from '@angular/common/http'
import { UserViewComponent } from './components/user-view/user-view.component';
import { DirectoryItemComponent } from './components/directory-item/directory-item.component';
import { StoreModule } from '@ngrx/store';
import { usersReducer } from './store/user.reducer';
import { AppState } from './app.state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from './store/user.effects';
import { AuthModule } from './components/auth/auth.module';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    DirectoryComponent,
    UserViewComponent,
    DirectoryItemComponent,
    ProfileComponent,
    HomeComponent,
    SearchBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot<AppState>({ users: usersReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    EffectsModule.forRoot([UsersEffects]),
    AuthModule,
    FormsModule,
    BrowserAnimationsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
