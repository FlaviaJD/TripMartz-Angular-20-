import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { formatDate } from 'projects/employee/src/app/core/services/format-date';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { UtilityService } from 'projects/employee/src/app/core/services/utility.service';
import { ThemeOptions } from 'projects/employee/src/app/theme-options';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { browserRefresh } from '../../../../app.component';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { FlightService } from '../flight.service';
import { tempFareQuaote } from '../flight.temp.service';
import { TripInfoComponent } from './flight-details/trip-info/trip-info.component';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('flteboxwrp', {static:false}) flteboxwrp!: ElementRef;
    endSlice: number = 20;
    throttle;
    public browserRefresh: boolean;
    displayedColumns = ['Flights', "Markup Value", 'Markup Type', 'Edit'];
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    isCollapsed = true;
    // showModify = true;
    showModify: boolean = false;
    isCollapsedSearch = true;
    isBottomReached = false;
    showMobilefilter = true;
    subscription: Subscription;
    currency = this.flightService.currency;
    expand: boolean = false;
    tripType = '';
    showFareRule=false;
    departureCity = '';
    departureCityModified = '';
    showCarousel = true;
    departureDate: any = '';
    destinationCity = '';
    destinationCityModified = '';
    returnDate: any = '';
    traveller: any;
    travellerCount = 1;
    travellerString: any;
    displayCities = [];
    flights: any = [];
    flightsCopy: any = [];
    myValue = 9999;
    minPrice = 1000;
    maxPrice = 9999;
    loading: boolean;
    totalFlights = 0;
    fastestFligtTime = '';
    cheapestFlight: any = 0;
    totalDuration: string = '';
    airline_logo = '';
    serverError = false;
    noFlight = false;
    searchingFlight = false;
    originCountry = '';
    destCountry = '';
    protected subs = new SubSink();
    private searchPayload: any;
    Fstops = [
        { id: 1 },
        { id: 2 },
    ]
    showRoundTripUI:boolean=false;
    MulticiyRoundUI:boolean=false;
    sendEnquiryArr=false;
    userId:any;
    priceResultToken:string;
    selectedPrice:any=[];
    isCollapsedArr = []
    selectedIndex;
    flight_departure_noOfDays: string;
    flight_is_day_to_departure: string;
    beyond_days: string;
    showDatePolicy: string;
    mobileModify: boolean = false;
    hasUserScrolled: boolean = false;
    private initialOffsetTop: number = 0; 
    resultToken: any;
    booking_source: any;
    fareRuleData: any[];
    noData: boolean;
    onStopSelection(s) {
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private flightService: FlightService,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService,
        private cd: ChangeDetectorRef,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        public globals: ThemeOptions,
        private alertService: SwalService,
        private swalService: SwalService,
        private cdRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.userId= JSON.parse(localStorage.getItem('currentUser'))['id']
        this.browserRefresh = browserRefresh;
        if (this.browserRefresh) {
            this.flightService.loading.next(true);
            this.subs.sink = this.flightService.loading.subscribe(res => {
                this.loading = res;
            });
            let flightSearchPostdata = this.prepareSearchPayloadFromSessionData('flightSearchData');
            this.flightService.formFilled = JSON.parse(localStorage.getItem('flightSearchData'));
            if(flightSearchPostdata.JourneyType=='Return' ){
                flightSearchPostdata.JourneyType == 'multicity' ?
                this.flightService.isDomesticFlight('','',flightSearchPostdata.Segments) : this.flightService.isDomesticFlight(flightSearchPostdata.Segments[0]['Origin'], flightSearchPostdata.Segments[0]['Destination']);
            if(!this.flightService.isDomesticFlightSelected){
                this.showRoundTripUI=false;
                this.MulticiyRoundUI=false;
                this.searchResult(flightSearchPostdata);
            }
            else{
                this.showRoundTripUI=true;
                return;
            }
        }
        else{
            this.showRoundTripUI=false;
            this.searchResult(flightSearchPostdata);
        }
            
        } else {
            this.searchPayload = this.prepareSearchPayloadFromSessionData('flightSearchData');
            this.flightService.formFilled = JSON.parse(localStorage.getItem('flightSearchData'));
            if(this.searchPayload.JourneyType=='Return')
            {
                this.searchPayload.JourneyType == 'multicity' ?
                    this.flightService.isDomesticFlight('','',this.searchPayload.Segments) : this.flightService.isDomesticFlight(this.searchPayload.Segments[0]['Origin'], this.searchPayload.Segments[0]['Destination']);
                if (!this.flightService.isDomesticFlightSelected) {
                    this.showRoundTripUI = false;
                this.searchResult(this.searchPayload);
            }
            else{
                this.showRoundTripUI=true;
                return;
            }
        }
        else{
            this.showRoundTripUI=false;
            this.searchResult(this.searchPayload);
        }
        }
        this.flightService.loading.next(true);
        this.flightService.dialogClose.next(false);
        this.originCountry = this.flightService.originCountry['CountryName'];
        this.destCountry = this.flightService.destCountry['CountryName'];
        this.airline_logo = this.flightService.airline_logo;
        this.subs.sink = this.flightService.searchingFlight.subscribe(res => {
            this.searchingFlight = res;
        });
        this.subs.sink = this.flightService.serverError.subscribe(res => {
            this.serverError = res;
        });
        this.subs.sink = this.flightService.loading.subscribe(res => {
            this.loading = res; 
        });
        this.subs.sink = this.flightService.flights.subscribe(res => {
            if (!res.length) {
                this.flights = [];
            } else {
                if(this.flightService.isDomesticFlightSelected && this.flightService.tripType.getValue()!='Multi-city'){
                    this.showRoundTripUI=true;
                    return;
                }
                this.setResponse(res);
            }
                
        });
       
        this.subs.sink = this.flightService.myValue.subscribe(res => {
            this.myValue = res;
        });
        this.subs.sink = this.flightService.minPrice.subscribe(res => {
            this.minPrice = res;
        });
        this.subs.sink = this.flightService.maxPrice.subscribe(res => {
            this.maxPrice = res;
        });
        this.subs.sink = this.flightService.isCollapsed.subscribe(res => {
            this.isCollapsed = res;
        });

        this.subs.sink = this.flightService.noFlight.subscribe(res => {
            this.noFlight = res;
        });
        this.flightService.closeModel.subscribe(res => {
            if (res)
            this.dialog.closeAll();
        });
        this.flightService.close.subscribe(res => {
            if (res){
                this.loading=false;
                this.searchingFlight=false;
                this.dialog.closeAll();
                this.cd.detectChanges();
            }
        });
       // this.flightService.loading.next(false);
        this.subs.sink = this.flightService.dialogClose.subscribe(res => {
            if (res)
                this.dialog.closeAll();
        })

        this.mobileModify = this.getIsMobile();
        //this.isCollapsedSearch = false;
        window.onresize = () => {
          this.mobileModify = this.getIsMobile();
          this.isCollapsedSearch = this.getIsMobile();
        };
        
        
    }

 
    @HostListener('window:scroll', [])
  onWindowScroll(): void {
    //this.checkFixedPosition();  // Check position on every scroll event
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

  toggleModifyFlight() {
    this.showModify = !this.showModify;
  }
  
  ngAfterViewChecked() {
    }

    async onBookNow(resultTokendata) {
        let loggedInUser= JSON.parse(localStorage.getItem('currentUser'));
        let bookingType=localStorage.getItem('bookingType');
        (!this.sendEnquiryArr && loggedInUser && loggedInUser.auth_role_id==2 && bookingType!='Personal')?this.setPrice():null;
        let resultToken=this.selectedPrice.ResultToken?this.selectedPrice.ResultToken :resultTokendata.ResultToken;
        this.flightService.isPanMandatory = resultTokendata.IsPanMandatory === 'true';
        // this.flightService.isPassportMandatory = this.flightService.is_domestic;
        this.flightService.setPassport(this.flightService.isPanMandatory,this.flightService.is_domestic);
        this.flightService.loading.next(true);
        if (this.flightService.isDevelopment) {
            const res = tempFareQuaote();
            const journeyListPre = res.data.UpdateFareQuote.FareQuoteDetails.JourneyList;
            this.flightService.bookingFlightData.next(journeyListPre);

            this.flightService.traveller = this.traveller;
            setTimeout(_ => {
                this.flightService.loading.next(false);
                this.router.navigate(['/search/flight/booking']);
            }, 3000);
        } else {
            this.flightService.loading.next(true);
            const req: any = {
                ResultToken: [resultToken],
                booking_source: resultTokendata.booking_source,
            }
            if (1) {
                req.UserType = 'B2B';
                req.UserId = this.util.readStorage('currentUser', localStorage)['id'];
            }
            
            this.subs.sink = this.apiHandlerService.apiHandler('updateFareQuote', 'POST', '', '', req).subscribe(res => {
                if ((res.statusCode == 200 || res.statusCode == 201) && res.data && Object.keys(res.data).length != 0) {
                    const journeyListPre = res.data.UpdateFareQuote.FareQuoteDetails;
                    journeyListPre.JourneyList['searchResultToken'] = resultTokendata.ResultToken;
                    this.flightService.bookingFlightData.next(journeyListPre);
                    this.flightService.resultToken = journeyListPre.JourneyList.ResultToken;
                    this.flightService.bookingSource.next(resultTokendata.booking_source);
                    const randomTwoDigit = Math.floor(Math.random() * 90 + 10);
                    const randomNumber = new Date().valueOf();
                    this.flightService.traveller = this.traveller;
                   // this.flightService.getFlightType(journeyListPre.JourneyList);
                    this.flightService.setLocalStrorage(journeyListPre,resultTokendata);
                    this.router.navigate(['/search/flight/booking']);
                } else if ((res.statusCode == 200 || res.statusCode == 201) && res.Message != "") {
                    this.flightService.loading.next(false);
                    this.alertService.alert.oops(res.Message);
                } else {
                    this.flightService.loading.next(false);
                    this.alertService.alert.oops(res.Message);
                }
                this.flightService.loading.next(false);
            }, (err: HttpErrorResponse) => {
                this.flightService.loading.next(false);
                this.alertService.alert.oops(err.error.Message);
            });
        }
    }

    setPrice() {
        let selectedPrice = localStorage.getItem('selectedPrice');
        const policies = [];
        const pricePolicy = {
            PolicyType: 'Pricing',
            Eligible: +selectedPrice,
            Selected: +this.selectedPrice.TotalDisplayFare,
            EligibilityCheck:'Within Price Eligibility',
            Remark: ''
        };
        policies.push(pricePolicy);
        localStorage.setItem('flightPricePolicy', JSON.stringify(pricePolicy))
    }

    ngAfterViewInit() {
        this.initialOffsetTop = this.flteboxwrp.nativeElement.offsetTop;
         this.checkFixedPosition();  // Initial check
        setTimeout(() => {
        });
    }

    setTripData(params) {
        this.tripType = params['tripType'];
        if (params['tripType'] == 'Multi-city') {
            this.displayCities = params['cities'];
        } else {
            this.departureCity = params['departureCity'];
            var x = params['departureCity'].lastIndexOf(",");
            this.departureCityModified = params['departureCity'].substring(x + 1);
            if (params['departureDate'] != '') {
                if (params['tripType'] == 'Roundtrip') {
                    this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                    this.returnDate = moment(params['returnDate']).format("DD/MM/YYYY");
                    // this.departureDate = new Date(params['departureDate']);
                    // this.returnDate = new Date(params['returnDate']);
                } else {
                    this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                    // this.departureDate = new Date(params['departureDate']);
                }
            }
            this.destinationCity = params['destinationCity'];
            var y = params['destinationCity'].lastIndexOf(",");
            this.destinationCityModified = params['destinationCity'].substring(y + 1);
        }
        this.traveller = params['traveller'];
        this.travellerCount = this.traveller['adults'] + this.traveller['childrens'] + this.traveller['infants'];
        this.travellerString = params['traveller'];
    }

    searchResult(data: any) {
     data.JourneyType == 'multicity' ?
     this.flightService.isDomesticFlight('','',data.Segments) : this.flightService.isDomesticFlight(data.Segments[0]['Origin'], data.Segments[0]['Destination']);
     if((data.JourneyType=='Return' ) && this.flightService.isDomesticFlightSelected){
        this.showRoundTripUI=true;
        return;
     }
       
        if (data['booking_source']) {
            delete data['booking_source'];
        }
        this.util.writeStorage("flightSearchPostdata", data, localStorage)
        const params = this.flightService.formFilled;
        if (params) {
            this.tripType = params['tripType'];
            this.flightService.tripType.next(this.tripType);
            if (params['tripType'] == 'Multi-city') {
                this.displayCities = params['cities'];
            } else {
                this.departureCity = params['departureCity'];
                if (params['departureCity'] != undefined) {
                    var x = params['departureCity'].lastIndexOf(",");
                    this.departureCityModified = params['departureCity'].substring(x + 1);
                }
                if (params['departureDate'] != '') {
                    if (params['tripType'] == 'Roundtrip') {
                        this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                        this.returnDate = moment(new Date(params['returnDate'])).format("DD/MM/YYYY");
                    } else {
                        this.departureDate = moment(params['departureDate']).format("DD/MM/YYYY");
                    }
                }
                this.destinationCity = params['destinationCity'];
                if (params['destinationCity'] != undefined) {
                    var y = params['destinationCity'].lastIndexOf(",");
                    this.destinationCityModified = params['destinationCity'].substring(y + 1);
                }
            }
            if (params['traveller']) {
                this.traveller = params['traveller'];
                this.travellerCount = this.traveller['adults'] + this.traveller['childrens'] + this.traveller['infants'];
                this.travellerString = params['traveller'];
            }
            let config = new MatDialogConfig();
            config.height = '600px';
            config.width = '1000px';
            config.panelClass = "copy-items-modal";
            config.disableClose = true;
            config.data = {
                data: this.flightService.formFilled
            }
            let copyDialog = this.dialog.open(TripInfoComponent, config);
        }
        this.flightService.searchResult(data);
    }

    getAirportCode(parantesis: string) {
        return parantesis.match(/\(([^)]+)\)/)[1]
    }

    convertDates(data) {
        const date = data[0],
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    resetFilter() {
        this.flightService.resetFilter();
    }

    stops(flight: any) {
        return flight.length - 1;
    }

    stopsAirportCodes(flight: any) {
        const codes = [];
        flight.forEach(e => {
            codes.push(e.Destination.AirportCode);
        });
        codes.pop();
        return codes.join(' -> ');
    }

    duration(flight) {
        return this.flightService.duration(flight);
    }

    flightDataStringify(flight: any) {
        return JSON.stringify(flight);
    }

    checkDays(flight: any) {
        if (typeof flight == 'object') {
            const time = flight;
            const dt = time[0].Origin.DateTime.split(" ");
            let days = 0;
            let dt2: any;
            if (time.length > 1) {
                dt2 = time[time.length - 1].Destination.DateTime.split(" ");
            } else {
                dt2 = time[0].Destination.DateTime.split(" ");
            }
            const origin: any = new Date(dt[0]);
            const destination: any = new Date(dt2[0]);
            days = Math.floor((destination - origin) / (1000 * 60 * 60 * 24));
            return days;
        }
    }

    mobileFilter(){
        this.showMobilefilter = true;
    }

    closeFilter(){
        this.showMobilefilter = false;
    }
    getIsMobile(): boolean {
        
        const w = document.documentElement.clientWidth;
        const breakpoint = 992;
        if (w < breakpoint) {
            this.isCollapsedSearch = false;
            this.showModify = false;
            this.showMobilefilter = false;
          return true;
        } else {
            
          return false;
        }
      }
      isCollapsedModify(){
        this.showModify = true;
      }
    private prepareSearchPayloadFromSessionData(sessionKey: string): any {
        const ssd = JSON.parse(localStorage.getItem(sessionKey));
        let segments = [];
        const pattern = /\(([^)]+)\)/;
        if (ssd.tripType == 'Multi-city') {
            ssd.tripType = 'multicity';
            ssd.cities.forEach((e) => {
                const Origin = e.mDepartureCity;
                const OriginAirport = e.mDeparture;
                const Destination = e.mDestinationCity;
                const DestinationAirport = e.mDestination;
                const DepartureDate = formatDate(e.mDepartureDate, "");
                segments.push({
                    Origin: Origin,
                    OriginAirport:OriginAirport,
                    Destination:
                        Destination ,
                    DestinationAirport:DestinationAirport,
                    DepartureDate: DepartureDate + "T00:00:00",
                    CabinClass: ssd.CabinClass
                });
            });
        } else {
            segments = [
                {
                    CabinClass: ssd.CabinClass,
                    CabinClassOnward: ssd.CabinClass,
                    CabinClassReturn: ssd.CabinClass,
                    DepartureDate: moment(ssd.departureDate).format("YYYY-MM-DD[T00:00:00]"),
                    ReturnDate: (ssd.tripType == 'Roundtrip') ? moment(ssd.returnDate).format("YYYY-MM-DD[T00:00:00]") : undefined,
                    Destination: ssd.destinationCity,
                    Origin: ssd.departureCity
                }
            ];
        }
        let searchReq = {
            AdultCount: ssd.traveller.adults,
            ChildCount: ssd.traveller.childrens,
            InfantCount: ssd.traveller.infants,
            JourneyType: (ssd.tripType == 'Roundtrip') ? 'Return' : ssd.tripType,
            PreferredAirlineName: ssd.PreferredAirline == '' ? 'All' : ssd.PreferredAirline,
            PreferredAirlines: ssd.PreferredAirlineCode == '' ? '' : [ssd.PreferredAirlineCode],
            NonStopFlights: ssd.connectivity == 'Direct Flights' ? 1 : 0,
            Segments: segments,
            childDOB:ssd.traveller.childDateOfBirth,
            infantDOB:ssd.traveller.infantDateOfBirth
        }
        return searchReq;
    }

    extractCity(city) {
        if (city) {
            let c = city.split("(")
            return c[0] + ' (' + (c[1].replace(")", "")) + ')';
        } else {
            return '';
        }
    }

    getTime(date: any) {
        return date.substr(11, 5);
    }

    ngOnDestroy() {
        this.flightService.modifySearch.next(false);
        this.subs.unsubscribe();
    }
    showFareDetails = false;
    showFare(event) {
        this.showFareDetails = event;
        this.cd.detectChanges();
    }

    showResult(event) {
        this.ngOnInit();
    }

    setResponse(res) {
        this.flights = res;
        this.sendEnquiryArr=false;
        localStorage.removeItem('flightPricePolicy');
        this.getPolicyValues();
        this.flights.length ? this.dialog.closeAll() : ""
        if (!this.loading) {
            setTimeout(_ => {
                this.dialog.closeAll();
                this.globals.sidebarHover = true;
            }, 100);
        }
        this.isCollapsedArr = new Array(this.flights.length).fill(true);
    }

    showRoundTrip(){
        if(this.flightService.isDomesticFlightSelected){
            this.showRoundTripUI=true;
        }
        else{
            this.showRoundTripUI=false;
        }
    }

    getPolicyValues(){
        this.flight_departure_noOfDays= localStorage.getItem('flight_departure_noOfDays');
        this.flight_is_day_to_departure= localStorage.getItem('flight_is_day_to_departure');
        this.beyond_days= localStorage.getItem('beyond_days');
        this.showDatePolicy=localStorage.getItem('showDatePolicy');
    }

    onScrollDown() {
        this.endSlice += 20;
    }
    
    onScrollUp() {
        if (this.endSlice != 20) {
            this.endSlice -= 20;
        }
    }

    onModifySearch(){
        this.flightService.modifySearch.next(true);
    }

    showEnquiry(index: any, exchangePrice,flight) {
        let loggedInUser= JSON.parse(localStorage.getItem('currentUser'));
        this.selectedPrice=exchangePrice;
        this.flightService.selectedFare.next(exchangePrice)
        this.selectedIndex = index;
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        if(loggedInUser && (loggedInUser.auth_role_id!=2) || (policyList && policyList.length==0)){
            localStorage.removeItem('flightPricePolicy');
            this.onBookNow(flight);
            return
        }
        this.checkPolicy(flight,exchangePrice);
    }

    checkPolicy(flight,exchangePrice){
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        this.validatePricePolicy(flight, policyList,exchangePrice);
    }


    validatePricePolicy(flight, policyList, exchangePrice) {
        let cabinClass = localStorage.getItem('cabinClass');
            if (policyList && policyList.length > 0 && this.flightService.is_domestic ) {
                this.checkDomestic(flight,policyList, exchangePrice, cabinClass);
            }
            if (policyList && policyList.length > 0 && !this.flightService.is_domestic) {
                this.checkInternational(flight,policyList, exchangePrice, cabinClass);
            }
    }

    checkInternational(flight, policyList, exchangePrice, cabinClass) {
        let internationalRecords = policyList[0].policyFlights.slice(3, 6);
        let selectedRecord = this.flightService.getSelectedRecord(internationalRecords, cabinClass);
        if (selectedRecord && exchangePrice.TotalDisplayFare > selectedRecord.upper_limit && policyList[0].int_beyond_limit) {
            localStorage.setItem('selectedPrice', selectedRecord.upper_limit);
            this.sendEnquiryArr = true;
        } else if (selectedRecord && exchangePrice.TotalDisplayFare > selectedRecord.upper_limit && !policyList[0].int_beyond_limit) {
            this.swalService.alert.oops('Policy Is Not Enabled');
            this.sendEnquiryArr = false;
            localStorage.setItem('selectedPrice', null);
            return;
        } else {
            localStorage.setItem('selectedPrice', selectedRecord.upper_limit);
            this.sendEnquiryArr = false;
            localStorage.removeItem('flightPricePolicy');
            this.onBookNow(flight);
        }
    }

    
    
    checkDomestic(flight, policyList, exchangePrice, cabinClass) {
        let domesticRecords = policyList[0].policyFlights.slice(0, 3);
        let selectedRecord = domesticRecords.find(record => record.cabin === this.flightService.getCabinType(cabinClass));
        if (selectedRecord && exchangePrice.TotalDisplayFare > selectedRecord.upper_limit && policyList[0].dom_beyond_limit) {
            localStorage.setItem('selectedPrice', selectedRecord.upper_limit);
            this.sendEnquiryArr = true;
        } else if (selectedRecord && exchangePrice.TotalDisplayFare > selectedRecord.upper_limit && !policyList[0].dom_beyond_limit) {
            this.swalService.alert.oops('Policy Is Not Enabled');
            this.sendEnquiryArr = false;
            localStorage.setItem('selectedPrice', null);
            return;
        }
        else {
            localStorage.setItem('selectedPrice', selectedRecord.upper_limit);
            this.sendEnquiryArr = false;
            localStorage.removeItem('flightPricePolicy');
            this.onBookNow(flight);
        }
    }
    
    ViewFareRule(value,booking_source){
        this.getFareRule(value,booking_source)
    }

    getFareRule(value,booking_source) {
        this.loading=true;
        this.fareRuleData=[];
        let fareRuleData = {
            ResultToken: value,
            booking_source: booking_source
        }
        this.subs.sink = this.apiHandlerService.apiHandler('fareRule', 'POST', '', '', fareRuleData).subscribe(res => {
            if (res.Status) {
                this.showFareRule=true;
                if (res.data.length) {
                    this.loading=false;
                    this.noData = false;
                    this.fareRuleData = res.data;
                } else {
                    this.showFareRule=true;
                    this.loading=false;
                    this.noData = true;
                    this.fareRuleData=[];
                }
            }
        }, err => {
            this.showFareRule=true;
            this.loading=false;
            this.noData = true;
            this.fareRuleData=[];
        });
    }
   

    hideEnquiry(i){
        this.selectedIndex=i
        this.sendEnquiryArr = false;
    }

    hide(){
        this.showFareRule=false;
    }

    toggleFareRuleModal() {
        this.showFareRule = !this.showFareRule;
      }
    
      onHide() {
        this.showFareRule = false;
      }

    showMorePriceInfo(index:any){
        this.isCollapsedArr.forEach((_, i) => {
			if (i !== index) {
				this.isCollapsedArr[i] = true;
			}
		});
		this.isCollapsedArr[index] = !this.isCollapsedArr[index];
        this.expand = !this.expand;
    }

}

   