import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'projects/agent/src/environments/environment.prod';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { ModalConfigDataI, ModalConfigDefault } from '../../../core/services/mat-modal.service';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { HeaderService } from '../../../shared/components/header/header.service';
import {
    fakeCommitBookingResult,
    fakeFinalBookingResult, tempExtraServices, tempFareQuaote,
    tempTraveller
} from './flight.temp.service';
const baseUrl = environment.IMAGE_URL;
@Injectable({ providedIn: 'root' })
export class FlightService implements OnDestroy {
    protected subs = new SubSink();
    isDevelopment = false;
    currency = 'INR';
    changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
    bookingFlightData = new BehaviorSubject<any>(undefined);
    CommitBookingResponse = new BehaviorSubject<any>(undefined);
    FinalBookingResponse = new BehaviorSubject<any>(undefined);
    traveller: any = this.isDevelopment ? tempTraveller() : undefined;
    extraServices = new BehaviorSubject<any>(undefined);
    flightSearchData: BehaviorSubject<{}[]> = new BehaviorSubject<any>([]);
    resultToken: any;
    appReference: any;
    bookingSource = new BehaviorSubject<any>('');
    cabinClass: any;
    modalData: any;
    loading = new BehaviorSubject<boolean>(false);
    isCollapsed = new BehaviorSubject<boolean>(true);
    proceedBooking=new BehaviorSubject<boolean>(true);
    enableBooking=new BehaviorSubject<boolean>(true);
    close = new BehaviorSubject<boolean>(false);
    internalCall = false;
    selectedFare=new BehaviorSubject<object>({});
    private _flightsCopy: any = [];
    isDomesticMulticity:boolean=false;
    private _maxPrice: any = 0;
    private _minPrice: any = 0;
    originCountry = new BehaviorSubject<object>({});
    destCountry = new BehaviorSubject<object>({});
    flights = new BehaviorSubject<any>([]);
    flightsCopy = new BehaviorSubject<any>([]);
    maxPrice = new BehaviorSubject<any>(0);
    minPrice = new BehaviorSubject<any>(0);
    myValue = new BehaviorSubject<any>(0);
    myValueStart = new BehaviorSubject<any>(0);
    tripType = new BehaviorSubject<any>('Oneway');
    zeroStopActive = new BehaviorSubject<boolean>(true);
    oneStopActive = new BehaviorSubject<boolean>(true);
    multipleStopsActive = new BehaviorSubject<boolean>(true);
    multipleStopsPrice = new BehaviorSubject<boolean>(false);
    departureReset = new BehaviorSubject<boolean>(false);
    earlyMorning = new BehaviorSubject<boolean>(true);
    setModel = new BehaviorSubject<boolean>(false);
    morning = new BehaviorSubject<boolean>(true);
    midDay = new BehaviorSubject<boolean>(true);
    evening = new BehaviorSubject<boolean>(true);
    arrivalReset = new BehaviorSubject<boolean>(false);
    earlyMorning2 = new BehaviorSubject<boolean>(true);
    morning2 = new BehaviorSubject<boolean>(true);
    midDay2 = new BehaviorSubject<boolean>(true);
    evening2 = new BehaviorSubject<boolean>(true);
    airlines = new BehaviorSubject<any>([]);
    airlinesReset = new BehaviorSubject<boolean>(false);
    nearbyAirports = new BehaviorSubject<any>([]);
    nearbyAirportsReset = new BehaviorSubject<boolean>(false);
    stopovers = new BehaviorSubject<any>([]);
    stopoversReset = new BehaviorSubject<boolean>(false);
    preferencesReset = new BehaviorSubject<boolean>(false);
    stopsReset = new BehaviorSubject<boolean>(false);
    refundable = new BehaviorSubject<boolean>(true);
    nonRefundable = new BehaviorSubject<boolean>(true);
    baggage = new BehaviorSubject<boolean>(true);
    airlinesCarousel = new BehaviorSubject<any>([]);
    airline_logo = baseUrl+'/airline_logo/';
    airlineCarouselClick = new BehaviorSubject<any>(null);
    serverError = new BehaviorSubject<boolean>(false);
    tripTypeClicked = false;
    formFilled: any = false;
    extraFees = new BehaviorSubject<any>({});
    searchingFlight = new BehaviorSubject<any>('');
    applySortingAfterFilter = new BehaviorSubject<boolean>(false);
    currentCurrency = new BehaviorSubject<string>(localStorage.getItem('selectedCurrency') || 'USD');
    currentCurrencyRate = new BehaviorSubject<number>(1);
    searchFlightSubmitted = false;
    searchResponseCopy = new BehaviorSubject<any>(false);
    userTitleList = new BehaviorSubject<any>(false);
    countryList = new BehaviorSubject<any>(false);
    nearByAirportsCopy = new BehaviorSubject<any>([]);
    noFlight = new BehaviorSubject<boolean>(false);
    flightType = new BehaviorSubject<any>('');
    goToDashboardTabs = new BehaviorSubject<any>('');
    bookingType = new BehaviorSubject<any>('Self');
    isredirrection = new BehaviorSubject<any>(false);
    //changeEmitted$ = this.goToDashboardTabs.asObservable();
    private sidebarClickEvents = new BehaviorSubject<any>('');
    changeSidebarTabs$ = this.sidebarClickEvents.asObservable();
    isBaggeProtected: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    baggeProtectionData: BehaviorSubject<any> = new BehaviorSubject<any>({
        isProtected: false,
        data: {}
    });
    selectedSector=0;
    modalConfigData: ModalConfigDataI;
    resultsFound: boolean = false;
    dialogClose = new BehaviorSubject<boolean>(false);
    closeModel= new BehaviorSubject<boolean>(false);
    bookingApiSources = [];
    airlineCode = [];
    isPanMandatory:boolean=false;
    isPassportMandatory:boolean=false;
    isDomesticFlightSelected: boolean = false;
    is_domestic: boolean = false;
    modifySearch = new BehaviorSubject<boolean>(false);
    baggageFees = new BehaviorSubject<any>({});
    seatFees= new BehaviorSubject<any>({});
    mealFees = new BehaviorSubject<any>({});
   // apiList = ['ZBAPINO00015','ZBAPINO00020']; 
    apiList = ['ZBAPINO00002','ZBAPINO00003','ZBAPINO00015']; 
    callCount: any;
    callCountTP: any;
    currentUser: any;
    private key = 'timer';  // The key used to store timer value in localStorage
    constructor(
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private utility: UtilityService,
        private swalService: SwalService,
        private http: HttpClient,
        private headerService: HeaderService,
        private router: Router
    ) {
        this.modalConfigData = ModalConfigDefault;
        if (this.isDevelopment) {
            this.bookingFlightData.next(tempFareQuaote().data.UpdateFareQuote.FareQuoteDetails.JourneyList);
            this.extraServices.next(tempExtraServices().data.ExtraServices.ExtraServiceDetails);
            this.CommitBookingResponse.next(fakeCommitBookingResult().data.CommitBooking.BookingDetails);
            this.FinalBookingResponse.next(fakeFinalBookingResult().data.FinalBooking.BookingDetails);
        }
        this.apiHandlerService.apiHandler('userTitlelist', 'POST').subscribe(res => {
            this.userTitleList.next(res.data);
        });
        this.apiHandlerService.apiHandler('countryList', 'POST').subscribe(res => {
            this.countryList.next(res.data.popular_countries.concat(res.data.countries));
        });
    }

    emitChange(change: any) {
        this.goToDashboardTabs.next(change);
    }

    sidebarEventChange(change: any) {
        this.sidebarClickEvents.next(change)
    }

    saveTime(seconds: number): void {
        localStorage.setItem(this.key, seconds.toString());
      }

    resetFilter() {
        this.internalCall = false;
        this.flights.next(this._flightsCopy);
        this.maxPrice.next(this._maxPrice);
        this.minPrice.next(this._minPrice);
        this.stopsReset.next(true);
        this.departureReset.next(true);
        this.arrivalReset.next(true);
        this.stopoversReset.next(true);
       this.airlinesReset.next(true);
        this.changeDetectionEmitter.emit();
    }

    resetSearch() {
        this.flightsCopy.next([]);
        this.flights.next([]);
        this.maxPrice.next(0);
        this.minPrice.next(0);
        this.myValue.next(0);
        this.myValueStart.next(0);
        this.departureReset.next(false);
        this.arrivalReset.next(false);
        this.nearbyAirportsReset.next(false);
        this.stopoversReset.next(false);
        this.preferencesReset.next(false);
        this.airlinesReset.next(false);
        this.changeDetectionEmitter.emit();
    }

    getCabinClass(): Observable<any> {
        if (!this.cabinClass) {
            this.cabinClass = this.apiHandlerService.apiHandler('cabinClass', 'POST')
                .pipe(
                    map(response => response['Data']['CabinClass']),
                    shareReplay(1)
                );
        }
        return this.cabinClass;
    }

    setModalData(data: any) {
        this.modalData = data;
    }
    counter: number = 0;
    searchResult(data: any) {
        this.saveTime(0);
        data.JourneyType=='multicity'?this.isDomesticMulticity=true:this.isDomesticMulticity=false;
        data.childDOB= data.childDOB.map((child) => child.childDateOfBirth);
        data.infantDOB= data.infantDOB.map((infant) => infant.infantDateOfBirth);
        const created_by_id = this.utility.readStorage('currentUser', localStorage)['user_id'];
        this.searchFlightSubmitted = true;
        this.searchingFlight.next(true);
        this.loading.next(true);
        this.closeModel.next(false);
        if (!data.booking_source || data.booking_source === 'ZBAPINO00002' || data.booking_source === 'ZBAPINO00003' || data.booking_source === 'ZBAPINO00009' || data.booking_source === 'ZBAPINO00008' || data.booking_source === 'ZBAPINO00007') {
            data.UserType = 'B2B';
            data.UserId = this.utility.readStorage('currentUser', localStorage)['id'];
            if (data.booking_source === 'ZBAPINO00002') {
                this.flights.next([]);
            }
        } else {
            delete data['UserType'];
            delete data['UserId'];
        }
        let enabledApiList = this.getEnabledApi();
        let tmx_api = enabledApiList.filter(api => this.apiList.includes(api));
        if ((data.JourneyType == 'Return') && tmx_api && tmx_api.length > 0 && tmx_api[0] != "") {
            this.checkFormDomesticCodes(data);
        }
        else if (tmx_api && tmx_api.length > 0 && tmx_api[0] != "") {
            this.isDomesticFlightSelected = false;
            this.setBookingApiSources(data);
        }
        else {
            this.isDomesticFlightSelected = false;
            this.setBookingApiSourceOld(data);
        }
    }

    checkFormDomesticCodes(data) {
        if (data) {
            let domesticFlight = 
            data.JourneyType == 'multicity' ?
            '' : this.isDomesticFlight(data.Segments[0]['Origin'], data.Segments[0]['Destination']);
            if (domesticFlight) {
                this.setTravelomatixBookingApiSources(data);
            }
            else {
                this.setBookingApiSources(data);
            }
        }
    }

