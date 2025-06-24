import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('Hotel/AddUpdateHotel');
import { formatDate } from '../../../../../../core/services/format-date';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
    roomPriceForm: FormGroup;
    showPriceList: boolean;
    showPriceForm: boolean;
    addedPriceDetail: any;
    seasonCopy:any =[];
    showInputOne = false;
    showInputTwo = false;
    noDataMessage: string;
    noData: boolean = true;
    isboard:boolean=false;
    isRoom:boolean=false;
    isHalf:boolean=false;
    roomId:object = {};
    boardData:string='';
    submittedRoomPrice: boolean = false;
    @Input() hotelOne: object = {};
    @Input() priceData: object = {};
    @Output() showRoomDetail = new EventEmitter<any>();
    seasonList: any = [];
    showInputThree = false;
    showChildInput = false;
    showVat = false;
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
    BoardList = [
        { id: 'RO', name: 'Room Only(RO)',isChecked:false},
        { id: 'BB', name: 'Bed and Breakfast',isChecked:false},
        { id: 'HB', name: 'Half Board(HB)',isChecked:false},
    ];
    isDisabled: boolean = true;
  constructor(
    private fb: FormBuilder,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
    private swalService: SwalService,
  ) { }

  ngOnInit() {
    console.log("priceData",this.priceData)
    this.createRoomPriceForm();
    this.getSeasonList();
    this.hotelCrsService.seasonList.subscribe(res => {
        this.seasonCopy = res;
    });
    this.hotelCrsService.roomId.subscribe(resp => {
        this.roomId=resp
       })
    this.getPriceList()
  }
  createRoomPriceForm() {
    this.roomPriceForm = this.fb.group({
        hotel_room_season_id: ['', Validators.required],
        from_date: [''],
        to_date: [''],
        single_room: [0, Validators.required],
        double_room: ['', Validators.required],
        adult_extra_price: ['', Validators.required],
        childwb: ['', Validators.required],
        childb: ['', Validators.required],
        no_of_rooms:['', Validators.required],
        gst:['', Validators.required],
        RO:[0, Validators.required],
        HB:[0, Validators.required],
        block_rooms:['', Validators.required],
        service: ['',Validators.required],
        status: new FormControl('')
    })
}
onEdit(patchData) {
    this.patchdData =patchData;
    const formattedDate1 = moment(this.patchdData.from_date).format("YYYY-MM-DD");
    const formattedDate2 = moment(this.patchdData.to_date).format("YYYY-MM-DD");
    this.showPriceForm =true;
    this.roomPriceList =false;
    this.roomPriceForm.patchValue({
        hotel_room_season_id: patchData['season_id'] || '',
        single_room: patchData['single_room'] || 0,
        double_room: patchData['double_room'] || '',
        RO: patchData['RO'] || 0,
        HB: patchData['HB'] || 0,
        adult_extra_price: patchData['adult_extra_price'] || '',
        childwb: patchData['childwb'] || '',
        childb: patchData['childb'] || '',
        no_of_rooms: patchData['no_of_room'] || '',
        block_rooms: patchData['block_rooms'] || '',
        gst: patchData['gst'] || '',
        service: patchData['service'] || '',
        from_date:formattedDate1 || '',
        to_date:formattedDate2 || '' ,
        status:patchData['status'] ? true : false
    });
}
  onClickAddPrice() {
    this.roomPriceList =false;
    this.roomPriceForm.reset();
    this.patchdData='';
    this.roomPriceForm.patchValue({
        RO:0, 
        HB:0,
        single_room:0
    })
    // this.getSeasonList();
    this.boardData=this.priceData['board_type'].split(',').map(api => api.replace(/[\[\]\"\\]/g, '').trim())
      this.BoardList.forEach(module => {
        if (this.boardData.includes(module.id)) {
        if(module.id == "RO"){
            this.isRoom=true;
        }else if(module.id == "HB"){
            this.isHalf =true;
        }
        }
      });
      this.showPriceForm = true;
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
        let data = Object.assign({}, this.roomPriceForm.value);
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
        try {
            if (this.patchdData) {
                data['hotel_room_season_id'] = parseInt(this.patchdData.season_id)
                data['price_id'] = this.patchdData['price_id'];
                data['room_id'] = this.priceData['id'];
                data = [data];
                data['topic'] = 'updateRoomPrice';
            }
            else {
                data['hotel_room_season_id'] = parseInt(this.roomPriceForm.value.hotel_room_season_id)
                data['room_id'] = this.priceData['id'];
                data['board_type']="";
                data = [data];
                data['topic'] = 'addPrice';
            }
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
                    this.submittedRoomPrice=false;
                    if(data['topic'] == 'addPrice'){
                        this.swalService.alert.success("Price detail added successfully!")
                    }else if(data['topic'] == 'updateRoomPrice'){
                        this.swalService.alert.success("Price detail Updated successfully!")
                    }
            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.Message)
            }
            else {
                this.swalService.alert.oops(resp.Message);
            }
        }, err => {
              this.swalService.alert.oops(err.error.Message);
          })
    }
    else {
        return;
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
                this.seasonList = resp.data.filter(p => p.status == 1);
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
            }
        }
    )
}
getPriceList(){
    let room_id = this.priceData['id']
    const data = [{ room_id: room_id, offset: 0, limit: 10 }]
    data['topic'] = 'getPriceList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            if (resp.statusCode == 200) {
                this.noData = false;
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
// onDelete(pricedata){
//     const data = [{ price_id:pricedata['price_id']}]
//     data['topic'] = 'deleteRoomPrice';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 201) {
//             // this.hotelImage = resp.data;
//             this.getPriceList()
//             this.swalService.alert.success("Price detail deleted successfully!")
//         }

//     });
// }
onDelete(pricedata){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{ price_id:pricedata['price_id']}]
            data['topic'] = 'deleteRoomPrice';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201 ) {
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
    const formattedDate1 = moment(this.selectedSeasonFrom).format("YYYY-MM-DD");
    const formattedDate2 = moment(this.selectedSeasonTo).format("YYYY-MM-DD");
    this.roomPriceForm.patchValue({
        from_date: formattedDate1 ||  '',
        to_date:   formattedDate2|| '',
    });
  }
