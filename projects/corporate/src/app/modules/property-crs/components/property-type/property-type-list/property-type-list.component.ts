import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-property-type-list',
  templateUrl: './property-type-list.component.html',
  styleUrls: ['./property-type-list.component.scss']
})
export class PropertyTypeListComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "propertyType", value: 'Property Type' },
        { key: "propertyTypeCode", value: 'Property Type Code' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {"propertyType":'Resort',"propertyTypeCode":'HB1001',"status":1},
        {"propertyType":'Luxury Apartment',"propertyTypeCode":'HB2001',"status":0},
        {"propertyType":'Service Home',"propertyTypeCode":'HB1023',"status":1},
        {"propertyType":'Tree House',"propertyTypeCode":'HB3004',"status":1},
        {"propertyType":'Water Villa',"propertyTypeCode":'HB3407',"status":0},
        {"propertyType":'Hotel',"propertyTypeCode":'HB6001',"status":1},
    ]

    constructor(
    ) { }

    ngOnInit() {
        this.getPropertyTypeList();
    }

    getPropertyTypeList(): void {
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
