import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-room-meal-type-list',
  templateUrl: './room-meal-type-list.component.html',
  styleUrls: ['./room-meal-type-list.component.scss']
})
export class RoomMealTypeListComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "mealType", value: 'Meal Type' },
        { key: "typeCode", value: 'Meal Code' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {"mealType":'Veg',"typeCode":'MT1001',"status":1},
        {"mealType":'Non-Veg',"typeCode":'MT2001',"status":0},
        {"mealType":'Jainism Food',"typeCode":'MT1023',"status":1},
        {"mealType":'Budhist Food',"typeCode":'MT3004',"status":1},
        {"mealType":'North Indian Thali',"typeCode":'MT3407',"status":0},
        {"mealType":'South Indian Thali',"typeCode":'MT6001',"status":1},
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
