import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.scss']
})
export class PriceManagementComponent implements OnInit {

    regConfig:FormGroup;
    fliterConfig:FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    propertName='HomelyRest';
    roomName='Luxury Twin Sharing';
    roomType='Luxury'
    seasonList=['Generic','Winter','Summer','Raining'];
    pageSize =6;
    page = 1;
    collectionSize: number;
    searchText='';
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'availableDate', value: 'Available Date' },
        { key: 'noOfRooms', value: 'No. Of Rooms' },
        { key: 'blockRoom', value: 'Block Room' },
        { key: 'bookedRoom', value: 'Booked Room' },
        { key: "singleRoom", value: 'Single Room(BB)' },
        { key: 'doubleRoom', value: 'Double Room' },
        { key: 'adultExtraPrice', value: 'Adult Extra Price' },
        { key: 'childWithBed', value: 'Child With Bed' },
        { key: 'childWithoutBed', value: 'Child Without Bed' },
        { key: 'RO', value: 'RO' },
        { key: 'HB', value: 'HB' },
        { key: 'serviceTax', value: 'Service Tax' },
        { key: 'gst', value: 'GST' },
        { key: 'stopScale', value: 'Stop Scale' },
        { key: 'action', value: 'Action' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    filter:boolean;
    
    constructor(
        private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createPriceForm()
      this.createFilterForm();
      this.getPriceList();
    }
  
    createPriceForm(){
      this.regConfig=this.fb.group({
        selectSeason:new FormControl(''),
        availableFromDate:new FormControl(''),
        availableToDate:new FormControl(''),
        noOfRooms:new FormControl(''),
        blockRoom:new FormControl(''),
        singleRoom:new FormControl(''),
        doubleRoom:new FormControl(''),
        RO:new FormControl(''),
        HB:new FormControl(''),
        adultExtraPrice:new FormControl(''),
        childWithBed:new FormControl(''),
        childWithoutBed:new FormControl(''),
        gst:new FormControl(''),
        serviceTax:new FormControl(''),
        stopScale:new FormControl('')
      })
    }

    createFilterForm(){
        this.fliterConfig=this.fb.group({
            availableFromDate:new FormControl(''),
            availableToDate:new FormControl(''),
            noOfRooms:new FormControl(''),
            blockRoom:new FormControl(''),
            singleRoom:new FormControl(''),
            doubleRoom:new FormControl(''),
        })
    }
    
    onSubmit(){
    }

    getPriceList(){
        this.noData=false;
    }

    onSearchSubmit(){

    }

    sortData(event){

    }

    exportExcel(){

    }
    
    onReset(){

    }

    onDelete(){

    }

}
