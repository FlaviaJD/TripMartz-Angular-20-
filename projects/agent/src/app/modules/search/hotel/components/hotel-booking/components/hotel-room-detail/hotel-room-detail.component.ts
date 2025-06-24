import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../hotel.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CancelInfoComponent } from '../cancel-info/cancel-info.component';
import { UtilityService } from 'projects/agent/src/app/core/services/utility.service';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';

@Component({
    selector: 'app-hotel-room-detail',
    templateUrl: './hotel-room-detail.component.html',
    styleUrls: ['./hotel-room-detail.component.scss']
})
export class HotelRoomDetailComponent implements OnInit {
    @Input() hotel: any;
    @Input() traveller: any;
    @Output() roomSelectionChange = new EventEmitter<boolean>();
    protected subs = new SubSink();
    @ViewChild('mapContainer', { static: true }) gMap: ElementRef<HTMLDivElement>;
    mapOptions: google.maps.MapOptions;
    map: any; //google.maps.Map;
    selectedRoomTypeName: string = ''; // Initialize with an empty string or default value
    selectedBoardType: string = ''; // Initialize with an empty string or default value
    totalPrice: number = 0;
    allRoomsSelected: boolean = false;
    travellerAdult: any = 0;
    travellerChild: any = 0;
    hotels: {}[] = [];
    center!: google.maps.LatLngLiteral;
    marker: google.maps.Marker;
    selectedRooms: any[] = [];
    visibleCancelPolicyIndex = -1;
    selectedRoomIndex: any;
    amenityImageMap = {
        'Free WiFi': 'assets/images/wifi.svg',
        'Dry cleaning/laundry service': 'assets/images/Dry cleaning.svg',
        'Secured parking': 'assets/images/Secured parking.svg',
        'Change of towels (on request)': 'assets/images/Change of towels.svg',
        'Laundry facilities': 'assets/images/Laundry facilities.svg',
        'Luggage storage': 'assets/images/Luggage storage.svg',
        'Smoke-free property': 'assets/images/Smoke-free property.svg',
        'Free breakfast': 'assets/images/Free breakfast.svg',
        'Free self parking': 'assets/images/Free self parking.svg',
        'Lockers available': 'assets/images/Lockers available.svg',
        '24-hour front desk': 'assets/images/24-hour front desk.svg',
      };
   