//   onStatusUpdate(val, index): void {
//     const formattedDate1 = moment(val.from_date).format("YYYY/MM/DD");
//     const formattedDate2 = moment(val.to_date).format("YYYY/MM/DD");
//     console.log("val",val)
//     let data = Object.assign({},);
//     data['id']=val['id']
//     data['hotel_room_season_id'] = parseInt(this.patchdData.season_id)
//     data['price_id'] = this.patchdData['price_id'];
//     data['room_id'] = this.priceData['id'];
//     data['form_date']=formattedDate1;
//     data['to_date']=formattedDate2;
//     data['single_room']=val['single_room']
//     data['double_room'] =val['double_room']
//     data['adult_extra_price']=val['adult_extra_price']
//     data['childwb']=val['childwb']
//     data['childb']=val['childb']
//     data['no_of_rooms']=val['no_of_rooms']
//     data['gst']=val['gst']
//     data['RO']=val['RO']
//     data['HB']=val['HB']
//     data['block_rooms']=val['block_rooms']
//     data['service']=val['service']
//     data['status']= val['status'] ? false : true;
//     data = [data];
//     data['topic'] = 'updateRoomPrice';
//             this.hotelCrsService.update(data).subscribe(resp => {
//                 if (resp.statusCode == 200) {
//                     this.getSeasonList();
//                     this.swalService.alert.update();
//                 }
//                 else
//                     this.swalService.alert.oops();
//             })
//   }
get hotelRoomSeasonPrice() { return this.roomPriceForm.controls; }
}
