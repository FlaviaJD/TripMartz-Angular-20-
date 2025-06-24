import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { untilDestroyed } from '../../../core/services';
import { SwalService } from '../../../core/services/swal.service';
import { ThemeOptions } from '../../../theme-options';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
    selector: 'app-raise-request',
    templateUrl: './raise-request.component.html',
    styleUrls: ['./raise-request.component.scss']
})
export class RaiseRequestComponent implements OnInit {
    @ViewChild('city', { static: false }) city: ElementRef<HTMLElement>;
    @ViewChild('location', { static: false }) location: ElementRef<HTMLElement>;
    @ViewChild('checkInDate', { static: false }) checkInDate: ElementRef<HTMLElement>;
    @ViewChild('checkOutDate', { static: false }) checkOutDate: ElementRef<HTMLElement>;
    filteredHotelNames: Observable<string[]>;
    minDateArr = Array(5).fill(new Date());
    protected subs = new SubSink();
    regConfig: FormGroup;
    depart = false as boolean;
    searchedList: Array<any> = [];
    isOpen: boolean;
    age: number;
    fadeinn = false;
    travellersFadeinn: boolean = false;
    genderBool: boolean = false;
    prefClass: boolean = false;
    dropDownCity: any;
    minDate = new Date();
    hotelNames: any = [];
    maxDate;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    showCityError: boolean = false;
    showLocationError: boolean = false;
    showGuestError: boolean = false;
    showHotelError: boolean = false;

    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    bookingRequestData:any=[];
    times: string[] = [
        '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
        '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
        '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
        '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
        '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
        '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
    ];
    genderList: Array<string> = ['Male', 'Female'];
    loading: boolean = false;
    hideOther:boolean=false;
    minCheckoutDate= new Date();;
    hotelList:Array<any>=[];
    locationList:Array<any>=[];
    guestHouseList:Array<any>=[];
    filteredCityName: Observable<string[]>;
    filteredLocationNames: Observable<string[]>;
    filteredGuestHouseNames: Observable<string[]>;
    cityCode='';
    cityName='';
    locationCode='';
    isMale:boolean=false;
    isFemale:boolean=false;
    respData: any[];
    cdRef: any;
    currentUser: any;
    slectededIndex: any;
    selectedTitle: any;
    titles: any;
    newFormGroup: FormGroup;
    showDiv = {
        newbook: true,
        extendbook: false,
    }

    constructor(private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private http:HttpClient,
        private router: Router,
        private globals: ThemeOptions,
        private cdf:ChangeDetectorRef,
        private util: UtilityService,
    ) { }

    ngOnInit() {
        this.currentUser = this.util.getStorage('currentUser');
        this.hideOther = this.globals.hideOther;
        this.createForm();
        this.regConfig.get('reason').valueChanges.subscribe(value => {
            if (value === 'Others') {
              this.regConfig.get('otherReason').setValidators([Validators.required]);
            } else {
              this.regConfig.get('otherReason').clearValidators();
              this.regConfig.get('otherReason').setValue('');
            }
            this.regConfig.get('otherReason').updateValueAndValidity();
          });
        if (this.hideOther) {
            this.bookingRequestData = JSON.parse(localStorage.getItem('bookingRequest')) || {};
            if (this.bookingRequestData) {
                this.bookingRequest(this.bookingRequestData);
            }
        }
    }

    createForm(): void {
        this.regConfig = this.fb.group({
            emailId: ['', [Validators.required, Validators.email]],
            department: ['', [Validators.required]],
            reason: ['', [Validators.required]],
            remarks: ['', [Validators.required]],
            paxDetails: this.fb.array([]),
            city: ['', [Validators.required]],
            location: ['', [Validators.required]],
            checkInDate: ['', [Validators.required]],
            checkInTime: ['',[Validators.required]],
            checkOutDate: ['', [Validators.required]],
            checkOutTime: ['',[Validators.required]],
            guestHouse: ['',[Validators.required]],
            hotelName: ['',[Validators.required]],
            iciciRequestId: [''],
            mealPreference: ['',[Validators.required]],
            bookingRequestId:[''],
            bookingRequestType: ['NewBooking'],
            remark: ['', [Validators.required]],
            otherReason:['']
        });
       this.addFormToFormArray();
    }

