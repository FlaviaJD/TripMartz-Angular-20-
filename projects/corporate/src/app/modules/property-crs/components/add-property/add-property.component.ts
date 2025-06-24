import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {

    regConfig:FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    propertyTypeList=['Resort','Apartment','Hotel','Service Apartment']
    
    constructor(
                  private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createFlightForm()
    }
  
    createFlightForm(){
      this.regConfig=this.fb.group({
          propertyType:new FormControl(''),
          propertyName:new FormControl(''),
          starRating:new FormControl(''),
          amenities:new FormControl(''),
          contractExpiryDate:new FormControl(''),
          country:new FormControl(''),
          city:new FormControl(''),
          cityCode:new FormControl(''),
          email:new FormControl(''),
          hotelContactNo:new FormControl(''),
          latitude:new FormControl(''),
          longitude:new FormControl(''),
          address:new FormControl(''),
          description:new FormControl(''),
          status:new FormControl('0'),
          image:new FormControl(''),
          thumbnails:new FormControl('')
      })
    } 
    
    uploadImage(event){

    }

    uploadThumbnail(event){

    }

    onSearchSubmit(){
    }
    
    onReset(){

    }

}
