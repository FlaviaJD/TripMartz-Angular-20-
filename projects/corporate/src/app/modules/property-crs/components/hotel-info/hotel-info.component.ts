import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hotel-info',
  templateUrl: './hotel-info.component.html',
  styleUrls: ['./hotel-info.component.scss']
})
export class HotelInfoComponent implements OnInit {

    regConfig:FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    propertyTypeList=['Single','Double','Delux','Luxury']
    
    constructor(
                  private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createFlightForm()
    }
  
    createFlightForm(){
      this.regConfig=this.fb.group({
        hotelType:new FormControl(''),
        hoteCode:new FormControl(''),
        hotelName:new FormControl(''),
        starRating:new FormControl(''),
        amenities:new FormControl(''),
        contractExpiryDate:new FormControl(''),
        country:new FormControl(''),
        city:new FormControl(''),
        cityCode:new FormControl(''),
        email:new FormControl(''),
        latitude:new FormControl(''),
        longitude:new FormControl(''),
        address:new FormControl(''),
        description:new FormControl(''),
        status:new FormControl('0'),
        image:new FormControl('')
      })
    } 
    
    uploadImage(event){

    }

    onSearchSubmit(){
    }
    
    onReset(){

    }

}
