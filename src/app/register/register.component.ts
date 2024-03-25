import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        this.redirectToLogin(username, password);
      },
      err => {
        console.log(err);
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    );
  }

  redirectToLogin(username: string, password: string) {
    this.authService.login(username, password).subscribe(
      data => {
        console.log("Login...");
        console.log(data);
        this.tokenStorage.saveToken(data["token"]);
        this.tokenStorage.saveUser(username);

        this.reloadPage();
      },
      err => {
        console.log(err);
      }
    );
  }

  reloadPage(): void {
    this.router.navigate(['/home']).then(
      () =>  window.location.reload()
    );
  }
}
