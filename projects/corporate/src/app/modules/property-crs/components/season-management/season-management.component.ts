import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-season-management',
  templateUrl: './season-management.component.html',
  styleUrls: ['./season-management.component.scss']
})
export class SeasonManagementComponent implements OnInit {

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
        seasonName:new FormControl(''),
        startDate:new FormControl(''),
        endDate:new FormControl(''),
        status:new FormControl('0')
      })
    } 
    
    uploadImage(event){

    }

    onBack(){
    }
    
    onAddSeason(){

    }

}
