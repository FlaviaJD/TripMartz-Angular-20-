import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { formatDate } from 'projects/student/src/app/core/services/format-date';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { ThemeOptions } from 'projects/student/src/app/theme-options';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { browserRefresh } from '../../../../../app.component';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { FlightService } from '../../flight.service';
import { TripInfoComponent } from './../flight-details/trip-info/trip-info.component';

@Component({
    selector: 'app-round-trip',
    templateUrl: './round-trip.component.html',
    styleUrls: ['./round-trip.component.scss']
})

export class RoundTripComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

    endSlice: number = 10;
    throttle;
    public browserRefresh: boolean;
    displayedColumns = ['Flights', "Markup Value", 'Markup Type', 'Edit'];
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    showMultiFilter:boolean=true;
    expand: boolean = false;
    anchor: string = '+ More Fare';
    isCollapsed = true;
    subscription: Subscription;
    currency = this.flightService.currency;
    tripType = '';
    departureCity = '';
    departureCityModified = '';
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
    fastestFligtTime = '';
    cheapestFlight: any = 0;
    totalDuration: string = '';
    airline_logo = '';
    serverError = false;ƒ
    noFlight = false;
    searchingFlight = false;
    showModify: boolean = false;
    isCollapsedSearch = true;
    showMobilefilter = true;
    totalAmount=0;
    originCountry = '';
    destCountry = '';
    selectedFlight: any[] = [];
    totalDisplayFare;
    @Output() returnResult: EventEmitter<any> = new EventEmitter<any>();
    protected subs = new SubSink();
    private searchPayload: any;
    read?: any; static: boolean;
    slideConfig4 = {
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        infinite:false,
    };
    Fstops = [
        { id: 1 },
        { id: 2 },
    ]
    clickedIndex: number | null = null; // Variable to store the clicked flight index
    clickedColoumnIndex: number | null = 0;
    isMulticity:boolean=false;
    sectorInfo;
    @ViewChild('scrollTwo', { static: true }) public scrollTwo: 
    ElementRef<any>;
    @ViewChild('scrollOne', { static: true }) public scrollOne: 
    ElementRef<any>;
    sendEnquiryArr: boolean;
    beyond_limit_reason='';
    loggedInUser: any;
    fareRuleData: any[];
    showFareRule: boolean;
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
        private dialog: MatDialog,
        public globals: ThemeOptions,
        private alertService: SwalService,
    ) { }

     scrollRight(): void {
        this.scrollTwo.nativeElement.scrollTo({ left: (this.scrollTwo.nativeElement.scrollLeft + 426), behavior: 'smooth' });
    }
    
     scrollLeft(): void {
        this.scrollTwo.nativeElement.scrollTo({ left: (this.scrollTwo.nativeElement.scrollLeft - 426), behavior: 'smooth' });
    }

    ngOnInit() {
        this.browserRefresh = browserRefresh;
        if (this.browserRefresh) {
            this.flightService.loading.next(true);
            this.subs.sink = this.flightService.loading.subscribe(res => {
                this.loading = res;
            });
        }
        let flightSearchPostdata = this.prepareSearchPayloadFromSessionData('flightSearchData');
        this.flightService.formFilled = JSON.parse(localStorage.getItem('flightSearchData'));
        this.searchResult(flightSearchPostdata);
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
            if (!res.length || res.every(arr => Array.isArray(arr) && arr.length === 0)) {
                this.flights = [];
                this.clickedColoumnIndex =0
            } else {
                if(!this.flightService.isDomesticFlightSelected){
                   this.returnResult.emit(true);
                   return;
               }
                 this.flights = res;
                 this.cd.detectChanges();
                if(this.flights){
                    this.setIsMorePriceVisible(this.flights);
                }
                this.flights.length ? this.dialog.closeAll() : ""
                if (!this.loading) {
                    setTimeout(_ => {
                        this.dialog.closeAll();
                        this.globals.sidebarHover = true;
                    }, 100);
                }
            }
        });

        this.subs.sink = this.flightService.setModel.subscribe(res => {
            if(res){
                this.setupModelContent(this.flights);
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
        console.log(w);
        if (w < breakpoint) {
            this.isCollapsedSearch = false;
            this.showModify = false;
            this.showMobilefilter = false;
            console.log('filter',this.showMobilefilter)
          return true;
        } else {
            
          return false;
        }
      }
      isCollapsedModify(){
        this.showModify = true;
      }
      toggleModifyFlight() {
        this.showModify = !this.showModify;
      }
   
    showEnquiry() {
        this.loggedInUser = JSON.parse(localStorage.getItem('studentCurrentUser'));
        let bookingType=localStorage.getItem('bookingType');
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        if (this.loggedInUser && (this.loggedInUser.auth_role_id !== 2)|| policyList && policyList.length==0 || bookingType=='Personal') {
            localStorage.removeItem('flightPricePolicy');
            this.onBookNow();
        } else {
            const policyList = JSON.parse(localStorage.getItem('policyList')) || [];
            const cabinClass = localStorage.getItem('cabinClass');
            this.validatePricePolicy(policyList, cabinClass);
        }
    }
    
    validatePricePolicy(policyList, cabinClass) {
        if (policyList.length === 0) {
            this.sendEnquiryArr = false;
            localStorage.setItem('selectedPrice', null);
            return;
        }
    
        const policy = policyList[0];
        const isDomestic = this.flightService.is_domestic;
        if (isDomestic) {
            this.checkPolicyType(policy, cabinClass, policy.dom_beyond_limit);
        } else if (!isDomestic) {
            this.checkPolicyType(policy, cabinClass, policy.int_beyond_limit);
        }
    }
    
    checkPolicyType(policy, cabinClass, beyondLimit) {
        let records = [];
        if (this.flightService.is_domestic) {
            records = policy.policyFlights.slice(0, 3);
        } else {
            records = policy.policyFlights.slice(3, 6);
        }
    
        const selectedRecord = records.find(record => record.cabin === this.flightService.getCabinType(cabinClass));
        if (selectedRecord) {
            if (this.isMulticity && this.totalDisplayFare > selectedRecord.upper_limit && beyondLimit) {
                localStorage.setItem('selectedPrice', selectedRecord.upper_limit);
                this.sendEnquiryArr = true;
            }
            else if (this.isMulticity && this.totalDisplayFare > selectedRecord.upper_limit && !beyondLimit) {
                this.alertService.alert.oops('Policy Is Not Enabled');
                this.sendEnquiryArr = false;
                localStorage.setItem('selectedPrice', null);
                return;
                // } else if (!this.isMulticity && this.selectedFlight[0].Price.TotalDisplayFare > selectedRecord.upper_limit) {
            //     localStorage.setItem('selectedPrice', selectedRecord.upper_limit);
            //     this.sendEnquiryArr = true;
            // } else if (!this.isMulticity && this.selectedFlight[1].Price.TotalDisplayFare > selectedRecord.return_upper_limit) {
            //     localStorage.setItem('selectedPrice', selectedRecord.return_upper_limit);
            //     this.sendEnquiryArr = true;
        } else if (!this.isMulticity && this.totalDisplayFare > selectedRecord.return_upper_limit && beyondLimit) {
                localStorage.setItem('selectedPrice', selectedRecord.return_upper_limit);
                this.sendEnquiryArr = true;
             } else if (!this.isMulticity && this.totalDisplayFare > selectedRecord.return_upper_limit && !beyondLimit) {
                this.alertService.alert.oops('Policy Is Not Enabled');
                this.sendEnquiryArr = false;
                localStorage.setItem('selectedPrice', null);
                return;
            }
            else {
                localStorage.setItem('selectedPrice', null);
                this.sendEnquiryArr = false;
                localStorage.removeItem('flightPricePolicy');
                this.onBookNow();
            }
        }
    }
    

    onScrollDown() {
        this.endSlice += 10;
    }

    onScrollUp() {
        if (this.endSlice != 10) {
            this.endSlice -= 10;
        }
    }

    ngAfterViewChecked() {
    }

    async onBookNow() {
       let bookingType=localStorage.getItem('bookingType');
       this.loggedInUser.auth_role_id==2 && bookingType!='Personal' ? this.setPolicyValue():localStorage.removeItem('flightPricePolicy');
        let resultToken = [];
        let booking_source=[];
        this.flightService.loading.next(true);
        for (let flight of this.selectedFlight) {
            let token = flight.Price.ResultToken ? flight.Price.ResultToken : flight.ResultToken;
            resultToken.push(token);
            booking_source.push(flight.booking_source);
        }
        if (this.selectedFlight[0].IsPanMandatory == 'true' || this.selectedFlight[0].IsPanMandatory == 'true') {
            this.flightService.isPanMandatory = true;
        }
        // if (this.selectedFlight[0].IsPassportMandatory=='true' || this.selectedFlight[0].IsPassportMandatory=='true') {
        //     this.flightService.isPassportMandatory = true;
        // }
        this.flightService.setPassport(this.flightService.isPanMandatory,this.flightService.is_domestic);
        this.flightService.loading.next(true);
        const req: any = {
            ResultToken: resultToken,
            booking_source: this.selectedFlight[0].booking_source,
        }
        if (1) {
                req.UserType = 'B2B';
                req.UserId = this.util.readStorage('studentCurrentUser', localStorage)['id'];
            }
            this.subs.sink = this.apiHandlerService.apiHandler('updateFareQuote', 'POST', '', '', req).subscribe(res => {
                if ((res.statusCode == 200 || res.statusCode == 201) && res.data && Object.keys(res.data).length != 0) {
                    const journeyListPre = res.data.UpdateFareQuote.FareQuoteDetails;
                    journeyListPre.JourneyList['searchResultToken'] = resultToken;
                    this.flightService.bookingFlightData.next(journeyListPre);
                    this.flightService.resultToken = journeyListPre.JourneyList.ResultToken;
                    this.flightService.bookingSource.next(this.selectedFlight[0].booking_source);
                    this.flightService.traveller = this.traveller;
                   // this.flightService.getFlightType(journeyListPre.JourneyList);
                    this.flightService.setLocalStrorage(journeyListPre,journeyListPre.JourneyList);                    //this.flightService.getFlightType(journeyListPre.JourneyList);
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

    ngAfterViewInit() {
        setTimeout(() => {
        });
    }
    showFilter(){
        this.showMultiFilter=true;
        this.cd.detectChanges();
    }

    setPolicyValue(){
        let selectedPrice = localStorage.getItem('selectedPrice');
        let eligibilityCheck=this.sendEnquiryArr? "Beyond Price Eligibility":"Within Price Eligibility";  
       const policies = [];
        const pricePolicy = {
            PolicyType: 'Pricing',
            EligibilityCheck:eligibilityCheck,
            Eligible: +selectedPrice,
            Selected: this.totalDisplayFare,
            Remark: this.beyond_limit_reason // fixed from this.starRatingReason to this.priceReason
        };
        policies.push(pricePolicy);
        localStorage.setItem('flightPricePolicy', JSON.stringify(pricePolicy))
    }

    closeFilterTab() {
        this.showMultiFilter=false;   
        this.cd.detectChanges();
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
                    // const dt = (params['departureDate']).split(' - ');
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
        this.selectedFlight=[];
        this.totalDisplayFare=0
        this.sectorInfo=data.Segments;
        data.JourneyType=='multicity'?this.isMulticity=true:this.isMulticity=false;
        data.JourneyType == 'multicity' ?
        this.flightService.isDomesticFlight('','',data.Segments) : this.flightService.isDomesticFlight(data.Segments[0]['Origin'], data.Segments[0]['Destination']);
        if (
            (!this.flightService.isDomesticFlightSelected && data.JourneyType !== 'Return')
        ) {
            this.returnResult.emit(true);
            return;
        }
        if (data.JourneyType == 'multicity') {
            this.returnResult.emit(true);
            this.showMultiFilter = false;
        }

        if (data.JourneyType == 'Return') {
            this.showMultiFilter=true;
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

    onHide() {
        this.showFareRule = false;
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
                    CabinClass: (ssd.tripType == 'Oneway') ? ssd.CabinClass : undefined,
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
        this.subs.unsubscribe();
    }
    showFareDetails = false;
    showFare(event) {
        this.showFareDetails = event;
        this.cd.detectChanges();
    }

    setSelectedFlight(flight, exchangePrice, columnIndex, flightList) {
        this.flightService.selectedFare.next(exchangePrice);
        this.sendEnquiryArr=false;
        this.beyond_limit_reason='';
        if(flightList){
            flightList.forEach(flight => {
                flight.isSelected = false;
            });
        }
        let selectedValue = { ...flight }; // Create a shallow copy of the flight object
        if (flight.Price) {
            selectedValue.Price = { ...flight.Price };
        }
        if (exchangePrice) {
            selectedValue.Price = exchangePrice;
        }
        if(flight) {
            flight.isSelected=true;
        }
        this.totalDisplayFare=0;
        this.selectedFlight[columnIndex] = selectedValue;
        for (let flight of this.selectedFlight) {
            // Ensure flight and flight.Price are not null or undefined
            if (flight && flight.Price && flight.Price.TotalDisplayFare) {
                this.totalDisplayFare += Number(flight.Price.TotalDisplayFare);
            }
        }
    }

    returnToResult(){
        if(!this.flightService.isDomesticFlightSelected){
            this.returnResult.emit(true);
        }
        else{
        }
    }

    trackByIndex(index: number, item: any) {
        return index; // Return the index as the unique identifier
    }

    onClickFlight(index: number) {
        this.clickedIndex = index; // Update clickedIndex when a flight is clicked
      }

      onClick(columnIndex){
        this.clickedColoumnIndex = columnIndex; // Update clickedIndex when a flight is clicked
        this.flightService.selectedSector=columnIndex;
      }

    setIsMorePriceVisible(flights){
        flights.forEach((journey: any[], index: number) => {
            journey.forEach((flight => {
                flight.isMorePriceVisible = true
            }))
        });
        this.cd.detectChanges();
    }

    setupModelContent(flights) {
        if (flights) {
            this.selectedFlight=[];
            // Assuming you have a loop where you can access the index
            for (let index = 0; index < flights.length; index++) {
                this.setSelectedFlight(flights[index][0],'',index,'');
            }
        }
    }

    toggleMorePriceVisibility(flight): void {
        flight.isMorePriceVisible = !flight.isMorePriceVisible;
    }

   
}
