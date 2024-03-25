import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isInted = false;
  isLoggedIn = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService, private router: Router, private authService:SocialAuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log("This is the user", user);
      
      this.tokenStorage.saveToken(user["idToken"]);
      this.tokenStorage.saveUser(user["lastName"]);
      this.router.navigate(['/']).then( 
        () => window.location.reload());
      
      //perform further logics
    });

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.isInted = true;
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      console.log("user is", user);
      this.username = user;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/']).then( 
      () => window.location.reload());
  }
}
