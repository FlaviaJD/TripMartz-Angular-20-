import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-room-amenities-list',
  templateUrl: './room-amenities-list.component.html',
  styleUrls: ['./room-amenities-list.component.scss']
})
export class RoomAmenitiesListComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "roomAmenities", value: 'Room Amenities Name' },
        { key: "typeCode", value: 'Type Code' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {"roomAmenities":'AC',"typeCode":'RA1001',"status":1},
        {"roomAmenities":'WiFi',"typeCode":'RA2001',"status":0},
        {"roomAmenities":'Queen Bed',"typeCode":'RA1023',"status":1},
        {"roomAmenities":'Bath Tub',"typeCode":'RA3004',"status":1},
        {"roomAmenities":'Fridge',"typeCode":'RA3407',"status":0},
        {"roomAmenities":'Microwave',"typeCode":'RA6001',"status":1},
    ]

    constructor(
    ) { }

    ngOnInit() {
        this.getRoomAmenitiesList();
    }

    getRoomAmenitiesList(): void {
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
