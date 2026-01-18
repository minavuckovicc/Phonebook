import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/store/user.selector';
import { AppState } from 'src/app/app.state';
import { addPhoneNumber, removePhoneNumber, updateUser } from 'src/app/store/user.action';
import { UpdateUser } from 'src/app/models/updateUser';
import { UpdateAdditionalInfos } from 'src/app/models/updateAdditionalInfos';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('form') form!: NgForm;
  user: User | null = null;

  constructor(
    private authService: AuthService, 
    private store: Store<AppState>
    ) {}

  ngOnInit(): void {
    this.store.select(selectLoggedUser).subscribe((user) => {
      if(user){
        this.user = user;
      }
    });
  }

  onSignOut() {
    this.authService.logout();
  }

  onUpdate() {
    let { firstName, lastName, email, birthDate, description } = this.form.value;
    firstName = !firstName ? this.user?.firstName : firstName;
    lastName = !lastName ? this.user?.lastName : lastName;
    email = !email ? this.user?.email : email;
    birthDate = (!birthDate && this.user?.additionalInfos) ? this.user?.additionalInfos.birthDate : birthDate;
    description = (!description && this.user?.additionalInfos) ? this.user?.additionalInfos.description : description;

    const updateAddInfos : UpdateAdditionalInfos = {
      birthDate: birthDate,
      description: description
    }
    const updtUser: UpdateUser = {
      firstName: firstName,
      lastName: lastName,
      updateAdditionalInfos: updateAddInfos
    }
    if(this.user) {
      this.store.dispatch(updateUser({ userId: this.user.id, addInfosId: this.user.additionalInfos.id, updateUser: updtUser }));
    }
  }

  onCancel() {
    this.form.resetForm();
  }

  onAdd() {
    const { phoneNumber } = this.form.value;
    if (!phoneNumber || !this.user) return;
    
    this.store.dispatch(addPhoneNumber({ userId: this.user.id, phoneNumber }));

    this.form.reset(phoneNumber);
  }

  onRemove(phoneId: number) {
    if(this.user) {
      this.store.dispatch(removePhoneNumber({ phoneId: phoneId, userId: this.user.id }));
    }
    
  }

  setInputDateValue () {
    let date: Date = new Date();
    if (this.user && this.user.additionalInfos && this.user.additionalInfos.birthDate) {
      date = new Date(this.user!.additionalInfos.birthDate);
    }
    
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }

  padTo2Digits(num:number) {
    return num.toString().padStart(2, '0');
  }

}