    addFormToFormArray() {
        const newFormGroup = this.fb.group({
            FirstName: ['', [Validators.required]],
            LastName: ['', [Validators.required]],
            MobileNo: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(10)]],
            EmailId: ['', [Validators.required, Validators.email]],
            Age: [''],
            Gender: ['',[Validators.required]],
            selectedEmployee:new FormControl(''),
            Department: ['', [Validators.required]],
            Reason: [''],
            EmployeeBand: ['', [Validators.required]],
        });
        this.formArray.push(newFormGroup);
    }

    get formArray(): FormArray {
        return this.regConfig.get('paxDetails') as FormArray;
    }

    removeFormFromFormArray(index: number): void {
        this.formArray.removeAt(index);
    }

    getTravellersList(event: any,travellerIndex): void {
        this.slectededIndex=travellerIndex
        const query = `${event.target.value}`.trim();
        let corporate_id=localStorage.getItem('selectedCorporateId');
        this.apiHandlerService.apiHandler("travellerManagementList", "POST",{},{},{
            "query":query,
            "auth_role_id":this.currentUser.auth_role_id,
            "corporate_id":this.currentUser.auth_role_id==3? (+corporate_id):''
        }).subscribe((res) => {
            if (res && res.data.length) {
                this.respData = res.data;
                this.cdRef.detectChanges();
            }
            else{
                this.respData = [];
                this.cdRef.detectChanges();
            }
        });
    }
    
    
    setEmployee(event: any,formGroup): void {
        this.setPassengerTitle(event,formGroup);
        formGroup.patchValue({
             Title:this.selectedTitle,
             FirstName:event.first_name,
             LastName:event.last_name,
             MobileNo:event.phone,
             EmailId:event.email,
             Age:event.Age,
             Department:event.department_name,
             EmployeeBand:event.position_name,
             EmployeeCostCenter:event.cost_center,
             selectedEmployee:event.first_name,
             EmployeeId:event.business_number
         })
     }
    
       setPassengerTitle(event,type) {
        // let titleArray = this.titles.filter(element => (element.id === event.title));
        // if (titleArray.length == 0) {
        //     this.selectedTitle = "";
        // } else {
        //     this.selectedTitle =  titleArray[0].title;
        // }
    }

    bookingRequest(bookingRequest) {
        this.regConfig.patchValue({
            emailId: bookingRequest.Email,
            department: bookingRequest.Department,
            iciciRequestId:bookingRequest.app_reference
        });
        this.regConfig.get('emailId').disable();
        this.regConfig.get('department').disable();
        while (this.formArray.length !== 0) {
            this.formArray.removeAt(0);
        }
        if (bookingRequest.BookingType == 'Self') {
          this.setValues(bookingRequest,false);
        }
        if (bookingRequest.BookingType == 'Colleague') {
            this.setValues(bookingRequest.ColleagueProfile,true);
        }
        if (bookingRequest.BookingType == 'Group') {
            this.setGroupValue(bookingRequest,bookingRequest.GroupTraveller);
        }
    }

    setGroupValue(bookingRequest, groupTraveller) {
        let length = +bookingRequest.TravellerCount.Adult;
        for (let i = 1; i <= length; i++) { // Assuming you have two sets of data
            const employeeKey = `EmployeeId${i}`;
            const firstNameKey = `FirstName${i}`;
            const lastNameKey = `LastName${i}`;
            const mobileKey = `Mobile${i}`;
            const emailKey = `Email${i}`;
            const departmentKey = `Department${i}`;
            const employeeBand = `EmployeeBand${i}`;
            const employeeCostCenter= `EmployeeCostCenter${i}`;
            const newFormGroup = this.fb.group({
                FirstName: [groupTraveller[firstNameKey], [Validators.required]],
                LastName: [groupTraveller[lastNameKey], [Validators.required]],
                MobileNo: [groupTraveller[mobileKey], [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
                EmailId: [groupTraveller[emailKey], [Validators.required, Validators.email]],
                Age: [''],
                selectedEmployee:new FormControl(''),
                Gender: ['', [Validators.required]],
                Department: [groupTraveller[departmentKey], [Validators.required]],
                Reason: [''],// Add other form controls as needed
                EmployeeId:[groupTraveller[employeeKey]],
                EmployeeBand:[groupTraveller[employeeBand], [Validators.required]],
                EmployeeCostCenter:[groupTraveller[employeeCostCenter]]
            });
            this.formArray.push(newFormGroup);
            this.desablePaxDetails(newFormGroup)
        }
    }

    desablePaxDetails(newFormGroup) {
        Object.keys(newFormGroup.controls).forEach(controlName => {
            const control = newFormGroup.get(controlName);
            if (control.value !== null && control.value !== '' && control.value !== undefined) {
                control.disable();
            }
        });
    }

    setValues(bookingRequest,value) {
        const employeecostcenter=value?bookingRequest.EmployeeCostCenter:bookingRequest.Employeecostcenter;
        const newFormGroup = this.fb.group({
            FirstName: [bookingRequest.FirstName, [Validators.required]],
            LastName: [bookingRequest.LastName, [Validators.required]],
            MobileNo: [bookingRequest.Mobile, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            EmailId: [bookingRequest.Email, [Validators.required, Validators.email]],
            Age: [''],
            Gender: ['', [Validators.required]],
            Department: [bookingRequest.Department, [Validators.required]],
            Reason: [''],
            EmployeeId:[bookingRequest.EmployeeId],
            EmployeeBand:[bookingRequest.EmployeeBand, [Validators.required]],
            EmployeeCostCenter:[employeecostcenter]
        });
        this.formArray.push(newFormGroup);
        this.desablePaxDetails(newFormGroup);
    }


    getSearchedList(event: any): void {
        this.emptyDependentField();
        if (this.isMale) {
            this.enableControl();
        }
        this.showCityError=true;
        if (event && event.target.value) {
            const City = `${event.target.value}`;
            this.apiHandlerService.apiHandler('iciciCityList', 'POST', '', '', { City })
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

    private emptyDependentField(){
        this.regConfig.patchValue({
            location:'',
            guestHouse:'',
            hotelName:''
        });
        this.locationList.splice(0)
    }

    emptyField(){
        this.regConfig.patchValue({
            hotelName:''
        });
    }

    getLocationList(event: any): void {
        this.showLocationError=true;
        this.emptyField();
        const searchData={
            CityCode: this.cityCode,
            LocationName: `${event.target.value}`
        }
        if (this.cityCode) {
            this.guestHouseList.splice(0);
            this.apiHandlerService.apiHandler('iciciLocationList', 'POST', '', '', { ...searchData })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.locationList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.locationList.length = 0;
                    }
                });
        }
    }

    getGuestHouseList(event: any): void {
        this.showGuestError=true;
        const searchData={
            CityCode: this.cityCode,
            GuestHouseName:`${event.target.value}`
        }
        if (this.cityCode) {
            this.hotelList.splice(0);
            this.apiHandlerService.apiHandler('iciciGuestHouseList', 'POST', '', '', { ...searchData })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status && resp.data.length > 0) {
                        this.guestHouseList = resp.data;
                        if (this.isMale) {
                            this.enableControl();
                        }
                    } else {
                        const msg = resp['Message'];
                        if (this.isMale) {
                            this.desableControl();
                        } this.guestHouseList.length = 0;
                    }
                });
        }
    }

    enableControl(){
        this.regConfig.patchValue({
            hotelName: '',
            guestHouse: ''
        });
        this.regConfig.get('guestHouse').enable();
        this.regConfig.get('hotelName').disable();
    }

    desableControl(){
        this.regConfig.patchValue({
            hotelName: '',
            guestHouse: ''
        });
        this.showGuestError=false;
        this.regConfig.get('guestHouse').disable();
        this.regConfig.get('hotelName').enable();
    }
  
    getHotelList(event: any): void {
        this.showHotelError=true;
        const searchData={
            CityCode: this.cityCode,
            LocationCode:this.locationCode,
            HotelName:`${event.target.value}`
        }
        if (this.cityCode && this.locationCode) {
            this.apiHandlerService.apiHandler('iciciHotelList', 'POST', '', '', { ...searchData })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.hotelList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.hotelList.length = 0;
                    }
                });
        }
    }

    selectedCity(city){
        this.regConfig.get("city").patchValue(city.City);
        this.searchedList.splice(0);
        this.showCityError=false;
        this.cityCode=city.CityCode;
        this.cityName=city.City
    }

    selectedLocation(location){
        this.showLocationError=false;
        this.regConfig.get("location").patchValue(location.LocationName);
        this.locationList.splice(0);
        this.locationCode=location.LocationCode;
    }

    selectedGuest(guestHouse){
        this.showGuestError=false;
        this.regConfig.get("guestHouse").patchValue(guestHouse.GuestHouseName);
        this.guestHouseList.splice(0);
    }

    selectedHotel(hotel){
        this.showHotelError=false;
        this.regConfig.get("hotelName").patchValue(hotel.HotelName);
        this.hotelList.splice(0);
    }

    setCurrentInput(t) {
        this.dropDownCity = t;
    }

    isCurrentInput(t) {
        return this.dropDownCity == t;
    }

    getDynamicCity(event: any): void {
        let city = `${event.name} (${event.state_code})`;
        if (city) {
            if (event.inputFor === 'state') {
                this.regConfig.get('state').patchValue(city)
            }
        }
    }

    getCity(event: any): void {
        let cityName = `${event.cityName} (${event.countryCode})`;
        if (cityName) {
            this.regConfig.patchValue({ city: cityName });
            this.searchedList.length = 0;
        }
    }

    closeGender() {
        this.genderBool = false;
    }

    onGenderChange(inputGender: string) {
        this.regConfig.patchValue({
            gender: inputGender
        });
        this.genderBool = false;
    }

    onChange(event: Event,control) {
        if(control=='checkIn'){
            this.regConfig.patchValue({
                checkInTime: event
            })
        }
        else{
            this.regConfig.patchValue({
                checkOutTime: event
            })
        }
    }
    onCheckIn(event) {
        if (event) {
            const eventDate = new Date(event);
            eventDate.setDate(eventDate.getDate() + 1);
            this.regConfig.patchValue({
                checkOutDate: ''
            });
            this.minCheckoutDate = eventDate;
        }
    }

    exchangeCityFn() {

    }

    onAgeEntered(event: Event): void {
        const input = event.target as HTMLInputElement;
        const inputValue = input.value;
        const numericValue = parseInt(inputValue, 10);

        if (isNaN(numericValue)) {
            input.value = ''; // Clear the input if it's not a number
        } else if (numericValue > 100) {
            input.value = ''; // make input empty if user gives age more than 100
        }
    }

    onSubmit() {
        if (!(this.regConfig.valid)) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            return;
        }
        if (this.showCityError || this.showGuestError || this.showLocationError || this.showHotelError) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            return;
        }
        let request = this.generatePayload();
        this.onCreate(request);
    }

    generatePayload() {
        const created_by_id =(JSON.parse(localStorage.getItem('currentUser')))['id'];
        let formValues = this.regConfig.getRawValue();
        formValues.reason = (formValues.reason === "Others") ? formValues.otherReason : formValues.reason;
        let request = {
            "PersonalDetails": {
                "EmailId": formValues.emailId,
                "Department": formValues.department,
                "Reason": formValues.reason,
                "Remarks": formValues.remarks
            },
            "PaxDetails": formValues.paxDetails,
            "HotelDetails": {
                "City": formValues.city,
                "Location": formValues.location,
                "CheckInDate": moment(formValues.checkInDate).format("YYYY-MM-DD"),
                "CheckInTime": formValues.checkInTime,
                "CheckOutDate": moment(formValues.checkOutDate).format("YYYY-MM-DD"),
                "CheckOutTime": formValues.checkOutTime,
                "GuestHouse": formValues.guestHouse,
                "HotelName": formValues.hotelName,
                "Remarks": formValues.remark,
            },
            "IciciRequestId":formValues.iciciRequestId,
            "BookingRequestType":formValues.bookingRequestType,
            "BookingRequestId":formValues.bookingRequestId,
            "UserType":"Employee",
            "MealPreference":formValues.mealPreference,
            "UserId":created_by_id
        };
        return request;
    }

    onCreate(request) {
        this.loading = true;
        this.apiHandlerService.apiHandler('iciciHotelCreate', 'POST', '', '', request).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.createForm();
                this.swalService.alert.success(res.Message);
                localStorage.setItem('isBookingRequestSubmitted', JSON.stringify(true));
                this.router.navigate(['/reports/icici-hotel-booking-details']);
            }
            else {
                this.loading = false;
                this.swalService.alert.oops(res.Message);
            }
        }, (err) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
        });
    }

    keyPressNumbers(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    addPax() {
        this.addFormToFormArray();
    }

    co_travellers(): FormArray {
        return this.regConfig.get("co_travellers") as FormArray
    }

    removeTraveller(i: number) {
        this.co_travellers().removeAt(i);
    }

    genderCheck(type){
        const formSelectedGender=(this.regConfig.get('paxDetails') as FormArray).value;
        const selectedGender = formSelectedGender[0]['Gender'];
        this.isMale = selectedGender === 'Male';
        this.isFemale = selectedGender === 'Female';
        this.hotelList=[];
        this.guestHouseList=[];
        this.regConfig.patchValue({
            hotelName:'',
            guestHouse:''
        });
        this.showGuestError=false;
        this.showHotelError=false;
        if(selectedGender==='Male'){
            this.regConfig.get('hotelName').disable();
            this.regConfig.get('guestHouse').enable();
        } else if(selectedGender==='Female'){
            this.regConfig.get('guestHouse').disable();
            this.regConfig.get('hotelName').enable();
        }else{
            this.regConfig.get('guestHouse').enable();
            this.regConfig.get('hotelName').enable();
        }
    }

    handleBookingTypeChange(value: string) {
        if (value === 'NewBooking') {
            this.showDiv.newbook = true;
            this.showDiv.extendbook = false;
            this.setRemarkValidator(false);
        } else if (value === 'ExtendBooking') {
            this.showDiv.newbook = false;
            this.showDiv.extendbook = true;
            this.setRemarkValidator(true);
        }
    }

    setRemarkValidator(isRequired: boolean): void {
        const remarkControl: AbstractControl = this.regConfig.get('bookingRequestId');
        if (isRequired) {
            remarkControl.setValidators([Validators.required]);
        } else {
            remarkControl.setValidators(null);
        }
        remarkControl.updateValueAndValidity();
    }

    ngOnDestroy(): void {
    }
    clearDetails(index) {
        this.newFormGroup.controls['passengers']['controls'][index].patchValue({
            Title: '',
            Name: '',
            Gender: '',
            //Age: "",
            PassengerSelection: '',// Used for passenger selection
            selectedEmployee:'',
        });
    }
}
