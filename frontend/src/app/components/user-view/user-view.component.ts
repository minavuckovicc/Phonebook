import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { loadUsers, selectUser } from 'src/app/store/user.action';
import { setShowCreateForm } from 'src/app/store/user.action';
import { selectLoggedUser, selectSelectedUser, selectShowCreateForm } from 'src/app/store/user.selector';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  @ViewChild('adminForm') adminForm!: NgForm;

  @Input() user: User | null = null;
  userId: number = 0;
  loggedUser: User | null = null;
  isAdmin = false;
  isEditing = false;
  showCreateForm = false;
  phoneNumberDraft: string = "";

  constructor(
    private store: Store<AppState>,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.store.select(selectSelectedUser).subscribe((user) => {
      if(user){
        this.user = user;
      }
    });

    this.store.select(selectLoggedUser).subscribe((user) => {
      this.loggedUser = user;
      this.isAdmin = (user?.role === 'ADMIN');
    });

    this.store.select(selectShowCreateForm).subscribe((show) => {
      this.showCreateForm = show;
      if (show) {
        this.isEditing = false;
        this.user = null;
      }
    });
  }

  getDateString(): string {
    if(this.user) {
      if (this.user.additionalInfos.birthDate == null) return "";
      let userBDate = new Date(this.user.additionalInfos.birthDate);
      if(userBDate) {
        let day = userBDate.getDate();
        let month = userBDate.getMonth();
        month++;
        let year = userBDate.getFullYear();
        return day + "." + month + "." + year + ".";
      }
      else
        return "";
    }
    else
      return "";
  }

  startEdit() {
    if (!this.isAdmin || !this.user) return;
    this.isEditing = true;
    this.store.dispatch(setShowCreateForm({ show: false }));
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.adminForm) this.adminForm.resetForm();
  }

  openCreateUser() {
    if (!this.isAdmin) return;
    this.isEditing = false;
    this.user = null;
    this.store.dispatch(selectUser({ userId: 0 }));
    this.store.dispatch(setShowCreateForm({ show: true }));
    if (this.adminForm) this.adminForm.resetForm();
  }

  closeCreateUser() {
    this.store.dispatch(setShowCreateForm({ show: false }));
    if (this.adminForm) this.adminForm.resetForm();
  }

  saveEdit() {
    if (!this.isAdmin || !this.user) return;
    const addInfosId = this.user.additionalInfos?.id;
    if (!addInfosId) return;

    let { firstName, lastName, birthDate, description } = this.adminForm.value;

    // Keep existing values when admin leaves fields empty.
    firstName = !firstName ? this.user.firstName : firstName;
    lastName = !lastName ? this.user.lastName : lastName;
    birthDate = (!birthDate && this.user.additionalInfos) ? this.user.additionalInfos.birthDate : birthDate;
    description = (!description && this.user.additionalInfos) ? this.user.additionalInfos.description : description;

    this.usersService.updateUser(this.user.id, addInfosId, {
      firstName,
      lastName,
      updateAdditionalInfos: {
        birthDate,
        description,
      }
    }).pipe(take(1)).subscribe(() => {
      this.isEditing = false;
      this.store.dispatch(loadUsers());
    });
  }

  addPhoneToSelected() {
    if (!this.isAdmin || !this.user) return;
    if (!this.phoneNumberDraft) return;
    this.usersService.addPhoneNumber(this.user.id, this.phoneNumberDraft)
      .pipe(take(1))
      .subscribe((user) => {
        this.user = user;
        this.phoneNumberDraft = "";
        this.store.dispatch(loadUsers());
      });
  }

  removePhoneFromSelected(phoneId: number) {
    if (!this.isAdmin || !this.user) return;
    this.usersService.removePhoneNumber(phoneId, this.user.id)
      .pipe(take(1))
      .subscribe((user) => {
        this.user = user;
        this.store.dispatch(loadUsers());
      });
  }

  deleteSelectedUser() {
    if (!this.isAdmin || !this.user) return;
    if (this.loggedUser?.id === this.user.id) return;
    this.usersService.deleteUser(this.user.id).pipe(take(1)).subscribe(() => {
      this.store.dispatch(loadUsers());
      this.store.dispatch(selectUser({ userId: 0 }));
      this.user = null;
      this.isEditing = false;
    });
  }

  addNewUser() {
    if (!this.isAdmin) return;
    const { newFirstName, newLastName, newEmail, newPassword, newBirthDate, newDescription, newPhoneNumber } = this.adminForm.value;
    if (!newFirstName || !newLastName || !newEmail || !newPassword) return;

    const phoneNumbers = newPhoneNumber ? [newPhoneNumber] : [];

    this.usersService.createUser({
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      password: newPassword,
      birthDate: newBirthDate ?? null,
      description: newDescription ?? "",
      phoneNumbers,
    }).pipe(take(1)).subscribe(() => {
      this.store.dispatch(loadUsers());
      this.adminForm.resetForm();
      this.store.dispatch(setShowCreateForm({ show: false }));
    });
  }

  setSelectedInputDateValue(): string {
    let date: Date = new Date();
    if (this.user && this.user.additionalInfos && this.user.additionalInfos.birthDate) {
      date = new Date(this.user.additionalInfos.birthDate);
    }
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
