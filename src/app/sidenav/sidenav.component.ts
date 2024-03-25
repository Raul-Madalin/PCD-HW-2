import {Component, OnInit} from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { TablesComponent } from '../tables/tables.component';
import { THomeComponent } from '../t-home/t-home.component';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements  OnInit{
  dummyComponent = Object();
  isLoggedIn = false;
  constructor(private tokenStorageService: TokenStorageService) {

  }

  ngOnInit() {
    this.dummyComponent = THomeComponent;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  assignComponent(component: string) {
    if (component === 'dashboard') {
      this.dummyComponent = DashboardComponent;
    } else if (component === 'sensors') {
      this.dummyComponent = TablesComponent;
    } else if (component === 't-home'){
      this.dummyComponent = THomeComponent;
    }
  }
}
