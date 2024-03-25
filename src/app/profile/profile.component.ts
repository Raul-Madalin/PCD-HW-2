import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  })
export class ProfileComponent implements OnInit {
  currentUser: any;
  ip: any;  
  constructor(private http: HttpClient, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getIPAddress().subscribe(
      (res: any) =>  {
        this.ip = res["ip"]; 
      }
    );
  }

  getIPAddress()  
  {  
    return this.http.get("http://api.ipify.org/?format=json");  
  } 
}
