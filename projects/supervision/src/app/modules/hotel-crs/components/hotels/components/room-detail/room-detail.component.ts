import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
const log = new Logger('Hotel/AddUpdateHotel');
@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {
    @Output() showRoomImage = new EventEmitter<any>();
    @Output() isPrice =new EventEmitter<boolean>(false);
    @Output() showIsPrice=new EventEmitter<boolean>(false);
    @Output() someEvent = new EventEmitter<any>();
    showRoomList: boolean=true;
    showRoomForm: boolean;
    showPriceDetail:boolean;
    roomList: any;
    addedRoomDetail: any;
    @Input() hotelOne;
    noDataMessage: string;
    submittedRoom: boolean = false;
    noData: boolean = true;
    roomDetailForm: FormGroup;
    roomAmenityList: any;
    patchdData:any
    roomTypeList: any;
    dropdownSettingsForRoom = {};
    addedHotelDetail: any;
    RoomId:any;
    hotelAmenityList: any;
    selectedModuleCheckboxes: Array<any> = [];
    selectedMealCheckboxes: Array<any> = [];
    data:Array<any> = [];
    BoardList = [
        { id: 'RO', name: 'Room Only(RO)',isChecked:false},
        { id: 'BB', name: 'Bed and Breakfast(BB)',isChecked:false},
        { id: 'HB', name: 'Half Board(HB)',isChecked:false},
    ];
    mealList = [
        { id: 'veg', name: 'Veg',isChecked:false},
        { id: 'nonVeg', name: 'Non-Veg',isChecked:false},
    ];
    private subSunk = new SubSink();
  constructor( private hotelCrsService: HotelCrsService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router :Router,
    private apiHandlerService: ApiHandlerService,) { 
          
    this.dropdownSettingsForRoom = {
        singleSelection: false,
        idField: 'id',
        textField: 'room_amenity_name',
        maxHeight: 197,
        itemsShowLimit: 2,
    };
    }

  ngOnInit() {
    this.createHotelRoomForm();
    this.getHotelRoomTypeList()
    this.getHotelRoomAmenityList()
    this.getRoomsByHotelId();
    this.hotelCrsService.addedHotelDetail.subscribe(res => {
        this.addedHotelDetail = res;
    });
  
  }
  onClickAddRoom() {
    this.submittedRoom = false;
    this.showRoomList = false;
    this.roomDetailForm.reset()
    this.patchdData='';
    this.BoardList.forEach(module => {
        module.isChecked =false;
    })
    this.mealList.forEach(module => {
        module.isChecked =false;
    })
    this.showRoomForm = true;
//    this.showPriceDetail=true;

}
createHotelRoomForm(): void {
    this.roomDetailForm = this.fb.group({
        hotel_room_type_id: ['', Validators.required],
        room_name: ['',Validators.required ],
        no_of_rooms:['',Validators.required],
        occupancy: ['', Validators.required],
        // max_adult_capacity: [null, Validators.required],
        // max_child_capacity: [null, Validators.required],
        // extra_bed_availability: ['', Validators.required],
        room_description: ['', Validators.required],
        // room_policy: ['', Validators.required],
        hotel_room_cancellation_policy:['', Validators.required],
        hotel_room_amenity_ids: [[''], Validators.required],
        hotel_id: [''],
        status: new FormControl('')
    })
}
onEdit(patchData) {
    this.patchdData = patchData;
    this.showRoomForm =true;
    this.showRoomList = false;
    this.selectedModuleCheckboxes=this.patchdData.board_type.split(',').map(api => api.replace(/[\[\]\"\\]/g, '').trim())
    this.selectedMealCheckboxes = this.patchdData.meal_type.split(',').map(type => type.trim());
      this.BoardList.forEach(module => {
        if (this.selectedModuleCheckboxes.includes(module.id)) {
            module.isChecked = true;
        }
      });
      this.mealList.forEach(api => {
        if (this.selectedMealCheckboxes.includes(api.name)) {
            api.isChecked = true;
        }
      });
 
    this.roomDetailForm.patchValue({
        hotel_room_type_id: patchData['hotel_room_type_id'] || '',
        room_name:patchData['room_name'] || '',
        no_of_rooms:patchData['no_of_rooms'] || '',
        occupancy: patchData['occupancy'] || '',
        room_description: patchData['room_description'] || '',
        hotel_room_cancellation_policy: patchData['hotel_room_cancellation_policy'] || '',
        hotel_room_amenity_ids:this.getAlreadySelectedAmenities(patchData['hotel_room_amenity_ids']),
        hotel_id:patchData['hotel_id'],
        status:patchData['status'] ? true : false
    });
}
getAlreadySelectedAmenities(amenities) {
    if(amenities){
        amenities = amenities.split(',');
        return this.roomAmenityList.filter((val, index) => val.room_amenity_name == amenities[index]);
    }
   
}
onSubmitRoomDetail(): void {
    this.submittedRoom = true;
    if (this.roomDetailForm.valid) {
        this.roomDetailForm.value.hotel_id =  this.addedHotelDetail['id'];
        this.roomDetailForm.value.hotel_room_amenity_ids = this.roomDetailForm.value.hotel_room_amenity_ids.map(v => v.room_amenity_name);     
        let data = Object.assign({}, this.roomDetailForm.value);
        data['board_type'] = this.selectedModuleCheckboxes;
        data['meal_type'] = this.selectedMealCheckboxes;
        if (data['status']) {
            data['status'] = true;
        } else {
            data['status'] = false;
        }
      
            if (this.patchdData) {
                // data['hotel_id'] = this.hotelOne['id'];
                data['id']=this.patchdData['id']
                data['hotel_id'] = this.hotelOne['id'];
                data['hotel_code']= this.hotelOne['hotel_code'];
                // data['room_name']=this.patchdData['room_name']
                data = [data];
                data['topic'] = 'updateRoom';
            }
            else {
                data['hotel_id'] = this.hotelOne['id'];
                data['hotel_code']= this.hotelOne['hotel_code'];
                data = [data];
                data['topic'] = 'addRoom';
                
            }

            this.hotelCrsService.update(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.addedRoomDetail = resp['data']
                this.hotelCrsService.roomDetailList.next(this.addedRoomDetail);
                this.getRoomsByHotelId();
                this.showRoomForm = false;
                this.roomDetailForm.reset();
                this.showRoomList = true;
                this.submittedRoom = false;
                if(data['topic'] == 'addRoom'){
                    this.swalService.alert.success("Room detail added successfully!") 
                }else{
                    this.swalService.alert.success("Room detail Updated successfully!")
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
getHotelRoomAmenityList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'roomAmenityList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.roomAmenityList = resp.data.filter(p => p.status == 1);
        }
    });
}
getRoomsByHotelId(): void {
    let hotel_id = this.hotelOne['hotel_code']
        const data = [{ hotel_code: hotel_id, offset: 0, limit: 10 }]
        data['topic'] = 'getRoomsByHotelId';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.roomList = resp.data;
                }
                else if (resp.statusCode == 404) {
                    this.noData = true;
                    this.noDataMessage = "No records found"
                }
            }
        )
}
getHotelRoomTypeList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'roomTypeList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.roomTypeList = resp.data.filter(p => p.status == 1);
        }

    });
}
goToRoom(roomId,tab){
    // this.hotelCrsService.showTab.next(tab)
    // this.someEvent.next({ hoteltrigger: 'roomImage' })
    this.showRoomImage.emit({  rooms: roomId,hoteltrigger:tab });
}
goToHotelList(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/hotels/hotel-crs-lists']);
}
 get hotelRoom()
  { 
    return this.roomDetailForm.controls; 
}
 
 onBoardCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedModuleCheckboxes.push(inclusion);
    } else {
      const index = this.selectedModuleCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedModuleCheckboxes.splice(index, 1);
      }
   }
  }
  onMealCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedMealCheckboxes.push(inclusion);
    } else {
      const index = this.selectedMealCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedMealCheckboxes.splice(index, 1);
      }
   }
  }
  onDelete(pricedata){
    this.swalService.alert.delete((action)=>{
        if(action){
            const data = [{id:pricedata['id']}]
            data['topic'] = 'deleteHotelRoom';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success(`Hotel Room has been deleted successfully`);
                        this.getRoomsByHotelId();
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
//   onDelete(pricedata){
//     const data = [{id:pricedata['id']}]
//     data['topic'] = 'deleteHotelRoom';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 201) {
//             // this.hotelImage = resp.data;
//             this.getRoomsByHotelId();
//             this.swalService.alert.success("Hotel room detail deleted successfully!")
//         }

//     });
// }

onStatusUpdate(val, index): void {
    this.selectedModuleCheckboxes=val.board_type.split(',').map(api => api.replace(/[\[\]\"\\]/g, '').trim())
    this.selectedMealCheckboxes = val.meal_type.split(',').map(type => type.trim());
    let data = Object.assign({}, val);
    data['hotel_room_amenity_ids']=this.getAlreadySelectedAmenities(val['hotel_room_amenity_ids'])
    data['board_type'] = this.selectedModuleCheckboxes;
    data['meal_type'] = this.selectedMealCheckboxes;
    data['id']=val['id']
    data['hotel_id'] = this.hotelOne['id'];
    data['hotel_code']= this.hotelOne['hotel_code'];
    data['status']= val['status'] ? false : true;
    // data['room_name']=this.patchdData['room_name']
    data = [data];
    data['topic'] = 'updateRoom';
            data['topic'] = 'updateRoom';
            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.getRoomsByHotelId()
                    this.swalService.alert.update();
                }
                else
                    this.swalService.alert.oops();
            })
     
   

}
 onbBackClick(){
    this.showRoomList = true;
    this.roomDetailForm.reset();
    this.showRoomForm = false;
  }
}
