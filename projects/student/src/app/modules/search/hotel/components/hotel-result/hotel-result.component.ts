import { ChangeDetectorRef, Component, DoCheck, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { } from 'googlemaps';
import { browserRefresh } from 'projects/student/src/app/app.component';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { ThemeOptions } from 'projects/student/src/app/theme-options';
import { SubSink } from 'subsink';
import { HotelService } from '../../hotel.service';
import { HotelSearchLoaderComponent } from './components/hotel-search-loader/hotel-search-loader.component';

@Component({
    selector: 'app-hotel-result',
    templateUrl: './hotel-result.component.html',
    styleUrls: ['./hotel-result.component.scss']
})
export class HotelResultComponent implements OnInit, DoCheck {
    @ViewChild('flteboxwrp', {static:false}) flteboxwrp!: ElementRef;
    @ViewChild('mapContainer', { static: true }) gMap: ElementRef<HTMLDivElement>;
    searchType = "middle";
    traveller: any;
    travellerAdult: any = 0;
    travellerChild: any = 0;
    checkInDate: any;
    checkOutDate: any;
    destination: any;
    booking_source: any;
    searchPayload: any;
    protected subs = new SubSink();
    loading: boolean;
    hotels: any = [];
    errorMessage: any;
    isCollapsed = true;
    isCollapsedSearch = true;
	showMobilefilter = true;
	mobileModify: boolean = false;
    serverError = false;
    noHotel = false;
    searchingHotel = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    endSlice: number = 20;
    throttle: any;
    map: any; 
    coordinates: any = { 'lat': 12.972442, 'lng': 77.580643 };
    lat: number;
    lng: number;
    marker: google.maps.Marker;
    details: any = {};
    mapLoaded: Promise<boolean>;
    public browserRefresh: boolean;
    selectedPrice:any=[];
    sendEnquiryArr=false;
    selectedIndex;
    policyPrice;
    policyStarRatings;
    currentUser;
    price_beyond_limit;
    star_beyond_limit;
    policy_star_category;
    showPriceRemark:boolean=false;
    showStarRemark:boolean=false;
    starRatingReason='';
    priceReason='';
    isBottomReached = false;
    private initialOffsetTop: number = 0; 

    constructor(
        private hotelService: HotelService,
        private router: Router,
        public globals: ThemeOptions,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService,
        private swalService: SwalService
    ) {}

    ngOnInit() {
        this.browserRefresh = browserRefresh;
        this.currentUser = JSON.parse(localStorage.getItem('studentCurrentUser'));
        this.searchPayload = this.prepareSearchPayloadFromSessionData('hotelSearchData');
        if (this.browserRefresh) {
            this.hotelService.formFilled=JSON.parse(localStorage.getItem('hotelSearchData'));
		}
         this.searchPayload.RoomGuests.forEach(element => {
            this.traveller = [{
                adults: element.NoOfAdults,
                childrens: element.NoOfChild
            }];
        });
        this.searchResult(this.searchPayload);
        this.hotelService.loading.next(true);
        this.subs.sink = this.hotelService.searchingHotel.subscribe(res => {
            this.searchingHotel = res;
            if(!this.searchingHotel)
            {this.dialog.closeAll();
            }
        });
        this.subs.sink = this.hotelService.closeDialog.subscribe(res => {
            if(res){
                this.dialog.closeAll();
                this.hotelService.loading.next(false)
            }
        });

        this.subs.sink = this.hotelService.serverError.subscribe(res => {
            this.serverError = res;
        });
        this.subs.sink = this.hotelService.loading.subscribe(res => {
            this.loading = res;
        });
        this.subs.sink = this.hotelService.hotels.subscribe(res => {
            //this.hotelService.loading.next(true);
            if (!res.length) {
                this.hotels = [];
                this.selectedIndex=null
            } else {
                this.hotelService.loading.next(false);
                this.hotels = res || [];
                // this.hotels = res.sort((a, b) => b.Priority - a.Priority);
                this.selectedIndex=null
                this.getPolicyValues();
                this.details = res;
                //this.mapInitializer();
                if (!this.loading) {
                    setTimeout(_ => {
                        this.dialog.closeAll();
                        this.globals.sidebarHover = true;
                    }, 100);
                }
            }
        });
        this.subs.sink = this.hotelService.changeDetectionEmitter.subscribe(
            () => {
                // this.cd.detectChanges();
            },
            (err) => {
            }
        );

        this.subs.sink = this.hotelService.isCollapsed.subscribe(res => {
            this.isCollapsed = res;
        });
        this.subs.sink = this.hotelService.noHotel.subscribe(res => {
            this.noHotel = res;
        });
        // this.hotelService.loading.next(false);

        this.mobileModify = this.getIsMobile();
        //this.isCollapsedSearch = false;
        window.onresize = () => {
        //   this.mobileModify = this.getIsMobile();
        //   this.isCollapsedSearch = this.getIsMobile();
        };
    }

    onScrollDown(len) {
        if ((len % 20) === 0 && this.endSlice < 500) {
            this.endSlice += 20;
        }
    }

    @HostListener('window:scroll', [])
      onWindowScroll(): void {
        this.checkFixedPosition();  // Check position on every scroll event
      }
    
      checkFixedPosition(): void {
        const scrollPosition = window.scrollY + window.innerHeight;  // Current scroll position from top to bottom
        const elementOffsetBottom = this.flteboxwrp.nativeElement.offsetTop + this.flteboxwrp.nativeElement.offsetHeight;
    
        // Add fixed position when the scroll position reaches the element's bottom
        if (scrollPosition >= elementOffsetBottom && !this.isBottomReached) {
          this.isBottomReached = true;
        }
    
        // Remove fixed position when scrolling back up above the element's original top position
        if (window.scrollY < this.initialOffsetTop && this.isBottomReached) {
          this.isBottomReached = false;
        }
      }
    
      scrollTopFilter():void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

    getIsMobile(): boolean {
        
        const w = document.documentElement.clientWidth;
        const breakpoint = 992;
        console.log(w);
        if (w < breakpoint) {
            this.isCollapsedSearch = false;
            this.showMobilefilter = false;
          return true;
        } else {
          return false;
        }
      }

	  mobileFilter(){
        this.showMobilefilter = true;
    }

    closeFilter(){
        this.showMobilefilter = false;
    }



    getPolicyValues(){
      this.policyPrice= +(localStorage.getItem('policyPrice'));
      this.price_beyond_limit= localStorage.getItem('price_beyond_limit');
      this.star_beyond_limit= localStorage.getItem('star_beyond_limit');
      this.policy_star_category= localStorage.getItem('policy_star_category');
    }


    ngAfterViewChecked() {
        // this.cd.detectChanges();
    }

    ngAfterViewInit() {
        this.initialOffsetTop = this.flteboxwrp.nativeElement.offsetTop;
        this.checkFixedPosition();  // Initial check
        setTimeout(() => {
            // this.cd.detectChanges();
        });
    }

    resetFilter() {
        this.hotelService.resetFilter();
    }

    searchResult(data: any) {
        this.util.writeStorage("hotelSearchPostdata", data, localStorage);
        this.searchPayload = this.prepareSearchPayloadFromSessionData('hotelSearchData');
        const params = this.hotelService.formFilled;
        if (params) {
            this.travellerAdult = 0;
            this.travellerChild = 0;
            this.traveller = params['traveller'];
            this.traveller.forEach(element => {
                this.travellerAdult += element.adults;
                this.travellerChild += element.childrens;
            });
            this.booking_source = params['destination_source'];
            let config = new MatDialogConfig();
            config.height = '600px';
            config.width = '1000px';
            config.panelClass = "copy-items-modal";
            config.disableClose = true;
            config.data = {
                data: this.hotelService.formFilled
            }
            let copyDialog = this.dialog.open(HotelSearchLoaderComponent, config);
        }
        // RDD
        this.hotelService.searchResult(data);
        
    }

    private prepareSearchPayloadFromSessionData(sessionKey: string): any {
        const ssd = JSON.parse(localStorage.getItem(sessionKey));
        this.destination=ssd.destination_name;
        let RoomGuests = [];
        ssd['traveller'].forEach(element => {
            this.setAdultChildCount(element);
            RoomGuests.push({
                "NoOfAdults": Number(element['adults']),
                "NoOfChild": Number(element['childrens']),
                "ChildAge":element['childAges']
            })
        });

        let reqBody = {
            "CheckIn": `${ssd['check_in_date']}`,
            "CheckOut": `${ssd['check_out_date']}`,
            "Currency": 'INR',
            "Market":`${ssd['market']}`,
            "CancellationPolicy": true,
            "CityIds": [
                `${ssd['destination_id']}`
            ],
            "GuestNationality":`${ssd['GuestNationality']}`,
            "NoOfNights": `${ssd['noOfNights']}`,
            "CheckInTime":`${ssd['check_in_time']}`,
            "CheckOutTime":`${ssd['check_out_time']}`,
            NoOfRooms: Number(ssd['traveller'].length),
            RoomGuests,
            booking_source: `${ssd['destination_source']}`
        }
        return reqBody;
    }

    onBookNow(hotel: any,isPolicy?) {
        this.currentUser = JSON.parse(localStorage.getItem('studentCurrentUser'));
        let bookingType=localStorage.getItem('bookingType');
        (this.currentUser && this.currentUser.auth_role_id==2 && bookingType!='Personal')? this.setPolicyData(hotel):null;
        this.hotelService.loading.next(true);
        this.subs.sink = this.apiHandlerService.apiHandler('hotelDetails', 'POST', '', '', {
            ResultToken: hotel['ResultIndex'],
            booking_source: hotel['booking_source']
        }).subscribe(res => {
            if (res.data.length > 0 || res.data) {
                this.hotelService.bookingHotelData.next(res.data);
                localStorage.setItem('b2bBookingHotelData', JSON.stringify(this.hotelService.bookingHotelData.getValue()));
                this.hotelService.resultToken = res.ResultToken;
                this.hotelService.traveller = this.traveller;
                localStorage.setItem('b2bHotelTraveller', JSON.stringify(this.hotelService.traveller));
                this.router.navigate(['/search/hotel/booking']);
            } else {
                this.hotelService.loading.next(false);
                this.swalService.alert.oops(res.Message);
            }
            this.hotelService.loading.next(false);
        },
            (err) => {
                this.hotelService.loading.next(false);
                this.swalService.alert.oops("Unable to proceed with booking");
            });
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


    setPolicyData(hotel) {
        const policyList = JSON.parse(localStorage.getItem('policyList'));
        const policies = [];
        if(policyList && policyList.length>0){
            let starEligibilityCheck=this.showStarRemark? "Beyond Star Eligibility":"Within Star Eligibility";
            let priceEligibilityCheck=this.showPriceRemark? "Beyond Price Eligibility":"Within Price Eligibility";
            if(policyList[0].beyond_star){
                const starPolicy = {
                    PolicyType: 'Star',
                    Eligible: this.policy_star_category,
                    Selected: hotel.StarRating,
                    EligibilityCheck:starEligibilityCheck,
                    Remark: this.starRatingReason
                };
                policies.push(starPolicy);
            }
            if(policyList[0].hotel_beyond_limit){
                const pricePolicy = {
                    PolicyType: 'Price',
                    Eligible: +this.policyPrice,
                    Selected: hotel.Price.Amount,
                    EligibilityCheck:priceEligibilityCheck,
                    Remark: this.priceReason // fixed from this.starRatingReason to this.priceReason
                };
                policies.push(pricePolicy);
            }
            localStorage.setItem('PolicyDetails', JSON.stringify(policies));
        }
    }

    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
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

    ngDoCheck(): void {
    }

    //For map

    mapInitializer() {
        var mapProp = {
            center: new google.maps.LatLng(this.details[0]['Latitude'], this.details[0]['Longitude']),
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP // also use ROADMAP,SATELLITE or TERRAIN
        };

        const svgMarker = {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "#003580",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };

        this.map = new google.maps.Map(document.getElementById("toggleMap"), mapProp);
        var marker = new google.maps.Marker({ position: mapProp.center, icon: svgMarker });

        marker.setIcon(svgMarker)
        marker.setMap(this.map);
        /*var infowindow = new google.maps.InfoWindow({ content: "Hey !! Here we are" });
        infowindow.open(this.map, marker);*/
        // this.setMultipleMarker(this);
        this.setMarkers();
    }


    setMarkers() {
        let infowindow = new google.maps.InfoWindow()
        const svgMarker = {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "#003580",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };
        this.details.forEach((place) => {
            let latlngset = new google.maps.LatLng(place.Latitude, place.Longitude);
            let marker = new google.maps.Marker({
                map: this.map,
                title: place.HotelName,
                position: latlngset,
                icon: svgMarker,
            });
            marker.setIcon(svgMarker)
            this.map.setCenter(marker.getPosition())

            let style_pop_up = 'height="60" width="60"';
            let style_image = 'height="30" width="30"';
            let pop_up_hotel_image = '<img src="' + place['HotelPicture'] + '" ' + style_pop_up + '>';

            //<img src="./assets/images/star_rating_black_' + 0 + '.png" alt="" />
            let $pop_up = `<div style="width:300px; padding:2px;">
            <div class="mapplot" style="color:#3399FE;"> 
            <div class="projimg1" style="float:left;">  ${pop_up_hotel_image} </div> 
            <div class="mapplot_desc"><div style="color: royalblue; font-size: 14px; font-weight:bold;"> 
             ${place.HotelName}, <small style="color:#000;"> ${place.HotelAddress} </small></div> 
             <div style="float:left"> <div class="rating_empty" style="margin-left: 0px;"> 
             <span class="rating-no">
             
             
              </span><h5 class="font-weight-bold"> INR ${place.Price.Amount}</h5> 
              <button id="book" class="btn btn-info">
              <span class="sendapplink-wrapper"><span class="sendapplink-text">Book</span></span></button>
              <p id="resultIndex" style="visibility: hidden; display:none;"> ${place.ResultIndex} </p>
              <p id="bookingSource" style="visibility: hidden; display:none;"> ${place.booking_source} </p>
              </div> </div></div> </div></div>`;
            //	let $pop_up = `${place.HotelName}`;
            let currentInfoWin = true;

            google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                return function () {
                    if (currentInfoWin) {
                        infowindow.close();
                    }
                    infowindow.setContent($pop_up);
                    infowindow.open(this.map, marker);
                    currentInfoWin = true;
                };
            })(marker, place.HotelName, infowindow));

        });

        infowindow.addListener('domready', () => {
            let resultIndex = document.getElementById('resultIndex').innerHTML;
            let bookingSource = document.getElementById('bookingSource').innerHTML;
            let hotel = {
                ResultIndex: resultIndex.trim(),
                booking_source: bookingSource.trim()
            }
            document.getElementById("book").addEventListener("click", () => {
                //this.showRooms(val);
                this.onBookNow(hotel)
            });
        });

    }

    convert(price, cur) {
        return `${cur} ${price}`
    }

    showEnquiry(i, price, starrating, hotel) {
        this.priceReason = '';
        this.starRatingReason = '';
        this.showPriceRemark = false;
        this.showStarRemark = false;
        const policyList = JSON.parse(localStorage.getItem('policyList'));
        let bookingType=localStorage.getItem('bookingType');
        let starCategory=this.policy_star_category? this.policy_star_category.split(','):'';
        if(this.currentUser && this.currentUser.auth_role_id==2 && bookingType!='Personal' && policyList && policyList.length>0){
            switch (true) {
                case (this.price_beyond_limit !== 'false' && price > this.policyPrice && price !== 0):
                    this.showPriceRemark = true;
                    this.selectedIndex = i;
                    this.sendEnquiryArr = true;
                case (this.star_beyond_limit !== 'false' && !starCategory.includes(starrating.toString())):
                    this.selectedIndex = i;
                    this.sendEnquiryArr = true;
                    this.showStarRemark = true;
                     break;
                default:
                    this.showPriceRemark = false;
                    this.showStarRemark = false;
                    this.sendEnquiryArr=false;
                    this.onBookNow(hotel);
            }
        }
        else{
            this.showPriceRemark = false;
            this.showStarRemark = false;
            this.sendEnquiryArr=false;
            this.onBookNow(hotel);
        }
        
    }

    
    hideEnquiry(i){
        this.selectedIndex=i
        this.sendEnquiryArr = false;
    }

    showRooms(hotel) {
        // let queryParams = {};
        // this.subSunk.sink = this.hotelService.searchHotelReqBody.subscribe(reqBody => {
        // 	//queryParams = Object.assign({ hotel_ids: [`${hotel['HotelCode']}`] }, reqBody);
        // 	queryParams = Object.assign({ hotel_ids: [hotel] }, reqBody);
        // })
        //this.router.navigate(['/hotel/hotel-details'], { queryParams })
    }
    
    setAdultChildCount(element){
		this.travellerAdult += Number(element['adults']);
		this.travellerChild += Number(element['childrens']);
	}

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
