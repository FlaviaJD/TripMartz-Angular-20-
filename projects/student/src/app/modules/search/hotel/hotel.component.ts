import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { browserRefresh } from '../../../../app/app.component';
import { ApiHandlerService } from '../../../core/api-handlers';
import { shareReplay } from 'rxjs/operators';
import { untilDestroyed } from '../../../core/services';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { ThemeOptions } from '../../../theme-options';
import { HotelService } from './hotel.service';
import { PlatformLocation } from '@angular/common';
import { UtilityService } from '../../../core/services/utility.service';
import { AppService } from '../../../app.service';


@Component({
    selector: 'app-hotel',
    templateUrl: './hotel.component.html',
    styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit, OnDestroy {

    @ViewChild('destination_name', { static: false }) destination_name: ElementRef<HTMLElement>;
    @ViewChild('checkinDate', { static: false }) checkinDate: ElementRef<HTMLElement>;
    @ViewChild('checkoutDate', { static: false }) checkoutDate: ElementRef<HTMLElement>;
    @ViewChild('noOfNights', { static: false }) noOfNights: ElementRef<HTMLElement>;
    @ViewChild('check_in_time', { static: false }) check_in_time: ElementRef<HTMLElement>;
    @ViewChild('check_out_time', { static: false }) check_out_time: ElementRef<HTMLElement>;

    minDate = new Date();
    setMinDate= new Date();
    setMaxDate=new Date();
    protected subs = new SubSink();
    searchedList: Array<any> = Array();
    public browserRefresh: boolean;
    regConfig: FormGroup;
    isOpen = false as boolean;
    depart = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    tabSubscription: any;
    roomError = false;
    travellersFadeinn = false;
    travellerCountError = false;
    submitSessionHotelSearchKeyCheck;
    @Output() callResult = new EventEmitter<any>();
    city: any;
    booking_source: any;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    noOfRooms: any = 1;
    noOfAdults: any = 1;
    noOfChild: any = 0;
    loading: boolean;
    currentUser: any;
    hotels: Array<any> = [];
    countries: any = [];
    loggedInUser;
    enableTraveller:boolean=false;
    enableIncrement:boolean=false;
    isCorporateSelected:boolean=false;
    nights: number[];
    times: string[] = [
        '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
        '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
        '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
        '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
        '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
        '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
    ];

    constructor(
        private fb: FormBuilder,
        public location: PlatformLocation,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private hotelService: HotelService,
        public globals: ThemeOptions,
        private utility: UtilityService,
        private appService:AppService,
        private cdr:ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.createSearchForm();
        this.generateNightsList();
        this.maxDate(this.setMaxDate);
        this.loggedInUser = JSON.parse(localStorage.getItem('studentCurrentUser'));
        this.appService.isCorporateSelected.subscribe(data => {
            this.loggedInUser.auth_role_id == 3 ? this.isCorporateSelected = data : this.isCorporateSelected = true;
        });
        this.hotelService.bookingType.subscribe(data => {
            if (data == 'Self' && this.loggedInUser.auth_role_id == 2) {
                this.enableTraveller = false;
                this.enableIncrement = false;
                this.resetTraveller();
            } else if (data == 'Behalf' && this.loggedInUser.auth_role_id == 2) {
                this.enableTraveller = false;
                this.enableIncrement = true;
                this.resetTraveller();
            }
            else{
                this.enableIncrement=true;
                this.enableTraveller=true;
            }
        });
        this.hotelService.countryList.subscribe(res => {
            this.countries = res;
            this.cdr.detectChanges();
        });

        this.currentUser = this.utility.readStorage('studentCurrentUser', localStorage)['user_id'];
        let data1 = localStorage.getItem('hotelSearchData');
        data1 = JSON.parse(data1) || {};
        if(data1){
            this.setRoomUI(data1);
            this.setChildUI(data1);
        }
        this.browserRefresh = browserRefresh;
        if (this.hotelService.formFilled || this.browserRefresh) {
            let data = localStorage.getItem('hotelSearchData');
            data = JSON.parse(data);
            if(data){
                this.regConfig.patchValue({
                    destination_name: data['destination_name'],
                    destination_id: data['destination_id'],
                    destination_source: data1['destination_source'],
                    check_in_date: new Date(data['check_in_date']),
                    check_out_date: new Date(data['check_out_date']),
                    check_in_time: data['check_in_time'],
                    check_out_time: data['check_out_time'],
                    traveller: data['traveller'],
                    market:data['market'],
                    GuestNationality:data['GuestNationality'],
                    noOfNights:data['noOfNights']
                });
                this.maxDate(data['check_in_date']);
                this.enableControl();
            }
        }
        if (this.browserRefresh == false && data1.hasOwnProperty('destination_name')) {
            this.regConfig.patchValue({
                destination_name: data1['destination_name'],
                destination_id: data1['destination_id'],
                destination_source: data1['destination_source'],
                check_in_date: new Date(data1['check_in_date']),
                check_out_date: new Date(data1['check_out_date']),
                check_in_time: data1['check_in_time'],
                check_out_time: data1['check_out_time'],
                traveller: data1['traveller'],
                market:data1['market'],
                GuestNationality:data1['GuestNationality'],
                noOfNights:data1['noOfNights']
            });
            this.maxDate(data1['check_in_date']);
            this.enableControl();
        }
        this.location.onPopState(() => {
            this.regConfig.patchValue({
                destination_name: data1['destination_name'],
                destination_id: data1['destination_id'],
                destination_source: data1['destination_source'],
                check_in_date: new Date(data1['check_in_date']),
                check_out_date: new Date(data1['check_out_date']),
                check_in_time: data1['check_in_time'],
                check_out_time: data1['check_out_time'],
                traveller: data1['traveller'],
                market:data1['market'],
                GuestNationality:data1['GuestNationality'],
                noOfNights:data1['noOfNights']
            });
            this.maxDate(data1['check_in_date']);
            this.enableControl();
        });
        this.setAdultChildCount(this.regConfig.value['traveller']);
        this.hotelService.hotels.subscribe(h => {
            this.hotels = h;
        });
    }
    getMinDate(inDate) {
        const d = new Date(inDate);
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year, month, day + 1);
        return c;

    }
    get shouldiHide(): boolean {
        try {
            return !!this.searchedList.length ? true : false;
        } catch (error) {
        }
    }

    generateNightsList(): void {
        this.nights = Array.from({ length: 30 }, (_, i) => i + 1);
      }

    createSearchForm() {
        this.regConfig = this.fb.group({
            destination_name: ['', [Validators.required]],
            destination_id: [''],
            destination_source: [''],
            check_in_date: ['', [Validators.required]],
            check_in_time: ['00', [Validators.required]],
            check_out_date: ['', [Validators.required]],
            check_out_time: ['00', [Validators.required]],
            traveller: this.fb.array([this.createTravellerForm()]),
            market: ['IN',[Validators.required]],
            GuestNationality: ['IN',[Validators.required]],
            noOfNights:['', [Validators.required]]
        });
        this.regConfig.get('noOfNights').disable();
    }

    createTravellerForm() {
        return this.fb.group({
            adults: 1,
            childrens: 0,
            childAges:this.fb.array([])
        });
    }

    travellers(controlName: string): FormArray {
        return this.regConfig.get(controlName) as FormArray;
    }

    addRoom() {
        if (this.regConfig.value['traveller'].length < 10) {
            this.noOfRooms++;
            this.noOfAdults++;
            this.travellers('traveller').push(this.createTravellerForm())
        }
    }

    removeRoom(i) {
        if (this.regConfig.value['traveller'].length > 0) {
            this.noOfRooms--;
            this.noOfAdults -= this.regConfig.value['traveller'][i]['adults'];
            this.noOfChild -= this.regConfig.value['traveller'][i]['childrens'];
            this.travellers('traveller').removeAt(i);
        }
    }

    onUpdateTraveller(i: any, travellerType: string, operation: string) {
        let traveller = this.travellers('traveller');
        let item = traveller.at(i);
        const adults = item.value['adults'];
        const childrens = item.value['childrens'];
        const control = traveller.controls[i]['controls'][travellerType];
        const childAge = item['controls']['childAges'] as FormArray;
        let result = 0;
        if (operation === 'minus') {
            result = control.value < 1 ? control.value : control.value - 1;
            if (travellerType == 'adults' && adults > 1) {
                this.noOfAdults -= 1;
            } else if (travellerType == 'childrens' && this.noOfChild >= 0) {
                if(childAge.controls && childAge.controls.length>0){
                    let length=childAge.controls.length-1;
                    this.noOfChild -= 1;
                    childAge.removeAt(length);
                }
            }
        } else {
            result = control.value + 1;
        }
        let adultCount = 0, childCount = 0;
        if (travellerType == 'adults') {
            adultCount = adults;
            if (operation == 'plus' && adultCount <= 2) {
                this.noOfAdults += 1;
            }
        }
        if (travellerType == 'childrens') {
            childCount = childrens;
            if (operation == 'plus' && childCount <= 1) {
                this.noOfChild += 1;
                childAge.push(this.setChildAgeArray())
            }
        }
        if (operation === 'minus' && travellerType == 'adults' && result < 1) {
            return false;
        }
        if (adultCount > 2 && operation === 'plus') {
            this.travellerCountError = true;
            this.roomError = false;
            return false;
        }
        if (childCount > 1 && operation === 'plus') {
            this.travellerCountError = true;
            this.roomError = false;
            return false;
        }
        this.travellerCountError = false;
        control.setValue(result);
        this.regConfig.patchValue({
            traveller: [control]
        });
    }

    onSubmitTraveller() {
        this.travellersFadeinn = false;
    }

    resetTraveller(){
        this.noOfRooms=1;
        this.noOfAdults=1;
        this.noOfChild=0;
        (this.regConfig.controls['traveller'] as FormArray).clear();
        let regConfigTraveller=this.regConfig.controls['traveller'] as FormArray;
        regConfigTraveller.push(this.createTravellerForm());
        (this.travellers('traveller') as FormArray).clear();
        let traveller=this.travellers('traveller') as FormArray;
        traveller.push(this.createTravellerForm()); 
        let data:any = localStorage.getItem('hotelSearchData');
        data = JSON.parse(data);
        if(data){
            data.traveller=traveller.value;
            localStorage.setItem('hotelSearchData', JSON.stringify(data));
        }
       }
   
    closeTravellers() {
        this.travellersFadeinn = false;
    }

    getSearchedList(event: any): void {
        if (event.target.id === 'destination_name') {
            this.depart = true;
        } else if (event.target.id === 'destination_name') {
            this.depart = false;
        }
        if (event && event.target.value) {
            const city_name = `${event.target.value}`;
            let booking_source: string;
            if (this.loggedInUser.auth_role_id === 3) {
                let selectedCorporate: any = JSON.parse(localStorage.getItem('selectedCorporate'));
                let hotel_api= JSON.parse(selectedCorporate.hotel_pricing);
                booking_source=hotel_api[0];
            } else {
                const hotelApi = JSON.parse(this.loggedInUser.corporate_details.hotel_pricing);
                booking_source = hotelApi[0];
            }
            this.apiHandlerService.apiHandler('autoCompleteCrs', 'POST', '', '', { city_name,booking_source })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.searchedList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.searchedList.length = 0;
                    }
                });
        }
    }

    getCity(event: any): void {
        this.city = `${event.cityId}`;
        this.booking_source = `${event.booking_source}`;
        let cityName = `${event.cityName} (${event.countryCode})`;
        localStorage.setItem('hotelCountryCode',event.countryCode);
        if (cityName) {
            this.regConfig.patchValue({ destination_name: cityName });
            this.checkinDate.nativeElement.click();
            this.searchedList.length = 0;
        }
    }

    submitForm(data: any) {
        this.hotelService.hotelsCopy.next([]);
        this.hotelService.hotels.next([]);
        this.callResult.emit(data);
    }

    onSubmit(): void {
        const selectedPurpose = localStorage.getItem('selectedPurpose');
        if (selectedPurpose === 'HR Training') {
            const id = localStorage.getItem('selectedTrainingId');
            if (!id) {
                this.hotelService.proceedBooking.next(false);
                return;
            }
        }
        // if (this.loggedInUser.auth_role_id == 2) {
        //     const selectedTripId = localStorage.getItem('selectedTripId');
        //     if (!selectedTripId) {
        //         window.scrollTo({ top: 0, behavior: 'smooth' });
        //         this.hotelService.enableBooking.next(false);
        //         return;
        //     }
        // }
        this.hotelService.proceedBooking.next(true);
        this.hotelService.loading.next(true);
        this.globals.toggleSidebar = true;
        this.submitSessionHotelSearchKeyCheck = true;
        this.hotelService.formFilled = {};
        if (this.city) {
            this.regConfig.patchValue({
                destination_id: this.city
            });
            if (!this.regConfig.value['booking_source'])
                this.regConfig.value['destination_source'] = this.booking_source;
        }
        this.hotelService.formFilled = this.regConfig.value;
        localStorage.removeItem('hotelSearchData');
        localStorage.setItem('hotelSearchData', JSON.stringify(this.regConfig.value));
        localStorage.setItem('submitSessionHotelSearchKeyCheck', 'true');
        setTimeout(() => {
            this.isOpen = false;
            this.travellersFadeinn = false;
        }, 100);

        if (this.router.url == '/search/flight/result') {
            this.hotelService.formFilled = this.regConfig.value;
            this.prepareSearchPayloadFromSessionData('hotelSearchData');
            this.router.navigate(
                [
                    "search/hotel/result",
                ]
            );
        }

        if (this.router.url == "/dashboard/search-form") {
            this.router.navigate(
                [
                    "search/hotel/result",
                ]
            );
        } else {
            this.hotelService.isCollapsed.next(true);
            let RoomGuests = [];
            this.regConfig.controls.traveller.value.forEach(element => {
                RoomGuests.push({
                    "NoOfAdults": Number(element['adults']),
                    "NoOfChild": Number(element['childrens']),
                    "ChildAge": element['childAges']
                })
            });
            const formData = {
                UserId: this.currentUser,
                UserType: "B2B",
                CheckIn: this.regConfig.controls.check_in_date.value,
                CheckOut: this.regConfig.controls.check_out_date.value,
                Currency: "INR",
                Market: this.regConfig.controls.market.value,
                GuestNationality:this.regConfig.controls.GuestNationality.value,
                CancellationPolicy: true,
                CheckInTime:this.regConfig.controls.check_in_time.value,
                CheckOutTime:this.regConfig.controls.check_out_time.value,
                CityIds: [this.regConfig.controls.destination_id.value],
                NoOfRooms: this.regConfig.controls.traveller.value.length,
                NoOfNights:this.regConfig.controls.noOfNights.value,
                RoomGuests: RoomGuests,
                booking_source: this.regConfig.controls.destination_source.value,
            };
            this.submitForm(formData);
        }

    }

    prepareSearchPayloadFromSessionData(sessionKey: string): any {
        const ssd = JSON.parse(localStorage.getItem(sessionKey));
        let RoomGuests = [];
        ssd['traveller'].forEach(element => {
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
            "Market": `${ssd['market']}`,
            "CheckInTime":`${ssd['check_in_time']}`,
            "CheckOutTime":`${ssd['check_out_time']}`,
            "CancellationPolicy": true,
            "CityIds": [
                `${ssd['destination_id']}`
            ],
            "GuestNationality":`${ssd['GuestNationality']}`,
            "NoOfNights": `${ssd['noOfNights']}`,
            NoOfRooms: Number(ssd['traveller'].length),
            RoomGuests,
            booking_source: `${ssd['destination_source']}`
        }
        this.hotelService.searchResult(reqBody);
    }

    setMarket(value) {
        this.regConfig.patchValue({
            market: value,
        });
    }

    onCheckIn(event) {
        if (event) {
            const eventDate = new Date(event);
            eventDate.setDate(eventDate.getDate() + 1);
            this.regConfig.patchValue({
                check_out_date: eventDate
            });
            this.setMinDate = eventDate;
            this.maxDate(event);
        }
    }

    maxDate(event) {
        const date = new Date(event);
        date.setDate(date.getDate() + 30);
        this.setMaxDate = date;
        this.cdr.detectChanges();
    }

    onCheckOut(event) {
        if (event) {
            this.setNoOfNights();
        }
    }

    getAge(empIndex: number): FormArray {
        return this.travellers('traveller').at(empIndex).get("childAges") as FormArray
    }

    onChange(value, index, ageIndex) {
        const childAges = this.getAge(index);
        childAges.controls[ageIndex].patchValue({ childAge: value });
    }

    setChildAgeArray(){
        return this.fb.group({
            childAge: 2,
        });  
      }

      setRoomUI(data1){
        if(data1 && data1.traveller){
            this.setAdultChildCount(data1.traveller);
            this.noOfRooms=0;
            this.noOfRooms=data1.traveller.length;
            if (data1['traveller'] && data1['traveller'].length > 1) {
                const traveller = this.regConfig.get('traveller') as FormArray;
                for (let i = 0; i < (data1['traveller'].length - 1); i++) {
                    traveller.push(this.createTravellerForm())
                }
            }
        }
    }

    setChildUI(data1) {
        if (data1['traveller'] && data1['traveller'].length) {
            const traveller = this.regConfig.get('traveller') as FormArray;
            for (let i = 0; i < data1['traveller'].length; i++) {
                const childAge = traveller.controls[i]['controls']['childAges'] as FormArray;
                for (let index= 0; index < data1['traveller'][i].childAges.length; index++) {
                    childAge.push(this.setChildAgeArray())
                }
            }
        }
    }

    setAdultChildCount(traveller){
        if(traveller){
        this.noOfAdults=0;
        this.noOfChild=0;
            traveller.forEach(element => {
                this.noOfAdults += element.adults;
                this.noOfChild += element.childrens;
            });
        }
    }

    setNoOfNights() {
        var check_in_date =  new Date(this.regConfig.get('check_in_date').value);
        var check_out_date =  new Date(this.regConfig.get('check_out_date').value);
        var timeDiff = Math.abs(check_out_date.getTime() - check_in_date.getTime());
        var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        this.regConfig.patchValue({
            noOfNights:numberOfNights
        })
        this.enableControl();
    }

    enableControl(){
        this.regConfig.get('noOfNights').enable();
    }

    onChangeType(value) {
        const date = new Date(this.regConfig.get('check_in_date').value);
            date.setDate(date.getDate() + (+value));
            this.regConfig.patchValue({
                check_out_date: date,
            });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
