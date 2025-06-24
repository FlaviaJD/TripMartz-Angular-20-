import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
const log = new Logger('Hotel/AddUpdateHotel');
import { formatDate } from '../../../../../../core/services/format-date';
import * as moment from 'moment';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.scss']
})
export class PriceManagementComponent implements OnInit {
    roomPriceForm: FormGroup;
    rooListForm:FormGroup;
    showPriceList: boolean;
    showPriceForm: boolean;
    addedPriceDetail: any;
    seasonCopy:any =[];
    showInputOne = false;
    showInputTwo = false;
    noDataMessage: string;
    noData: boolean = true;
    roomId:object = {};
    submittedRoomPrice: boolean = false;
    @Input() hotelOne: object = {};
    @Input() priceData: object = {};
    @Output() showRoomDetail = new EventEmitter<any>();
    seasonList: any = [];
    showInputThree = false;
    showChildInput = false;
    showVat = false;
    showRoom = false;
    showServiceCharge = false;
    priceList: any;
    patchdData:any;
    roomPriceList:boolean=true;
    isOpen = false as boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-green'
    };
    selectedSeasonFrom: string = '';
    selectedSeasonTo: string = '';
    initialValues = {};
    otherFieldsChanged:boolean=false;
    dateChanged:boolean=false;
  constructor(
    private fb: FormBuilder,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
    private swalService: SwalService,
  ) { }

  ngOnInit() {
    console.log("hotelOne",this.hotelOne)
    this.createRoomPriceForm();
    // this.setInitialDates();
    this.hotelCrsService.seasonList.subscribe(res => {
        this.seasonCopy = res;
    });
    this.getSeasonList();
    this.hotelCrsService.roomId.subscribe(resp => {
        this.roomId=resp
       })
    this.getPriceList()
    // this.onEdit();
  }
  createRoomPriceForm() {
    this.roomPriceForm = this.fb.group({
        from_date: [''],
        to_date: [''],
        single_room: [],
        double_room: [],
        adult_extra_price: [],
        childwb: [],
        childb: [],
        no_of_rooms:[],
        gst:[],
        stop_sale:[],
        RO:[],
        HB:[],
        block_rooms:[],
        booked_rooms:[],
        service: [],
        status: [true],
    })
    
Object.keys(this.roomPriceForm.controls).forEach(key => {
    const control = this.roomPriceForm.get(key);
    this.initialValues[key] = control.value;
});
}

toggleInputThree() {
    if (this.showInputThree) {
        this.showInputThree = false;
    } else if (!this.showInputThree) {
        this.showInputThree = true;
    }
}

onSubmitPrice() {
    this.submittedRoomPrice = true;
    if (this.roomPriceForm.valid) {
        const dt1 = new Date(this.roomPriceForm.value.from_date);
        this.roomPriceForm.value.from_date = formatDate(dt1, '');
        const dt2 = new Date(this.roomPriceForm.value.to_date);
        this.roomPriceForm.value.to_date = formatDate(dt2, '');
        const changedValues = {};
        Object.keys(this.roomPriceForm.controls).forEach(key => {
            const control = this.roomPriceForm.get(key);
            if (control.value !== this.initialValues[key]) {
                if ((key === 'from_date' || key === 'to_date') ) {
                    this.dateChanged = true;
                    this.otherFieldsChanged=false;
                  } else if(control.value != null) {
                    this.otherFieldsChanged = true;
                    //this.dateChanged=false;
                  }
                changedValues[key] = parseInt(control.value);
                // Update the initial value to the current value
                //this.initialValues[key] = control.value;
                // Optionally reset the dirty state
                control.markAsPristine();
            }
        });
        if (this.dateChanged && !this.otherFieldsChanged) {
            this.getPriceList();
          }else if (this.dateChanged && this.otherFieldsChanged ) {
        let data = { ...changedValues };
        try {
                data['from_date']=this.roomPriceForm.value.from_date;
                data['to_date']=this.roomPriceForm.value.to_date;
                data['room_id'] = this.priceData['id'];
                data['board_type']="";
                data = [data];
                data['topic'] = 'updatePriceManagement';
            
        } catch (error) {
            log.debug(error)
        }
        log.debug('data', data);

        this.hotelCrsService.update(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.addedPriceDetail = resp['data']
                    this.roomPriceList =true;
                    this.showPriceForm =false;
                    this.getPriceList();
                    this.getSeasonList();
                    // this.roomPriceForm.reset()
                    Object.keys(this.roomPriceForm.controls).forEach(key => {
                        if (key !== 'from_date' && key !== 'to_date') {
                            this.roomPriceForm.get(key).reset();
                        }
                    });
                    this.swalService.alert.success("Price detail updated successfully!")

            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.Message)
            }
            else {
                this.swalService.alert.oops(resp.Message);
            }
        },err => {
              this.swalService.alert.oops(err.error.Message);
          })
    }
    else {
        return;
    }
    }
}

