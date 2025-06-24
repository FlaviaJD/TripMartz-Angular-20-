import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {

    regConfig:FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    pageSize =6;
    page = 1;
    collectionSize: number;
    searchText='';
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'propertyCode', value: 'Property Code' },
        { key: 'propertyName', value: 'Property Name' },
        { key: 'propertyEmail', value: 'Property Email' },
        { key: 'propertyContact', value: 'Property Contact' },
        { key: "city", value: 'City' },
        { key: 'country', value: 'Country' },
        { key: 'city Code', value: 'City Code' },
        { key: 'address', value: 'Address' },
        { key: 'display', value: 'Display Image' },
        { key: 'thumbImage', value: 'Thumb Image' },
        { key: 'status', value: 'Status' },
        { key: 'edit', value: 'Edit' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];

    dummyData=[
            {
              "propertyCode": "AB123C",
              "propertyName": "Sunny Heights Apartments",
              "propertyEmail": "sunny@example.com",
              "propertyContact": "+1 (123) 456-7890",
              "city": "Los Angeles",
              "country": "United States",
              "cityCode": "LAX",
              "address": "1234 Elm Street",
              "display":"",
              "thumbImage":"",
               "status":1
            },
            {
              "propertyCode": "XY789Z",
              "propertyName": "Maple Grove Estates",
              "propertyEmail": "maple@example.com",
              "propertyContact": "+1 (987) 654-3210",
              "city": "Toronto",
              "country": "Canada",
              "cityCode": "TOR",
              "address": "567 Oak Avenue",
              "display":"",
              "thumbImage":"",
               "status":0

            },
            {
              "propertyCode": "PQ456R",
              "propertyName": "Riverside Villas",
              "propertyEmail": "riverside@example.com",
              "propertyContact": "+44 (20) 1234-5678",
              "city": "London",
              "country": "United Kingdom",
              "cityCode": "LON",
              "address": "789 River Road",
              "display":"",
              "thumbImage":"",
               "status":1
            },
            {
              "propertyCode": "JK012L",
              "propertyName": "Hilltop Residences",
              "propertyEmail": "hilltop@example.com",
              "propertyContact": "+33 (1) 23-45-67-89",
              "city": "Paris",
              "country": "France",
              "cityCode": "PAR",
              "address": "101 Hillside Drive",
              "display":"",
              "thumbImage":"",
               "status":1
            },
            {
              "propertyCode": "MN345O",
              "propertyName": "Green Valley Apartments",
              "propertyEmail": "green@example.com",
              "propertyContact": "+49 (30) 9876-5432",
              "city": "Berlin",
              "country": "Germany",
              "cityCode": "BER",
              "address": "456 Green Street",
              "display":"",
              "thumbImage":"",
               "status":0
            },
            {
              "propertyCode": "CD678E",
              "propertyName": "Palm Oasis Condos",
              "propertyEmail": "palm@example.com",
              "propertyContact": "+34 (91) 234-5678",
              "city": "Madrid",
              "country": "Spain",
              "cityCode": "MAD",
              "address": "789 Palm Avenue",
              "display":"",
              "thumbImage":"",
               "status":1
            },
            {
              "propertyCode": "FG901H",
              "propertyName": "Mountain View Estates",
              "propertyEmail": "mountain@example.com",
              "propertyContact": "+39 (06) 1234-5678",
              "city": "Rome",
              "country": "Italy",
              "cityCode": "ROM",
              "address": "123 Mountain Road",
              "display":"",
              "thumbImage":"",
               "status":1
            },
            {
              "propertyCode": "RS234T",
              "propertyName": "Sunset Heights Residences",
              "propertyEmail": "sunset@example.com",
              "propertyContact": "+81 (3) 1234-5678",
              "city": "Tokyo",
              "country": "Japan",
              "cityCode": "TOK",
              "address": "789 Sunset Boulevard",
              "display":"",
              "thumbImage":"",
               "status":1
            },
            {
              "propertyCode": "UV567W",
              "propertyName": "Oceanfront Villas",
              "propertyEmail": "ocean@example.com",
              "propertyContact": "+61 (2) 9876-5432",
              "city": "Sydney",
              "country": "Australia",
              "cityCode": "SYD",
              "address": "567 Ocean Avenue",
              "display":"",
              "thumbImage":"",
               "status":1
            },
            {
              "propertyCode": "EF890Q",
              "propertyName": "Meadowbrook Residency",
              "propertyEmail": "meadow@example.com",
              "propertyContact": "+82 (2) 3456-7890",
              "city": "Seoul",
              "country": "South Korea",
              "cityCode": "SEL",
              "address": "101 Meadow Lane",
              "display":"",
              "thumbImage":"",
               "status":1
            }  
    ]
      

    constructor(
                  private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createFlightForm()
      this.getPropertyListData()
    }
  
    createFlightForm(){
      this.regConfig=this.fb.group({
          propertyName:new FormControl(''),
          propertyCode:new FormControl(''),
          cityCode:new FormControl('')
      })
    } 

    getPropertyListData(){
        this.noData=false;
        this.respData=this.dummyData;
        this.collectionSize=this.respData.length;
    }

    onSearchSubmit(){

    }

    sortData(event){

    }

    exportExcel(){

    }
    
    onReset(){

    }

    exportAsExcel(){

    }

    onDelete(){

    }
}
