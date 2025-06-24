import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-season',
  templateUrl: './add-season.component.html',
  styleUrls: ['./add-season.component.scss']
})
export class AddSeasonComponent implements OnInit {

  
    regConfig:FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    seasonList=['Generic','Winter','Summer','Raining']
    
    constructor(
                  private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createSeasontForm()
    }
  
    createSeasontForm(){
      this.regConfig=this.fb.group({
        selectSeason:new FormControl(''),
        startDate:new FormControl(''),
        endDate:new FormControl(''),
        noOfRooms:new FormControl(''),
        singleRoom:new FormControl(''),
        sRO:new FormControl(''),
        sHB:new FormControl(''),
        doubleRoom:new FormControl(''),
        dRO:new FormControl(''),
        dHB:new FormControl(''),
        adultExtraPrice:new FormControl(''),
        childPriceWithBed:new FormControl(''),
        childPriceWithoutBed:new FormControl(''),
        gst:new FormControl(''),
        service:new FormControl(''),
        stopScale:new FormControl('Yes')
      })
    }

    onBack(){

    }
    
    onSubmit(){
    }

}
