import { PlatformLocation } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { browserRefresh } from '../../../../app/app.component';
import { AppService } from '../../../app.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { untilDestroyed } from '../../../core/services';
import { formatDate } from '../../../core/services/format-date';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ThemeOptions } from '../../../theme-options';
import { FlightService } from './flight.service';
@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss'],
})
export class FlightComponent implements OnInit, OnDestroy {
    public browserRefresh: boolean;
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public trainIcon: string = "assets/images/login-images/assets/train.png";
    public carIcon: string = "assets/images/login-images/assets/car.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    public plusIcon: string = "assets/images/login-images/plus.png";
    public removeIcon: string = "assets/images/login-images/remove.png";
    @ViewChild('roundtripButton', { static: true }) roundtripButton: ElementRef<HTMLElement>;
    @ViewChild('flight', { static: false }) flight: ElementRef<HTMLElement>;
    @ViewChild('hotels', { static: false }) hotels: ElementRef<HTMLElement>;
    @ViewChild('insurance', { static: false }) insurance: ElementRef<HTMLElement>;
    @ViewChild('multiButton', { static: true }) multiButton: ElementRef<HTMLElement>;
    @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
    @ViewChild('destinationCity', { static: false }) destinationCity: ElementRef<HTMLElement>;
    @ViewChild('departureDate', { static: false }) departureDate: ElementRef<HTMLElement>;
    @ViewChild('returnDate', { static: false }) returnDate: ElementRef<HTMLElement>;
    @ViewChildren('mDepartureCity') mDepartureCity: QueryList<ElementRef>
    @ViewChildren('mDestinationCity') mDestinationCity: QueryList<ElementRef>
    @ViewChildren('mDepartureDate') mDepartureDate: QueryList<ElementRef>
    @ViewChild('prefferedAirline', { static: false }) prefferedAirline: ElementRef<HTMLElement>;
    @ViewChild('trains', { static: false }) trains: ElementRef<HTMLElement>;
    @ViewChild('cars', { static: false }) cars: ElementRef<HTMLElement>;
    @Input() searchtype;
    @Output() callResult = new EventEmitter<any>();
    public items$: Observable<[]>;
    public input$ = new Subject<string | null>();
    searchTabs: Array<string>;
    selectedIndex = 1;
    CabinClass: any;
    searchedList: Array<any> = Array();
    searchedAirLineList: Array<any> = Array();
    depart = false as boolean;
    isOpen = false as boolean;
    isreturnDate = false as boolean;
    exchangeCity = false;
    mappedData;
    trendingSearches = [];
    isDisabled: boolean = false;
    onewayTab: boolean = false;
    roundtripTrab: boolean = false;
    regConfig: FormGroup;
    cityExchanged = false;
    flight_departure_noOfDays: any;
    minDate = new Date();
    minDateArr = Array(5).fill(new Date());
    maxDate;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    fadeinn = false;
    Connectivity = false;
    airline = false;
    travellersFadeinn = false;
    travellerForm: FormGroup;
    dropDownCity: any;
    submitSessionFlightSearchKeyCheck;
    travellerCountError = false;
    infantError = false;
    airlines: any = [];
    airlineName = 'Choose Airline';
    airlineCode: string;
    protected subs = new SubSink();
    setMinDate: any;
    tabSubscription: any;
    deparureDateReason = '';
    sectorReason = '';
    config = {
        displayKey: "name", //if objects array passed which key to be displayed defaults to description
        search: true, //true/false for the search functionlity defaults to false,
        height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
        placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
        customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        limitTo: 0,// number thats limits the no of options displayed in the UI (if zero, options will not be limited)
        moreText: 'more',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
        noResultsFound: 'No results found!',// text to be displayed when no items are found while searching
        searchPlaceholder: 'Search', // label thats displayed in search input,
        searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    }
    maxDateChild: any;
    minDateChild: any;
    maxDateInfant: any;
    minDateInfant: any;
    showModuleSearchName: boolean = true;
    enableTraveller: boolean = false;
    enableIncrement: boolean = false;
    loggedInUser;
    isCorporateSelected: boolean = false;
    isStateSelected: boolean = false;
    cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];
    showRemark: boolean = false;
    desableSearch: boolean = false;
    noPolicyEnabled: boolean;
    differenceInDays: number;
    showSectorPolicy: boolean = false;
    noSectorPolicyEnabled: boolean = false;
    flight_short_sector: any;
    is_flight_is_short_sector: any = false;
    isflightDayToDeparture: any = false;
    isDropdownOpen = false;
    selectedTripLabel = 'One way';

    constructor(
        private fb: FormBuilder,
        public location: PlatformLocation,
        private flightService: FlightService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private utility: UtilityService,
        public globals: ThemeOptions,
        private appService: AppService,
        private swalService: SwalService
    ) {
        this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
        this.showSectorPolicy = false;
        this.sectorReason = '';
        let selectedCorporate: any = JSON.parse(localStorage.getItem('selectedCorporate'));
        if (selectedCorporate) {
            this.appService.isCorporateSelected.next(true);
        }
        let selectedState: any = localStorage.getItem('selectedState');
        if (selectedState) {
            this.appService.isStateSelected.next(true);
        }
        this.appService.isCorporateSelected.subscribe(data => {
            this.loggedInUser.auth_role_id == 3 ? this.isCorporateSelected = data : this.isCorporateSelected = true;
        });
        this.appService.isStateSelected.subscribe(data=>{
            this.loggedInUser.auth_role_id==3?this.isStateSelected=data:this.isStateSelected=true;
        })
        this.input$.subscribe((newTerm) => {
            const logLine = `Typeahead emit: ${newTerm}\n`;
        });

        this.items$ = this.input$.pipe(
            map((term) => this.searchPeople(term))
        )
    }

    private searchPeople(term: string | null): any {
        const searchTerm = term ? term : '';
        return this.airlines.filter((airline) => {
            return airline.name.toLowerCase().startsWith(searchTerm.toLowerCase());
        });
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      }

      selectTrip(index: number, label: string) {
        this.selectedIndex = index;
        this.selectedTripLabel = label;
        this.isDropdownOpen = false; // Close dropdown after selection
        this.selectedTrip(index);
      }

    ngOnInit() {
        this.setMaxMinDate();
        this.flightService.flightSearchData.next([]);
        this.searchTabs = ['Roundtrip', 'Oneway', 'Multi-city'];
        this.createTravellerForm();
        this.createForm();
        this.flightService.bookingType.subscribe(data => {
            if (data == 'Self' && this.loggedInUser.auth_role_id == 2) {
                this.enableTraveller = false;
                this.enableIncrement = false;
                this.resetTraveller();
            } else if (data == 'Behalf' && this.loggedInUser.auth_role_id == 2) {
                this.enableTraveller = false;
                this.enableIncrement = true;
                //this.resetTraveller();
            }
            else {
                this.enableIncrement = true;
                this.enableTraveller = true;
            }
        });
        if (browserRefresh == false) {
            this.onewayTab = true;
            this.roundtripTrab = true;
        }
        let data1 = localStorage.getItem('flightSearchData');
        data1 = JSON.parse(data1) || {};
        this.browserRefresh = browserRefresh;

        //Radha D D
        if (this.browserRefresh == false && data1.hasOwnProperty('departureCity')) {
            const tripType = data1['tripType'];
            this.flightService.tripType.next(tripType);
            this.toggleTripType(tripType);
        }
        this.location.onPopState(() => {
            this.flightService.flightsCopy.next([]);
            this.flightService.flights.next([]);
            if (data1['tripType'] == 'Multi-city') {
                data1['cities'].forEach((e) => {
                    e.mDepartureDate = new Date(formatDate(new Date(e.mDepartureDate), 'DD/MM/YYYY'));
                });
            }
            if (data1) {
                this.regConfig.patchValue({
                    destinationCity: data1['destinationCity'],
                    departureDate: new Date(data1['departureDate']),
                    returnDate: data1['tripType'] != 'Oneway' ? new Date(data1['returnDate']) : '',
                    traveller: data1['traveller'],
                    cities: data1['cities'],
                    PreferredAirline: data1['PreferredAirlineName'],
                    PreferredAirlineCode: data1['PreferredAirlines'] && data1['PreferredAirlines'][0] ? data1['PreferredAirlines'][0] : '',
                });
            }
            this.checkSectorPolicy();
        });
        if (!this.flightService.formFilled && (data1['tripType'] == 'Multi-city')) {
            this.selectedTrip(2);//used to clear default selected records if clicked on home icon after selecting the multicity
        }
        if (this.flightService.formFilled) {
            (this.loggedInUser && this.loggedInUser.auth_role_id == 2) ? this.setPolicyValues() : null;
            let data = localStorage.getItem('flightSearchData');
            data = JSON.parse(data);
            if (data['tripType'] == 'Multi-city') {
                data['cities'].forEach((e) => {
                    e.mDepartureDate = new Date(formatDate(new Date(e.mDepartureDate), 'DD/MM/YYYY'));
                });
            }
            //Added to show more than 2 multi-city added in ui
            if (data['cities'] && data['cities'].length > 2) {
                const cities = this.regConfig.get('cities') as FormArray;
                for (let i = 0; i < (data['cities'].length - 2); i++) {
                    cities.push(this.generateCities(''));
                }
            }
            this.regConfig.patchValue({
                departureCity: data['departureCity'],
                destinationCity: data['destinationCity'],
                departureDate: new Date(formatDate(new Date(data['departureDate']), 'DD/MM/YYYY')),
                returnDate: data['returnDate'] ? new Date(formatDate(new Date(data['returnDate']), 'DD/MM/YYYY')) : '',
                traveller: data['traveller'],
                cities: data['cities'],
                PreferredAirline: data['PreferredAirlineName'] ? data['PreferredAirlineName'] : data['PreferredAirline']
            });
            this.regConfig.get('departureCity').clearValidators();
            this.regConfig.get('destinationCity').clearValidators();
            this.setSectorPolicy();
            const tripType = data['tripType'];
            this.flightService.tripType.next(tripType);
            this.toggleTripType(tripType);
        }
        if (this.selectedIndex == 1) {
            this.regConfig.get('returnDate').clearValidators();
        }
        const data = { agent_id: this.utility.readStorage('currentUser', localStorage)['user_id'] };
        this.CabinClass = this.flightService.getCabinClass();
        this.flightService.flightSearchData.subscribe(data => {
            if (data && data['id'] > 0) {
                const today = new Date()
                let tomorrow; let returnDate;
                if (new Date(data['travel_date']) > new Date(today)) {
                    tomorrow = new Date(formatDate(new Date(data['travel_date']), 'DD/MM/YYYY'))
                } else {
                    tomorrow = new Date(today)
                    tomorrow.setDate(tomorrow.getDate() + 1)
                }

                if (new Date(data['return_date']) > tomorrow) {
                    returnDate = new Date(formatDate(new Date(data['return_date']), 'DD/MM/YYYY'))
                } else {
                    returnDate = "";
                }
                let airlineCode;
                let airlineName;
                if (data['airlines'].includes('-')) {
                    let airline;
                    airline = data['airlines'].split('-');
                    airlineName = airline[0];
                    airlineCode = airline[1];
                }
                this.regConfig.patchValue({
                    departureCity: data['from_airport_code'],
                    destinationCity: data['to_airport_code'],
                    departureDate: tomorrow,
                    returnDate: data['trip_type'] != 'oneWay' ? returnDate : '',
                    CabinClass: data['class'],
                    tripType: data['trip_type'],
                    traveller: data['traveller'] || 1,
                    PreferredAirline: airlineName ? airlineName : 'All Airline',
                    PreferredAirlineCode: airlineCode ? airlineCode : 'ALL'
                });
                this.setSectorPolicy();
                let tripType = data['trip_type'] == "oneWay" ? "Oneway" : "Roundtrip";
                this.toggleTripType(tripType);
                if (data['trip_type'] == "oneWay") {
                    this.regConfig.get('returnDate').clearValidators();
                }
                else {
                    this.regConfig.get('returnDate').setValidators(Validators.required);
                    this.regConfig.get('returnDate').updateValueAndValidity();

                }
                this.regConfig.markAsUntouched();
            } else {
            }
        })
        this.flightService.modifySearch.subscribe((res) => {
            this.showModuleSearchName = !res;
        })
    }


    setPolicy() {
        let policyList = JSON.parse(localStorage.getItem('policyList'));
        if (policyList && policyList.length > 0 && policyList[0].cabin) {
            this.cabinClasses = policyList[0].cabin.split(',').map(c => c.trim());
            if (this.cabinClasses.includes('Economy')) {
                this.regConfig.patchValue({
                    CabinClass: 'Economy'
                })
            }
            else {
                this.regConfig.patchValue({
                    CabinClass: this.cabinClasses[0]
                })
            }

        }
    }

    validateNoOfDays(departureDate) {
        const policyList = JSON.parse(localStorage.getItem('policyList'));
        if (policyList && policyList.length > 0) {
            const flightIsDayToDeparture = policyList.length > 0 ? policyList[0].flight_is_day_to_departure : null;
            this.isflightDayToDeparture = policyList[0].flight_is_day_to_departure;
            const departureDateValue = new Date(departureDate);
            const currentDate = new Date();
            const differenceInDays = this.flightService.calculateDifferenceInDays(departureDateValue, currentDate);
            this.differenceInDays = differenceInDays;
            if (policyList.length > 0 && policyList[0].flight_is_day_to_departure) {
                this.handlePolicyBasedOnDays(policyList[0], differenceInDays);
            } else {
                this.resetPolicyFlags();
            }
        }
    }

    handlePolicyBasedOnDays(policy, differenceInDays) {
        if (policy.beyond_days) {
            this.handleBeyondDaysPolicy(policy, differenceInDays);
        } else {
            this.handleWithinDaysPolicy(policy, differenceInDays);
        }
    }

    handleBeyondDaysPolicy(policy, differenceInDays) {
        this.flight_departure_noOfDays = policy.flight_departure_noOfDays;
        if (differenceInDays < policy.flight_departure_noOfDays) {
            this.showRemark = true;
            this.noPolicyEnabled = false;
        } else {
            this.resetPolicyFlags();
        }
    }

    handleWithinDaysPolicy(policy, differenceInDays) {
        this.flight_departure_noOfDays = policy.flight_departure_noOfDays;
        let daymsg = `According to the policy, you must book a flight prior to ${this.flight_departure_noOfDays} days of your travel, this search is within ${this.flight_departure_noOfDays} days. Please contact to the Traveldesk`;
        if (differenceInDays < policy.flight_departure_noOfDays) {
            this.swalService.alert.warning(daymsg);
            this.showRemark = false;
            this.deparureDateReason = ''
            this.noPolicyEnabled = true;
        } else {
            this.resetPolicyFlags();
        }
    }

    resetPolicyFlags() {
        this.showRemark = false;
        this.deparureDateReason = ''
        this.noPolicyEnabled = false;
    }


    toggleTripType(tripType) {
        switch (tripType) {
            case 'Roundtrip':
                this.selectedIndex = 0;
                break;
            case 'Multi-city':
                this.selectedIndex = 2;
                break;
            case 'Oneway':
                this.selectedIndex = 1;
                this.regConfig.get('returnDate').clearValidators();
                break;
            default:
                break;
        }
        (this.loggedInUser && this.loggedInUser.auth_role_id == 2) ? this.checkSectorPolicy() : null;
    }

    ngAfterViewInit() {
        this.tabSubscription = this.flightService.goToDashboardTabs.subscribe(tabvalue => {
            // this.validateTabs(tabvalue);
        });
    }


    validateTabs(tabvalue) {
        if (tabvalue == 'flights') {
            this.flight && this.flight.nativeElement.click()
        }
        else if (tabvalue == 'hotels') {
            this.hotels && this.hotels.nativeElement.click()
        }
        else if (tabvalue == 'insurence') {
            this.insurance && this.insurance.nativeElement.click()
        }
        else if (tabvalue == 'trains') {
            this.trains && this.trains.nativeElement.click()
        }
        else if (tabvalue == 'cars') {
            this.cars && this.cars.nativeElement.click()
        }
    }


    openDate() {
        this.isOpen = true;
        this.Connectivity = false;
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.tabSubscription.unsubscribe();
    }

    selectedTrip(i: number): void {
        this.flightService.tripTypeClicked = true;
        this.selectedIndex = i;
        this.regConfig.patchValue({ tripType: this.searchTabs[i] });
        if (i != 2) {
            this.regConfig.get('returnDate').clearValidators();
            if (i == 0) {
                this.regConfig.get('returnDate').setValidators(Validators.required);
            }
            // if (this.regConfig.controls.departureCity.value) {
            //     this.regConfig.patchValue({ departureCity: '' });
            //     this.regConfig.patchValue({ departAirport: '' });

            // }
            // if (this.regConfig.controls.destinationCity.value) {
            //     this.regConfig.patchValue({ destinationCity: '' });
            //     this.regConfig.patchValue({ destinationAirport: '' });
            // }
            this.regConfig.patchValue({
                // departureDate: '',
                returnDate: '',
                cities: [
                    { mDepartureCity: '', mDeparture: '', mDepartureAirport: '', mDestinationCity: '', mDestination: '', mDestinationAirport: '', mDepartureDate: '' },
                    { mDepartureCity: '', mDeparture: '', mDepartureAirport: '', mDestinationCity: '', mDestination: '', mDestinationAirport: '', mDepartureDate: '' }
                ]
            });
            const citiesArray = this.regConfig.get('cities') as FormArray;
            citiesArray.controls.forEach(cityGroup => {
                Object.keys(cityGroup['controls']).forEach(key => {
                    cityGroup.get(key).clearValidators();
                });
            });
            this.regConfig.markAsUntouched();
        } else {
            if (this.regConfig.controls.departureCity.value == '') {
                this.regConfig.patchValue({ departureCity: '' });
                this.regConfig.patchValue({ departAirport: '' });
            }
            if (this.regConfig.controls.destinationCity.value == '') {
                this.regConfig.patchValue({ destinationCity: '' });
                this.regConfig.patchValue({ destinationAirport: '' });
            }
            if (this.regConfig.controls.departureDate.value == '') {
                this.regConfig.patchValue({ departureDate: '' });
            }
            if (this.regConfig.controls.returnDate.value == '') {
                this.regConfig.patchValue({ returnDate: '' });
            }
            this.regConfig.get('departureDate').clearValidators();
            this.regConfig.get('returnDate').clearValidators();
            this.regConfig.get('departureCity').clearValidators();
            this.regConfig.get('destinationCity').clearValidators();
            //Added to clear more than 2 cities addeed under multi-city
            const cities = this.regConfig.get('cities') as FormArray;
            if (cities.value && cities.value.length > 2) {
                while (cities.value.length > 2) {
                    cities.removeAt(cities.length - 1);
                }
            }
            const citiesArray = this.regConfig.get('cities') as FormArray;
            citiesArray.controls.forEach(cityGroup => {
                Object.keys(cityGroup['controls']).forEach(key => {
                    cityGroup.get(key).setValidators(Validators.required);
                });
            });
            this.regConfig.controls.cities.markAsUntouched();
        }
    }
    get classes() {
        const cssClasses = {};
        cssClasses['bg-info'] = true;
        return cssClasses;
    }


    getSearchedList(event: any, city, controlName): void {
        if (event.target.id === 'departureCity') {
            this.depart = true;
        } else if (event.target.id === 'destinationCity') {
            this.depart = false;
        }
        if (event && event.target.value) {
            const text = `${event.target.value}`.trim();
            if (text && text.length >= 3) {
                this.apiHandlerService.apiHandler('airportList', 'POST', '', '', { text })
                    .pipe(
                        shareReplay(1),
                        untilDestroyed(this)
                    )
                    .subscribe((resp: any) => {
                        if (resp.Status) {
                            this.searchedList = resp.data;
                        } else {
                            const msg = resp['Message'];
                            this.searchedList = [];
                        }

                    });
            }
            else {
                this.searchedList = [];
            }
        }
        else {
            const target = city !== '' ? city : this.regConfig;
            target.patchValue({
                [controlName]: '',
            });
        }
    }


    getPrefferedAirlineList(event: any): void {
        if (event && event.target.value) {
            const name = `${event.target.value}`;
            this.apiHandlerService.apiHandler('preferredAirlines', 'POST', '', '', { name })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.searchedAirLineList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.searchedAirLineList.length = 0;
                    }
                });
        }
    }


    applyTrendingSearch(ts: any) {
        this.regConfig.patchValue({
            tripType: 'Oneway', /* temp line */
            departureCity: ts.departureCity + '(' + ts.departureCityCode + ')',
            destinationCity: ts.destinationCity + '(' + ts.destinationCityCode + ')',
        })
    }

    submitForm(data: any) {
        this.flightService.flightsCopy.next([]);
        this.flightService.flights.next([]);
        this.callResult.emit(data);
    }

    createForm(): void {
        this.regConfig = this.fb.group({
            departureCity: ['', [Validators.required]],
            destinationCity: ['', [Validators.required]],
            departureDate: ['', [Validators.required]],
            returnDate: ['', [Validators.required]],
            tripType: 'Oneway',
            traveller: this.fb.group({
                adults: 1,
                childrens: 0,
                infants: 0,
                childDateOfBirth: this.fb.array([]),
                infantDateOfBirth: this.fb.array([])
            }),
            CabinClass: ['Economy', [Validators.required]],
            PreferredAirline: ['All'],
            PreferredAirlineCode: [''],
            departAirport: [''],
            destinationAirport: [''],
            connectivity: ['All', [Validators.required]],
            cities: this.fb.array([this.generateCities(''), this.generateCities('')]),
        });
        (this.loggedInUser && this.loggedInUser.auth_role_id == 2) ? this.setPolicy() : null;
        this.selectedTrip(1)
        if (this.flightService.formFilled) {
            this.setTravellerForm();
        } else if (this.flightService.isDevelopment) {
            this.regConfig.patchValue({
                departureCity: 'Bangalore(BLR)',
                destinationCity: 'Chennai(MAA)',
                departureDate: new Date(),
                traveller: this.flightService.traveller
            });
            this.travellerForm.patchValue(this.flightService.traveller);
        }
    }

    setTravellerForm() {
        this.setTravellerChild();
        this.setTravellerInfant();
        this.regConfig.patchValue(this.flightService.formFilled);
        this.travellerForm.patchValue(this.flightService.formFilled.traveller);
    }

    setTravellerChild() {
        this.flightService.formFilled.traveller.childDateOfBirth = this.flightService.formFilled.traveller.childDateOfBirth.map(child => {
            const date = new Date(child.childDateOfBirth);
            return { childDateOfBirth: date };
        });
        this.patchChildDateOfBirth(this.flightService.formFilled.traveller.childDateOfBirth);
        this.patchRegChildDateOfBirth(this.flightService.formFilled.traveller.childDateOfBirth);
    }

    setTravellerInfant() {
        this.flightService.formFilled.traveller.infantDateOfBirth = this.flightService.formFilled.traveller.infantDateOfBirth.map(infant => {
            const date = new Date(infant.infantDateOfBirth);
            return { infantDateOfBirth: date };
        });
        this.patchInfantDateOfBirth(this.flightService.formFilled.traveller.infantDateOfBirth);
        this.patchRegInfantDateOfBirth(this.flightService.formFilled.traveller.infantDateOfBirth);
    }

    createTravellerForm() {
        this.travellerForm = this.fb.group({
            adults: 1,
            childrens: 0,
            infants: 0,
            childDateOfBirth: this.fb.array([]),
            infantDateOfBirth: this.fb.array([]),
        });
    }

    generateCities(d: string) {
        let dDate = new Date(formatDate(new Date(), 'DD/MM/YYYY'));
        if (this.regConfig && this.regConfig.controls.tripType.value === 'Multi-city') {
            return this.fb.group({
                mDepartureCity: [d, [Validators.required]],
                mDeparture: [d, [Validators.required]],
                mDepartureAirport: [d, [Validators.required]],
                mDestinationCity: [d, [Validators.required]],
                mDestination: [d, [Validators.required]],
                mDestinationAirport: [''],
                mDepartureDate: ['', [Validators.required]]
            });
        }
        else {
            return this.fb.group({
                mDepartureCity: [d, [Validators.required]],
                mDeparture: [d, [Validators.required]],
                mDepartureAirport: [''],
                mDestinationCity: [d, [Validators.required]],
                mDestination: [d, [Validators.required]],
                mDestinationAirport: [''],
                mDepartureDate: ['', [Validators.required]]
            });
        }
    }

    onSubmitTraveller() {
        this.travellersFadeinn = false;
    }

    onUpdateTraveller(travellerType: string, operation: string) {
        const adults = this.travellerForm.get('adults').value;
        const childrens = this.travellerForm.get('childrens').value;
        const infants = this.travellerForm.get('infants').value;
        const control = this.travellerForm.controls[travellerType];
        const dateOfBirth = this.travellerForm.controls['childDateOfBirth'];
        const infantDOB = this.travellerForm.controls['infantDateOfBirth'];
        let result = 0;
        let travellerCount = 0;
        if (travellerType == 'adults' || travellerType == 'childrens') {
            travellerCount = adults + childrens;
        } else {
            travellerCount = infants;
        }


        if (travellerCount > 8 && operation === 'plus') {
            this.travellerCountError = true;
            this.infantError = false;
            return false;
        }
        if ((adults <= infants && operation === 'plus' && travellerType == 'infants') || (adults <= infants && operation === 'minus' && travellerType == 'adults')) {
            this.travellerCountError = true;
            this.infantError = true;
            return false;
        }
        if (operation === 'minus') {
            result = control.value < 1 ? control.value : control.value - 1;
            if (travellerType == 'childrens' && travellerCount > 1) { this.removechildDateOfBirth(dateOfBirth); }
            if (travellerType == 'infants') { this.removeInfantDateOfBirth(infantDOB); }
        } else {
            result = control.value + 1;
            if (travellerType == 'childrens' && travellerCount <= 8) { this.addChildDateOfBirth(dateOfBirth); }
            if (travellerType == 'infants') { this.addInfantDateOfBirth(infantDOB); }
        }
        if (operation === 'minus' && travellerType == 'adults' && result < 1) {
            return false;
        }

        this.patchChildDateOfBirth(dateOfBirth);
        this.patchInfantDateOfBirth(infantDOB);
        this.travellerCountError = false;
        control.setValue(result);
        this.regConfig.patchValue({
            traveller: this.travellerForm.value
        });

    }

    patchChildDateOfBirth(dateOfBirth) {
        const regTraveller = this.regConfig.controls['traveller'] as FormArray;
        let childDateOfBirth = regTraveller.controls['childDateOfBirth'] as FormArray;
        childDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            childDateOfBirth.push(this.setChildDateOfBirth());
        }
    }

    patchRegChildDateOfBirth(dateOfBirth) {
        const childDateOfBirth = this.travellerForm.controls['childDateOfBirth'] as FormArray;
        childDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            childDateOfBirth.push(this.setChildDateOfBirth());
        }
    }

    patchInfantDateOfBirth(dateOfBirth) {
        const regTraveller = this.regConfig.controls['traveller'] as FormArray;
        let infantDateOfBirth = regTraveller.controls['infantDateOfBirth'] as FormArray;
        infantDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            infantDateOfBirth.push(this.setInfantDateOfBirth());
        }
    }

    patchRegInfantDateOfBirth(dateOfBirth) {
        const infantDateOfBirth = this.travellerForm.controls['infantDateOfBirth'] as FormArray;
        infantDateOfBirth.clear();
        for (let i = 0; i < dateOfBirth.length; i++) {
            infantDateOfBirth.push(this.setInfantDateOfBirth());
        }
    }

    addChildDateOfBirth(childDateOfBirth) {
        childDateOfBirth.push(this.setChildDateOfBirth());
    }

    addInfantDateOfBirth(infantDateOfBirth) {
        infantDateOfBirth.push(this.setInfantDateOfBirth());
    }

    setChildDateOfBirth() {
        return this.fb.group({
            childDateOfBirth: new Date(formatDate(new Date(this.maxDateChild), 'DD/MM/YYYY'))
        });
    }

    setInfantDateOfBirth() {
        return this.fb.group({
            infantDateOfBirth: new Date(formatDate(new Date(this.maxDateInfant), 'DD/MM/YYYY'))
        });
    }

    removechildDateOfBirth(childDateOfBirth) {
        let length = childDateOfBirth.controls.length - 1;
        childDateOfBirth.removeAt(length);
    }

    removeInfantDateOfBirth(infantDateOfBirth) {
        let length = infantDateOfBirth.controls.length - 1;
        infantDateOfBirth.removeAt(length);
    }

    onChangeCabin(v: any) {
        this.regConfig.patchValue({
            CabinClass: v
        });
        this.fadeinn = false;
    }

    setSelectedDate(event, index) {
        const childAges = this.regConfig.get('traveller.childDateOfBirth') as FormArray;
        childAges.at(index).patchValue({ childDateOfBirth: new Date(formatDate(new Date(event), 'DD/MM/YYYY')) });
    }

    setInfantSelectedDate(event, index) {
        const infantAges = this.regConfig.get('traveller.infantDateOfBirth') as FormArray;
        infantAges.at(index).patchValue({ infantDateOfBirth: new Date(formatDate(new Date(event), 'DD/MM/YYYY')) });
    }

    onChangeConnectivity(v: any) {
        this.regConfig.patchValue({
            connectivity: v
        });
        this.Connectivity = false;
    }
    onChangeAirline(i: any) {
        this.regConfig.patchValue({
            PreferredAirline: this.airlines[i]['code']
        });
        this.airline = false;
        this.airlineName = this.airlines[i]['name'];
    }

    selectionChanged(airLine: any) {
        this.regConfig.patchValue({
            PreferredAirlineCode: airLine.value.code,
            PreferredAirline: airLine.value.name
        });
        this.airline = false;
        this.airlineName = airLine.value.name;
        this.airlineCode = airLine.value.code;
    }

    changeFn(val) {
    }

    onDepart(event) {
        (this.loggedInUser && this.loggedInUser.auth_role_id == 2) ? this.validateNoOfDays(event) : null;
        if (event && this.selectedIndex == 0) {
            setTimeout(() => {
                this.returnDate.nativeElement.click();
                this.setMinDate = event
            }, 100)
        } else if (event && this.selectedIndex == 1) {
            setTimeout(() => {
                this.isreturnDate = false;
                this.isOpen = false;
            }, 100)
            //this.travellersFadeinn = true;
        }
    }

    closeTravellers() {
        this.travellersFadeinn = false;
    }
    closeConnectivity() {
        this.Connectivity = false;
    }
    closeClass() {
        this.fadeinn = false;
    }
    closeAirline() {
        this.airline = false;
        this.searchedAirLineList.length = 0;
    }
    onReturn(event) {
        if (event && this.selectedIndex == 0) {
            setTimeout(() => {
                this.travellersFadeinn = true;
            }, 100)
        }
    }

    getCity(event: any): void {
        let city = `${event.AirportCity}, ${event.CountryName}, ${event.AirportName}(${event.AirportCode})`;
        if (city) {
            if (event.inputFor === 'depart') {
                this.flightService.originCountry = event;
                this.regConfig.patchValue({ departAirport: event.AirportName });
                this.regConfig.patchValue({ departureCity: event.AirportCity + '-' + event.AirportCode });
                this.destinationCity.nativeElement.focus();
            } else {
                this.flightService.destCountry = event;
                this.regConfig.patchValue({ destinationAirport: event.AirportName });
                // this.regConfig.patchValue({ destinationCity: city });
                this.regConfig.patchValue({ destinationCity: event.AirportCity + '-' + event.AirportCode });
                this.departureDate.nativeElement.click();
            }
            (this.loggedInUser && this.loggedInUser.auth_role_id == 2) ? this.checkSectorPolicy() : null;
            this.searchedList.length = 0;
        }
    }

    getPreferredAirLineList(event: any): void {
        let city = `${event.name}, (${event.code})`;
        if (city) {
            this.flightService.destCountry = event;
            // this.regConfig.patchValue({ destinationCity: city });
            this.regConfig.patchValue({
                PreferredAirline: event.name,
                PreferredAirlineCode: event.code
            });
            this.prefferedAirline.nativeElement.click();
            this.searchedAirLineList.length = 0;
        }
    }

    get shouldiHide(): boolean {
        try {
            return !!this.searchedList.length ? true : false;
        } catch (error) {
        }
    }

    get shouldPreferedAirLineHide(): boolean {
        try {
            return !!this.searchedAirLineList.length ? true : false;
        } catch (error) {
        }
    }

    get f() {
        return this.regConfig.controls;
    }

    shouldiHideDynamic(index): boolean {
        if (index === 1)
            return true;
        else
            return false;
    }

    shouldRemoveCity(index): boolean {
        if (index === 0 || index === 1)
            return false;
        else
            return true;
    }

    setCurrentInput(t) {
        this.dropDownCity = t;
    }

    isCurrentInput(t) {
        return this.dropDownCity == t;
    }

    exchangeCityFn() {
        this.cityExchanged = !this.cityExchanged;
        const destinationCity = JSON.parse(JSON.stringify(this.regConfig.controls.destinationCity.value));
        const departureCity = JSON.parse(JSON.stringify(this.regConfig.controls.departureCity.value));
        this.regConfig.patchValue({ departureCity: destinationCity });
        this.regConfig.patchValue({ destinationCity: departureCity });
    }

    getDynamicCity(event: any): void {
        let city = `${event.AirportCity}(${event.AirportCode})`;
        if (city) {
            const mDesCtArr = this.mDestinationCity.toArray();
            const mDepDtArr = this.mDepartureDate.toArray();
            const inputFor = event.inputFor.split('_');
            if (inputFor[0] == 'mDepartureCity') {
                mDesCtArr[inputFor[1]].nativeElement.focus();
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDepartureCity: event.AirportCity + '-' + event.AirportCode });
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDeparture: event.AirportCity });
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDepartureAirport: event.AirportName });
            } else {
                mDepDtArr[inputFor[1]].nativeElement.click();
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDestinationCity: event.AirportCity + '-' + event.AirportCode });
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDestination: event.AirportCity });
                this.regConfig.controls['cities']['controls'][inputFor[1]].patchValue({ mDestinationAirport: event.AirportName });
                if (mDepDtArr[+inputFor[1] + 1]) {
                    this.regConfig.controls['cities']['controls'][+inputFor[1] + 1].patchValue({ mDepartureCity: event.AirportCity + '-' + event.AirportCode });
                    this.regConfig.controls['cities']['controls'][+inputFor[1] + 1].patchValue({ mDeparture: event.AirportCity });
                    this.regConfig.controls['cities']['controls'][+inputFor[1] + 1].patchValue({ mDepartureAirport: event.AirportName });
                }
            }
            (this.loggedInUser && this.loggedInUser.auth_role_id == 2) ? this.checkSectorPolicy() : null;
            this.searchedList.length = 0;
        }
    }

    addCity(): void {
        const cities = this.regConfig.get('cities') as FormArray;
        if (cities.length < 5) {
            cities.push(this.generateCities(''));
        }
    }

    removeCity(i: number): void {
        const cities = this.regConfig.get('cities') as FormArray;
        if (cities.length > 1) {
            cities.removeAt(i);
        }
    }

    mUpdateNextDepDt(i: number) {
        (this.loggedInUser && this.loggedInUser.auth_role_id == 2) ? this.validateNoOfDays(this.regConfig.controls['cities']['controls'][i]['controls']['mDepartureDate'].value) : null;
        if (this.minDateArr[i + 1]) {
            this.minDateArr[i + 1] = new Date(this.regConfig.controls['cities']['controls'][i]['controls']['mDepartureDate'].value);
        }
        const mDepCtArr = this.mDestinationCity.toArray();
        // this.returnDate.nativeElement.click();
        if (mDepCtArr[i + 1]) {
            mDepCtArr[i + 1].nativeElement.focus();
        }
    }

    onSubmit(): void {
        if (this.regConfig.invalid) {
            return;
        }
        localStorage.setItem('sectorReason', this.sectorReason);
        localStorage.setItem('deparureDateReason', this.deparureDateReason)
        this.setDeparturePolicy();
        this.setSectorPolicy();
        const selectedPurpose = localStorage.getItem('selectedPurpose');
        if (selectedPurpose === 'HR Training') {
            const id = localStorage.getItem('selectedTrainingId');
            if (!id) {
                this.flightService.proceedBooking.next(false);
                return;
            }
        }
        // if (this.loggedInUser.auth_role_id == 2) {
        //     const selectedTripId = localStorage.getItem('selectedTripId');
        //     if (!selectedTripId) {
        //         window.scrollTo({ top: 0, behavior: 'smooth' });
        //         this.flightService.enableBooking.next(false);
        //         return;
        //     }
        // }
        this.flightService.proceedBooking.next(true);
        this.flightService.enableBooking.next(true);
        if (this.regConfig.value.PreferredAirlineCode === "ALL") {
            this.regConfig.controls.PreferredAirlineCode.setValue('')
        }
        this.globals.toggleSidebar = true;
        this.submitSessionFlightSearchKeyCheck = true;
        this.flightService.formFilled = {}
        this.flightService.tripTypeClicked = false;
        if (this.selectedIndex == 0) {
            this.regConfig.controls.tripType.setValue('Roundtrip')
        }
        else if (this.selectedIndex == 1) {
            this.regConfig.controls.tripType.setValue('Oneway')
        } else if (this.selectedIndex == 2) {
            this.regConfig.controls.tripType.setValue('Multi-city');
        }
        this.flightService.formFilled = this.regConfig.value;

        localStorage.setItem('flightSearchData', JSON.stringify(this.regConfig.value));
        localStorage.setItem('submitSessionFlightSearchKeyCheck', 'true');
        setTimeout(() => {
            this.isreturnDate = false;
            this.isOpen = false;
            this.travellersFadeinn = false;
        }, 100)
        if (this.router.url == "/dashboard/search-form") {
            this.flightService.flightsCopy.next([]);//Added to clear the previously selected data
            this.flightService.flights.next([]); //Added to clear the previously selected data
            this.router.navigate(
                [
                    "search/flight/result",
                ] /*, { queryParams: { ...this.regConfig.value } }*/
            );
        } else {
            this.flightService.isCollapsed.next(true);
            const pattern = /\(([^)]+)\)/;
            let Segments = [];
            let JourneyType = "OneWay";
            if (this.selectedIndex == 2) {
                JourneyType = "multicity";
                this.regConfig.controls.cities.value.forEach((e) => {
                    const Origin = e.mDepartureCity;
                    const OriginAirport = e.mDeparture;
                    const Destination = e.mDestinationCity;
                    const DestinationAirport = e.mDestination;

                    const DepartureDate = formatDate(e.mDepartureDate, "");
                    Segments.push({
                        Origin: Origin,
                        OriginAirport: OriginAirport,
                        Destination:
                            Destination,
                        DestinationAirport: DestinationAirport,
                        DepartureDate: DepartureDate + "T00:00:00",
                        // CabinClassReturn: this.regConfig.controls.CabinClass.value,
                        // CabinClassOnward: this.regConfig.controls.CabinClass.value
                        CabinClass: this.regConfig.controls.CabinClass.value
                    });
                });
            } else {
                // const Destination = this.regConfig.controls.destinationCity.value.match(pattern)
                const Origin = this.regConfig.value.departureCity
                const Destination = this.regConfig.value.destinationCity
                Segments.push({
                    Origin: Origin,
                    Destination: Destination,
                    CabinClassReturn: this.regConfig.controls.CabinClass.value,
                    CabinClassOnward: this.regConfig.controls.CabinClass.value,
                    CabinClass: this.regConfig.controls.CabinClass.value
                });
                if (this.selectedIndex == 1) {
                    const dt = this.regConfig.controls.departureDate.value;
                    const DepartureDate = formatDate(dt, "");
                    Segments[0]["DepartureDate"] = DepartureDate + "T00:00:00";
                    Segments[0]["CabinClass"] = this.regConfig.controls.CabinClass.value;//added for one way
                } else {
                    JourneyType = "Return";
                    const dt = this.regConfig.controls.departureDate.value;
                    const rd = this.regConfig.controls.returnDate.value
                    const DepartureDate = formatDate(dt, "");
                    const ReturnDate = formatDate(rd, "");
                    Segments[0]["DepartureDate"] = DepartureDate + "T00:00:00";
                    Segments[0]["ReturnDate"] = ReturnDate + "T00:00:00";
                }
            }
            const formData = {
                AdultCount: JSON.stringify(this.regConfig.get('traveller.adults').value ? this.regConfig.get('traveller.adults').value : 1),
                ChildCount: JSON.stringify(this.regConfig.get('traveller.childrens').value ? this.regConfig.get('traveller.childrens').value : 0),
                InfantCount: JSON.stringify(this.regConfig.get('traveller.infants').value ? this.regConfig.get('traveller.infants').value : 0),
                PreferredAirlines: (this.regConfig.get('PreferredAirline').value && this.regConfig.get('PreferredAirline').value != 'all') && this.regConfig.get('PreferredAirlineCode').value ? [this.regConfig.get('PreferredAirlineCode').value] : [],
                PreferredAirlineName: this.regConfig.get('PreferredAirline').value ? this.regConfig.get('PreferredAirline').value : 'All',
                NonStopFlights: this.regConfig.get('connectivity').value == 'Direct Flights' ? 1 : 0,
                JourneyType,
                Segments,
                childDOB: this.regConfig.get('traveller.childDateOfBirth').value,
                infantDOB: this.regConfig.get('traveller.infantDateOfBirth').value
            };
            this.submitForm(formData);
        }
    }

    getControl(): FormArray {
        return this.travellerForm.controls['childDateOfBirth'] as FormArray
    }

    getInfantControl(): FormArray {
        return this.travellerForm.controls['infantDateOfBirth'] as FormArray
    }

    setMaxMinDate() {
        this.maxDateChild = this.addYearsToDate(-2, 0);
        this.minDateChild = this.addYearsToDate(-12, 0);
        this.maxDateInfant = new Date();
        this.minDateInfant = this.addYearsToDate(-2, 0);
    }


    addYearsToDate(y: number, m: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month + m, day);
        return c;
    }

    resetTraveller() {
        this.createTravellerForm();
        this.regConfig.patchValue({
            traveller: this.travellerForm.value
        });
        let data = JSON.parse(localStorage.getItem('flightSearchData'));
        if (data) {
            data.traveller = this.travellerForm.value;
            localStorage.setItem('flightSearchData', JSON.stringify(data));
        }
        if (this.flightService.traveller) {
            this.flightService.traveller = this.travellerForm.value;
        }
        if (this.flightService.formFilled && this.flightService.formFilled.traveller) {
            this.flightService.formFilled.traveller = this.travellerForm.value;
        }
    }

    checkSectorPolicy() {
        const policyList = JSON.parse(localStorage.getItem('policyList'));
        if (policyList && policyList.length > 0) {
            this.is_flight_is_short_sector = policyList[0].flight_is_short_sector;
            if (policyList.length > 0 && policyList[0].flight_is_short_sector) {
                this.flight_short_sector = JSON.parse(policyList[0].flight_short_sector);
                const tripType = this.regConfig.get('tripType').value;
                if (policyList[0].flight_display_asking_for_a_reason) {
                    if (tripType === 'Multi-city') {
                        const searchSectors = this.regConfig.get('cities').value;
                        for (let segment of searchSectors) {
                            segment.mDepartureCity.includes('-') ? segment.mDepartureCity = segment.mDepartureCity.split('-')[1] : segment.mDepartureCity;
                            segment.mDestinationCity.includes('-') ? segment.mDestinationCity = segment.mDestinationCity.split('-')[1] : segment.mDestinationCity;
                        }
                        this.mappedData = searchSectors.map(({ mDepartureCity: fromAirport, mDestinationCity: toAirport }) => ({ fromAirport, toAirport }));
                        this.showSectorPolicy = this.checkSectorMatch(this.mappedData, this.flight_short_sector);
                    } else {
                        let departureCity = this.regConfig.get('departureCity').value;
                        let destinationCity = this.regConfig.get('destinationCity').value;
                        departureCity.includes('-') ? departureCity = departureCity.split('-')[1] : departureCity;
                        destinationCity.includes('-') ? destinationCity = destinationCity.split('-')[1] : destinationCity;
                        this.mappedData = [{ fromAirport: departureCity, toAirport: destinationCity }];
                        this.showSectorPolicy = this.checkSectorMatch(this.mappedData, this.flight_short_sector);
                    }
                }
                else {
                    let policyEnabled = false;
                    if (tripType === 'Multi-city') {
                        const searchSectors = this.regConfig.get('cities').value;
                        for (let segment of searchSectors) {
                            segment.mDepartureCity.includes('-') ? segment.mDepartureCity = segment.mDepartureCity.split('-')[1] : segment.mDepartureCity;
                            segment.mDestinationCity.includes('-') ? segment.mDestinationCity = segment.mDestinationCity.split('-')[1] : segment.mDestinationCity;
                        }
                        this.mappedData = searchSectors.map(({ mDepartureCity: fromAirport, mDestinationCity: toAirport }) => ({ fromAirport, toAirport }));
                        policyEnabled = this.checkSectorMatch(this.mappedData, this.flight_short_sector);
                    } else {
                        let departureCity = this.regConfig.get('departureCity').value;
                        let destinationCity = this.regConfig.get('destinationCity').value;
                        departureCity.includes('-') ? departureCity = departureCity.split('-')[1] : departureCity;
                        destinationCity.includes('-') ? destinationCity = destinationCity.split('-')[1] : destinationCity;
                        this.mappedData = [{ fromAirport: departureCity, toAirport: destinationCity }];
                        policyEnabled = this.checkSectorMatch(this.mappedData, this.flight_short_sector);
                    }
                    if (policyEnabled) {
                        let daymsg = `According to the policy, selected sector is not authorized to book !!`;
                        this.swalService.alert.warning(daymsg);
                        this.showSectorPolicy = false;
                        this.sectorReason = '';
                        this.noSectorPolicyEnabled = true;
                    }

                }

            } else {
                this.showSectorPolicy = false;
                this.sectorReason = '';
                this.noSectorPolicyEnabled = false;
            }
        }
    }

    checkSectorMatch(searchSectors, sector) {
        const fromAirports = sector.map(sector => sector.fromAirport);
        const toAirports = sector.map(sector => sector.toAirport);
        let foundMatchingSector = false;
        for (const searchSector of searchSectors) {
            if ((searchSector.fromAirport == '' || searchSector.toAirport == '')) {
                foundMatchingSector = true;
                break; // 
            }
            if (fromAirports.includes(searchSector.fromAirport) && toAirports.includes(searchSector.toAirport)) {
                // If either the fromAirport or toAirport is not included in their respective arrays
                foundMatchingSector = false;
            } else {
                // Both fromAirport and toAirport are included in their respective arrays
                foundMatchingSector = true;
                break; // Exit the loop since we found a matching sector
            }
        }
        if (!foundMatchingSector) {
            this.noSectorPolicyEnabled = false;
            return true;
        }
        this.noSectorPolicyEnabled = false;
        this.sectorReason = '';
        return false;
    }

    setDeparturePolicy() {
        let bookingType=localStorage.getItem('bookingType');
        if (this.loggedInUser && this.loggedInUser.auth_role_id == 2 && bookingType!='Self' && this.isflightDayToDeparture) {
            let eligibilityCheck = this.showRemark ? "Beyond Days To Departure Eligibility" : "Within Days To Departure Eligibility";
            const daysToDeparturePolicy = {
                PolicyType: 'DaysToDeparture',
                Eligible: +this.flight_departure_noOfDays,
                Selected: +this.differenceInDays,
                EligibilityCheck: eligibilityCheck,
                Remark: this.deparureDateReason // fixed from this.starRatingReason to this.priceReason
            };
            localStorage.setItem('daysToDeparturePolicy', JSON.stringify(daysToDeparturePolicy));
        }
        else {
            localStorage.removeItem('daysToDeparturePolicy');
        }
    }

    setSectorPolicy() {
        let eligibleSector = this.processFlightSectors(this.flight_short_sector);
        let mappedSectorList = this.processFlightSectors(this.mappedData);
        let bookingType=localStorage.getItem('bookingType');
        if (this.loggedInUser && this.loggedInUser.auth_role_id == 2 && bookingType!='Self' && this.is_flight_is_short_sector) {
            let eligibilityCheck = this.showSectorPolicy ? "Beyond Sector Eligibility" : "Within Sector Eligibility";
            const sectorPolicy = {
                PolicyType: 'Sector',
                Eligible: eligibleSector,
                Selected: mappedSectorList,
                EligibilityCheck: eligibilityCheck,
                Remark: this.sectorReason // fixed from this.starRatingReason to this.priceReason
            };
            localStorage.setItem('sectorPolicy', JSON.stringify(sectorPolicy));
        }
        else {
            localStorage.removeItem('sectorPolicy');
        }
    }

    processFlightSectors(flightSectors: any[]) {
        let sectorList = [];
        if (flightSectors) {
            for (let value of flightSectors) {
                let concatenatedValues = this.concatenateValues(value.fromAirport, value.toAirport);
                sectorList.push(concatenatedValues);
            }
        }
        return sectorList.join(',');
    }


    concatenateValues(from: string, to: string): string {
        return `${from}-${to}`;
    }

    setPolicyValues() {
        this.sectorReason = localStorage.getItem('sectorReason') || '';
        this.deparureDateReason = localStorage.getItem('deparureDateReason') || '';
        this.showRemark = this.deparureDateReason !== '';
        this.showSectorPolicy = this.sectorReason !== '';
    }


}
