import { Component, Input, OnInit, } from '@angular/core';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../hotel.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CancelInfoComponent } from '../cancel-info/cancel-info.component';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';


@Component({
    selector: 'app-hotel-room-detail',
    templateUrl: './hotel-room-detail.component.html',
    styleUrls: ['./hotel-room-detail.component.scss']
})
export class HotelRoomDetailComponent implements OnInit {
    @Input() hotel: any;
    @Input() traveller: any;
    protected subs = new SubSink();
    selectedRoomTypeName: string = ''; // Initialize with an empty string or default value
    selectedBoardType: string = ''; // Initialize with an empty string or default value
    totalPrice: number = 0;
    allRoomsSelected: boolean = false;
    travellerAdult: any = 0;
    travellerChild: any = 0;
    hotels: {}[] = [];
    selectedRooms: any[] = [];
    visibleCancelPolicyIndex = -1;
    selectedRoomIndex: any;
    isExpanded: boolean = false;
    isExpandedHotelDescription: boolean = false;
    visibleCount: number = 5;
    activePanelId: string = 'room-panel-0'; // Open Room 1 by default
    
   
    constructor(
        private hotelService: HotelService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private dialog: MatDialog,
        private utility: UtilityService,
        private swalService: SwalService

    ) { }

    ngOnInit() {
        this.scrollToRoomDetails();
        this.hotels = this.hotel.HotelPicture ? this.hotel.HotelPicture[0] : [];
    }

    toggleRoomPanel(index: number) {
        const panelId = `room-panel-${index}`;
        this.activePanelId = this.activePanelId === panelId ? '' : panelId; // Toggle room tabs
      }

      setActivePanel(panelId: string) {
        this.activePanelId = panelId; // Set the new active panel
      }
    
      clearActivePanel() {
        this.activePanelId = ''; // Close all panels when clicked
      }

    scrollToRoomDetails() {
        this.hotelService.scrollToRoomDetails.subscribe(t => {
            if (t) {
                document.getElementById('rooms1').click();
                document.getElementById('roomDetail').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        });
        this.hotelService.sendRequest.subscribe(hotel => {
            if (Object.keys(hotel).length > 0) {
                const rooms=[];
                this.onBookNow(hotel,false);
            }
        });
    }

    cancelInfo(data) {
        this.dialog.open(CancelInfoComponent, {
            data: data
        });
    }

    onBookNow(hotel: any, rooms: any) {
        this.hotelService.loading.next(true);
        let roomIndex=[];
        if (rooms) {
            for (let roomDetails of hotel.RoomDetails) {
                for (let rooms of roomDetails) {
                    if (rooms.SelectedRoom) {
                        roomIndex.push(rooms.SelectedRoom.Index);
                    }
                }
            }
        }
        else {
            roomIndex = [];
        }
    
        const currentUserId = this.utility.readStorage('studentCurrentUser', localStorage)['id'];
        this.subs.sink = this.apiHandlerService.apiHandler('blockRoom', 'POST', '', '', {
            UserId: currentUserId,
            UserType: "B2B",
            ResultToken: hotel['ResultIndex'],
            RoomResultToken: roomIndex,
            booking_source: hotel['booking_source']
        }).subscribe(res => {
            if (res.data) {
                this.hotelService.blockHotelRoom.next(res);
                localStorage.setItem('b2bBlockHotelRoomState', JSON.stringify(this.hotelService.blockHotelRoom.getValue()));
                this.hotelService.resultToken = res.ResultToken;
                this.hotelService.traveller = this.traveller;
                this.hotelService.sendRequest.next({});
                this.router.navigate(['/search/hotel/guests']);
            } else {
                this.hotelService.loading.next(false);
                this.swalService.alert.oops(res.Message);
            }
            this.hotelService.loading.next(false);
        },
            (err) => {
                this.hotelService.loading.next(false);
                this.swalService.alert.oops(err.error.Message);
            });
    }


    toggleAmenities() {
        if (this.isExpanded) {
          this.visibleCount = 5;  // Collapse to first 5 items
        } else {
          this.visibleCount = this.hotel.HotelAmenities.length;  // Expand to full list
        }
        this.isExpanded = !this.isExpanded;
      }


    toggleFacilities() {
        this.visibleCount = this.isExpanded ? 5 : Number.MAX_SAFE_INTEGER; // Expand or collapse
        this.isExpanded = !this.isExpanded;
      }

    amenityAvailable(item: string, match: string) {
        const regx = new RegExp(`${match}`, 'gi');
        if (item == match)
            return true;
        return false;
    }

    selectedRoom(rooms, room,index,roomIndex) {
        this.totalPrice = 0;
        this.selectedRoomIndex=roomIndex;
        if (index == 0) {
            if (this.hotel && this.hotel.RoomDetails) {
                for (let roomList of this.hotel.RoomDetails) {
                    for (let roomDetail of roomList) {
                        roomDetail.SelectedRoom = null;
                    }
                }

            }
        }
        this.selectedRoomTypeName = rooms.RoomTypeName;
        this.selectedBoardType = room.BoardType;
        rooms.SelectedRoom = room;
        if (this.hotel && this.hotel.RoomDetails) {
            for(let roomList of this.hotel.RoomDetails)
            roomList.forEach((roomDetail, index) => {
                    if(roomDetail.SelectedRoom){
                        this.totalPrice += roomDetail.SelectedRoom.Price.Amount;
                    }
            });
            
        }

        if (this.hotel && this.hotel.RoomDetails) {
            this.allRoomsSelected = this.hotel.RoomDetails.every(roomList => {
                return roomList.some(room => room.SelectedRoom != null);
            });
        }
       
        //this.allRoomsSelected = this.hotel.RoomDetails[0].every(room => room.SelectedRoom != null);
    }

    showSubCancelPolicy(cancelpolicy) {
        if (this.visibleCancelPolicyIndex === cancelpolicy) {
          this.visibleCancelPolicyIndex = -1;
        } else {
          this.visibleCancelPolicyIndex = cancelpolicy;
        }
      }
}
