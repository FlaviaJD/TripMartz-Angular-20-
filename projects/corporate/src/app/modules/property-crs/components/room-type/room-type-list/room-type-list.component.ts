import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-room-type-list',
  templateUrl: './room-type-list.component.html',
  styleUrls: ['./room-type-list.component.scss']
})
export class RoomTypeListComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "roomType", value: 'Room Type' },
        { key: "roomTypeCode", value: 'Room Type Code' },
        { key: "propertyType", value: 'Property Type' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {"roomType":'Duplex',"roomTypeCode":"RT1005","propertyType":'Resort',"status":1},
        {"roomType":'1 BHk',"roomTypeCode":"RT2205","propertyType":'Luxury Apartment',"status":0},
        {"roomType":'2 BHK',"roomTypeCode":"RT1405","propertyType":'Service Home',"status":1},
        {"roomType":'3 BHK',"roomTypeCode":"RT2105","propertyType":'Tree House',"status":1},
        {"roomType":'1 RK',"roomTypeCode":"RT4305","propertyType":'Water Villa',"status":0},
        {"roomType":'Single',"roomTypeCode":"RT7805","propertyType":'Hotel',"status":1},
    ]

    constructor(
    ) { }

    ngOnInit() {
        this.getRoomTypeList();
    }

    getRoomTypeList(): void {
        setTimeout(() => {
            this.respData=this.dummyData;
            this.noData=false;
            this.collectionSize = this.respData.length;
        }, 1000);
    }

    onEdit(){
        this.enableEdit=true;
    }

    onSave(data): void {
        
    }

    onCancelEdit(){
        this.enableEdit=false;
    }

    onDelete(data){

    }

    sortData(sort: Sort) {
        
    }

}
