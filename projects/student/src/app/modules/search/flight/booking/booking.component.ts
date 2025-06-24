import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalConfigDataI } from 'projects/student/src/app/shared/service/mat-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { timer, Subscription } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { FlightService } from '../flight.service';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { fakeCommitBookingResult } from '../flight.temp.service';
import { SubSink } from 'subsink';
import { formatDate } from '../../../../core/services/format-date';
import { AlertService } from '../../../../core/services/alert.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SwalService } from '../../../../core/services/swal.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { KeyValue } from '@angular/common';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { shareReplay } from 'rxjs/operators';
import { untilDestroyed } from 'projects/student/src/app/core/services';
export function getAlertConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), {
        placement: 'right',
        container: 'body',
    });
}

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
    providers: [{ provide: TooltipConfig, useFactory: getAlertConfig }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent implements OnInit, OnDestroy {
    @ViewChild('scrolldiv', { static: true }) private myScrollContainer: ElementRef;
    @ViewChild('optionRef', { static: false }) optionRef: ElementRef;
    @ViewChild('employeeList', { static: false }) employeeList: ElementRef;
    @ViewChild('state',{ static: false }) state: ElementRef;
    stateNotSelected:boolean=false;
    terms: boolean = true;
    searchedList: any = [];
    phoneCodes: Array<any> = [];
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    isCollapsed = true;
    isCollapsedFareSumm = true;
    isCollapsedGst = true;
    isCollapsedServiceReqs = true;
    modalConfigData: ModalConfigDataI;
    flight: any;
    flightString: any;
    traveller: any = false;
    travellerString: any;
    contactForm: FormGroup;
    usaDetailsForm: FormGroup;
    titles: any = [];
    infantsTitles: any = [];
    countries: any = [];
    loading: boolean;
    respData: any = [];
    selectedTitle;
    submitted: boolean = false;
    seatMapData:any;
    seatMapSectors:any;
    selectedPassengerIndex:any;
    selectedPassenger:any;
    selectedTabIndex: number = 0;
    keysArray = [];
    isSeatLoading:boolean=true;
    showSeatSelection:boolean=false;
    baggageArray = [];
    baggageMapData:any;
    baggageMapSectors:any;
    selectedBaggage: any="";
    selectedMealTabIndex: number = 0;
    mealArray = [];
    mealMapData:any;
    mealMapSectors:any;
    selectedMeal: any="";
    isPanMandatory:boolean=false;
    isPassportMandatory:boolean=false;
    promocodeList:any=[];
    selectedPromocode='';
    selectedBaggageTabIndex: number = 0;
    slectededIndex: any;
    dropDownCity: any;

    html = `<div class="container">
    <div class="row py-3">
        <div class="col-12 font-weight-bold">
            Information on Entry of Name(s)
        </div>
        <div class="col-12 mt-2">
            Name of the <mark>Passenger(s)</mark> must be identical with the name displayed on the selected ID type.
        </div>
        <div class="col-12">
            <div class="row col-12 bg my-2 mx-0 p-3">
                <div class="col-12 mb-3"> <span class="font-weight-bold f-14"> Passport </span> </div>
                <div class="col-3 pt-4">
                    <i class=" fa fa-5x fa-users"></i>
                </div>
                <div class="col-9">
                    <div class="d-flex flex-column">
                        <div class="text-muted">
                            <small> Last name </small> 
                        </div>
                        <div class="text-dark">
                            <span>
                                JONH
                            </span>
                        </div>
                        <div class="text-muted mt-3">
                            <small> First & middle name </small> 
                        </div>
                        <div class="text-dark">
                            <span>
                            STEVE  DOE
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 mt-3 f-12">
            <span class="font-italic f-14"> 
                N.B.- 
            </span>
            Passenger(s) who don't have first names may enter their last name in the boxese for both "last name" and "first & middle names".
        </div>
    </div>
</div>`;

    isConfirmed = false;
    maxDate = new Date();
    minDateExpiry= new Date();
    maxDateExpiry;
    maxDateAdult: any;
    minDateAdult: any;
    maxDateChild: any;
    minDateChild: any;
    maxDateInfant: any;
    minDateInfant: any;
    minDatePassportExpiry: any;
    extraServices = false;
    appRef: any;
    flightType: any;
    protected subs = new SubSink();
    private _jsonURL = 'assets/seatAvailabilityFormat.json';
    airline_logo: string = '';
    currentUser: any;
    pgValue = 900;
    isSelfBooking:boolean=false;
    originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
        return 0;
      }
    
      reverseKeyOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
        return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
      }
    
      valueOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
        return a.value.localeCompare(b.value);
      }
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private flightService: FlightService,
        private alertService: AlertService,
        private utility: UtilityService,
        private cdRef: ChangeDetectorRef,
        private swalService: SwalService,
        private http: HttpClient,
        private renderer: Renderer2
    ) {

    }

    ngOnInit() {
        this.setValues();
        this.renderer.listen('document', 'click', (event: MouseEvent) => {
            if (this.employeeList && !this.employeeList.nativeElement.contains(event.target) && !this.state.nativeElement.contains(event.target)) {
                this.slectededIndex = -1;
                this.cdRef.detectChanges();
            }
          });

        this.removeBaggeMeal();
        this.createContactForm();
        this.isPanMandatory=this.flightService.isPanMandatory;
        this.isPassportMandatory=!this.flightService.isPassportMandatory;
        let bookingType = localStorage.getItem('bookingType');
        this.isSelfBooking = bookingType === 'Self' ? true : false;
        this.currentUser = this.utility.readStorage('studentCurrentUser', localStorage);
        this.subs.sink = this.flightService.bookingFlightData.subscribe(res => {
            if (typeof res == 'object' && res.JourneyList.hasOwnProperty('FlightDetails')) {
                this.flightService.extraFees.next(this.flightService.extraFees.value);
                this.traveller = this.flightService.traveller;
                //if ((res.JourneyList.booking_source == 'ZBAPINO00002' || res.JourneyList.booking_source == 'ZBAPINO00007') && this.currentUser.id==2) {
                    this.showSeatSelection = true;
                    //this.getSeatLayout(res.JourneyList);
                //}
                this.flight = res.JourneyList;
                this.flightService.flightType.subscribe(data => {
                    this.flightType = data
                    this.passengers.clear();
                    let leadPax = 1;
                    for (let t of Object.keys(this.traveller)) {
                        if (this.traveller[t]) {
                            for (let i = 0; i < this.traveller[t]; i++) {
                                this.addPassenger(t, i, leadPax);
                                leadPax = 0;
                            }
                        }
                    }
                })
            } else {
                this.router.navigate(['/dashboard']);
            }
         
            this.cdRef.detectChanges();
        });
        this.airline_logo = this.flightService.airline_logo;
        this.subs.sink = this.flightService.extraServices.subscribe(res => {
            if (res) {
                this.extraServices = true;
            } else {
                this.extraServices = false;
            }
        });

                 this.flightService.userTitleList.subscribe(res => {
            if (res) {
                this.titles = res
                console.log("titles",this.titles)
            }
        });   
    

        this.flightService.countryList.subscribe(res => {
            this.countries = res;
        });
        this.getPhoneCodeList();
        this.subs.sink = this.flightService.loading.subscribe(res => {
            this.loading = res;
        });
        this.maxDateAdult = this.addYearsToDate(-12, 0);
        this.minDateAdult = this.addYearsToDate(-100, 0);
        this.maxDateChild = this.addYearsToDate(-2, 0);
        this.minDateChild = this.addYearsToDate(-12, 0);
        this.maxDateInfant = new Date();
        this.minDateInfant = this.addYearsToDate(-2, 0);
        if (this.currentUser.auth_role_id == 2) {
            this.contactForm.get('contact').patchValue({
                state: this.currentUser.state
            })
            //this.contactForm.get('contact.state').disable();
        }
        if (this.currentUser.auth_role_id == 3) {
           let state= localStorage.getItem('selectedState');
            this.contactForm.get('contact').patchValue({
                state: state
            })
            //this.contactForm.get('contact.state').disable();
        }
        if (this.currentUser.auth_role_id == 3) {
           let state= localStorage.getItem('selectedState');
            this.contactForm.get('contact').patchValue({
                state: state
            })
            this.contactForm.get('contact.state').disable();
        }
        if(this.currentUser.auth_role_id == 9){
            setTimeout(() => {
            this.setPaxDetails();
            }, 1000);

        }
        this.minDatePassportExpiry = new Date();
        this.minDatePassportExpiry = this.addYearsToDate(+0, +6);
        
    }

    setProgressBarValue(value: number, total: number) {
        this.pgValue = (100 * value) / total;
      }


    getTravellersList(event: any,travellerIndex): void {
        this.slectededIndex=travellerIndex;
        const query = `${event.target.value}`.trim();
        let corporate_id=localStorage.getItem('selectedCorporateId');
        this.apiHandlerService.apiHandler("travellerManagementList", "POST",{},{},{
            "query":query,
            "auth_role_id":this.currentUser.auth_role_id,
            "corporate_id":this.currentUser.auth_role_id==3 ? (+corporate_id):''
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
      

    findEmployeeId(value: any,item,travellerIndex,controlType): void {
        this.slectededIndex=travellerIndex;
        this.loading=true;
        const query = `${value}`.trim();
        let corporate_id=localStorage.getItem('selectedCorporateId');
        this.apiHandlerService.apiHandler("findEmployeeId", "POST",{},{},{
            "employeeId":query
        }).subscribe((res) => {
            if (res && res.statusCode==201) {
                this.loading=false;
                this.respData = res.data;
                this.setEmployee(this.respData,item,controlType,value,true)
                this.cdRef.detectChanges();
            }
            else{
                this.loading=false;
                this.respData = [];
                this.cdRef.detectChanges();
            }
    }, (err) => {
        this.loading=false;
        this.respData=[];
        this.cdRef.detectChanges();
    });
    }
    setEmployee(event: any,traveller,type,value?,flag?): void {   
        this.setPassengerTitle(event,type);
        traveller.patchValue({
            Title:this.selectedTitle,
            PhoneCode:'91',
            FirstName:event.first_name.toUpperCase(),
            // MiddleName:'',
            LastName:event.last_name.toUpperCase(),
            // Gender:'',
            // PassportNumber: '',
            // PassportIssuingCountry:'',
            DateOfBirth:event.date_of_birth?new Date(formatDate(new Date(event.date_of_birth), 'DD/MM/YYYY')):'',
            // PassportExpiry:'',
            AddressLine1:event.address,
            AddressLine2:event.address1,
            Email:event.email,
            // PinCode:'',
            City:event.City,
            // Nationality:'',
            ContactNo: this.currentUser.auth_role_id == 8 ? event.phone_number : event.phone,
            MobileNo: this.currentUser.auth_role_id == 8 ? event.phone_number : event.phone,
            Department:this.currentUser.auth_role_id == 8 ?'':event.department_name,    
            EmployeeBand: this.currentUser.auth_role_id == 8 ?'':event.position_name, 
            EmployeeCostCenter:this.currentUser.auth_role_id == 8 ?'': event.cost_center,
            PassengerSelection:flag?value:event.first_name,
            EmployeeId: this.currentUser.auth_role_id == 8 ?'':event.business_number,        });
        this.setGenderDateOfBirth(traveller,type);
       }

   
    setPassengerTitle(event,type) {
        let titleArray;
        if (type === 'adults') {
            titleArray = this.titles.filter(element => (element.pax_type === "ADULT" && element.id === (+event.title)));
        }
        else {
            titleArray = this.titles.filter(element => (element.pax_type === "CHILD" && element.id === (+event.title)));
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
            Gender:'',
            Nationality:'IND',
            PassportNumber:'',
            DateOfBirth:'',
            ContactNo:'',
            PhoneCode:'91',
            AddressLine1: 'Electronic City Phase -1',
            AddressLine2: 'Electronic City Phase -1',
            Email:'',
            PassportExpiry:'',
            City:'',
            MobileNo:'',
            Department:'',
            EmployeeBand:'',
            EmployeeCostCenter:'',
            PassengerSelection:'',
            EmployeeId:''
        });
    }
  
    onTerms(e) {
        this.terms = e
    }

    getPhoneCodeList() {
        this.subs.sink = this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
            .subscribe(res => {
                if (res && res.data.length) {
                    this.phoneCodes = res.data;
                    this.cdRef.detectChanges();
                }
            });
    }

    createContactForm() {
        this.contactForm = this.fb.group({
            passengers: this.fb.array([]),
            contact: this.fb.group({
                // phoneCode: ['91', [Validators.required]],
                // phoneNumber: ['', [Validators.required]],
                // email: ['', [Validators.required, Validators.email]],
                state:[''],
                message: ['',[Validators.pattern('^[a-zA-Z0-9 ]*$')]]
            }),
            usaForm: [0],
            usaDetailsForm: this.fb.group({
                country_name: ['USA'],
                gender: ['Male'],
                types: ['resident'],
                address: [''],
                city: [''],
                state: [''],
                postal_code: ['']
            }),
            baggageProtection: [false]
        });
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    createUsaDetailsForm() {
        this.usaDetailsForm = this.fb.group({
            // passengers: this.fb.array([]),
            // contact: this.fb.group({
            //     countryCode: ['+91', [Validators.required]],
            //     phoneAreaCode: '080',
            //     phoneExtensionCode: '91',
            //     phoneNumber: [123456789, [Validators.required]],
            //     email: ['', [Validators.required, Validators.email]],
            //     message: ['', [Validators.required]]
            // })
        });
    }

    get passengers() {
        return this.contactForm.get('passengers') as FormArray;
    }

    addPassenger(tt: string, i: number, lead = 0) {
        this.passengers.push(this.createPassenger(tt, i, lead));
    }

    createPassenger(tt: string, i: number, lead = 0): FormGroup {
        const title = tt == 'adults' ? 'Mr' : (tt == 'infants' ? 'Miss' : 'Miss');
        const paxType = tt == 'adults' ? 1 : (tt == 'infants' ? 3 : 2);
        const bookingFlightData = this.flightService.bookingFlightData.getValue();
        let dateOfBirth:any;
        if (paxType == 2) {
            dateOfBirth = this.setChildDateOfBirth(bookingFlightData,i);
        }
        if (paxType == 3) {
            dateOfBirth = this.setInfantDateOfBirth(bookingFlightData,i);
        }
        return this.fb.group(
            {
                IsLeadPax: lead,
                Title: ['', [Validators.required]],
                FirstName: ['', [Validators.required]],
                MiddleName: '',
                LastName: ['', [Validators.required]],
                PaxType: paxType,
                Gender: ['', [Validators.required]],
                DateOfBirth: [dateOfBirth, [Validators.required]],
                PassportNumber: this.isPassportMandatory ? ['', [Validators.required]] : [''],
                PassportExpiry: this.isPassportMandatory ? ['', [Validators.required]] : [''],
                PassportIssuingCountry: ['IND',[Validators.required]],
                Nationality: ['IND',[Validators.required]],
                CountryCode: ['IND'],
                CountryName: ['India',],
                City: ['Bengaluru'],
                PinCode: '560100',
                AddressLine1: 'Electronic City Phase -1',
                AddressLine2: 'Electronic City Phase -1',
                Email: ['',[Validators.required]],
                ContactNo: ['',[Validators.required]],
                PhoneCode: ['91',[Validators.required]],
                travellerType: tt,
                travellerTypeCount: i + 1,
                BaggageId: [],
                MealId: [],
                SeatId: [],
                SelectedSeats: [],
                SelectedSelectorId:0,
                PassengerSelection:'',// Used for passenger selection
                SelectedBaggage: [],
                SelectedBaggageSector: 0,
                SelectedBaggagePassengerIndex: 0,
                Baggage:'',
                SelectedMeal: [],
                SelectedMealSector: 0,
                SelectedMealPassengerIndex: 0,
                PanNumber: '',
                Meal:'',
                MobileNo:'',
                Department:'',
                EmployeeBand:'',
                EmployeeCostCenter:'',
                EmployeeId:''
            }
        );
    }

    isCurrentInput(t) {
        return this.dropDownCity == t;
    }
    setCurrentInput(t) {
        this.dropDownCity = t;
    }
    
    onUpdatePassenges(phonecode: any) {
        phonecode = phonecode.split(/[()]/)[1];
        const result = this.phoneCodes.find(c => c.phone_code == phonecode);
        this.passengers.value.forEach((e, i) => {
            this.contactForm.controls['passengers']['controls'][i].patchValue({
                PhoneCode: result.phone_code,
                CountryName: result.name,
                // FirstName:this.currentUser.first_name,
                // LastName:this.currentUser.last_name,
                // phoneNumber:this.currentUser.phone
            });
        });
    }

    onSubmitBooking() {
        this.submitted=true;
        if (!this.terms) {
            this.swalService.alert.oops("Please accept Terms and Conditions/Privacy Policy.");
            return;
        }
        if (this.stateNotSelected) {
            return;
        }
        let baggageProtection = this.contactForm.value.baggageProtection;
        // if (this.flight && this.flight.Attr && this.flight.attr.is_usa) {
        //     this.contactForm.patchValue({ usaForm: 0 });
        // } else {
        //     this.contactForm.patchValue({ usaForm: 1 });
        // }
        const passengers = this.passengers.getRawValue();
        this.setSeatId(passengers);
        this.setBaggageId(passengers);
        this.setMealId(passengers);
        this.setNull(passengers);
        // const cEmail = this.contactForm.get('contact.email').value;
        // const cPhoneCode = this.contactForm.get('contact.phoneCode').value;
        // const cphoneNumber = this.contactForm.get('contact.phoneNumber').value;
         const remark = this.contactForm.get('contact.message').value;
        const passengersTemp = passengers.map((p, i) => {
            const DateOfBirth = formatDate(p.DateOfBirth, '');   
            // if (p.PassportNumber == '' && (this.flight.booking_source != 'ZBAPINO00009' && this.flight.booking_source != 'ZBAPINO00008')) {
            //     p.PassportNumber = "BP012543" + i + (i + 1);
            // }
            // if (p.PassportExpiry == '') {
            //     p.PassportExpiry = formatDate(this.addYearsToDate(+5, +0), '');
            // } else {
            //     p.PassportExpiry = formatDate(p.PassportExpiry, '');
            // }
            // const PassportExpiryDate = p.PassportExpiry;
            p.PassportExpiry = p.PassportExpiry? formatDate(p.PassportExpiry, ''):'';
            const PassportExpiryDate =p.PassportExpiry? formatDate(p.PassportExpiry, ''):'';
            // p.Email = cEmail;
            // p.PhoneCode = cPhoneCode.includes('(') ? cPhoneCode.split(/[()]/)[1] : cPhoneCode;
            p.phoneAreaCode = p.PhoneCode.includes('(') ? p.PhoneCode.split(/[()]/)[1] : p.PhoneCode;
            //p.ContactNo = cphoneNumber;
            let usaFormDetail = {};
            if (this.flight && this.flight.Attr && this.flight.attr && this.flight.attr.is_usa) {
                Object.assign(usaFormDetail, {
                    City: this.contactForm.get('usaDetailsForm.city').value,
                    State: this.contactForm.get('usaDetailsForm.state').value,
                    CountryName: this.contactForm.get('usaDetailsForm.country_name').value,
                    CountryCode: 'IND',
                    AddressLine1: this.contactForm.get('usaDetailsForm.address').value,
                    AddressLine2: '.',
                    PinCode: this.contactForm.get('usaDetailsForm.postal_code').value,
                    Gender: this.contactForm.get('usaDetailsForm.Gender').value,
                    LocationType: this.contactForm.get('usaDetailsForm.types').value
                });
        
    }
            p.CountryCode = p.Nationality;
            return { ...p, DateOfBirth, PassportExpiryDate, ...usaFormDetail };
        });
        this.flightService.loading.next(true);
        if (this.flightService.isDevelopment) {
            setTimeout(_ => {
                const res = fakeCommitBookingResult();
                this.flightService.loading.next(false);
                if (res.Status) {
                    this.router.navigate(['/search/flight/confirm-passenger']);
                } else {
                    this.alertService.error(res.Message);
                    window.alert(res.Message);
                }
            }, 3000);
        } else {
            this.subs.sink = this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
                module: "flight"
            }).subscribe(res => {
                if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
                    this.appRef = res.data;
                    if (baggageProtection) {
                        this.subs.sink = this.apiHandlerService.apiHandler('servicePurchase', 'post', {}, {}, {
                            app_reference: this.appRef,
                            booking_source: this.flight.booking_source
                        }).subscribe(resp => {
                            if (resp.statusCode == 200 || resp.statusCode == 201) {
                            }
                        });
                    }
                   this.commitBooking(passengersTemp,remark);
                }
            })
        }
    }

    commitBooking(passengersTemp,remark){
        const stateCode = this.contactForm.get('contact.state').value;
        this.trimPassengersTemp(passengersTemp);
        const loggedInUser=this.utility.readStorage('studentCurrentUser', localStorage);
        const created_by_id =loggedInUser.id;
        const bookingFlightData = this.flightService.bookingFlightData.getValue();
        let brandResultToken=bookingFlightData.JourneyList.BrandResultToken;
        let policyDetails=[];
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        if (loggedInUser && loggedInUser.auth_role_id == 2 && policyList && policyList.length>0) {
            let daysToDeparturePolicy = JSON.parse(localStorage.getItem('daysToDeparturePolicy'));
            let flightPricePolicy = JSON.parse(localStorage.getItem('flightPricePolicy'));
            let sectorPolicy=JSON.parse(localStorage.getItem('sectorPolicy'));
            daysToDeparturePolicy != null ? policyDetails.push(daysToDeparturePolicy) : null
            flightPricePolicy != null ? policyDetails.push(flightPricePolicy) : null;
            sectorPolicy!=null ? policyDetails.push(sectorPolicy):null
        }
        let business_name = this.currentUser.business_name ? this.currentUser.business_name.replace(/[^a-zA-Z0-9 ]/g, ' ') : '';
        this.subs.sink = this.apiHandlerService.apiHandler('commitBooking', 'POST', '', '', {
            UserId: created_by_id,
            UserType: 'B2B',
            PromoCode:this.selectedPromocode,
            AppReference: this.appRef,
            booking_source: this.flight.booking_source,
            BookingSource: "B2B",
            SequenceNumber: 0,
            ResultToken: this.flightService.resultToken,
            Passengers: passengersTemp,
            SelectedState:stateCode,
            BrandResultToken:brandResultToken,
            Remark:"TripMartz B2B "+business_name+" "+remark,
            PolicyDetails:policyDetails
        }).subscribe(res => {
            if (res.Status && (res.statusCode==200 || res.statusCode==201))  {
                const BookingDetails = res.data.CommitBooking.BookingDetails;
                this.flightService.CommitBookingResponse.next(BookingDetails);
                localStorage.setItem('b2bFlightCommitBookingResponse', JSON.stringify(BookingDetails));
                this.flightService.loading.next(false);
                this.router.navigate(['/search/flight/confirm-passenger']);
            }
            else{
                this.swalService.alert.oops("Unable to commit booking.");
            }
        }, (err) => {
            this.swalService.alert.oops(err.error.Message);
            this.flightService.loading.next(false);
            setTimeout(() => {
                this.router.navigate(['/search/flight/result']);
            }, 100);
        }
        );
    }

    trimPassengersTemp(passengersTemp){
        passengersTemp.forEach(passenger => {
            Object.entries(passenger).forEach(([key, value]) => {
              if (typeof value === 'string') {
                passenger[key] = value.trim();
              }
            });
          });
    }


    getBaggageProtection(val) {
        this.flightService.isBaggeProtected.next(val)
    }

    addYearsToDate(y: number, m: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month + m, day);
        return c;
    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'kg' || bg[1] == 'Kg' || bg[1] == 'KGS' || bg[1] == 'Kgs') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    getTime(date: any) {
        return date.substr(11, 5);
    }

    alphaNumberOnly (e) {  // Accept only alpha numerics, not special characters 
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
    
        e.preventDefault();
        return false;
      }

    openStaticPage(page_title) {
        localStorage.setItem('static_title', page_title);
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['auth/cms'])
        );
        window.open( url, '_blank');
    }

    hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
        if (typeof arrayControl !== 'undefined') {
            let formArrayName = this.contactForm.get(arrayControl) as FormArray;
            return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
        } else {
            return ((this.submitted || this.contactForm.controls[controlName].touched) && this.contactForm.controls[controlName].hasError(errorName));
        }
    }

    getSeatLayout(res) {
        this.isSeatLoading=true;
        let request={
            ResultToken:res.ResultToken,
            booking_source:res.booking_source
        }
        this.subs.sink = this.apiHandlerService.apiHandler('flightSeatAvailability', 'POST', '', '',request).subscribe(response => {
            if ((response.statusCode == 200 || response.statusCode == 201) && response.data) {
                this.seatMapData=response.data.seat_map;
                this.setSeatMapSectors(this.seatMapData);
                this.baggageMapData=response.data.baggage;
                if(this.baggageMapData){
                    this.setBaggageMapSectors(this.baggageMapData);
                }
                this.mealMapData=response.data.meal;
                if(this.mealMapData){
                    this.setMealMapSectors(this.mealMapData);
                }
                this.setSelectedPassenger(0);
                this.isSeatLoading=false;
                this.cdRef.detectChanges();
            }
            else{
                this.isSeatLoading=false;
                this.cdRef.detectChanges();
            }
        }, (error) => {
            this.isSeatLoading=false;
            this.cdRef.detectChanges();
        }
        );
    }

    onCheckboxChange(item: any, selectedSectorIndex: any, selectedSeat: any, event: any) {
        if (!this.selectedPassenger || (this.selectedPassenger.controls.SelectedSeats.value || []).some(s => s.sectorIndex === selectedSectorIndex && s.selectedPassenger === this.selectedPassengerIndex) || (selectedSeat.value.hasOwnProperty('isSelected') && selectedSeat.value.isSelected)) {
            return;
          }
          const seatCode = selectedSeat.value;
          const sector = this.seatMapSectors.get(item.key) || [];
          selectedSeat.value.isSelected = true;
          selectedSeat.value.sectorIndex = selectedSectorIndex;
          selectedSeat.value.selectedPassenger = this.selectedPassengerIndex;
          this.keysArray.push(selectedSeat.value);
          this.selectedPassenger.patchValue({
            SelectedSeats: this.keysArray,
            SelectedSelectorId: selectedSectorIndex
          });
          sector.push(seatCode);
          this.cdRef.detectChanges();
          this.setSelectedPassenger(this.selectedPassengerIndex + 1);
          this.moveToNextOption(this.optionRef, this.selectedPassengerIndex);
          this.seatMapSectors.set(item.key, sector);
          this.setSeatPrice();
    
    }


    // scroll(el) {
    //     el.scrollIntoView({behavior:"smooth"});
    //   }

    moveToNextOption(currentOption: ElementRef, nextIndex: number) {
        if (nextIndex < 0 || nextIndex >= this.passengers.value.length) {
            const isAllSeatsSelected = this.keysArray.filter(value => value.sectorIndex === this.selectedTabIndex).length === this.passengers.value.length;
            if (isAllSeatsSelected && nextIndex >= this.passengers.value.length) {
                this.setSelectedTab(this.selectedTabIndex + 1);
            }
            this.setSelectedPassenger(0);
            nextIndex = 0;
        }
        const nextOption = currentOption.nativeElement.parentElement.parentElement.querySelectorAll('input')[nextIndex];
        this.renderer.setProperty(nextOption, 'checked', true);
        nextOption.focus();
    }

    removeSeat(item: any, sectorIndexToRemove: any, seat: any, selectedPassengerToRemove: any, passenger: any) {
        const passengerData = passenger.controls.SelectedSeats.value;
        const index = passengerData.findIndex((item) => item.sectorIndex === sectorIndexToRemove && item.selectedPassenger === selectedPassengerToRemove);
        if (index !== -1) {
            passengerData.splice(index, 1);
            passenger.patchValue({ SelectedSeats: passengerData });
        }
        const sector = this.seatMapSectors.get(item.key) || [];
        const sectorIndex = this.findIndexBySeatCode(sector,seat.ResultToken);
        //const sectorIndex = sector.indexOf(seat.ResultToken);
        if (sectorIndex !== -1) {
            sector.splice(sectorIndex, 1);
            seat.isSelected = false;
            this.cdRef.detectChanges();
        }
        this.seatMapSectors.set(item.key, sector);
        this.setSeatPrice();
        this.setSelectedPassenger(selectedPassengerToRemove);
        this.moveToNextOption(this.optionRef, this.selectedPassengerIndex);
    }

    setSeatMapSectors(seatMapData){
        const map = new Map<any, any>();
        for (let item of Object.keys(seatMapData)) {
            if (Object.keys(seatMapData[item]).length === 0) {
                break;
            }
            map.set(item, []);
        }
        this.seatMapSectors=map;
    }
    
    public getJSON(): Observable<any> {
        return this.http.get(this._jsonURL);
    }
    
    setSelectedPassenger(ii) {
        const filteredArray = this.passengers.controls.filter((passenger) => {
          const control = passenger as FormGroup;
          return control.controls.travellerType.value !== 'infants';
        });
      
        if (filteredArray[ii]) {
          this.selectedPassengerIndex = ii;
          this.selectedPassenger = filteredArray[ii];
        } else {
          this.setSelectedTab(this.selectedTabIndex + 1);
        }
    }

    onTabSelected(event: NgbTabChangeEvent): void {
      let id=+event.nextId;
       this.setSelectedTab(id);
    }

    setSelectedTab(id){
        this.selectedTabIndex = id;
        this.setSelectedPassenger(0);
        this.cdRef.detectChanges();
        for (const passenger of this.passengers.controls) {
            passenger.patchValue({
                SelectedSelectorId: this.selectedTabIndex
            });
        }
    }

    isSeatSelected(sectorIndex: number,selectedPassenger: number, passenger:any): boolean {
        if(passenger && passenger.controls.SelectedSeats.value!=null){
            return passenger.controls.SelectedSeats.value.some(s => s.sectorIndex === sectorIndex && s.selectedPassenger === selectedPassenger);
        }
      }

     setSeatId(passengers: any[]) {
        passengers.forEach((passenger, i) => {
            passenger.SeatId=[];
            if(this.seatMapSectors){
                // Add null values to passenger.SeatId based on this.seatMapSectors.size
            for (let j = 0; j < this.seatMapSectors.size; j++) {
                passenger.SeatId.push(null);
            }
            if (passenger.SelectedSeats && passenger.SelectedSeats.length > 0) {
                const result = passenger.SelectedSeats.filter((seat) => seat.selectedPassenger === i);
                result.forEach((seat) => {
                    passenger.SeatId[seat.sectorIndex] = seat.ResultToken;
                });
            }
            }
        });
    }

    setDateOfBirth(bookingFlightData: any, key: string, i: number): Date | string {
        if (bookingFlightData && bookingFlightData.hasOwnProperty('SearchData') && bookingFlightData.SearchData[key][i] != null) {
            return new Date(formatDate(new Date(bookingFlightData.SearchData[key][i]), 'DD/MM/YYYY'));
        } else {
            return '';
        }
    }

    setChildDateOfBirth(bookingFlightData: any, i: number): Date | string {
        return this.setDateOfBirth(bookingFlightData, 'childDOB', i);
    }

    setInfantDateOfBirth(bookingFlightData: any, i: number): Date | string {
        return this.setDateOfBirth(bookingFlightData, 'infantDOB', i);
    }

    setNull(passengers) {
        // Assuming passengers is the array containing the passenger objects
        // Check if all passengers' SeatId is null
        const allSeatIdsNull = passengers.every(passenger => {
            return passenger.SeatId.every(seatId => seatId === null);
        });
        // If all SeatId values are null, set them to an empty array
        if (allSeatIdsNull) {
            passengers.forEach(passenger => {
                passenger.SeatId = [];
            });
        }
    }

    setValues(){
        this.flightService.setUserTitleList();
        this.flightService.setJourneyListPre();
        this.flightService.setFlightTraveller();
        this.flightService.setResultToken();
        this.flightService.setIsPanMandatory();
        this.flightService.setIsPassportMandatory();
    }
    
    removeBaggeMeal(){
        this.flightService.baggageFees.next({
            baggageFee: 0
        });
        localStorage.setItem('baggageFee', JSON.stringify(0));
        
        this.flightService.mealFees.next({
            mealFee: 0
        });
        localStorage.setItem('mealFee', JSON.stringify(0));

        this.flightService.seatFees.next({
            seatFee: 0
        });
        localStorage.setItem('seatFee', JSON.stringify(0));
        // this.flightService.promocode.next({
        //     promocode: ''
        // });
        // localStorage.setItem('promocode', JSON.stringify(''));

    }

    //Baggage Selection code
    onBaggageTabSelected(event: NgbTabChangeEvent): void {
        let id = +event.nextId;
        this.setSelectedBaggageTab(id);
    }

    setSelectedBaggageTab(id) {
        this.selectedBaggageTabIndex = id;
        this.setSelectedPassenger(0);
        this.cdRef.detectChanges();
        this.setBaggage(id);
    }

    setBaggage(id) {
        const baggageMapSectors = Array.from(this.baggageMapSectors);
        // Retrieve the selected baggage data based on the new tab's id
        const sector = baggageMapSectors[id] || [];
        // Iterate through the passengers in your FormArray
        this.passengers.controls.forEach((passenger, passengerIndex) => {
            const selectedBaggage = sector[1] || null;
            // Update the passenger's SelectedBaggage field
            passenger.patchValue({
                SelectedBaggage: selectedBaggage,
                SelectedBaggageSector: id,
                SelectedBaggagePassengerIndex: passengerIndex,
                Baggage:''
            });
            this.cdRef.detectChanges();
        });
    }

    setBaggageMapSectors(baggageMapData) {
        const map = new Map<any, any>();
        for (let item of Object.keys(baggageMapData)) {
            if (baggageMapData[item].length == 0) {
                break
            }
            map.set(item, []);
        }
        this.baggageMapSectors = map;
    }

    onBaggageSelection(item: any, selectedSectorIndex: any, selectedBaggageIndex: any, passengerIndex: any, passenger: any) {
        const selectedBaggage = item.value[selectedBaggageIndex];
        this.setSelectedPassenger(passengerIndex);
        const sector = this.baggageMapSectors.get(item.key) || [];
        const key = item.key; // Assuming item.key is a valid string
        // Ensure the sector array has a certain length and fill with empty objects if needed
        while (sector.length <= passengerIndex) {
            sector.push({ [key]: null });
        }
        selectedBaggage.SelectedBaggageSector = selectedSectorIndex;
        selectedBaggage.SelectedBaggagePassengerIndex = passengerIndex;
        // Push baggageCode into the passenger's object with a key
        sector[passengerIndex][item.key] = selectedBaggage;
        // Update the baggageMapSectors
        this.baggageMapSectors.set(item.key, sector);
        this.setBaggagePrice();
        passenger.patchValue({
            SelectedBaggage: sector,
            SelectedBaggageSector: selectedSectorIndex,
            SelectedBaggagePassengerIndex: passengerIndex
        });
    }

    setBaggagePrice() {
        let total = 0;
        for (const baggageSector of this.baggageMapSectors) {
            for (const baggage of Object.values(baggageSector[1])) {
                for (const baggageDetail of Object.values(baggage)) {
                    if (baggageDetail) {
                        total += baggageDetail.Price;
                    }
                }
            }
        }
        this.flightService.baggageFees.next({
            baggageFee: total
        });
        localStorage.setItem('baggageFee', JSON.stringify(total));
    }

    setSeatPrice() {
        let total = 0;
        for (const seatSector of this.seatMapSectors) {
            for (const seat of Object.values(seatSector[1])) {
                if (seat) {
                    const amount = seat['seat_charge'].split(" ")
                    total += (+amount[0]);
                }
            }
        }
        this.flightService.seatFees.next({
            seatFee: total
        });
        localStorage.setItem('seatFee', JSON.stringify(total));
    }

    removeBaggage(item: any, sectorIndexToRemove: any, selectedPassengerToRemove: any, passenger: any) {
        // Get the sector array for the specified item
        const sector = this.baggageMapSectors.get(item.key) || [];
        // Check if the sectorIndexToRemove and selectedPassengerToRemove are within valid bounds
        if (
            sectorIndexToRemove >= 0 &&
            sectorIndexToRemove <=sector.length &&
            selectedPassengerToRemove >= 0 
            //&& selectedPassengerToRemove <= Object.keys(sector[selectedPassengerToRemove]).length
        ) {
            // Remove the baggage value for the specified user and index
            sector[selectedPassengerToRemove][item.key] = null;
            // Update the baggageMapSectors
            this.baggageMapSectors.set(item.key, sector);
            // Update the passenger's SelectedBaggage with the modified sector
            passenger.patchValue({
                SelectedBaggage: sector,
                Baggage:''
            });
            this.setBaggagePrice();
        }
    }

    //Meal Selection code
    onMealTabSelected(event: NgbTabChangeEvent): void {
        let id = +event.nextId;
        this.setSelectedMealTab(id);
    }

    setSelectedMealTab(id) {
        this.selectedMealTabIndex = id;
        this.setSelectedPassenger(0);
        this.cdRef.detectChanges();
        this.setMeal(id);
    }

    setMeal(id) {
        const mealMapSectors = Array.from(this.mealMapSectors);
        // Retrieve the selected baggage data based on the new tab's id
        const sector = mealMapSectors[id] || [];
        // Iterate through the passengers in your FormArray
        this.passengers.controls.forEach((passenger, passengerIndex) => {
            const selectedMeal = sector[1] || null;
            // Update the passenger's SelectedBaggage field
            passenger.patchValue({
                SelectedMeal: selectedMeal,
                SelectedMealSector: id,
                SelectedMealPassengerIndex: passengerIndex,
                Meal:''
            });
            this.cdRef.detectChanges();
        });
    }

    setMealMapSectors(mealMapData) {
        const map = new Map<any, any>();
        for (let item of Object.keys(mealMapData)) {
            if(mealMapData[item].length==0){
                break
            }
            map.set(item, []);
        }
        this.mealMapSectors = map;
    }

    onMealSelection(item: any, selectedSectorIndex: any, selectedMealIndex: any, passengerIndex: any, passenger: any) {
        const selectedMeal = item.value[selectedMealIndex];
        this.setSelectedPassenger(passengerIndex);
        const sector = this.mealMapSectors.get(item.key) || [];
        const key = item.key; // Assuming item.key is a valid string
        // Ensure the sector array has a certain length and fill with empty objects if needed
        while (sector.length <= passengerIndex) {
            sector.push({ [key]: null });
        }
        selectedMeal.SelectedMealSector = selectedSectorIndex;
        selectedMeal.SelectedMealPassengerIndex = passengerIndex;
        // Push baggageCode into the passenger's object with a key
        sector[passengerIndex][item.key] = selectedMeal;
        // Update the baggageMapSectors
        this.mealMapSectors.set(item.key, sector);
        this.setMealPrice();
        passenger.patchValue({
            SelectedMeal: sector,
            SelectedMealSector: selectedSectorIndex,
            SelectedMealPassengerIndex: passengerIndex
        });
    }

    setMealPrice() {
        let total = 0;
        for (const mealSector of this.mealMapSectors) {
            for (const meal of Object.values(mealSector[1])) {
                for (const mealDetail of Object.values(meal)) {
                    if (mealDetail) {
                        total += mealDetail.Price;
                    }
                }
            }
        }

         this.flightService.mealFees.next({
            mealFee: total
        });
        localStorage.setItem('mealFee', JSON.stringify(total));
    }

    removeMeal(item: any, sectorIndexToRemove: any, selectedPassengerToRemove: any, passenger: any) {
        // Get the sector array for the specified item
        const sector = this.mealMapSectors.get(item.key) || [];
        // Check if the sectorIndexToRemove and selectedPassengerToRemove are within valid bounds
        if (
            sectorIndexToRemove >= 0 &&
            sectorIndexToRemove <=sector.length &&
            selectedPassengerToRemove >= 0 
            //&& selectedPassengerToRemove <= Object.keys(sector[selectedPassengerToRemove]).length
        ) {
            // Remove the baggage value for the specified user and index
            sector[selectedPassengerToRemove][item.key] = null;
            // Update the baggageMapSectors
            this.mealMapSectors.set(item.key, sector);
            // Update the passenger's SelectedBaggage with the modified sector
            passenger.patchValue({
                SelectedMeal: sector,
                Meal:''
            });
            this.setMealPrice();
        }
    }

    setBaggageId(passengers: any[]) {
        passengers.forEach((passenger, i) => {
            passenger.BaggageId = [];
            if (this.baggageMapSectors) {
                // Add null values to passenger.SeatId based on this.seatMapSectors.size
                for (let j = 0; j < this.baggageMapSectors.size; j++) {
                    passenger.BaggageId.push(null);
                }
                for (let j = 0; j < this.baggageMapSectors.size; j++) {
                    const sector = Object.values(Array.from(this.baggageMapSectors)[j])[1];
                    if (sector && sector[i]) {
                        //return response && response[0]!=null ? response[0].ResultToken : null;
                        let sectorValues: any;
                        sectorValues = Object.values(sector[i])[0];
                        if (sectorValues) {
                            passenger.BaggageId[j]=sectorValues.ResultToken;
                           // passenger.BaggageId.push(sectorValues.ResultToken);
                        }
                    }
                }
            }
        });
    }

    setMealId(passengers) {
        passengers.forEach((passenger, i) => {
            passenger.MealId = [];
            if (this.mealMapSectors) {
                // Add null values to passenger.SeatId based on this.seatMapSectors.size
                for (let j = 0; j < this.mealMapSectors.size; j++) {
                    passenger.MealId.push(null);
                }
                for (let j = 0; j < this.mealMapSectors.size; j++) {
                    const sector = Object.values(Array.from(this.mealMapSectors)[j])[1];
                    if (sector && sector[i]) {
                        //return response && response[0]!=null ? response[0].ResultToken : null;
                        let sectorValues: any;
                        sectorValues = Object.values(sector[i])[0];
                        if (sectorValues) {
                            passenger.MealId[j]=sectorValues.ResultToken;
                            //passenger.MealId.push(sectorValues.ResultToken);
                        }
                    }
                }
            }
        });
    }

    findIndexBySeatCode(sector, resultToken) {
        for (let i = 0; i < sector.length; i++) {
            if (sector[i].ResultToken === resultToken) {
                return i; // Return the index of the matching object
            }
        }
        return -1; // Return -1 if the object is not found
    }

    setPaxDetails() {
        let titleArray = this.titles.filter(element => (element.id === this.currentUser.title));
        let title = ''
        if (titleArray) {
            title = titleArray[0].title
        }
        let selectedCountry=this.countries.filter(country=>country.id==this.currentUser.country);
        let country='';
         if(selectedCountry){
            country=selectedCountry[0].code;
        }
        this.passengers.controls.forEach(passenger => {
            passenger.patchValue({
                Title: title,
                FirstName: this.currentUser.first_name,
                LastName: this.currentUser.last_name,
                EmployeeBand:this.currentUser.band,
                EmployeeCostCenter:this.currentUser.cost_center,
                Department:this.currentUser.department_name,
                EmployeeId:this.currentUser.business_number,
                Email:this.currentUser.email,
                ContactNo:this.currentUser.phone,
                MobileNo:this.currentUser.phone,
                Nationality:country,
                Gender:this.currentUser.gender.toLowerCase(),
            });
            this.setGenderDateOfBirth(passenger,'adults');
            passenger.get('Title').disable();
            passenger.get('FirstName').disable();
            passenger.get('LastName').disable();
            passenger.get('Nationality').disable();
            passenger.get('Gender').disable();
            passenger.get('PhoneCode').disable();
            passenger.get('ContactNo').disable();
            passenger.get('Email').disable();
        });
        // this.contactForm.controls.contact.patchValue({
        //     phoneNumber:this.currentUser.phone,
        //     email:this.currentUser.email
        // });
        // this.contactForm.controls.contact.get('phoneNumber').disable();
        // this.contactForm.controls.contact.get('email').disable();
    }

    setGenderDateOfBirth(item,type) {
        const title = item.get('Title').value.toLowerCase();
        let gender='';
        switch(title) {
            case 'mr':
            case 'mstr':
                gender = 'male';
                break;
            case 'ms':
            case 'miss':
            case 'mrs':
                gender = 'female';
                break;
            default:
                // Handle other cases or provide a default value for gender
                break;
        }
        if(!this.isPassportMandatory){
            item.patchValue({
                Gender: gender,
            });
            if (type == 'adults') {
                item.patchValue({
                    DateOfBirth: this.minDateAdult,
                });
            }
            if (type == 'childrens') {
                item.patchValue({
                    DateOfBirth: this.minDateChild
                });
            }
            if (type == 'infants') {
                item.patchValue({
                    DateOfBirth: this.minDateInfant
                });
            }
        }
    }

    getDynamicCity(event: any): void {
        let city = `${event.name}`;
        if (city) {
            if (event.inputFor === 'state') {
                this.stateNotSelected = false;
                this.contactForm.get('contact').patchValue({
                    state: city
                })
            }
        }
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
    
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}


@Pipe({
    name: 'formatTime',
  })
  export class FormatTimePipe implements PipeTransform {
    transform(value: number): string {
      const minutes: number = Math.floor(value / 60);
      return (
        ('00' + minutes).slice(-2) +
        ':' +
        ('00' + Math.floor(value - minutes * 60)).slice(-2)
      );
    }
  }
  