    isDomesticFlight(origin?, destination?, segments?) {
        let enabledApiList = this.getEnabledApi();
        let tmx_api = enabledApiList.filter(api => this.apiList.includes(api));
        let india_airport_list = ['AGR','RDP','AGX','IXE','AJL', 'AKD', 'AMD', 'ATQ', 'BBI', 'BDQ', 'BEK', 'BEP', 'BHJ', 'BHO', 'BHU', 'BKB', 'BLR', 'BOM', 'BUP', 'CD', 'CCJ', 'CCU', 'CDP', 'CJB', 'CNN', 'COH', 'COK', 'DAE', 'DAI', 'DBD', 'DED', 'DEL', 'DEP', 'DHM', 'DIB', 'DIU', 'DMU', 'GAU', 'GAY', 'GOI', 'GOP', 'GUX', 'GWL', 'HBX', 'HDD', 'HJR', 'HSS', 'HYD', 'IDR', 'IMF', 'ISK', 'IXA', 'IXB', 'IXC', 'IXD', 'IXE', 'IXG', 'IXH', 'IXI', 'IXJ', 'IXK', 'IXL', 'IXM', 'IXN', 'IXP', 'IXQ', 'IXR', 'IXS', 'IXT', 'IXU', 'IXV', 'IXW', 'IY', 'IXZ', 'JAI', 'JDH', 'JGA', 'JGB', 'JLR', 'JRH', 'JSA', 'KCZ', 'KLH', 'KNU', 'KTU', 'KUU', 'LDA', 'LKO', 'LUH', 'MAA', 'MOH', 'MYQ', 'MZA', 'MZU', 'NAG', 'NDC', 'NMB', 'NVY', 'OMN', 'PAB', 'PAT', 'PBD', 'PGH', 'PNQ', 'PNY', 'PUT', 'PYB', 'RA', 'REW', 'RGH', 'RJA', 'RJI', 'RMD', 'RPR', 'RRK', 'RTC', 'RUP', 'SHL', 'SLV', 'SSE', 'STV', 'SXR', 'SXV', 'TCR', 'TEI', 'EZ', 'TIR', 'TJV', 'TNI', 'TRV', 'TRZ', 'UDR', 'VGA', 'VNS', 'VTZ', 'WGC', 'ZER', 'CNN', 'JRG', 'GBI'];
        if (origin && destination) {
            origin.includes('-') ? origin = origin.split('-')[1] : origin;
            destination.includes('-') ? destination = destination.split('-')[1] : destination;
            if (india_airport_list.includes(origin) && india_airport_list.includes(destination) && tmx_api && tmx_api.length > 0 && tmx_api[0] != "") {
                this.isDomesticFlightSelected = true;
                this.is_domestic = true;
                return true;
            } else {
                this.isDomesticFlightSelected = false;
                this.is_domestic = false;
                return false;
            }
        }
        else {
            for (let segment of segments) {
                segment.Destination.includes('-') ? segment.Destination = segment.Destination.split('-')[1] : segment.Destination;
                segment.Origin.includes('-') ? segment.Origin = segment.Origin.split('-')[1] : segment.Origin;
            }
            let allSegmentsInIndia = segments.every(segment =>
                india_airport_list.includes(segment['Origin']) &&
                india_airport_list.includes(segment['Destination'])
            );
            if (allSegmentsInIndia) {
                this.isDomesticFlightSelected = true;
                this.is_domestic = true;
                return true;
            } else {
                this.isDomesticFlightSelected = false;
                this.is_domestic = false;
                return false;
            }
        }
    }

