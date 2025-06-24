import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-supplier-view-property',
  templateUrl: './supplier-view-property.component.html',
  styleUrls: ['./supplier-view-property.component.scss']
})
export class SupplierViewPropertyComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "propertNo", value: 'Property No' },
        { key: "propertyName", value: 'Property Name' },
        { key: "propertyAddress", value: 'Property Address' },
        { key: "noOfRooms", value: 'No. Of Rooms' },
        { key: "price", value: 'Room Price' },
        { key: "propertyEmail", value: 'Property Email' },
        { key: "propertyContactNo", value: 'Property Mobile No.' },
        { key: "propertyContactPerson", value: 'Property Contact Person' },
        { key: "supportedDocuments", value: 'Supported Documents' },
        { key: "status", value: 'Status' }
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {
          "propertyName": "Luxury Villa",
          "propertyAddress":'HSR Layout',
          "noOfRooms": 10,
          "price": 2000,
          "propertyEmail": "info@luxuryvilla.com",
          "propertyContactNo":12344567,
          "propertyContactPerson": "Keshav Singh",
          "status": 1
        },
        {
          "propertyName": "City Hotel",
          "propertyAddress":'Marathali',
          "noOfRooms": 50,
          "price": 1500,
          "propertyEmail": "info@cityhotel.com",
          "propertyContactNo":98344567,
          "propertyContactPerson": "Vikash Jha",
          "status": 0
        },
        {
          "propertyName": "Beach Resort",
          "propertyAddress":'Goa',
          "noOfRooms": 20,
          "price": 3000,
          "propertyEmail": "info@beachresort.com",
          "propertyContactNo":8757644567,
          "propertyContactPerson": "Chetan Prakash",
          "status": 1
        },
        {
          "propertyName": "Mountain Lodge",
          "propertyAddress":'Himachal',
          "noOfRooms": 30,
          "price": 1800,
          "propertyEmail": "info@mountainlodge.com",
          "propertyContactNo":896244567,
          "propertyContactPerson": "Manoj Yadav",
          "status": 0
        },
        {
          "propertyName": "Rural Retreat",
          "propertyAddress":'Coimbatore',
          "noOfRooms": 5,
          "price": 1200,
          "propertyEmail": "info@ruralretreat.com",
          "propertyContactNo":980753567,
          "propertyContactPerson": "Raju",
          "status": 1
        }
      ]
      

    constructor(
    ) { }

    ngOnInit() {
        this.getPropertyList();
    }

    getPropertyList(): void {
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

    downloadSupplierInfo(){
    }

    onViewProperty(){

    }

    onMoreInfo(data){

    }

}
