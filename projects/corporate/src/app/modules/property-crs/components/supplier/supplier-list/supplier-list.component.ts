import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    showModal:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "supplierName", value: 'Supplier Name' },
        { key: "contact", value: 'Contact' },
        { key: "propertyName", value: 'Property Name' },
        { key: "noOfProperty", value: 'No Of Property' },
        { key: "noOfRooms", value: 'No. Of Rooms' },
        { key: "price", value: 'Room Price/night/Avg' },
        { key: "propertyEmail", value: 'Property Email' },
        { key: "propertyContactNo", value: 'Property Contact No.' },
        { key: "propertyContactPerson", value: 'Property Contact Person' },
        { key: "supportedDocuments", value: 'Supported Documents' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {
          "supplierName": "ABC Suppliers",
          "contact": "123-456-7890",
          "propertyName": "Luxury Villa",
          "noOfProperty": 1,
          "noOfRooms": 10,
          "price": 2000,
          "propertyEmail": "info@luxuryvilla.com",
          "propertyContactNo":12344567,
          "propertyContactPerson": "John Doe",
          "supportedDocuments": ["License", "Insurance"],
          "status": 1
        },
        {
          "supplierName": "XYZ Enterprises",
          "contact": "987-654-3210",
          "propertyName": "City Hotel",
          "noOfProperty": 2,
          "noOfRooms": 50,
          "price": 1500,
          "propertyEmail": "info@cityhotel.com",
          "propertyContactNo":98344567,
          "propertyContactPerson": "Jane Smith",
          "supportedDocuments": ["License", "Health Permit"],
          "status": 0
        },
        {
          "supplierName": "EFG Hospitality",
          "contact": "555-123-4567",
          "propertyName": "Beach Resort",
          "noOfProperty": 1,
          "noOfRooms": 20,
          "price": 3000,
          "propertyEmail": "info@beachresort.com",
          "propertyContactNo":8757644567,
          "propertyContactPerson": "Michael Johnson",
          "supportedDocuments": ["License", "Environmental Clearance"],
          "status": 1
        },
        {
          "supplierName": "PQR Resorts",
          "contact": "111-222-3333",
          "propertyName": "Mountain Lodge",
          "noOfProperty": 3,
          "noOfRooms": 30,
          "price": 1800,
          "propertyEmail": "info@mountainlodge.com",
          "propertyContactNo":896244567,
          "propertyContactPerson": "Samantha Williams",
          "supportedDocuments": ["License", "Fire Safety Certificate"],
          "status": 0
        },
        {
          "supplierName": "LMN Ventures",
          "contact": "444-555-6666",
          "propertyName": "Rural Retreat",
          "noOfProperty": 1,
          "noOfRooms": 5,
          "price": 1200,
          "propertyEmail": "info@ruralretreat.com",
          "propertyContactNo":980753567,
          "propertyContactPerson": "David Brown",
          "supportedDocuments": ["License", "Joining Approval"],
          "status": 1
        }
      ]
      

    constructor(
                private route:Router
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

    downloadSupplierInfo(){
    }

    onViewProperty(){
        this.route.navigate(['./property/view-property'])
    }

    onMoreInfo(data){
        this.showModal=true;
    }

    hide(){
        this.showModal=false;
    }

}