    isModalOpen: boolean = false;
    isHotelPolicyModalOpen: boolean = false;
    isFacilitiesModalOpen: boolean = false;
    isExpanded: boolean = false;
    coordinates: any;
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
        this.resizeMap();
      }
   
   
    resizeMap() {
        this.coordinates = { lat: this.hotel.Latitude, lng: this.hotel.Longitude };
        this.center = this.coordinates || { lat: 0, lng: 0 }; // Default center
        this.mapInitializer();
      }

      mapInitializer() {
        if (!this.gMap || !this.coordinates) {
          console.error("Map container or coordinates are not available.");
          return;
        }
    
        this.mapOptions = {
          center: this.center,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gMap.nativeElement, this.mapOptions);
        this.placeMarker();
      }
    

      placeMarker() {
        const infowindow = new google.maps.InfoWindow();
        const latlngset = new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng);
        const marker = new google.maps.Marker({
          map: this.map,
          title: this.hotel.HotelName,
          position: latlngset,
        });
        this.map.setCenter(marker.getPosition());
        const style_pop_up = 'height="60" width="60"';
        const style_image = 'height="30" width="30"';
        const pop_up_hotel_image = `<img src="${this.hotel['HotelPicture']}" ${style_pop_up}>`;
        const $pop_up = `
          <div style="width:300px; padding:2px;">
            <div class="mapplot" style="color:#3399FE;">
              <div class="projimg1" style="float:left;"> 
                ${pop_up_hotel_image}
              </div>
              <div class="mapplot_desc">
                <div style="color: royalblue; font-size: 14px; font-weight:bold;">
                  ${this.hotel.HotelName}, <small style="color:#000;">${this.hotel.HotelAddress}</small>
                </div>
              </div>
            </div>
          </div>
        `;
    
        let currentInfoWin = true;
        google.maps.event.addListener(marker, 'click', () => {
          if (currentInfoWin) {
            infowindow.close();
          }
          infowindow.setContent($pop_up);
          infowindow.open(this.map, marker);
          currentInfoWin = true;
        });
      }
  
    openModal() {
        this.isModalOpen = true;
      }
      
      closeModal() {
        this.isModalOpen = false;
      }

      openHotelPolicyModal() {
        this.isHotelPolicyModalOpen = true;
      }
      
      closeHotelPolicyModal() {
        this.isHotelPolicyModalOpen = false;
      }

      openFacilitiesModal() {
        this.isFacilitiesModalOpen = true;
      }
      
      closeFacilitiesModal() {
        this.isFacilitiesModalOpen = false;
      }

      toggleDescription() {
  this.isExpanded = !this.isExpanded;
}


    scrollToRooms(){
        this.hotelService.scrollToRoomDetails.next(true);
    }

    scrollToLocation(){
        this.hotelService.scrollToLocation.next(true);
    }
    
    scrollToDescription(){
        this.hotelService.scrollToDescription.next(true);
    }

    scrollToAminities(){
        this.hotelService.scrollToAminities.next(true);
    }

    scrollToRoomDetails() {
        this.hotelService.scrollToRoomDetails.subscribe(t => {
            if (t) {
                document.getElementById('tab_default_2').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        });
        this.hotelService.scrollToRoomDetails.subscribe(t => {
            if (t) {
                document.getElementById('tab_default_2').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        });
        this.hotelService.scrollToLocation.subscribe(t => {
            if (t) {
                document.getElementById('location_tab').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        });
        this.hotelService.scrollToDescription.subscribe(t => {
            if (t) {
                document.getElementById('tab_default_1').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
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
    
        const currentUserId = this.utility.readStorage('currentUser', localStorage)['id'];
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

    amenityAvailable(item: string, match: string) {
        const regx = new RegExp(`${match}`, 'gi');
        if (item == match)
            return true;
        return false;
    }

    selectedRoom(rooms, room, index, roomIndex) {
        this.totalPrice = 0;
        this.selectedRoomIndex = roomIndex;
    
        // Clear all selected rooms if first room type is selected
        if (index == 0) {
            if (this.hotel && this.hotel.RoomDetails) {
                for (let roomList of this.hotel.RoomDetails) {
                    for (let roomDetail of roomList) {
                        roomDetail.SelectedRoom = null;
                    }
                }
            }
        }
    
        // Set selected room details
        this.selectedRoomTypeName = rooms.RoomTypeName;
        this.selectedBoardType = room.BoardType;
        rooms.SelectedRoom = room;
    
        // Calculate total price
        if (this.hotel && this.hotel.RoomDetails) {
            for (let roomList of this.hotel.RoomDetails) {
                roomList.forEach((roomDetail) => {
                    if (roomDetail.SelectedRoom) {
                        this.totalPrice += roomDetail.SelectedRoom.Price.Amount;
                    }
                });
            }
        }
    
        // Check if all rooms are selected
        let allRoomsSelected = false;
        if (this.hotel && this.hotel.RoomDetails) {
            allRoomsSelected = this.hotel.RoomDetails.every(roomList => 
                roomList.some(room => room.SelectedRoom != null)
            );
        }
    
        // Emit the selection state to the parent component
        this.roomSelectionChange.emit(allRoomsSelected);
    }

    

    showSubCancelPolicy(cancelpolicy) {
        if (this.visibleCancelPolicyIndex === cancelpolicy) {
          this.visibleCancelPolicyIndex = -1;
        } else {
          this.visibleCancelPolicyIndex = cancelpolicy;
        }
      }

      ngAfterViewInit(){
        this.getGeoCoords();
    }
    getGeoCoords() {
        navigator.geolocation.getCurrentPosition(pos => {
            this.center = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            if (this.center) {
                this.mapInitializer();
            }
        }, err => {
            // log.error(`Browser dose not support GeoLocation`, err);
        })
    }
}
