import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from 'src/app/models/newUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  @ViewChild('form') form!: NgForm;

  submissionType: 'login' | 'register' = 'login';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) return;

    if (this.submissionType === 'login') {
      this.authService.login(email, password).subscribe(() => {
        this.router.navigateByUrl(`/home(home:directory)`);
      });
      return;
    } else if (this.submissionType === 'register') {
      const { firstName, lastName } = this.form.value;
      if (!firstName || !lastName) return;
      
      const newUser: NewUser = { firstName, lastName, email, password};
      
      /*return*/ this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });
    }
  }

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'register';
    } else if (this.submissionType === 'register') {
      this.submissionType = 'login';
    }
  }
}
