import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-property-amenities-list',
  templateUrl: './property-amenities-list.component.html',
  styleUrls: ['./property-amenities-list.component.scss']
})
export class PropertyAmenitiesListComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "propertyAmenities", value: 'Hotel Amenities' },
        { key: "typeCode", value: 'Type Code' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {"propertyAmenities":'Parking',"typeCode":'Ha1001',"status":1},
        {"propertyAmenities":'GYM Apartment',"typeCode":'Ha2001',"status":0},
        {"propertyAmenities":'Sunset View',"typeCode":'HA1023',"status":1},
        {"propertyAmenities":'CCTV',"typeCode":'HA3004',"status":1},
        {"propertyAmenities":'Cultural Night Event',"typeCode":'HA3407',"status":0},
        {"propertyAmenities":'Rooftop Dining',"typeCode":'HA6001',"status":1},
    ]

    constructor(
    ) { }

    ngOnInit() {
        this.getPropertyAmenitiesList();
    }

    getPropertyAmenitiesList(): void {
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
