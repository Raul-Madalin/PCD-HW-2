import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import { SocketService } from '../_services/socket.service';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';
import { SocketNewService } from '../socket-new.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent {
  title = 'clients_manager_front';
  projectId = "";
  lastProjectId = "";
  displayedColumns: string[] = ['id',  'report', 'timestamp', 'actions'];
  dataSource!: MatTableDataSource<any>;
  showList: { [key: string]: boolean } = {};
  chart: Object = [];
  tableData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private api: SocketService, private datePipe: DatePipe, private apiNew: SocketNewService) {
  }

  ngOnInit() {
      // this.socketApi.messa
  }

  toggleList(row: any): void {
    console.log("Before", this.showList);
    this.showList[row.id] = !this.showList[row.id];
    console.log("After", this.showList);
  }

  removeItem(rowId: any): void {
    console.log("Remove", rowId);
    var startMsg = {
      "action": "report_solved",
      "params": {
        "project-id": `${rowId}`
      }
    };
    const indexToRemove = this.tableData.findIndex(item => item["id"] === rowId); // Find the index of the item to remove
      if (indexToRemove !== -1) { // Check if the item exists in the list
        this.tableData.splice(indexToRemove, 1);
        this.dataSource = new MatTableDataSource<any>(this.tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.mapMonthlyDistribution(this.tableData);
      }
    this.apiNew.sendMessage(startMsg);
  }

  getSensorData() {
    if (this.projectId.length === 36) {
      this.tableData = [];
      var startMsg = {
        "action": "bind_project",
        "params": {
          "project-id": `${this.projectId}`
        }
      };
      this.apiNew.sendMessage(startMsg);
      this.apiNew.messageReceived.subscribe((res) => {
            this.tableData = this.tableData.concat(res);
            console.log("Table data: ", this.tableData);
            this.dataSource = new MatTableDataSource<any>(this.tableData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.mapMonthlyDistribution(this.tableData);
      })
      // console.log("Start msg:", startMsg);
      // this.api.subscribe();
      // this.api.sendMessage(startMsg, -1);
      // console.log("Message sent");

      // this.api.messageList$
      //   .subscribe({
      //     next: (res) => {
      //       console.log("Received data: ", res);
      //       // this.updateDates(res);
      //       this.dataSource = new MatTableDataSource<any>(res);
      //       this.dataSource.paginator = this.paginator;
      //       this.dataSource.sort = this.sort;
      //       this.mapMonthlyDistribution(res);
            
      //     },
      //     error: (err) => {
      //       alert("Error while fetching the Records");
      //     }
      //   })
    }
  }

  onInputChange() {
    if (this.projectId.length === 36) {
      this.lastProjectId = this.projectId;
      console.log("Input project changed");
      this.getSensorData();
    } 
  }


  extractYearAndMonth(originalDateString: any): string {
    // Convert the string to a Date object
    const dateObject = new Date(originalDateString * 1000);

    // Format the Date object to get the year and month
    const formattedDate = this.datePipe.transform(dateObject, 'yyyy-MM-dd HH:mm:ss');

    console.log(formattedDate); // Output: 2023-12
    if (formattedDate == null) {
      return "";
    }
    return formattedDate;
  }

  mapMonthlyDistribution(res: any) {
    console.log("Typeof", typeof(res));
    const values: number[] = [];
    const intervalsCount = new Map<string, number>();


    for (const measure of res) {
      let value = this.extractYearAndMonth(measure["timestamp"]);

      if (intervalsCount.has(value)) {
        // Number is already in the map, increase the count
        const currentCount = intervalsCount.get(value) || 0;
        intervalsCount.set(value, currentCount + 1);
      } else {
        // Number is not in the map, create a new entry with count 1
        intervalsCount.set(value, 1);
      }
    }
    const sortedEntries = [...intervalsCount.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    console.log(sortedEntries);
    
    if (!(this.chart instanceof Chart)) {
    this.chart = new Chart('time-series', {
      type : 'line',
      data : {
        labels : sortedEntries.map(e => e[0]),
        datasets : [
            {
              data : sortedEntries.map(e => e[1]),
              label : "Events distribution",
              fill : false
            }]
      },
      options : {
        backgroundColor: "purple"
        // title : {
        //   display : true,
        //   text : 'Chart JS Line Chart Example'
        // }
      }
    });
  } else {
    this.chart.data.labels = sortedEntries.map(e => e[0]);
    this.chart.data.datasets[0].data = sortedEntries.map(e => e[1]);
    this.chart.update();
  }
}
}
