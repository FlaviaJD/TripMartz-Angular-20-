import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-board-type-list',
  templateUrl: './board-type-list.component.html',
  styleUrls: ['./board-type-list.component.scss']
})
export class BoardTypeListComponent implements OnInit {

    pageSize = 4;
    page = 1;
    collectionSize: number;
    searchText='';
    enableEdit:boolean;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "boardType", value: 'Board Type' },
        { key: "boardTypeCode", value: 'Board Type Code' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];

    noData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {"boardType":'Half Board',"boardTypeCode":'HB',"status":1},
        {"boardType":'Room only',"boardTypeCode":'RO',"status":0},
        {"boardType":'Bed with Breakfast',"boardTypeCode":'BB',"status":1},
        {"boardType":'Bed with Full Meals',"boardTypeCode":'BM',"status":1},
        {"boardType":'Bed with All amenities',"boardTypeCode":'BAA',"status":0},
        {"boardType":'Bed and GYM only',"boardTypeCode":'BGO',"status":1},
    ]

    constructor(
    ) { }

    ngOnInit() {
        this.getBoardTypeList();
    }

    getBoardTypeList(): void {
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
