import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-hotel-room-selection',
  templateUrl: './hotel-room-selection.component.html',
  styleUrls: ['./hotel-room-selection.component.scss']
})
export class HotelRoomSelectionComponent implements OnInit {
  searchData: any;
  roomList: any;
  totalPrice: number;
  selectedRoomIndex: any;
  selectedRoomTypeName: any;
  selectedBoardType: any;
  allRoomsSelected: any;
  visibleCancelPolicyIndex = -1;
    hotel: any;
    loading: boolean;
    loadingTemplate;
    app_reference: any;
    booking_source: any;
    bufferAmount: any;
    travellerAdult: any=0;
    travellerChild: any=0;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private utility: UtilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
        this.app_reference = (queryParams['appReference']);
    });

    let hotel = JSON.parse(localStorage.getItem('selectedHotels'));
    this.searchData = hotel[0];
    let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
    this.bufferAmount=policyList[0].bufferAmount;
    this.booking_source=this.searchData.booking_source;
    this.getRoomList();
  }


  ngOnInit() {
    let searchHotel=JSON.parse(localStorage.getItem('hotelSearch'));
    searchHotel.RoomGuests.forEach(element => {
        this.travellerAdult += element.NoOfAdults;
        this.travellerChild += element.NoOfChild;
    });
  }

  getRoomList(){
       this.loading=true;
       this.apiHandlerService.apiHandler('hotelDetails', 'POST', '', '', {
            ResultToken: this.searchData['ResultIndex'],
            booking_source: this.searchData['booking_source']
        }).subscribe(res => {
            if (res.Status) {
                this.hotel = res.data;
                this.hotel.RoomDetails = this.hotel.RoomDetails.filter((ele) => {
                    const validRooms = ele.map((room) => {
                        const filteredRooms = room.Rooms.filter((element) => {
                            return element.Price && element.Price.Amount <= (this.searchData.Price.Amount + this.bufferAmount);
                        });
                        return { ...room, Rooms: filteredRooms };
                    });
                    return validRooms.some(room => room.Rooms.length > 0);
                });
                this.loading=false;
            } else {
                this.loading=false;
                this.swalService.alert.oops("No Rooms Found");
                this.router.navigate(['/booking/request-list'], { queryParams: { sector: 'hotels' } });
            }
        },
            (err) => {
                this.loading=false;
                this.swalService.alert.oops("No Rooms Found");
                this.router.navigate(['/booking/request-list'], { queryParams: { sector: 'hotels' } });
            });
    }

    onBookNow(hotel: any, rooms: any) {
      this.loading=true;
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
      const currentUserId = this.utility.readStorage('currentUser', localStorage)['id'];
     this.apiHandlerService.apiHandler('blockRoom', 'POST', '', '', {
          UserId: currentUserId,
          UserType: "B2B",
          ResultToken: hotel['ResultIndex'],
          RoomResultToken: roomIndex,
          booking_source: hotel['booking_source']
      }).subscribe(res => {
          if (res.data) {
            this.walletPayment(this.app_reference);
            this.loading=false;
          } else {
              this.loading=false;
              this.swalService.alert.oops(res.Message);
              this.router.navigate(['/booking/request-list'], { queryParams: { sector: 'hotels' } });
          }
      },
          (err) => {
              this.loading=false;
              this.swalService.alert.oops(err.error.Message);
              this.router.navigate(['/booking/request-list'], { queryParams: { sector: 'hotels' } });
          });
  }

  walletPayment(appReference) {
    this.loading = true;
     this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
        .subscribe(res => {
            if (res && res.data[0].ticketFare) {
                if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                    this.loading = false;
                    this.swalService.alert.oops("Your wallet balence is not sufficient.")
                } else {
                    this.reservation();
                }
            }
        }, (err) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
        });
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
  }

  reservation() {
    this.loading = true;
    this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
        AppReference: this.app_reference,
        booking_source: this.booking_source
    }).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.deductFromWallet(this.app_reference);
        } else {
                this.loading = false;
                this.swalService.alert.oops(resp.Message);
                this.router.navigate(['/booking/request-list'], { queryParams: { sector: 'hotels' } });
        }
    }, err => {
        this.loading = false;
        this.swalService.alert.oops(err.error.Message);
        this.router.navigate(['/booking/request-list'], { queryParams: { sector: 'hotels' } });
    })
}

deductFromWallet(appReference) {
     this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: appReference }).subscribe(res => {
        if (res) {
        if (res.data[2].order_id) {
            this.router.navigate(['/reports/hotel-voucher'], { queryParams: { appReference:this.app_reference } });
            }
        }
        else{
            this.swalService.alert.oops(res.msg)
        }

    }, (err) => {
        this.loading = false;
        this.swalService.alert.oops(err.error.Message);
      });
}

getStarArray(num) {
    num = Number(num);
    let starArr = [];
    if (num)
        starArr.length = Math.round(num);
    return starArr;
}

getStarArrayRemaining(num) {
    num = Number(num);
    let starArr = [];
    if (num && num >= 0)
        starArr.length = 5 - Math.round(num);
    return starArr;
}

hasAmenities(amenitiesArr: Array<any>, type: string): boolean {
    if (Array.isArray(amenitiesArr)) {
        const amenitiesStr = amenitiesArr.join('').replace(/_/gi, '').toLowerCase();
        const typeArr = type.toLowerCase().replace(/_/gi, '').split('|');
        let found: boolean = false;
        typeArr.forEach(matchStr => {
            const match = new RegExp(`${matchStr}`, 'gi');
            if (amenitiesStr.match(match)) {
                found = true
            }
        });
        return found;
    }
}
    
  }
