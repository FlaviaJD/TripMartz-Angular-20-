import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { untilDestroyed } from 'projects/student/src/app/core/services';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { shareReplay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../../../core/api-handlers/api-handlers.service';
import { formatDate } from '../../../../../../../core/services/format-date';
import { UtilityService } from '../../../../../../../core/services/utility.service';
import { HotelService } from '../../../../hotel.service';
import * as moment from 'moment';

@Component({
    selector: 'app-hotel-guest-details',
    templateUrl: './hotel-guest-details.component.html',
    styleUrls: ['./hotel-guest-details.component.scss']
})
export class HotelGuestDetailsComponent implements OnInit {
    @ViewChild('employeeList', { static: false }) employeeList: ElementRef;
    @ViewChild('state',{ static: false }) state: ElementRef;
    currentUser: any;
    travellerForm: FormGroup;
    addressForm: FormGroup;
    titleList: any;
    hotel: any;
    traveller: any;
    noOfAdults: number = 0;
    noOfChilds: number = 0;
    noOfAdultsExt: number = 0;
    noOfChildsExt: number = 0;
    roomWiseAdultsChilds = [];
    guestData: any = {};
    countries: Array<any> = [];
    private subSunk = new SubSink();
    regConfig: FormGroup;
    submitted: boolean = false;
    lastKeyupTstamp: number = 0;
    openRooms: boolean = false;
    adults: number[] = [1];
    childs: number[] = [0];
    noOfRooms: number = 0;
    maxDateAdult: Date;
    minChildDate: Date;
    maxChildDate: Date;
    minDate = new Date();
    searchedList: any = [];
    dropDownCity: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeeks: false
      };
    isLoading: boolean = false;
    guestCountData: {} = {};
    noOfRoomArr = [];
    phoneCodes: any;
    respData: any = [];
    selectedTitle;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    stateNotSelected:boolean=false;
    selectededIndex: any;
    selectedRoomIndex;
    isSelfBooking:boolean=false;
    bookingType: string;
    isPANMandatory: any;
    isPassportMandatory: any;
    minDatePassportExpiry: Date;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private router: Router,
        private hotelService: HotelService,
        private util: UtilityService,
        private dialog: MatDialog,
        private cdRef: ChangeDetectorRef,
        private swalService: SwalService,
        private renderer: Renderer2
        
    ) { }

    ngOnInit() {
        this.minDatePassportExpiry = new Date();
        this.currentUser = this.util.getStorage('studentCurrentUser');
        this.renderer.listen('document', 'click', (event: MouseEvent) => {
            if (this.employeeList && !this.employeeList.nativeElement.contains(event.target) && !this.state.nativeElement.contains(event.target)) {
                this.selectededIndex = -1;
                this.cdRef.detectChanges();
            }
          });
        this.setHotelTraveller();
        this.setblockHotelRoomState();
        this.bookingType = localStorage.getItem('bookingType');
        this.isSelfBooking = this.bookingType === 'Self' ? true : false;
        this.subSunk.sink = this.hotelService.blockHotelRoom.subscribe(res => {
            if (!res) {
                this.router.navigate(['/dashboard']);
            }
            this.hotel = res.data;
        })
        this.traveller = this.hotelService.traveller;

        this.getCountryList();
        this.getTitleList();
        this.getPhoneCodeList();
        this.createTravellerForm();
        // if (this.currentUser.agent_balance <= 50) {
        //     this.dialog.open(LowBalanceAlertComponent, {
        //         data: this.currentUser.agent_balance
        //     });
        // }
        this.maxDateAdult = this.addYearsToDate(-12);
        this.maxChildDate = this.addYearsToDate(-2);
    }

    omitSpecialCharacters(event) {
        let k = event.charCode;
        if (
            (k > 64 && k < 91) ||  
            (k > 96 && k < 123)
        ) {
            return true;
        } else {
            return false;
        }
    }

    addYearsToDate(y: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month, day);
        return c;
    }

    createTravellerForm() {
        this.travellerForm = this.fb.group({
          rooms: this.fb.array([]),
          address: this.fb.array([this.addAddressForm()]),
          Aggreed: new FormControl(false, [Validators.required])
        });
        this.addRooms();
    }

    addRooms() {
        this.traveller.forEach((element, index) => {
            this.noOfAdults += element.adults;
            this.noOfChilds += element.childrens;
            const roomGroup = this.fb.group({
            RoomId: [index + 1], // Assign RoomId
            travellers: this.fb.array([]) // Group travellers within each room
          });
      
          // Add room group to the form
          (this.travellerForm.get('rooms') as FormArray).push(roomGroup);
      
          // Add adults and children to the respective room
          for (let i = 0; i < element.adults; i++) {
            let dateOfBirth=formatDate(this.maxDateAdult, 'YYYY-MM-DD');
            let age = this.util.calculateAge(dateOfBirth);
            let isLeadPax = (i === 0);
            (roomGroup.get('travellers') as FormArray).push(this.addTravellers('adult','1',dateOfBirth,age,isLeadPax));
          }
          for (let i = 0; i < element.childrens; i++) {
            let dateOfBirth=formatDate(this.maxChildDate, 'YYYY-MM-DD');
            let age = this.util.calculateAge(dateOfBirth);
            let isLeadPax=false;
            (roomGroup.get('travellers') as FormArray).push(this.addTravellers('child','0',dateOfBirth,age,isLeadPax));
          }
        });
      }
      
      addTravellers(type: string,PaxType,dateOfBirth,age,isLeadPax): FormGroup {
        this.isPANMandatory=this.hotel.RoomDetails[0].IsPANMandatory;
        this.isPassportMandatory=this.hotel.RoomDetails[0].isPassportMandatory;
        return this.fb.group({
          type: [type], // 'adult' or 'child'
          Title: new FormControl('', [Validators.required]),
          FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1)]),
          LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]),
          // Add other form controls here
          Dob: new FormControl(dateOfBirth),
          PanNumber: new FormControl('',
           null),
          Age: new FormControl(age),
          PassportNumber: new FormControl('',
            null),
          LeadPassenger:new FormControl(isLeadPax),
          PassportExpiryDate: new FormControl('',
             null),
          PaxType:new FormControl(PaxType),
          selectedEmployee:new FormControl(''),
          Email:new FormControl('',[Validators.required, Validators.email]),
          EmployeeId:new FormControl(''),
          MobileNo:new FormControl('',[Validators.required]),
          PhoneCode:new FormControl('91'),
          Department:new FormControl(''),
          EmployeeBand:new FormControl(''),
          Gender:new FormControl(''),
          EmployeeCostCenter:new FormControl('')
        });
      }
      
    alphaNumberOnly(e) {  // Accept only alpha numerics, not special characters 
        var regex = new RegExp("^[0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }

        e.preventDefault();
        return false;
    }
    getNoOfpassengerForRoom(i) {
        return this.traveller[i].adults
    }
    getNoOfChildrenForRoom(i) {
        return this.traveller[i].childrens
    }

    getCountryList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', {}, {}, {}).subscribe(resp => {
            if (resp.statusCode == 200 && resp.data) {
                this.countries = resp.data.countries;
            }
        })
    }

    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitlelist', 'POST', {}, {}, {}).subscribe(res => {
            this.hotelService.userTitleList.next(res.data);
            if (res.data.length) {
                this.titleList = res.data;
                if(this.isSelfBooking){
                    this.setPaxDetails();
                }
            }
        });
    }

    getPhoneCodeList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
            .subscribe(res => {
                if (res && res.data.length) {
                    this.phoneCodes = res.data;
                }
            });
    }

    getHotelData() {
        this.subSunk.sink = this.hotelService.blockHotelRoom.subscribe(d => {
            this.hotel = d;
        })
    }

    addAddressForm(): FormGroup {
        return this.fb.group({
            Title: new FormControl('', [Validators.required]),
            FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1)]),
            LastName: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.minLength(1)]),
            Address: new FormControl('India', [Validators.maxLength(120), Validators.minLength(2)]),
            Address2: new FormControl('', [Validators.maxLength(120), Validators.minLength(2)]),
            City: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.util.regExp.fullName)]),
            State: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            PostalCode: new FormControl('560100', [Validators.required, Validators.maxLength(20)]),
            Email: new FormControl(''),
            // PhoneCode: new FormControl('', [Validators.required]),
            PhoneCode: new FormControl('91', [Validators.required, Validators.maxLength(6)]), // Validators.pattern(this.util.regExp.phoneCode)
            Contact: new FormControl(''),
            Country: new FormControl('IND', [Validators.required])
        })
    }

    travellers(controlName: string): FormArray {
        return this.travellerForm.get(controlName) as FormArray;
    }

    hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number,roomIndex?: number): boolean => {
        if (arrayControl !== undefined && roomIndex !== undefined) {
            const formArray = this.travellerForm.get('rooms') as FormArray;
            if (formArray && formArray.at(roomIndex)) {
                const traveller = formArray.at(roomIndex).get(arrayControl) as FormArray;
                if (traveller && traveller.at(i)) {
                const control = traveller.at(i).get(controlName);
                return control && (this.submitted || control.touched) && control.hasError(errorName);
                }
            }
        } else {
            const formArray = this.travellerForm.get(arrayControl) as FormArray;
            const control = formArray.at(0).get(controlName);
            return control && (this.submitted || control.touched) && control.hasError(errorName);
        }
        return false; // Return false if there's an issue with formArray or index
    };
    

    onSubmit() {
        this.submitted = true;
        if (this.stateNotSelected) {
            return;
        }
        // Iterate through each room
        for (let roomIndex = 0; roomIndex < this.travellerForm.get('rooms')['length']; roomIndex++) {
            const room = this.travellerForm.get('rooms')['controls'][roomIndex];
            const travellers = room.get('travellers')['controls'];
            for (let adultIndex = 0; adultIndex < travellers.length; adultIndex++) {
                let control = room.get('travellers')['controls'][adultIndex];
                let passportExpiryDate = control.get('PassportExpiryDate').value;
                // Check if passportExpiryDate exists and is a valid date
                if (passportExpiryDate) {
                    control.get('PassportExpiryDate').setValue(moment(passportExpiryDate).format("YYYY-MM-DD"));
                }
            }
            
            // adult.get('Title').value,
            // const PassportExpiryDate =p.PassportExpiry? formatDate(p.PassportExpiry, ''):'';
            

            // Iterate through each adult in the room
            for (let adultIndex = 0; adultIndex < room.get('travellers')['length']; adultIndex++) {
                const adult = room.get('travellers')['controls'][adultIndex];

                // Check if the adult is an adult (type === 'adult') and if it has a corresponding address
                if (adult.get('type').value === 'adult' && roomIndex < this.travellerForm.get('address')['length']) {
                    const addressGroup = this.travellerForm.get('address')['controls'][roomIndex];

                    // Patch the address fields with the adult's values
                    addressGroup.patchValue({
                        Title: adult.get('Title').value,
                        FirstName: adult.get('FirstName').value,
                        LastName: adult.get('LastName').value
                        // Add other fields here if needed
                    });
                }
            }
}

        if (!this.hotelService.isDevelopment) {
            if (!this.travellerForm.valid)
                return;
        }
        this.loading = true;
        let passengerDetails = [];
        let room = (this.travellerForm.get('rooms') as FormArray).getRawValue();
        let paymentMode='';
        if(this.hotel && this.hotel.RoomDetails && this.hotel.RoomDetails[0] && this.hotel.RoomDetails[0].Rooms && this.hotel.RoomDetails[0].Rooms[0])
        {
            paymentMode=this.hotel.RoomDetails[0].Rooms[0].MealPlanCode;
        }
        passengerDetails.push(room);
        let policyDetails=JSON.parse(localStorage.getItem('PolicyDetails'));
        let address = (this.travellerForm.get('address') as FormArray).getRawValue();
        address[0]['Email']=passengerDetails[0][0].travellers[0].Email;
        address[0]['Contact']=passengerDetails[0][0].travellers[0].MobileNo;
        address[0]['PhoneCode']=passengerDetails[0][0].travellers[0].PhoneCode;

        let date = (new Date().getTime()).toString();
        const reqBody = {
            ResultToken: `${this.hotel['ResultIndex']}`,
            Email: address[0].Email,
            PromoCode: '',
            PaymentMode:paymentMode,
            UserId: localStorage.getItem('studentCurrentUser') ? JSON.parse(localStorage.getItem('studentCurrentUser'))['id'] : 0,
            RoomDetails: [
                {
                    PassengerDetails: passengerDetails,
                    AddressDetails: address[0],
                }
            ],
            PolicyDetails:policyDetails,
            booking_source: `${this.hotel['booking_source']}`,
            BookingSource: 'B2B'
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
            module: "hotel"
        }).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
                reqBody['AppReference'] = res.data;
                this.subSunk.sink = this.apiHandlerService.apiHandler('addPaxDetails', 'post', {}, {}, reqBody).subscribe(resp => {
                    if (resp.statusCode == 200) {
                        this.hotelService.addHotelBookingPaxDetails.next(resp.data);
                        this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: reqBody['AppReference'], source: `${this.hotel['booking_source']}` } });
                    }
                    else {
                        this.loading = false;
                        this.swalService.alert.oops("Unable to add details");
                    }
                }, err => {
                    this.loading = false;
                    this.swalService.alert.oops(err.error.Message);
                })
            }
        }, err => {
            this.loading = false;
        })
    }

    getTravellersList(event: any,travellerIndex,roomIndex): void {
        this.selectededIndex=travellerIndex;
        this.selectedRoomIndex=roomIndex;
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

    get roomsFormArray(): FormArray {
        return this.travellerForm.get('rooms') as FormArray;
      }

    openStaticPage(page_title) {
        localStorage.setItem('static_title', page_title);
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['auth/cms'])
        );
        window.open( url, '_blank');
    }

    setHotelTraveller() {
        this.hotelService.setHotelTraveller();
    }

    setblockHotelRoomState() {
        const storedState = localStorage.getItem('b2bBlockHotelRoomState');
        if (storedState) {
            this.hotelService.blockHotelRoom.next(JSON.parse(storedState));
        }
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

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }
    isCurrentInput(t) {
        return this.dropDownCity == t;
    }

    setCurrentInput(t) {
        this.dropDownCity = t;
    }

    getTotalTax() {
        let totalTax: number = 0;
        if (this.hotel.booking_source == 'ZBAPINO00024') {
            this.hotel['RoomDetails'].forEach(o => {
                totalTax += (o.Price.Tax);
            });
            return totalTax;
        } else {
            return this.hotel['RoomDetails'][0].Price.Tax || 0;
        }
    }

    getTotal() {
        let totalAmnt: number = 0;
        if (this.hotel.booking_source == 'ZBAPINO00024') {
            this.hotel['RoomDetails'].forEach(o => {
                totalAmnt += o.Price.Amount;
            });
            return totalAmnt;
        } else {
            return this.hotel['RoomDetails'][0].Price.Amount || 0;
        }
    }

    getTotalAmount() {
        let totalAmnt: number = 0;
        if (this.hotel.booking_source == 'ZBAPINO00024') {
            this.hotel['RoomDetails'].forEach(o => {
                totalAmnt += o.Price.RoomPrice;
            });
            return totalAmnt;
        }
        else {
            return this.hotel['RoomDetails'][0].Price.RoomPrice || 0;
        }
    }

    getDynamicCity(event: any): void {
        let city = `${event.name} (${event.state_code})`;
        if (city) {
            if (event.inputFor === 'state') {
                this.stateNotSelected=false;
                this.travellerForm.controls['address']['controls'][0].patchValue({
                    State: city,
                })
            }
        }
    }

    setEmployee(event: any, traveller,value?,flag?): void {
        this.setPassengerTitle(event, traveller);
        if(this.bookingType=="Behalf" && this.selectededIndex==0 && this.selectedRoomIndex==0)
        {
            this.setContactDetails(event);
        }
        traveller.patchValue({
            Title: this.selectedTitle,
            FirstName: event.first_name,
            LastName: event.last_name,
            Dob: event.date_of_birth,
            PanNumber: this.currentUser.auth_role_id == 8 ?'':event.PanNumber,
            Age: event.Age,
            Email: event.email,
            Department:this.currentUser.auth_role_id == 8 ?'':event.department_name,    
            EmployeeBand: this.currentUser.auth_role_id == 8 ?'':event.position_name, 
            EmployeeCostCenter:this.currentUser.auth_role_id == 8 ?'': event.cost_center,
            selectedEmployee: flag?value:event.first_name,
            EmployeeId: this.currentUser.auth_role_id == 8 ?'':event.business_number,
            MobileNo: this.currentUser.auth_role_id == 8 ? event.phone_number : event.phone
        });
    }

    setContactDetails(event) {
        const addressForm = this.travellerForm.get('address') as FormArray;
        addressForm.controls[0].patchValue({
            Email: event.email,
            Contact: event.phone,
            City: event.city,
            State: event.state
        });
        addressForm.controls[0].get('City').disable();
        addressForm.controls[0].get('State').disable();
        addressForm.controls[0].get('Email').disable();
        addressForm.controls[0].get('Contact').disable();
    }
    

    setPassengerTitle(event, traveller) {
        let titleArray;
        let type=traveller.get('type').value;
        if (type === 'adult') {
            titleArray = this.titleList.filter(element => (element.pax_type === "ADULT" && element.id === (+event.title)));
        }
        else {
            titleArray = this.titleList.filter(element => (element.pax_type === "CHILD" && element.id === (+event.title)));
        }
        if (titleArray.length == 0) {
            this.selectedTitle = "";
        } else {
            this.selectedTitle =  titleArray[0].title;
        }
    }

    clearDetails(traveller) {
        traveller.patchValue({
            Title:'',
            FirstName:'',
            LastName:'',
            Dob:'',
            PanNumber:'',
            Age:'',
            Email:'',
            MobileNo:'',
            Department:'',
            EmployeeBand:'',
            EmployeeId:'',
            EmployeeCostCenter:'',
            selectedEmployee:''
        })
    }
    
    setPaxDetails() {
        let titleArray = this.titleList.filter(element => (element.id === this.currentUser.title));
        let title = ''
        if (titleArray) {
            title = titleArray[0].title
        }
        let selectedCountry=this.countries.filter(country=>country.id==this.currentUser.country);
        let country='';
         if(selectedCountry){
            country=selectedCountry[0].code;
        }
        this.roomsFormArray.controls.forEach(rooms => {
            let room = rooms as FormGroup;
            let travellers = room.controls.travellers as FormArray; // Assuming 'travellers' is a FormArray
            if (travellers instanceof FormArray) { // Check if 'travellers' is actually a FormArray
                travellers.controls.forEach(traveller => {
                    if (traveller instanceof FormGroup) {
                        traveller.patchValue({
                            Title:title,
                            FirstName:this.currentUser.first_name,
                            LastName:this.currentUser.last_name,
                            EmployeeBand:this.currentUser.band,
                            EmployeeCostCenter:this.currentUser.cost_center,
                            Department:this.currentUser.department_name,
                            EmployeeId:this.currentUser.business_number,
                            Email:this.currentUser.email,
                            ContactNo:this.currentUser.phone,
                            MobileNo:this.currentUser.phone,
                            Nationality:country
                        });
                        traveller.get('Title').disable();
                        traveller.get('FirstName').disable();
                        traveller.get('LastName').disable();
                        traveller.get('MobileNo').disable();
                        traveller.get('Email').disable();
                        traveller.get('PhoneCode').disable();
                    }
                });
            }
        });
        this.setContactDetails(this.currentUser);
    }


    getSearchedList(event: any): void {
        if (event && event.target.value) {
            this.stateNotSelected=true;
            const state_name = `${event.target.value}`.trim();
            if (state_name) {
                this.apiHandlerService.apiHandler('hotelStates', 'POST', '', '', { state_name })
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
    }

    findEmployeeId(value: any,item,travellerIndex,roomIndex): void {
        this.selectededIndex=travellerIndex;
        this.selectedRoomIndex=roomIndex;   
        const query = `${value}`.trim();
        let corporate_id=localStorage.getItem('selectedCorporateId');
        this.apiHandlerService.apiHandler("findEmployeeId", "POST",{},{},{
            "employeeId":query
        }).subscribe((res) => {
            if (res && res.statusCode==201) {
                this.respData = res.data;
                this.setEmployee(this.respData,item,value,true)
                this.cdRef.detectChanges();
            }
            else{
                this.respData = [];
                this.cdRef.detectChanges();
            }
        });
    }


    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
