import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectoryComponent } from './components/directory/directory.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "directory",
    component: DirectoryComponent,
    outlet: "home"
  },
  {
    path: "auth",
    component: AuthComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
    outlet: "home"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
