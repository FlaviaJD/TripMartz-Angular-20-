import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

    pageSize =6;
    page = 1;
    collectionSize: number;
    searchText='';
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'roomName', value: 'Room Name' },
        { key: 'boardTypeName', value: 'Board Type Name' },
        { key: 'maximunPassengers', value: 'Maximum Passengers' },
        { key: 'noOfRooms', value: 'No of Rooms' },
        { key: "status", value: 'Status' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];

    dummyData=[
        {
          "roomName": "Standard",
          "boardTypeName": "RO,BB,HB",
          "maximunPassengers": 3,
          "noOfRooms": 1,
          "status": 1
        },
        {
            "roomName": "Delux",
            "boardTypeName": "RO,BB,HB",
            "maximunPassengers": 4,
            "noOfRooms": 2,
            "status": 1
        },
        {
            "roomName": "Delux",
            "boardTypeName": "RO,HB",
            "maximunPassengers": 2,
            "noOfRooms": 1,
            "status": 0
        },
        {
            "roomName": "Standard",
            "boardTypeName": "BB,HB",
            "maximunPassengers": 3,
            "noOfRooms": 1,
            "status": 0
        },
        {
            "roomName": "Luxury",
            "boardTypeName": "RO,BB,HB",
            "maximunPassengers": 10,
            "noOfRooms": 5,
            "status": 1
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
