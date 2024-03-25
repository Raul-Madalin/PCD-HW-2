import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SensorsService} from "../_services/sensors.service";
import { Chart, registerables } from 'chart.js';
import { DatePipe } from '@angular/common';
import { SocketService } from '../_services/socket.service';
import { webSocket } from 'rxjs/webSocket';

Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  title = 'clients_manager_front';


  constructor(private api: SocketService, private datePipe: DatePipe) {
  }
}