    setBookingApiSources(data) {
        let tmx_api = this.getApiList();
        if ((data['PreferredAirlineName'] != 'All') && (data['PreferredAirlineName'] != 'All Airline')) {
            if (data['PreferredAirlines'][0] === 'BS') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00008'];
            } else if (data['PreferredAirlines'][0] === 'VQ' && !(data['JourneyType'] == 'multicity')) {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00009'];
            } else {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002', 'ZBAPINO00007','ZBAPINO00020','ZBAPINO00020','ZBAPINO00003','ZBAPINO00015'];
            }
        }
        else {
            if (data['JourneyType'] == 'multicity') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002','ZBAPINO00008', 'ZBAPINO00007','ZBAPINO00020','ZBAPINO00020','ZBAPINO00003','ZBAPINO00015'];
            }
            else {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002','ZBAPINO00008', 'ZBAPINO00009','ZBAPINO00007','ZBAPINO00020','ZBAPINO00020','ZBAPINO00003','ZBAPINO00015'];
            }
        }
        this.bookingApiSources.push('ZBAPINO00011');
        this.bookingApiSources.push('ZBAPINO00012');
        this.showResult(tmx_api,data,false);
    }
    
    setBookingApiSourceOld(data) {
        let enabledApiList= this.getEnabledApi();
        if ((data['PreferredAirlineName'] != 'All') && (data['PreferredAirlineName'] != 'All Airline')) {
            if (data['PreferredAirlines'][0] === 'BS') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002','ZBAPINO00008'];
            } else if (data['PreferredAirlines'][0] === 'VQ' && !(data['JourneyType'] == 'multicity')) {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002','ZBAPINO00009'];
            } else {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002', 'ZBAPINO00007', 'ZBAPINO00003']; 
            }
        }
        else {
            if (data['JourneyType'] == 'multicity') {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002','ZBAPINO00008', 'ZBAPINO00007', 'ZBAPINO00003']; 
            }
            else {
                this.bookingApiSources = ['ZBAPINO00002','ZBAPINO00002','ZBAPINO00008', 'ZBAPINO00009', 'ZBAPINO00007', 'ZBAPINO00003']; 
            }
        }
        this.bookingApiSources.push('ZBAPINO00011');
        this.bookingApiSources.push('ZBAPINO00012');
        this.showResult(enabledApiList,data,false);
    }

    setTravelomatixBookingApiSources(data) {
        let enabledApiList = this.getEnabledApi();
        let tm_api = enabledApiList.filter(api => this.apiList.includes(api));
        if (tm_api && tm_api.length > 0 && tm_api[0] != "") {
            this.bookingApiSources = ['ZBAPINO00020','ZBAPINO00020','ZBAPINO00002','ZBAPINO00002','ZBAPINO00003','ZBAPINO00015'];
            data.booking_source = 'ZBAPINO00020';
            this.showResult(tm_api,data,true);
        }
        else {
            this.hideLoader();
            this.showApiEnableMessage();
        }
    }

    getEnabledApi() {
        let apiList;
        this.currentUser = this.utility.readStorage('currentUser', localStorage);
        if (this.currentUser && this.currentUser.auth_role_id != 3) {
            apiList = this.currentUser.api_list;
        } else {
            let selectedCorporate: any =JSON.parse(localStorage.getItem('selectedCorporate'));
            apiList = selectedCorporate ? selectedCorporate.flight_api : null; // corrected variable declaration
        }
        return apiList ? apiList.split(", ") : [];
    }

    showResult(enabledApiList, data, isRoundtrip) {
        this.callCount = 0;
        this.callCountTP=0;
        this.currentUser = this.utility.readStorage('currentUser', localStorage);
        let response = JSON.parse(localStorage.getItem('policyList'));
        if (this.currentUser && this.currentUser.auth_role_id == 2 && response && response.length>0) {
            if (response && response.length == 0) {
                this.closeLoader("");
                return;
            }
            if (response) {
                const air_dom = response[0].air_dom; // Whether domestic air is enabled
                const air_int = response[0].air_int; // Whether international air is enabled
                // Update switch case according to provided logic
                if (!air_dom && !air_int) {
                    this.closeLoader("Both");
                    return;
                } else if (air_dom && !air_int) {
                    if (!this.is_domestic) {
                        this.closeLoader("International");
                        return;
                    } else {
                        this.proceedWithBooking(enabledApiList, data, isRoundtrip);
                    }
                } else if (!air_dom && air_int) {
                    if (this.is_domestic) {
                        this.closeLoader("Domestic");
                        return;
                    } else {
                        this.proceedWithBooking(enabledApiList, data, isRoundtrip);
                    }
                } else if (air_dom && air_int) {
                    // Proceed with both domestic and international search
                    this.proceedWithBooking(enabledApiList, data, isRoundtrip);
                }
            }
        }
        else {
            this.proceedWithBooking(enabledApiList, data, isRoundtrip);
        }

    }

    validateCabinPolicy(data, policyList) {
        let cabin = policyList[0].cabin.split(',').map(c => c.trim());
        return cabin.includes(data.Segments[0].CabinClass);
    }


    closeLoader(text) {
        this.close.next(true);
        this.loading.next(false);
        this.flights.next([]);
        this.flightsCopy.next([]);
        this.searchingFlight.next(false);
        this.swalService.alert.warning(`According to the policy, ${text} travel is restricted. Please contact to the Traveldesk.`);
        // this.resultsFound = false;

    }

    proceedWithBooking(enabledApiList, data, isRoundtrip) {
        this.setBookingSource(enabledApiList, this.bookingApiSources);
        if (this.bookingApiSources && this.bookingApiSources.length > 0 && this.bookingApiSources[0]!="") {
            data.booking_source=this.bookingApiSources[0];
            if(!isRoundtrip){
                this.searchResultApi(data);
            }
            else{
                this.searchTravelomatix(data);
            }
        }
        else if((!enabledApiList || enabledApiList.length == 0 || enabledApiList[0]=="") && ( !this.bookingApiSources || this.bookingApiSources.length==0 || this.bookingApiSources[0]=="") ){
            this.hideModel();
            this.showNoApiEnableMessage();
        }
        else {
           this.hideModel();
        }
    }

    showApiEnableMessage() {
        this.router.navigate(['/dashboard']);
        this.swalService.alert.error("Specific api is not enabled for this user.Kindly contact customer support.");
    }

    showNoApiEnableMessage(){
        this.router.navigate(['/dashboard']);
        this.swalService.alert.error("Api is not enabled for this user.Kindly contact customer support.");
    }

    setBookingSource(enabledApiList,bookingApiSources){
        this.bookingApiSources=this.bookingApiSources.filter(item =>enabledApiList.includes(item))
    }
    
    searchResultApi(data) {
        this.setIsDomestic(data);
        this.setSegments(data);
        this.updateData(data);
       // this.blockAirline(data);
        data.MutiPrice = 1;
        data.Currency = "INR";
        // data.AirlineCode = '';
        if (!this.callCount) {
            this.callCount = 0;
        }
        if (!this.callCountTP) {
            this.callCountTP = 0;
        }
        this.setAirlineCodes(data);
        localStorage.setItem('cabinClass',data.Segments[0].CabinClass);
        data.JourneyType == 'Return' ? data.Segments[0].CabinClass = data.Segments[0].CabinClassOnward : data.Segments[0].CabinClass;
        this.subs.sink = this.apiHandlerService.apiHandler('search', 'POST', '', '', data)
            .subscribe(
                searchResponse => {
                    if (searchResponse.Status && Object.keys(searchResponse.data).length) {
                        let mergeResponseData = [...this.flights.value, ...searchResponse['data']['Search']['FlightDataList']['JourneyList'][0]];
                        mergeResponseData = mergeResponseData.sort((a, b) => a.Price.TotalDisplayFare - b.Price.TotalDisplayFare);
                        if (mergeResponseData.length > 0 && !this.isDomesticFlightSelected) {
                            this.hideLoader(); // added to hide loader soon after getting response from  one api
                        }
                        searchResponse['data']['Search']['FlightDataList']['JourneyList'][0] = mergeResponseData;
                        this.getResponse(searchResponse);
                        this.bookingApiSources.shift();
                        data.booking_source = this.bookingApiSources[0];
                        if (this.bookingApiSources.length > 0) {
                            this.searchResultApi(data);
                        }
                        else {
                            if(!this.isDomesticFlightSelected){
                                this.loading.next(false);
                                this.searchingFlight.next(false);
                                this.resultsFound = false;
                                this.dialogClose.next(true);
                            }
                        }
                        //}
                    } else {
                        if(!this.isDomesticFlightSelected){
                        this.noFlight.next(true);
                        this.alertService.error(searchResponse.Message);
                    }
                    }

                }, err => {
                    if (err.error.statusCode === 400) {
                        this.bookingApiSources.shift();
                        data.booking_source = this.bookingApiSources[0];
                        if (this.bookingApiSources.length > 0) {
                            this.searchResultApi(data);
                        }
                        else {
                            if(!this.isDomesticFlightSelected){
                            this.loading.next(false);
                            this.searchingFlight.next(false);
                            this.resultsFound = false;
                            this.dialogClose.next(true);
                            }
                        }

                    } else if (err.error.statusCode != 500) {
                        if(!this.isDomesticFlightSelected){
                        this.noFlight.next(true);
                        this.loading.next(false);
                        this.searchingFlight.next(false);
                        this.resultsFound = false;
                        this.dialogClose.next(true)
                        this.swalService.alert.oops(err.error.Message);
                        }
                    } else
                    {
                        this.bookingApiSources.shift();
                        data.booking_source = this.bookingApiSources[0];
                        if (this.bookingApiSources.length > 0) {
                            this.searchResultApi(data);
                        }
                        else {
                            if(!this.isDomesticFlightSelected){
                            this.loading.next(false);
                            this.searchingFlight.next(false);
                            this.resultsFound = false;
                            this.dialogClose.next(true);
                            }
                        }
                    }
                }
            );
    }

    searchTravelomatix(data) {
        this.setIsDomestic(data);
        this.setSegments(data);
        this.updateData(data);
        //this.blockAirline(data);
        data.MutiPrice=1;
        data.Currency="INR";
        // data.AirlineCode = '';
        if (!this.callCount) {
            this.callCount = 0;
        }
        if (!this.callCountTP) {
            this.callCountTP = 0;
        }
        this.setAirlineCodes(data);
        data.JourneyType=='Return'?
            localStorage.setItem('cabinClass',data.Segments[0].CabinClassOnward):localStorage.setItem('cabinClass',data.Segments[0].CabinClass);
            data.JourneyType == 'Return' ? data.Segments[0].CabinClass = data.Segments[0].CabinClassOnward : data.Segments[0].CabinClass;
        this.subs.sink = this.apiHandlerService.apiHandler('search', 'POST', '', '', data)
            .subscribe(
                searchResponse => {
                    if (searchResponse.Status && Object.keys(searchResponse.data).length) {
                        let mergeResponseData = [];
                        if (this.flights.value.length === 0) {
                            mergeResponseData = searchResponse['data']['Search']['FlightDataList']['JourneyList'];
                        } else if (this.flights.value.length === searchResponse['data']['Search']['FlightDataList']['JourneyList'].length) {
                            // Iterate over each index
                            for (let i = 0; i < this.flights.value.length; i++) {
                                // Concatenate arrays at the same index
                                mergeResponseData.push([...this.flights.value[i], ...searchResponse['data']['Search']['FlightDataList']['JourneyList'][i]]);
                            }
                        }
                          if (mergeResponseData.length > 0) {
                            this.hideLoader(); // added to hide loader soon after getting response from  one api
                            searchResponse['data']['Search']['FlightDataList']['JourneyList'] = mergeResponseData;
                            this.getTravelomatixResponse(searchResponse);
                            this.bookingApiSources.shift();
                            data.booking_source = this.bookingApiSources[0];
                            if (this.bookingApiSources.length > 0) {
                                this.searchTravelomatix(data);
                            }
                        }
                    }
                }, err => {
                    this.loading.next(false);
                    this.searchingFlight.next(false);
                    this.resultsFound = false;
                    this.dialogClose.next(true);
                    this.bookingApiSources.shift();
                    data.booking_source = this.bookingApiSources[0];
                    if (this.bookingApiSources.length > 0) {
                        this.searchTravelomatix(data);
                    }
                }
            );
    }

    getTravelomatixResponse(searchResponse) {
        this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
        const usdResult = searchResponse.data.Search.FlightDataList.JourneyList;
        this.nearByAirportsCopy.next(searchResponse.data.Search.NearByAirports);
        this.flights.next(usdResult);
        this.setModel.next(true);
        const flightsCopy = JSON.parse(JSON.stringify(usdResult));
        this.flightsCopy.next(flightsCopy);
        this._flightsCopy = flightsCopy;
        let mergedArray=[];
        for (let i = 0; i < this._flightsCopy.length; i++) {
            if (Array.isArray(this._flightsCopy[i])) {
                mergedArray.push(...this._flightsCopy[i]);
            }
        }
        const maxPrice = mergedArray.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) > curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: 0 } }).Price.TotalDisplayFare;

        this.maxPrice.next(maxPrice);
        this._maxPrice = maxPrice;
        const minPrice = mergedArray.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) < curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: maxPrice } }).Price.TotalDisplayFare;

        this.minPrice.next(minPrice);
        this._minPrice = minPrice;
        this.myValue.next(maxPrice);
        this.myValueStart.next(minPrice);

        const airlinesTemp = [];
        for (const flightList of flightsCopy) {
            if(flightList){
                flightList.forEach(flight => {
                    airlinesTemp.push(flight.FlightDetails.Details[0][0].OperatorName);
                });
            }
        }
        const airlines = airlinesTemp.filter((x, i, a) => a.indexOf(x) == i);
        const airlinesTemp2 = [];
        airlines.forEach((_element, i) => {
            airlinesTemp2.push({ name: airlines[i], isChecked: true });
        });
        this.airlines.next(airlinesTemp2);
        const tempNearbyAirport = [];
        for (const element of flightsCopy) {
            if(element){
            for (const flight of element) {
                if (flight.FlightDetails.Details[0].length === 2) {
                    tempNearbyAirport.push(flight.FlightDetails.Details[0][1].Origin.AirportName);
                }
            }
        }
        }
        const nearbyAirports = tempNearbyAirport.filter((x, i, a) => a.indexOf(x) == i);
        const airportsTemp2 = [];
        nearbyAirports.forEach((_element, i) => {
            airportsTemp2.push({ name: nearbyAirports[i], isChecked: true });
        });

        const tempStopovers = [];
        for (const element of flightsCopy) {
            element.forEach(flight => {
                const details = flight.FlightDetails.Details[0];
                if (details.length > 1) {
                    details.slice(0, -1).forEach(stop => {
                        tempStopovers.push(stop.Destination.CityName);
                    });
                }
            });
        }

        const Stopovers = tempStopovers.filter((x, i, a) => a.indexOf(x) == i);
        const tempStopovers2 = [];
        Stopovers.forEach((_element, i) => {
            tempStopovers2.push({ name: Stopovers[i], isChecked: true });
        });
        this.stopovers.next(tempStopovers2);
        this.changeDetectionEmitter.emit();
    }

    hideLoader() {
        this.loading.next(false);
        this.searchingFlight.next(false);
        this.resultsFound = false;
        this.dialogClose.next(true);
    }

    noFlightsFound() {
        this.noFlight.next(true);
        this.loading.next(false);
        this.changeDetectionEmitter.emit();
    }

    getResponse(searchResponse) {
        this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
        const usdResult = searchResponse.data.Search.FlightDataList.JourneyList[0];
        this.nearByAirportsCopy.next(searchResponse.data.Search.NearByAirports);
        if(!this.isDomesticFlightSelected){
            this.flights.next(usdResult);
        const flightsCopy = JSON.parse(JSON.stringify(usdResult));
        this.flightsCopy.next(flightsCopy);
        this._flightsCopy = flightsCopy;

        const maxPrice = flightsCopy.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) > curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: 0 } }).Price.TotalDisplayFare;

        this.maxPrice.next(maxPrice);
        this._maxPrice = maxPrice;

        const minPrice = flightsCopy.reduce(function (prev, curr) {
            return Number(prev.Price.TotalDisplayFare) < curr.Price.TotalDisplayFare ? prev : curr;
        }, { Price: { TotalDisplayFare: maxPrice } }).Price.TotalDisplayFare;
        this.minPrice.next(minPrice);
        this._minPrice = minPrice;
        this.myValue.next(maxPrice);
        this.myValueStart.next(minPrice);

        const airlinesTemp = [];
        flightsCopy.forEach(flight => {
            airlinesTemp.push(flight.FlightDetails.Details[0][0].OperatorName);
        });
        const airlines = airlinesTemp.filter((x, i, a) => a.indexOf(x) == i);

        const airlinesTemp2 = [];
        airlines.forEach((_element, i) => {
            airlinesTemp2.push({ name: airlines[i], isChecked: true });
        });
        this.airlines.next(airlinesTemp2);
        const tempNearbyAirport = [];
        flightsCopy.forEach(flight => {
            const tempFlight = flight.FlightDetails.Details[0];
            if (tempFlight.length === 2) {
                tempNearbyAirport.push(flight.FlightDetails.Details[0][1].Origin.AirportName);
            }
        });
        const nearbyAirports = tempNearbyAirport.filter((x, i, a) => a.indexOf(x) == i);
        const airportsTemp2 = [];
        nearbyAirports.forEach((_element, i) => {
            airportsTemp2.push({ name: nearbyAirports[i], isChecked: true });
        });
        const tempStopovers = [];
        flightsCopy.forEach(flight => {
            const tempFlight = flight.FlightDetails.Details[0];
            if (tempFlight.length > 1) {
                tempFlight.forEach((e, i) => {
                    if (i < tempFlight.length - 1) {
                        tempStopovers.push(e.Destination.CityName);
                    }
                });
            }
        });
        const Stopovers = tempStopovers.filter((x, i, a) => a.indexOf(x) == i);
        const tempStopovers2 = [];
        Stopovers.forEach((_element, i) => {
            tempStopovers2.push({ name: Stopovers[i], isChecked: true });
        });
        this.stopovers.next(tempStopovers2);
        this.changeDetectionEmitter.emit();
        }
    }

    changeSlider() {
        this.multipleFiltersApply();
    }

    filterByStops() {
        this.setModel.next(false)
        this.multipleFiltersApply();
    }

    changeSliderExt() {
        this.myValue.next(Math.ceil(this.myValue.value + 1));
        this.myValueStart.next(Math.floor(this.myValueStart.value));
    
        if (!this.isDomesticFlightSelected) {
            return this.filterFlights(this._flightsCopy);
        } else {
            return this.isDomesticMulticity ? this.changeSliderMulticity() : this.changeSliderExtTM();
        }
    }
    
    changeSliderExtTM() {
        return this._flightsCopy.map(flightList => this.filterFlights(flightList));
    }
    
    changeSliderMulticity() {
        return this._flightsCopy.map((flightList, index) => {
            return index === this.selectedSector ? this.filterFlights(flightList) : flightList;
        });
    }
    
    filterFlights(flights: any[]) {
        return flights.filter(flight =>
            flight.Price.TotalDisplayFare <= this.myValue.value && flight.Price.TotalDisplayFare >= this.myValueStart.value)
    }
    
    
    filterByStopsExt(flights) {
        const zeroStop = this.zeroStopActive.value;
        const oneStop = this.oneStopActive.value;
        const multipleStops = this.multipleStopsActive.value;

        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (!this.isDomesticFlightSelected) {
            if (!zeroStop && !oneStop && !multipleStops) {
                flights = flightsCopyTemp;
            } else if (!zeroStop && !oneStop && multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length > 2);
            } else if (!zeroStop && oneStop && !multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length === 2);
            } else if (!zeroStop && oneStop && multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length > 1);
            } else if (zeroStop && !oneStop && !multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length === 1);
            } else if (zeroStop && !oneStop && multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length !== 2);
            } else if (zeroStop && oneStop && !multipleStops) {
                flights = flightsCopyTemp.filter((flight) => flight.FlightDetails.Details[0].length <= 2);
            } else {
                flights = flightsCopyTemp;
            }
            return flights;
        }
        else {
            const result = this.isDomesticMulticity ? this.filterByStopsMulticity(flights, flightsCopyTemp, zeroStop, oneStop, multipleStops) : this.filterByStopsExtTM(flights, flightsCopyTemp, zeroStop, oneStop, multipleStops);
            return result;
        }
    }

 
    filterByStopsMulticity(flights, flightsCopyTemp, zeroStop, oneStop, multipleStops) {
        // Clone flights to avoid mutating the original array
        const filteredFlights = flights.map((flight, index) => {
            if (index === this.selectedSector) {
                if (!zeroStop && !oneStop && !multipleStops) {
                    // Keep the original flight data if no filters are applied
                    return flightsCopyTemp[index];
                } else {
                    // Apply the filter based on the conditions
                    return flight.filter(flightItem => {
                        const stopCount = flightItem.FlightDetails.Details[0].length;
                        if (!zeroStop && !oneStop && multipleStops) {
                            return stopCount > 2;
                        } else if (!zeroStop && oneStop && !multipleStops) {
                            return stopCount === 2;
                        } else if (!zeroStop && oneStop && multipleStops) {
                            return stopCount > 1;
                        } else if (zeroStop && !oneStop && !multipleStops) {
                            return stopCount === 1;
                        } else if (zeroStop && !oneStop && multipleStops) {
                            return stopCount !== 2;
                        } else if (zeroStop && oneStop && !multipleStops) {
                            return stopCount <= 2;
                        } else {
                            return true; // Return true to keep the flight if no conditions match
                        }
                    });
                }
            } else {
                // Return the flight data for other sectors without applying any filters
                return flightsCopyTemp[index];
            }
        });
    
        return filteredFlights;
    }

    setAirlineCodes(data) {
        this.setAirlineCode(data);
        this.setAirlineCodeTP(data);
    }


    filterByStopsExtTM(flights, flightsCopyTemp, zeroStop, oneStop, multipleStops) {
        if (!zeroStop && !oneStop && !multipleStops) {
            flights = flightsCopyTemp;
        } else if (!zeroStop && !oneStop && multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length > 2);
            }
        } else if (!zeroStop && oneStop && !multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length === 2);
            }
        } else if (!zeroStop && oneStop && multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length > 1);
            }
        } else if (zeroStop && !oneStop && !multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length === 1);
            }
        } else if (zeroStop && !oneStop && multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length !== 2);
            }
        } else if (zeroStop && oneStop && !multipleStops) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.FlightDetails.Details[0].length <= 2);
            }
        } else {
            flights = flightsCopyTemp;
        }
        return flights;
    }

    filterByDepartureTime() {
        this.setModel.next(false);
        this.multipleFiltersApply();
    }

    filterByDepartureTimeExt(flights) {
        const a = this.earlyMorning.value;
        const b = this.morning.value;
        const c = this.midDay.value;
        const d = this.evening.value;
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        let tempFlights;
        if (!this.isDomesticFlightSelected) {
            if (!a && !b && !c && !d) {
                tempFlights = flights;
            } else if (!a && !b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 18;
                });
            } else if (!a && !b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18 && t >= 12;
                });
            } else if (!a && !b && c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 12;
                });
            } else if (!a && b && !c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12 && t >= 6;
                });
            } else if (!a && b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 || (t < 12 && t >= 18);
                });
            } else if (!a && b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 && t < 18;
                });
            } else if (!a && b && c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            } else if (a && !b && !c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6;
                });
            } else if (a && !b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 18;
                });
            } else if (a && !b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || (t >= 12 && t < 18);
                });
            } else if (a && !b && c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 12;
                });
            } else if (a && b && !c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12;
                });
            } else if (a && b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            } else if (a && b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18;
                });
            } else {
                tempFlights = flights;
            }
            return tempFlights;

        }
        else {
            const result = this.isDomesticMulticity ? this.filterByDepartureTimeMulticity(flights, flightsCopyTemp, a, b, c, d) : this.filterByDepartureTimeExtTM(flights, flightsCopyTemp, a, b, c, d);;
            return result;
            
        }
    }

    filterByDepartureTimeExtTM(flights, flightsCopyTemp, a, b, c, d) {
        let tempFlights=[];
        if (!a && !b && !c && !d) {
            tempFlights = flights;
        } else if (!a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 18;
                });
            }
        } else if (!a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18 && t >= 12;
                });
            }
        } else if (!a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 12;
                });
            }
        } else if (!a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12 && t >= 6;
                });
            }
        } else if (!a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index]= flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 || (t < 12 && t >= 18);
                });
            }
        } else if (!a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 && t < 18;
                });
            }
        } else if (!a && b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && !b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6;
                });
            }
        } else if (a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 18;
                });
            }
        } else if (a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || (t >= 12 && t < 18);
                });
            }
        } else if (a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 12;
                });
            }
        } else if (a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12;
                });
            }
        } else if (a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][0].Origin.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18;
                });
            }
        } else {
            tempFlights = flights;
        }
        return tempFlights;
    }

     filterByDepartureTimeMulticity(flights, flightsCopyTemp, a, b, c, d) {
        // Clone flights to avoid mutating the original array
        const tempFlights = flights.map((flight, index) => {
            if (index === this.selectedSector) {
                if (!a && !b && !c && !d) {
                    return flightsCopyTemp[index];
                } else {
                    return flightsCopyTemp[index].filter(flightItem => {
                        const depTime = flightItem.FlightDetails.Details[0][0].Origin.DateTime;
                        const t = (new Date(depTime)).getHours();
                        if (!a && !b && !c && d) {
                            return t >= 18;
                        } else if (!a && !b && c && !d) {
                            return t < 18 && t >= 12;
                        } else if (!a && !b && c && d) {
                            return t >= 12;
                        } else if (!a && b && !c && !d) {
                            return t < 12 && t >= 6;
                        } else if (!a && b && !c && d) {
                            return t >= 6 || (t < 12 && t >= 18);
                        } else if (!a && b && c && !d) {
                            return t >= 6 && t < 18;
                        } else if (!a && b && c && d) {
                            return t >= 6;
                        } else if (a && !b && !c && !d) {
                            return t < 6;
                        } else if (a && !b && !c && d) {
                            return t < 6 || t >= 18;
                        } else if (a && !b && c && !d) {
                            return t < 6 || (t >= 12 && t < 18);
                        } else if (a && !b && c && d) {
                            return t < 6 || t >= 12;
                        } else if (a && b && !c && !d) {
                            return t < 12;
                        } else if (a && b && !c && d) {
                            return t >= 6;
                        } else if (a && b && c && !d) {
                            return t < 18;
                        } else {
                            return true; // Return true to keep the flight if no conditions match
                        }
                    });
                }
            } else {
                return flightsCopyTemp[index]; // Return the flight data for other sectors without applying any filters
            }
        });
    
        return tempFlights;
    }
    

    filterByArrivalTime() {
        this.multipleFiltersApply();
    }

    filterByArrivalTimeExt(flights) {
        const a = this.earlyMorning2.value;
        const b = this.morning2.value;
        const c = this.midDay2.value;
        const d = this.evening2.value;
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        let tempFlights;
        if (!this.isDomesticFlightSelected) {
            if (!a && !b && !c && !d) {
                tempFlights = flights;
            } else if (!a && !b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 18;
                });
            } else if (!a && !b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18 && t >= 12;
                });
            } else if (!a && !b && c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 12;
                });
            } else if (!a && b && !c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12 && t >= 6;
                });
            } else if (!a && b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 || (t < 12 && t >= 18);
                });
            } else if (!a && b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 && t < 18;
                });
            } else if (!a && b && c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            } else if (a && !b && !c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6;
                });
            } else if (a && !b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 18;
                });
            } else if (a && !b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || (t >= 12 && t < 18);
                });
            } else if (a && !b && c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 12;
                });
            } else if (a && b && !c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12;
                });
            } else if (a && b && !c && d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            } else if (a && b && c && !d) {
                tempFlights = flightsCopyTemp.filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18;
                });
            } else {
                tempFlights = flights;
            }
            return tempFlights;
        }
        else{
            const result = this.isDomesticMulticity ? this.filterByArrivalTimeMulticity(flights, flightsCopyTemp, a, b, c, d) : this.filterByArrivalTimeExtTM(flights, flightsCopyTemp, a, b, c, d);
            return result;
        }

    }

    filterByArrivalTimeMulticity(flights, flightsCopyTemp, a, b, c, d) {
        // Clone flights to avoid mutating the original array
        const tempFlights = flights.map((flight, index) => {
            if (index === this.selectedSector) {
                if (!a && !b && !c && !d) {
                    return flightsCopyTemp[index];
                } else {
                    return flightsCopyTemp[index].filter(flightItem => {
                        const depTime = flightItem.FlightDetails.Details[0][this.stops(flightItem)].Destination.DateTime;
                        const t = (new Date(depTime)).getHours();
                        if (!a && !b && !c && d) {
                            return t >= 18;
                        } else if (!a && !b && c && !d) {
                            return t < 18 && t >= 12;
                        } else if (!a && !b && c && d) {
                            return t >= 12;
                        } else if (!a && b && !c && !d) {
                            return t < 12 && t >= 6;
                        } else if (!a && b && !c && d) {
                            return t >= 6 || (t < 12 && t >= 18);
                        } else if (!a && b && c && !d) {
                            return t >= 6 && t < 18;
                        } else if (!a && b && c && d) {
                            return t >= 6;
                        } else if (a && !b && !c && !d) {
                            return t < 6;
                        } else if (a && !b && !c && d) {
                            return t < 6 || t >= 18;
                        } else if (a && !b && c && !d) {
                            return t < 6 || (t >= 12 && t < 18);
                        } else if (a && !b && c && d) {
                            return t < 6 || t >= 12;
                        } else if (a && b && !c && !d) {
                            return t < 12;
                        } else if (a && b && !c && d) {
                            return t >= 6;
                        } else if (a && b && c && !d) {
                            return t < 18;
                        } else {
                            return true; // Return true to keep the flight if no conditions match
                        }
                    });
                }
            } else {
                return flightsCopyTemp[index]; // Return the flight data for other sectors without applying any filters
            }
        });
    
        return tempFlights;
    }
    
    filterByArrivalTimeExtTM(flights,flightsCopyTemp, a, b, c, d)
     {
        let tempFlights=[];
        if (!a && !b && !c && !d) {
            tempFlights = flights;
        } else if (!a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 18;
                });
            }
        } else if (!a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index]= flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18 && t >= 12;
                });
            }
        } else if (!a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 12;
                });
            }
        } else if (!a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index]= flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12 && t >= 6;
                });
            }
        } else if (!a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 || (t < 12 && t >= 18);
                });
            }
        } else if (!a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6 && t < 18;
                });
            }
        } else if (!a && b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && !b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6;
                });
            }
        } else if (a && !b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 18;
                });
            }
        } else if (a && !b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || (t >= 12 && t < 18);
                });
            }
        } else if (a && !b && c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 6 || t >= 12;
                });
            }
        } else if (a && b && !c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 12;
                });
            }
        } else if (a && b && !c && d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t >= 6;
                });
            }
        } else if (a && b && c && !d) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                tempFlights[index] = flightsCopyTemp[index].filter(flight => {
                    const depTime = flight.FlightDetails.Details[0][this.stops(flight)].Destination.DateTime;
                    const t = (new Date(depTime)).getHours();
                    return t < 18;
                });
            }
        } else {
            tempFlights = flights;
        }
        return tempFlights;
    }

    filterByAirlines() {
        this.setModel.next(false);
        this.multipleFiltersApply();
    }

    filterByAirlinesExt(flights) {
        const tempAirlines = this.airlines.value.filter(f => f.isChecked);
        if (this.airlines.value.length === tempAirlines.length || tempAirlines.length === 0) {
            return flights;
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (!this.isDomesticFlightSelected) {
            const tempFlights = flightsCopyTemp.filter(flight => {
                const result = this.airlines.value.find(t => t.name === flight.FlightDetails.Details[0][0].OperatorName);
                return result.isChecked;
            });
            return tempFlights;
        }
        else {
            const result = this.isDomesticMulticity ? this.filterByAirlinesMulticity(flightsCopyTemp): this.filterByAirlinesExtTM(flightsCopyTemp);
            return result;
        }
    }
    
     filterByAirlinesMulticity(flightsCopyTemp) {
        if (flightsCopyTemp) {
            let tempFlights = [[], []]; // Initialize an array to store filtered flights for each direction
            flightsCopyTemp.forEach((flights, direction) => {
                // Check if the direction index matches the selected sector index
                if (direction === this.selectedSector) {
                    // Filter flights based on airline selection
                    const filteredFlights = flights.filter(flight => {
                        const result = this.airlines.value.find(t => t.name === flight.FlightDetails.Details[0][0].OperatorName);
                        return result.isChecked;
                    });
                    tempFlights[direction] = filteredFlights;
                } else {
                    // Keep the original flights if the direction index does not match the selected sector index
                    tempFlights[direction] = flights;
                }
            });
            return tempFlights;
        }
    }

     filterByAirlinesExtTM(flightsCopyTemp) {
        if (flightsCopyTemp) {
            let tempFlights = [[], []]; // Initialize an array to store filtered flights for each direction
            flightsCopyTemp.forEach((flights, direction) => {
                const filteredFlights = flights.filter(flight => {
                    const result = this.airlines.value.find(t => t.name === flight.FlightDetails.Details[0][0].OperatorName);
                    return result.isChecked;
                });
                tempFlights[direction] = filteredFlights;
            });
            return tempFlights;
        }
    }

    filterByNearestAirport() {
        this.setModel.next(false);
        this.multipleFiltersApply();
    }

    filterByNearestAirportExt(flights) {
        const tempData = [];
        this.nearbyAirports.value.forEach(e => {
            if (e.isChecked) {
                tempData.push(e.code);
            }
        });
        if (tempData.length === 0 || tempData.length === this.nearbyAirports.value.length) {
            return flights;
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        const tempFlights2 = flightsCopyTemp.filter(flight => {
            let returnResult1 = false;
            let returnResult2 = false;
            flight.FlightDetails.Details[0].forEach((t) => {
                if (tempData.includes(t.Origin.AirportCode)) {
                    returnResult1 = true;
                }
            });
            flight.FlightDetails.Details[flight.FlightDetails.Details.length - 1].forEach((t) => {
                if (tempData.includes(t.Destination.AirportCode)) {
                    returnResult2 = true;
                }
            });
            return returnResult1 && returnResult2;
        });
        /* EOF arrive logic */

        return tempFlights2;
    }

    filterByStopoverCity() {
        this.setModel.next(false)
        this.multipleFiltersApply();
    }

    filterByStopoverCityExt(flights) {
        const tempData = [];
        this.stopovers.value.forEach(e => {
            if (e.isChecked) {
                tempData.push(e.name);
            }
        });
        if (tempData.length === 0 || tempData.length === this.stopovers.value.length) {
            return flights;
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (!this.isDomesticFlightSelected) {
            const tempFlights = flightsCopyTemp.filter(flight => {
                let returnResult = false;
                flight.FlightDetails.Details[0].forEach((t) => {
                    if (tempData.includes(t.Destination.CityName)) {
                        returnResult = true;
                    }
                });
                return returnResult || !tempData.length;
            });
            return tempFlights;
        }
        else {
            const result = this.isDomesticMulticity ? this.filterByStopoverMulticity(flightsCopyTemp, tempData) : this.filterByStopoverCityExtTM(flightsCopyTemp, tempData);
            return result;
        }
    }

    filterByStopoverMulticity(flightsCopyTemp, tempData) {
        let resultArray = [];
        // Iterate over flightsCopyTemp
        flightsCopyTemp.forEach((flights, index) => {
            const filteredFlights = index === this.selectedSector ?
                flights.filter(flight => {
                    // Check if any of the details in the flight match the stopover cities
                    return flight.FlightDetails.Details[0].some(t => tempData.includes(t.Destination.CityName));
                }) :
                flights;

            resultArray.push(filteredFlights);
        });

        return resultArray;
    }


    filterByStopoverCityExtTM(flightsCopyTemp, tempData) {
        let resultArray = [];
        // Iterate over flightsCopyTemp
        flightsCopyTemp.forEach(flights => {
            const filteredFlights = flights.filter(flight => {
                // Check if any of the details in the flight match the stopover cities
                return flight.FlightDetails.Details[0].some(t => tempData.includes(t.Destination.CityName));
            });
            resultArray.push(filteredFlights);
        });
        return resultArray.some(result => result.length > 0) ? resultArray : this._flightsCopy;
    }

    filterByPreferences() {
        this.multipleFiltersApply();
    }

    filterByPreferencesExt(flights) {
        const a = this.refundable.value;
        const b = this.nonRefundable.value;
        // const c = this.baggage.value;
        if (!this.isDomesticFlightSelected) {
            if ((a && b) || (!a && !b)) {
                return flights
            }
            const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
            // let tempFlights;
            if (a && !b) {
                flights = flightsCopyTemp.filter((flight) => flight.Attr.IsRefundable);
            } else if (!a && b) {
                flights = flightsCopyTemp.filter((flight) => !flight.Attr.IsRefundable);
            } else if (!a && !b) {
                let flightsTemp = flightsCopyTemp.filter((flight) => flight.Attr.IsRefundable === "");

                if (flightsTemp)
                    flights = flightsTemp;
                else
                    flights = [];
            }
            return flights;
        }
        else {
            let result = this.filterByPreferencesExtTM(flights, a, b);
            return result;
        }
    }

    filterByPreferencesExtTM(flights, a, b) {
        if ((a && b) || (!a && !b)) {
            return flights
        }
        const flightsCopyTemp = JSON.parse(JSON.stringify(flights));
        if (a && !b) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => flight.Attr.IsRefundable);
            }

        } else if (!a && b) {
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flights[index] = flightsCopyTemp[index].filter((flight) => !flight.Attr.IsRefundable);
            }
        } else if (!a && !b) {
            let flightsTemp = [];
            for (let index = 0; index < flightsCopyTemp.length; index++) {
                flightsTemp = flightsCopyTemp[index].filter((flight) => flight.Attr.IsRefundable === "");
            }
            if (flightsTemp)
                flights = flightsTemp;
            else
                flights = [];
        }
        return flights;
    }

    priceFilter() {
        this.multipleFiltersApply();
    }

    multipleFiltersApply() {
        let flights = this.changeSliderExt();
        flights = this.filterByStopsExt(flights);
        flights = this.filterByDepartureTimeExt(flights);
        flights = this.filterByArrivalTimeExt(flights);
        // flights = this.filterByNearestAirportExt(flights);
        flights = this.filterByStopoverCityExt(flights);
        // flights = this.filterByPreferencesExt(flights);
        flights = this.filterByAirlinesExt(flights);
        this.flights.next(flights);
        /* apply sorting */
        this.applySortingAfterFilter.next(true);
        this.changeDetectionEmitter.emit();
    }

    duration(flight) {
        const time1 = flight;
        const dt11 = time1[0].Origin.DateTime;
        const dt12 = time1.length > 1 ? time1[time1.length - 1].Destination.DateTime : time1[0].Destination.DateTime;

        let totalDuration = '';
        let mins = 0, hrs = 0, day = 0;
        mins = this.diffMinutes(new Date(dt12), new Date(dt11))
        hrs += Math.floor(mins / 60);
        day = Math.floor(hrs / 24);
        hrs = hrs % 24;
        mins = mins % 60;
        totalDuration = day ? `${day} Day(s) ` : '';
        totalDuration += hrs ? `${hrs} Hr(s) ` : '';
        totalDuration += mins ? `${mins} Min(s)` : '';
        return totalDuration || '';
    }

    tripDuration(flight) {
        let totalDuration = '';
        let totalMins = 0, hrs = 0;
        flight.forEach(e => {
            for (let i = 0; i < e.length; i++) {
                const start = e[i].Origin.DateTime;
                const end = e[i].Destination.DateTime;
                totalMins += this.diffMinutes(new Date(end), new Date(start));
            }
        });
        hrs = Math.floor(totalMins / 60) % 24;
        totalMins = totalMins % 60;
        totalDuration += hrs ? `${hrs}h` : '';
        totalDuration += totalMins ? `${totalMins}m` : '';
        return totalDuration || '';
    }

    totalLayOverTime(flight) {
        let totalDuration = '';
        let totalMins = 0, hrs = 0;
        flight.forEach(e => {
            for (let i = 0; i < e.length; i++) {
                if (e[i].LayOverTimeMins) {
                    totalMins += e[i].LayOverTimeMins;
                }
            }
        });
        hrs = Math.floor(totalMins / 60) % 24;
        totalMins = totalMins % 60;
        totalDuration += hrs ? `${hrs}h` : '';
        totalDuration += totalMins ? `${totalMins}m` : '';
        return totalDuration || '';
    }

    stops(flight: any) {
        return flight.FlightDetails.Details[0].length - 1;
    }
    totalStops(flight: any) {
        let totalStops = 0;
        flight.forEach(e => {
            totalStops += e.length;
        });
        return totalStops - 1;
    }
    finalDestination(flight: any) {
        const firstIterate = flight.length - 1;
        const secondIterate = flight[firstIterate].length - 1;
        return flight[firstIterate][secondIterate].Destination.AirportCode;
    }

    diffMinutes(dt2: any, dt1: any) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }
    calculateDifferenceInDays(departureDateString, currentDateString) {
        const departureDate = new Date(departureDateString);
        const currentDate = new Date(currentDateString);
    
        const timeDifferenceMs = departureDate.getTime() - currentDate.getTime();
        const differenceInDays = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
    
        return differenceInDays;
    }
    
    changeCurrencyUpdateFareQuote(usdResult) {
        const fp = usdResult.Price;
        const currencyRate = this.currentCurrencyRate.value;
        fp.Currency = this.currentCurrency.value;
        fp.TotalDisplayFareUSD = fp['TotalDisplayFareUSD'] || fp.TotalDisplayFare;
        fp.TotalDisplayFare = Math.ceil(fp.TotalDisplayFareUSD * currencyRate);
        fp.PriceBreakup.BasicFareUSD = fp.PriceBreakup['BasicFareUSD'] || fp.PriceBreakup.BasicFare;
        fp.PriceBreakup.BasicFare = Math.ceil(fp.PriceBreakup.BasicFareUSD * currencyRate);
        fp.PriceBreakup.TaxUSD = fp.PriceBreakup['TaxUSD'] || fp.PriceBreakup.Tax;
        fp.PriceBreakup.Tax = Math.ceil(fp.PriceBreakup.TaxUSD * currencyRate);
        fp.PriceBreakup.TotalPriceUSD = fp.PriceBreakup['TotalPriceUSD'] || fp.PriceBreakup.TotalPrice;
        fp.PriceBreakup.TotalPrice = Math.ceil(fp.PriceBreakup.TotalPriceUSD * currencyRate);
        fp.PriceBreakup.TaxDetails.INUSD = fp.PriceBreakup.TaxDetails['INUSD'] || fp.PriceBreakup.TaxDetails.IN;
        fp.PriceBreakup.TaxDetails.IN = Math.ceil(fp.PriceBreakup.TaxDetails.INUSD * currencyRate);
        fp.PriceBreakup.TaxDetails.K3USD = fp.PriceBreakup.TaxDetails['K3USD'] || fp.PriceBreakup.TaxDetails.K3;
        fp.PriceBreakup.TaxDetails.K3 = Math.ceil(fp.PriceBreakup.TaxDetails.K3USD * currencyRate);
        fp.PriceBreakup.TaxDetails.P2USD = fp.PriceBreakup.TaxDetails['P2USD'] || fp.PriceBreakup.TaxDetails.P2;
        fp.PriceBreakup.TaxDetails.P2 = Math.ceil(fp.PriceBreakup.TaxDetails.P2USD * currencyRate);
        fp.PriceBreakup.TaxDetails.ZRUSD = fp.PriceBreakup.TaxDetails['ZRUSD'] || fp.PriceBreakup.TaxDetails.ZR;
        fp.PriceBreakup.TaxDetails.ZR = Math.ceil(fp.PriceBreakup.TaxDetails.ZRUSD * currencyRate);
        fp.PriceBreakup.TaxDetails.YQUSD = fp.PriceBreakup.TaxDetails['YQUSD'] || fp.PriceBreakup.TaxDetails.YQ;
        fp.PriceBreakup.TaxDetails.YQ = Math.ceil(fp.PriceBreakup.TaxDetails.YQUSD * currencyRate);
        fp.PriceBreakup.AgentCommissionUSD = fp.PriceBreakup['AgentCommissionUSD'] || fp.PriceBreakup.AgentCommission;
        fp.PriceBreakup.AgentCommission = Math.ceil(fp.PriceBreakup.AgentCommissionUSD * currencyRate);
        fp.PriceBreakup.AgentTdsOnCommisionUSD = fp.PriceBreakup['AgentTdsOnCommisionUSD'] || fp.PriceBreakup.AgentTdsOnCommision;
        fp.PriceBreakup.AgentTdsOnCommision = Math.ceil(fp.PriceBreakup.AgentTdsOnCommisionUSD * currencyRate);
        fp.PriceBreakup.CommissionEarnedUSD = fp.PriceBreakup['CommissionEarnedUSD'] || fp.PriceBreakup.CommissionEarned;
        fp.PriceBreakup.CommissionEarned = Math.ceil(fp.PriceBreakup.CommissionEarnedUSD * currencyRate);
        fp.PriceBreakup.PLBEarnedUSD = fp.PriceBreakup['PLBEarnedUSD'] || fp.PriceBreakup.PLBEarned;
        fp.PriceBreakup.PLBEarned = Math.ceil(fp.PriceBreakup.PLBEarnedUSD * currencyRate);
        fp.PriceBreakup.TdsOnCommissionUSD = fp.PriceBreakup['TdsOnCommissionUSD'] || fp.PriceBreakup.TdsOnCommission;
        fp.PriceBreakup.TdsOnCommission = Math.ceil(fp.PriceBreakup.TdsOnCommissionUSD * currencyRate);
        fp.PriceBreakup.TdsOnPLBUSD = fp.PriceBreakup['TdsOnPLBUSD'] || fp.PriceBreakup.TdsOnPLB;
        fp.PriceBreakup.TdsOnPLB = Math.ceil(fp.PriceBreakup.TdsOnPLBUSD * currencyRate);
        fp.PassengerBreakup.ADT.BasePriceUSD = fp.PassengerBreakup.ADT['BasePriceUSD'] || fp.PassengerBreakup.ADT.BasePrice;
        fp.PassengerBreakup.ADT.BasePrice = Math.ceil(fp.PassengerBreakup.ADT.BasePriceUSD * currencyRate);
        fp.PassengerBreakup.ADT.TaxUSD = fp.PassengerBreakup.ADT['TaxUSD'] || fp.PassengerBreakup.ADT.Tax;
        fp.PassengerBreakup.ADT.Tax = Math.ceil(fp.PassengerBreakup.ADT.TaxUSD * currencyRate);
        fp.PassengerBreakup.ADT.TotalPriceUSD = fp.PassengerBreakup.ADT['TotalPriceUSD'] || fp.PassengerBreakup.ADT.TotalPrice;
        fp.PassengerBreakup.ADT.TotalPrice = Math.ceil(fp.PassengerBreakup.ADT.TotalPriceUSD * currencyRate);
        if (fp.PassengerBreakup.hasOwnProperty("CHD")) {
            fp.PassengerBreakup.CHD.BasePriceUSD = fp.PassengerBreakup.CHD['BasePriceUSD'] || fp.PassengerBreakup.CHD.BasePrice;
            fp.PassengerBreakup.CHD.BasePrice = Math.ceil(fp.PassengerBreakup.CHD.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CHD.TaxUSD = fp.PassengerBreakup.CHD['TaxUSD'] || fp.PassengerBreakup.CHD.Tax;
            fp.PassengerBreakup.CHD.Tax = Math.ceil(fp.PassengerBreakup.CHD.TaxUSD * currencyRate);
            fp.PassengerBreakup.CHD.TotalPriceUSD = fp.PassengerBreakup.CHD['TotalPriceUSD'] || fp.PassengerBreakup.CHD.TotalPrice;
            fp.PassengerBreakup.CHD.TotalPrice = Math.ceil(fp.PassengerBreakup.CHD.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty("CNN")) {
            fp.PassengerBreakup.CNN.BasePriceUSD = fp.PassengerBreakup.CNN['BasePriceUSD'] || fp.PassengerBreakup.CNN.BasePrice;
            fp.PassengerBreakup.CNN.BasePrice = Math.ceil(fp.PassengerBreakup.CNN.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CNN.TaxUSD = fp.PassengerBreakup.CNN['TaxUSD'] || fp.PassengerBreakup.CNN.Tax;
            fp.PassengerBreakup.CNN.Tax = Math.ceil(fp.PassengerBreakup.CNN.TaxUSD * currencyRate);
            fp.PassengerBreakup.CNN.TotalPriceUSD = fp.PassengerBreakup.CNN['TotalPriceUSD'] || fp.PassengerBreakup.CNN.TotalPrice;
            fp.PassengerBreakup.CNN.TotalPrice = Math.ceil(fp.PassengerBreakup.CNN.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty("INF")) {
            fp.PassengerBreakup.INF.BasePriceUSD = fp.PassengerBreakup.INF['BasePriceUSD'] || fp.PassengerBreakup.INF.BasePrice;
            fp.PassengerBreakup.INF.BasePrice = Math.ceil(fp.PassengerBreakup.INF.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.INF.TaxUSD = fp.PassengerBreakup.INF['TaxUSD'] || fp.PassengerBreakup.INF.Tax;
            fp.PassengerBreakup.INF.Tax = Math.ceil(fp.PassengerBreakup.INF.TaxUSD * currencyRate);
            fp.PassengerBreakup.INF.TotalPriceUSD = fp.PassengerBreakup.INF['TotalPriceUSD'] || fp.PassengerBreakup.INF.TotalPrice;
            fp.PassengerBreakup.INF.TotalPrice = Math.ceil(fp.PassengerBreakup.INF.TotalPriceUSD * currencyRate);
        }
        return usdResult;
    }

    changeCurrencyExtraServices(usdResult) {
        const fp = usdResult;
        const currencyRate = this.currentCurrencyRate.value;
        for (let i = 0; i < fp.Baggage.length; i++) {
            for (let j = 0; j < fp.Baggage[i].length; j++) {
                fp.Baggage[i][j].PriceUSD = fp.Baggage[i][j]['PriceUSD'] || fp.Baggage[i][j].Price;
                fp.Baggage[i][j].Price = Math.ceil(fp.Baggage[i][j].PriceUSD * currencyRate);
            }
        }
        for (let i = 0; i < fp.MealPreference.length; i++) {
            for (let j = 0; j < fp.MealPreference[i].length; j++) {
                fp.MealPreference[i][j].PriceUSD = fp.MealPreference[i][j]['PriceUSD'] || fp.MealPreference[i][j].Price;
                fp.MealPreference[i][j].Price = Math.ceil(fp.MealPreference[i][j].PriceUSD * currencyRate);
            }
        }
        for (let i = 0; i < fp.Seat.length; i++) {
            for (let j = 0; j < fp.Seat[i].length; j++) {
                fp.Seat[i][j].PriceUSD = fp.Seat[i][j]['PriceUSD'] || fp.Seat[i][j].Price;
                fp.Seat[i][j].Price = Math.ceil(fp.Seat[i][j].PriceUSD * currencyRate);
            }
        }
        return fp;
    }

    changeCurrencyCommitBooking(usdResult) {
        const fp = usdResult;
        const currencyRate = this.currentCurrencyRate.value;
        for (let i = 0; i < fp.PassengerDetails.length; i++) {
            if (fp.PassengerDetails[i].hasOwnProperty('BaggageDetails')) {
                for (let j = 0; j < fp.PassengerDetails[i]['BaggageDetails'].length; j++) {
                    fp.PassengerDetails[i].BaggageDetails[j].PriceUSD = fp.PassengerDetails[i].BaggageDetails[j]['PriceUSD'] || fp.PassengerDetails[0].BaggageDetails[0].Price;
                    fp.PassengerDetails[i].BaggageDetails[j].Price = Math.ceil(fp.PassengerDetails[i].BaggageDetails[j].PriceUSD * currencyRate);

                    fp.PassengerDetails[i].BaggageDetails[j].BaggageUSD = fp.PassengerDetails[i].BaggageDetails[j]['BaggageUSD'] || fp.PassengerDetails[0].BaggageDetails[0].Baggage;
                    const Baggage = (fp.PassengerDetails[i].BaggageDetails[j].BaggageUSD).replace(fp.PassengerDetails[i].BaggageDetails[j].PriceUSD, fp.PassengerDetails[i].BaggageDetails[j].Price);
                    const FinalBaggage = (Baggage).replace('USD', this.currentCurrency.value);
                    fp.PassengerDetails[i].BaggageDetails[j].Baggage = FinalBaggage;
                }
            }
        }
        fp.Price.Currency = this.currentCurrency.value;
        fp.Price.TotalDisplayFareUSD = fp.Price['TotalDisplayFareUSD'] || fp.Price.TotalDisplayFare;
        fp.Price.TotalDisplayFare = Math.ceil(fp.Price.TotalDisplayFareUSD * currencyRate);
        fp.Price.PriceBreakup.BasicFareUSD = fp.Price.PriceBreakup['BasicFareUSD'] || fp.Price.PriceBreakup.BasicFare;
        fp.Price.PriceBreakup.BasicFare = Math.ceil(fp.Price.PriceBreakup.BasicFareUSD * currencyRate);
        fp.Price.PriceBreakup.TaxUSD = fp.Price.PriceBreakup['TaxUSD'] || fp.Price.PriceBreakup.Tax;
        fp.Price.PriceBreakup.Tax = Math.ceil(fp.Price.PriceBreakup.TaxUSD * currencyRate);
        fp.Price.PriceBreakup.TotalPriceUSD = fp.Price.PriceBreakup['TotalPriceUSD'] || fp.Price.PriceBreakup.TotalPrice;
        fp.Price.PriceBreakup.TotalPrice = Math.ceil(fp.Price.PriceBreakup.TotalPriceUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.INUSD = fp.Price.PriceBreakup.TaxDetails['INUSD'] || fp.Price.PriceBreakup.TaxDetails.IN;
        fp.Price.PriceBreakup.TaxDetails.IN = Math.ceil(fp.Price.PriceBreakup.TaxDetails.INUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.K3USD = fp.Price.PriceBreakup.TaxDetails['K3USD'] || fp.Price.PriceBreakup.TaxDetails.K3;
        fp.Price.PriceBreakup.TaxDetails.K3 = Math.ceil(fp.Price.PriceBreakup.TaxDetails.K3USD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.P2USD = fp.Price.PriceBreakup.TaxDetails['P2USD'] || fp.Price.PriceBreakup.TaxDetails.P2;
        fp.Price.PriceBreakup.TaxDetails.P2 = Math.ceil(fp.Price.PriceBreakup.TaxDetails.P2USD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.YRUSD = fp.Price.PriceBreakup.TaxDetails['YRUSD'] || fp.Price.PriceBreakup.TaxDetails.YR;
        fp.Price.PriceBreakup.TaxDetails.YR = Math.ceil(fp.Price.PriceBreakup.TaxDetails.YRUSD * currencyRate);
        fp.Price.PriceBreakup.AgentCommissionUSD = fp.Price.PriceBreakup['AgentCommissionUSD'] || fp.Price.PriceBreakup.AgentCommission;
        fp.Price.PriceBreakup.AgentCommission = Math.ceil(fp.Price.PriceBreakup.AgentCommissionUSD * currencyRate);
        fp.Price.PriceBreakup.AgentTdsOnCommisionUSD = fp.Price.PriceBreakup['AgentTdsOnCommisionUSD'] || fp.Price.PriceBreakup.AgentTdsOnCommision;
        fp.Price.PriceBreakup.AgentTdsOnCommision = Math.ceil(fp.Price.PriceBreakup.AgentTdsOnCommisionUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.BasePriceUSD = fp.Price.PassengerBreakup.ADT['BasePriceUSD'] || fp.Price.PassengerBreakup.ADT.BasePrice;
        fp.Price.PassengerBreakup.ADT.BasePrice = Math.ceil(fp.Price.PassengerBreakup.ADT.BasePriceUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TaxUSD = fp.Price.PassengerBreakup.ADT['TaxUSD'] || fp.Price.PassengerBreakup.ADT.Tax;
        fp.Price.PassengerBreakup.ADT.Tax = Math.ceil(fp.Price.PassengerBreakup.ADT.TaxUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TotalPriceUSD = fp.Price.PassengerBreakup.ADT['TotalPriceUSD'] || fp.Price.PassengerBreakup.ADT.TotalPrice;
        fp.Price.PassengerBreakup.ADT.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.ADT.TotalPriceUSD * currencyRate);
        if (fp.Price.PassengerBreakup.hasOwnProperty('CHD')) {
            fp.Price.PassengerBreakup.CHD.BasePriceUSD = fp.Price.PassengerBreakup.CHD['BasePriceUSD'] || fp.Price.PassengerBreakup.CHD.BasePrice;
            fp.Price.PassengerBreakup.CHD.BasePrice = Math.ceil(fp.Price.PassengerBreakup.CHD.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TaxUSD = fp.Price.PassengerBreakup.CHD['TaxUSD'] || fp.Price.PassengerBreakup.CHD.Tax;
            fp.Price.PassengerBreakup.CHD.Tax = Math.ceil(fp.Price.PassengerBreakup.CHD.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TotalPriceUSD = fp.Price.PassengerBreakup.CHD['TotalPriceUSD'] || fp.Price.PassengerBreakup.CHD.TotalPrice;
            fp.Price.PassengerBreakup.CHD.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.CHD.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty('CNN')) {
            fp.PassengerBreakup.CNN.BasePriceUSD = fp.PassengerBreakup.CNN['BasePriceUSD'] || fp.PassengerBreakup.CNN.BasePrice;
            fp.PassengerBreakup.CNN.BasePrice = Math.ceil(fp.PassengerBreakup.CNN.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CNN.TaxUSD = fp.PassengerBreakup.CNN['TaxUSD'] || fp.PassengerBreakup.CNN.Tax;
            fp.PassengerBreakup.CNN.Tax = Math.ceil(fp.PassengerBreakup.CNN.TaxUSD * currencyRate);
            fp.PassengerBreakup.CNN.TotalPriceUSD = fp.PassengerBreakup.CNN['TotalPriceUSD'] || fp.PassengerBreakup.CNN.TotalPrice;
            fp.PassengerBreakup.CNN.TotalPrice = Math.ceil(fp.PassengerBreakup.CNN.TotalPriceUSD * currencyRate);
        }
        if (fp.Price.PassengerBreakup.hasOwnProperty('INF')) {
            fp.Price.PassengerBreakup.INF.BasePriceUSD = fp.Price.PassengerBreakup.INF['BasePriceUSD'] || fp.Price.PassengerBreakup.INF.BasePrice;
            fp.Price.PassengerBreakup.INF.BasePrice = Math.ceil(fp.Price.PassengerBreakup.INF.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TaxUSD = fp.Price.PassengerBreakup.INF['TaxUSD'] || fp.Price.PassengerBreakup.INF.Tax;
            fp.Price.PassengerBreakup.INF.Tax = Math.ceil(fp.Price.PassengerBreakup.INF.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TotalPriceUSD = fp.Price.PassengerBreakup.INF['TotalPriceUSD'] || fp.Price.PassengerBreakup.INF.TotalPrice;
            fp.Price.PassengerBreakup.INF.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.INF.TotalPriceUSD * currencyRate);
        }
        return fp;
    }

    changeCurrencyFinalBooking(usdResult) {
        const fp = usdResult;
        const currencyRate = this.currentCurrencyRate.value;
        fp.Price.Currency = this.currentCurrency.value;
        fp.Price.TotalDisplayFareUSD = fp.Price['TotalDisplayFareUSD'] || fp.Price.TotalDisplayFare;
        fp.Price.TotalDisplayFare = Math.ceil(fp.Price.TotalDisplayFareUSD * currencyRate);
        fp.Price.PriceBreakup.BasicFareUSD = fp.Price.PriceBreakup['BasicFareUSD'] || fp.Price.PriceBreakup.BasicFare;
        fp.Price.PriceBreakup.BasicFare = Math.ceil(fp.Price.PriceBreakup.BasicFareUSD * currencyRate);
        fp.Price.PriceBreakup.TaxUSD = fp.Price.PriceBreakup['TaxUSD'] || fp.Price.PriceBreakup.Tax;
        fp.Price.PriceBreakup.Tax = Math.ceil(fp.Price.PriceBreakup.TaxUSD * currencyRate);
        fp.Price.PriceBreakup.TotalPriceUSD = fp.Price.PriceBreakup['TotalPriceUSD'] || fp.Price.PriceBreakup.TotalPrice;
        fp.Price.PriceBreakup.TotalPrice = Math.ceil(fp.Price.PriceBreakup.TotalPriceUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.airportTaxUSD = fp.Price.PriceBreakup.TaxDetails['airportTaxUSD'] || fp.Price.PriceBreakup.TaxDetails.airportTax;
        fp.Price.PriceBreakup.TaxDetails.airportTax = Math.ceil(fp.Price.PriceBreakup.TaxDetails.airportTaxUSD * currencyRate);
        fp.Price.PriceBreakup.TaxDetails.fuelTaxUSD = fp.Price.PriceBreakup.TaxDetails['fuelTaxUSD'] || fp.Price.PriceBreakup.TaxDetails.fuelTax;
        fp.Price.PriceBreakup.TaxDetails.fuelTax = Math.ceil(fp.Price.PriceBreakup.TaxDetails.fuelTaxUSD * currencyRate);
        fp.Price.PriceBreakup.AgentCommissionUSD = fp.Price.PriceBreakup['AgentCommissionUSD'] || fp.Price.PriceBreakup.AgentCommission;
        fp.Price.PriceBreakup.AgentCommission = Math.ceil(fp.Price.PriceBreakup.AgentCommissionUSD * currencyRate);
        fp.Price.PriceBreakup.AgentTdsOnCommisionUSD = fp.Price.PriceBreakup['AgentTdsOnCommisionUSD'] || fp.Price.PriceBreakup.AgentTdsOnCommision;
        fp.Price.PriceBreakup.AgentTdsOnCommision = Math.ceil(fp.Price.PriceBreakup.AgentTdsOnCommisionUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.BasePriceUSD = fp.Price.PassengerBreakup.ADT['BasePriceUSD'] || fp.Price.PassengerBreakup.ADT.BasePrice;
        fp.Price.PassengerBreakup.ADT.BasePrice = Math.ceil(fp.Price.PassengerBreakup.ADT.BasePriceUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TaxUSD = fp.Price.PassengerBreakup.ADT['TaxUSD'] || fp.Price.PassengerBreakup.ADT.Tax;
        fp.Price.PassengerBreakup.ADT.Tax = Math.ceil(fp.Price.PassengerBreakup.ADT.TaxUSD * currencyRate);
        fp.Price.PassengerBreakup.ADT.TotalPriceUSD = fp.Price.PassengerBreakup.ADT['TotalPriceUSD'] || fp.Price.PassengerBreakup.ADT.TotalPrice;
        fp.Price.PassengerBreakup.ADT.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.ADT.TotalPriceUSD * currencyRate);
        if (fp.Price.PassengerBreakup.hasOwnProperty('CHD')) {
            fp.Price.PassengerBreakup.CHD.BasePriceUSD = fp.Price.PassengerBreakup.CHD['BasePriceUSD'] || fp.Price.PassengerBreakup.CHD.BasePrice;
            fp.Price.PassengerBreakup.CHD.BasePrice = Math.ceil(fp.Price.PassengerBreakup.CHD.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TaxUSD = fp.Price.PassengerBreakup.CHD['TaxUSD'] || fp.Price.PassengerBreakup.CHD.Tax;
            fp.Price.PassengerBreakup.CHD.Tax = Math.ceil(fp.Price.PassengerBreakup.CHD.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.CHD.TotalPriceUSD = fp.Price.PassengerBreakup.CHD['TotalPriceUSD'] || fp.Price.PassengerBreakup.CHD.TotalPrice;
            fp.Price.PassengerBreakup.CHD.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.CHD.TotalPriceUSD * currencyRate);
        }
        if (fp.PassengerBreakup.hasOwnProperty('CNN')) {
            fp.PassengerBreakup.CNN.BasePriceUSD = fp.PassengerBreakup.CNN['BasePriceUSD'] || fp.PassengerBreakup.CNN.BasePrice;
            fp.PassengerBreakup.CNN.BasePrice = Math.ceil(fp.PassengerBreakup.CNN.BasePriceUSD * currencyRate);
            fp.PassengerBreakup.CNN.TaxUSD = fp.PassengerBreakup.CNN['TaxUSD'] || fp.PassengerBreakup.CNN.Tax;
            fp.PassengerBreakup.CNN.Tax = Math.ceil(fp.PassengerBreakup.CNN.TaxUSD * currencyRate);
            fp.PassengerBreakup.CNN.TotalPriceUSD = fp.PassengerBreakup.CNN['TotalPriceUSD'] || fp.PassengerBreakup.CNN.TotalPrice;
            fp.PassengerBreakup.CNN.TotalPrice = Math.ceil(fp.PassengerBreakup.CNN.TotalPriceUSD * currencyRate);
        }
        if (fp.Price.PassengerBreakup.hasOwnProperty('INF')) {
            fp.Price.PassengerBreakup.INF.BasePriceUSD = fp.Price.PassengerBreakup.INF['BasePriceUSD'] || fp.Price.PassengerBreakup.INF.BasePrice;
            fp.Price.PassengerBreakup.INF.BasePrice = Math.ceil(fp.Price.PassengerBreakup.INF.BasePriceUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TaxUSD = fp.Price.PassengerBreakup.INF['TaxUSD'] || fp.Price.PassengerBreakup.INF.Tax;
            fp.Price.PassengerBreakup.INF.Tax = Math.ceil(fp.Price.PassengerBreakup.INF.TaxUSD * currencyRate);
            fp.Price.PassengerBreakup.INF.TotalPriceUSD = fp.Price.PassengerBreakup.INF['TotalPriceUSD'] || fp.Price.PassengerBreakup.INF.TotalPrice;
            fp.Price.PassengerBreakup.INF.TotalPrice = Math.ceil(fp.Price.PassengerBreakup.INF.TotalPriceUSD * currencyRate);
        }
        return fp;
    }

    getFlightType(flight) {
        let airlineCodes = [];
        if (flight && flight.FlightDetails) {
            flight.FlightDetails.Details.forEach(flightDetails => {
                flightDetails.forEach(flight => {
                    airlineCodes.push({
                        Destination: flight.Destination.AirportCode,
                        Origin: flight.Origin.AirportCode
                    });
                });
            });
            this.subs.sink = this.apiHandlerService.apiHandler('flightType', 'POST', '', '', {
                Segments: airlineCodes
            }).subscribe(resp => {
                this.flightType.next(resp.data);
            })
        }
    }

    hideModel() {
        this.loading.next(false);
        this.searchingFlight.next(false);
        this.resultsFound = false;
        this.closeModel.next(true);
    }

    setInvoiceNumber(appReference) {
        let invoiceNumber = "";
        if (appReference) {
            invoiceNumber = "INV-" + (appReference.split("-")[1]);
        }
        return invoiceNumber;
    }

    convertDurationToMinutes(durationString) {
        let hours;
        let minutes;
        const parts = durationString.split(' ');
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].toLowerCase() === 'hrs') {
                hours = parseInt(parts[i - 1]);
            } else if (parts[i].toLowerCase() === 'mins') {
                minutes = parseInt(parts[i - 1]);
            }
        }
        return parseInt(hours) * 60 + parseInt(minutes);
     }
    
     setLocalStrorage(journeyListPre, resultTokendata) {
        localStorage.setItem('b2bJourneyListPre', JSON.stringify(journeyListPre));
        localStorage.setItem('b2bBookingSource', resultTokendata.booking_source);
        localStorage.setItem('b2bResultToken', journeyListPre.JourneyList.ResultToken);
        localStorage.setItem('b2bFlightTraveller', JSON.stringify(this.traveller));
    }

    setPassport(isPanMandatory,isPassportMandatory){
        localStorage.setItem('isPanMandatory', JSON.stringify(isPanMandatory));
        localStorage.setItem('isPassportMandatory', JSON.stringify(isPassportMandatory));
    }
    
    setIsPanMandatory(){
        const storedState = localStorage.getItem('isPanMandatory');
        if (storedState) {
            this.isPanMandatory=(JSON.parse(storedState));
        }
    }

    setIsPassportMandatory(){
        const storedState = localStorage.getItem('isPassportMandatory');
        if (storedState) {
            this.isPassportMandatory=(JSON.parse(storedState));
        }
    }

    setUserTitleList() {
        const storedState = localStorage.getItem('b2bUserTitleList');
        if (storedState) {
            this.userTitleList.next(JSON.parse(storedState));
        }
    }

    setJourneyListPre() {
        const storedState = localStorage.getItem('b2bJourneyListPre');
        if (storedState) {
            this.bookingFlightData.next(JSON.parse(storedState));
        }
    }

    setFlightTraveller() {
        const storedState = localStorage.getItem('b2bFlightTraveller');
        if (storedState) {
            this.traveller = (JSON.parse(storedState));
        }
    }
    
    setResultToken() {
        const storedState = localStorage.getItem('b2bResultToken');
        if (storedState) {
            this.resultToken = storedState;
        }
    }

    setBookingSourceValue() {
        const storedState = localStorage.getItem('b2bBookingSource');
        if (storedState) {
            this.bookingSource.next(storedState);
        }
    }

    setCommitBookingResponse() {
        const storedState = localStorage.getItem('b2bFlightCommitBookingResponse');
        if (storedState) {
            this.CommitBookingResponse.next(JSON.parse(storedState));
        }
    }

    setMealFee() {
        const storedState = localStorage.getItem('mealFee');
        if (storedState) {
            this.mealFees.next({
                mealFee: JSON.parse(storedState)
            });
        }
    }

    setSeatFee() {
        const storedState = localStorage.getItem('seatFee');
        if (storedState) {
            this.seatFees.next({
                seatFee: JSON.parse(storedState)
            });
        }
    }
    
    setBaggageFee() {
        const storedState = localStorage.getItem('baggageFee');
        if (storedState) {
            this.baggageFees.next({
                baggageFee: JSON.parse(storedState)
            });
        }
    }

    setAirlineCode(data) {
        this.callCount++;
        if (this.callCount === 1 && data.SearchType != 'approval') {
            data.AirlineCode = "6E";
        }
        else if (this.callCount === 2 && data.SearchType != 'approval') {
            data.AirlineCode = "SG";
            this.callCount = 0;
        }
    }

    setAirlineCodeTP(data) {
        this.callCountTP++;
        if (this.callCountTP === 1 && data.SearchType != 'approval') {
            data.AirlineCode = "";
        }
        else if (this.callCountTP === 2 && data.SearchType != 'approval') {
            data.AirlineCode = "6E";
            this.callCountTP = 0;
        }
    }
    
    getApiList()
    {
        let enabledApiList= this.getEnabledApi();
        let tmx_api = enabledApiList.filter(api => this.apiList.includes(api));
        return tmx_api
    }

    setIsDomestic(data){
        data.is_domestic = this.is_domestic ? 1 : 0;
    }

    setSegments(data) {
        for (let segment of data.Segments) {
            segment.Destination.includes('-') ? segment.Destination = segment.Destination.split('-')[1] : segment.Destination;
            segment.Origin.includes('-') ? segment.Origin = segment.Origin.split('-')[1] : segment.Origin;
        }
    }

    updateData(data) {
        //(this.currentUser && this.currentUser.auth_role_id == 8) ? data.CorporateID = 505 : data.CorporateID = +(localStorage.getItem('selectedCorporateId'));
        data.Purpose = localStorage.getItem('selectedPurpose');
        data.BookingType = localStorage.getItem('bookingType');
        data.TrainingId = localStorage.getItem('selectedTrainingId');
        data.TrainingName = localStorage.getItem('selectedTrainingName');
        data.TripId = localStorage.getItem('selectedTripId');
        data.TripName = localStorage.getItem('selectedTripName');
        data.SelectedState = (localStorage.getItem('selectedState'));
    }

    validatePolicy(data) {
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        let piceResponse = this.validatePricePolicy(data, policyList);
        return piceResponse;
    }

    validatePricePolicy(data, policyList) {
        if (data && data.length > 0) {
            if (policyList && policyList.length > 0 && this.is_domestic && !policyList[0].dom_beyond_limit) {
            }
            return data;
        }
    }

    setPolicyPrice(data,policyList){
        const policyHotels = policyList[0].policyHotels || [];
        const cityId = data[0].searchRequest.CityIds[0];
        let filteredData = [];
        let filteredPolicyList = policyHotels.filter(policy => policy.cities.includes(cityId));
        if (filteredPolicyList.length > 0) {
            const upperLimit = filteredPolicyList[0].upper_limit;
            localStorage.setItem("policyPrice",upperLimit);
        }
        if (filteredPolicyList.length === 0 && policyList[0].generic_budget_limit) {
            localStorage.setItem("policyPrice",policyList[0].generic_budget_limit);
        }
    }

    getCabinType(cabinClass: string): number {
        switch (cabinClass) {
            case 'Economy':
                return 1;
            case 'Business':
                return 2;
            case 'First':
                return 3;
            default:
                return -1; // Unknown cabin class
        }
    }

    getSelectedRecord(records, cabinClass): any {
        return records.find(record => record.cabin ===this.getCabinType(cabinClass));
    }

    filterUniqueZBAPINO00003Source(data) {
        const FlightItineraries = [];
        data.FlightBookingTransaction.forEach((element: any) => {
            // if (element.source === "ZBAPINO00003" && !foundZBAPINO00003) {
            //     foundZBAPINO00003 = true;
            //     FlightItineraries.push(element.flightBookingTransactionItineraries);
            // } else if (element.source === "ZBAPINO00019" || element.source === "ZBAPINO00020") {
             FlightItineraries.push(element.flightBookingTransactionItineraries);
            //}
        });
        return FlightItineraries;
    }

    blockAirline(data) {
        let cabinClass = data.Segments[0].CabinClassOnward;
        if (cabinClass == 'Premium Economy' || cabinClass == 'Business' || cabinClass == 'First Class') {
            this.bookingApiSources = this.bookingApiSources.filter(el => (el == 'ZBAPINO00003' || el == 'ZBAPINO00015'));
            data.booking_source = this.bookingApiSources[0];
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}