toggleInputOne() {
    if (this.showInputOne) {
        this.showInputOne = false;
    } else if (!this.showInputOne) {
        this.showInputOne = true;
    }
}
toggleInputTwo() {
    if (this.showInputTwo) {
        this.showInputTwo = false;
    } else if (!this.showInputTwo) {
        this.showInputTwo = true;
    }
}

toggleChildInput() {
    if (this.showChildInput) {
        this.showChildInput = false;
    } else if (!this.showChildInput) {
        this.showChildInput = true;
    }
}
toggleVAT() {
    if (this.showVat) {
        this.showVat = false;
    } else if (!this.showVat) {
        this.showVat = true;
    }
}
toggleServiceCharge() {
    if (this.showServiceCharge) {
        this.showServiceCharge = false;
    } else if (!this.showServiceCharge) {
        this.showServiceCharge = true;
    }
}
getSeasonList(){
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'hotelSeasonList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.noData = false;
                this.seasonList = resp.data;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
            }
        }
    )
}

showroom(){
this.showRoom =true;
}

// setInitialDates() {
//     const today = moment();
//     const oneYearFromNow = moment().add(1, 'year');
//     const formattedToday = today.format("YYYY-MM-DD");
//     const formattedOneYearFromNow = oneYearFromNow.format("YYYY-MM-DD");

//     this.roomPriceForm.patchValue({
//       from_date: formattedToday,
//       to_date: formattedOneYearFromNow
//     });
//   }
getPriceList(){
    const today = moment();
    const oneYearFromNow = moment().add(1, 'year');
    const formattedToday = today.format("YYYY-MM-DD");
    const formattedOneYearFromNow = oneYearFromNow.format("YYYY-MM-DD");
    this.roomPriceForm.patchValue({
        from_date:this.roomPriceForm.value.from_date ? this.roomPriceForm.value.from_date:formattedToday,
        to_date:this.roomPriceForm.value.to_date ? this.roomPriceForm.value.to_date:formattedOneYearFromNow,
    })
    let room_id = this.priceData['id']
    const data = [{ room_id: room_id,available_from: this.roomPriceForm.value.from_date,available_to: this.roomPriceForm.value.to_date }]
    // getPriceList
    // priceManagementList
    data['topic'] = 'priceManagementList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.priceList = resp.data;
            }
            else if (resp.statusCode == 404) {
                this.noDataMessage = "No records found"
            }
        }
    ) 
}
    
goToRoomLists(){
    this.showRoomDetail.emit({rooms:this.priceData,hoteltrigger:'goToRoomDetail'})

}

onDelete(pricedata){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{ price_id:pricedata['price_id']}]
            data['topic'] = 'deleteRoomPrice';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success(`Price has been deleted successfully`);
                        this.getPriceList()
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
onBackRoom(){
    this.roomPriceList =true;
    this.showPriceForm =false;
}
onSeasonChange(event) {
    let seasonId = event;
    const selectedSeason = this.seasonList.find(season => season.id == seasonId);
    this.selectedSeasonFrom = selectedSeason ? selectedSeason.from_date : '';
    this.selectedSeasonTo = selectedSeason ? selectedSeason.to_date : '';
    const formattedDate1 = moment(this.selectedSeasonFrom).format("MM/DD/YYYY");
    const formattedDate2 = moment(this.selectedSeasonTo).format("MM/DD/YYYY");
    this.roomPriceForm.patchValue({
        from_date: formattedDate1 ||  '',
        to_date:   formattedDate2|| '',
    });
  }

  onPrice(price:any){
    
    const formattedDate1 = moment(price.season_date).format("YYYY-MM-DD");
    let data = {};
    data['from_date']=formattedDate1;
    data['to_date']=formattedDate1;
    data['room_id'] = this.priceData['id'];
    data['no_of_room']=price.no_of_room;
    data['block_rooms']=price.block_rooms;
    data['single_room']=price.single_room;
    data['double_room']=price.double_room;
    data['RO']=price.RO;
    data['HB']=price.HB;
    data['adult_extra_price']=price.adult_extra_price;
    data['childb']=price.childb;
    data['childwb']=price.childwb;
    data['gst']=price.gst;
    data['service']=price.service;
    data['board_type']="";
    data = [data];
    data['topic'] = 'updatePriceManagement'
this.hotelCrsService.update(data).subscribe(resp => {
if (resp.statusCode == 201) {
    this.addedPriceDetail = resp['data']
        this.roomPriceList =true;
        this.showPriceForm =false;
        this.getPriceList();
        this.getSeasonList();
        this.swalService.alert.success("Price detail updated successfully!")
} else if (resp.statusCode == 400) {
    this.swalService.alert.oops(resp.msg)
}
else {
    this.swalService.alert.oops(resp.msg);
}
})
}
get hotelRoomSeasonPrice() { return this.roomPriceForm.controls; }
}
