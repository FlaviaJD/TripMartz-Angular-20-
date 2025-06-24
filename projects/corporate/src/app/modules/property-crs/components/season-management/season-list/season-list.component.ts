import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
  styleUrls: ['./season-list.component.scss']
})
export class SeasonListComponent implements OnInit {

    pageSize =6;
    page = 1;
    collectionSize: number;
    searchText='';
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'season', value: 'Seasons' },
        { key: 'fromDate', value: 'From Date' },
        { key: 'toDate', value: 'To Date' },
        { key: "status", value: 'Status' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];

    dummyData=[
        {
          "season": "Summer",
          "fromDate": "2023-06-01",
          "toDate": "2023-08-31",
          "status": 1
        },
        {
          "season": "Fall",
          "fromDate": "2023-09-01",
          "toDate": "2023-11-30",
          "status": 0
        },
        {
          "season": "Winter",
          "fromDate": "2023-12-01",
          "toDate": "2024-02-28",
          "status": 1
        },
        {
          "season": "Spring",
          "fromDate": "2024-03-01",
          "toDate": "2024-05-31",
          "status": 1
        },
        {
          "season": "Monsoon",
          "fromDate": "2024-06-01",
          "toDate": "2024-08-31",
          "status": 0
        }
    ]
      
    constructor(
                  
    ) { }
  
    ngOnInit() {
      this.getSeasonListData()
    }

    getSeasonListData(){
        this.respData=this.dummyData;
        this.noData=false;
    }

    onStatusChange(){

    }

    onEdit(){

    }

    sortData(event){

    }

    onDelete(){
        
    }

}
