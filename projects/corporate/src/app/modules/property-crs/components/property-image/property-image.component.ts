import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-image',
  templateUrl: './property-image.component.html',
  styleUrls: ['./property-image.component.scss']
})
export class PropertyImageComponent implements OnInit {

    addImage:boolean;
    pageSize =2;
    page = 1;
    collectionSize: number;
    searchText='';
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'image', value: 'Image Preview' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    dummyData=[
        {
          "image": ""
        },
        {
          "image": ""
        },
        {
          "image": ""
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
        this.collectionSize=this.respData.length;
    }

    uploadImage(event){

    }

    sortData(event){

    }

    onSubmit(){

    }

    onDelete(){
        
    }

}
