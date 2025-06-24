import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/employee/src/app/core/api-handlers';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { shareReplay } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { untilDestroyed } from '../../../core/services';
import { CarService } from './car.service';

@Component({
    selector: 'app-car',
    templateUrl: './car.component.html',
    styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {

    regConfig: FormGroup;
    travellerForm: FormGroup;
    travellersFadeinn = false;
    travellerCountError = false;
    infantError = false;
    maxDateChild: any;
    minDateChild: any;
    maxDateInfant: any;
    minDateInfant: any;
    isOpen: boolean;
    age: number;
    address: any;
    fadeinn = false;
    searchedList: Array<any> = [];
    minPickUpDate = new Date();
    minDropDate= new Date();
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    vechicle: boolean;
    loading:boolean=false;
    showPolicyRemark:boolean=false;
    pickDropAddress: Array<any> = [];
    vechileType: Array<any> = ['Sedan','SUV'];
    policyRemark='';
    policyCabType;
    policyCabList;
    times: string[] = [
        '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
        '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
        '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
        '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
        '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
        '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
    ];
    isCorporateSelected:boolean=false;
    loggedInUser;
    constructor(private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService,
        private router:Router,
        private appService:AppService,
        private carService:CarService

    ) { }

    ngOnInit() {
        this.createForm();
        this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loggedInUser && this.loggedInUser.auth_role_id == 2 ? this.checkPolicy() : null;
        this.appService.isCorporateSelected.subscribe(data=>{
            this.loggedInUser.auth_role_id==3?this.isCorporateSelected=data:this.isCorporateSelected=true;
        })
    }

    createForm(): void {
        this.regConfig = this.fb.group({
            departureCity: ['', [Validators.required]],
            pickupAddress: ['', [Validators.required]],
            dropAddress: ['', [Validators.required]],
            pickupDate: ['', [Validators.required]],
            pickupTime: ['', [Validators.required]],
            pickDropDate: ['', [Validators.required]],
            dropTime: ['', [Validators.required]],
            noOfPassenger: ['', [Validators.required]],
            vechicleType: ['Sedan', [Validators.required]],
            instruction: [],
            DutyType:['Outstation', [Validators.required]],
            policyRemark:['']
        });
    }

    onPickUpChange(event: Event) {
        this.regConfig.patchValue({
            pickupTime: event
        })
    }

    onDropUpChange(event: Event) {
        this.regConfig.patchValue({
            dropTime: event
        })
    }

    setCurrentInput(input: string) {
        this.address = input
    }

    getCurrentInput(input) {
        return input === this.address;
    }

    onVechileSelectChange(selectedVechile: string) {
        this.regConfig.patchValue({
            vechicleType: selectedVechile
        })
        this.loggedInUser && this.loggedInUser.auth_role_id == 2 ? this.checkPolicy() : null;
        this.vechicle = false;
    }

    checkPolicy() {
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        if (policyList && policyList.length > 0) {
            this.policyCabType=policyList[0].cabType;
            this.policyCabList = policyList[0].cabType.split(',').map(c => c.trim());
            let selectedCab = this.regConfig.get('vechicleType').value;
            this.policyCabList.includes(selectedCab) == false ? this.showPolicyRemark = true : this.showPolicyRemark = false;
        }
        
    }

    closeVechicleType() {
        this.vechicle = false;
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    onSubmit() {
        if (!(this.regConfig.valid)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (this.loggedInUser.auth_role_id == 2) {
            const selectedTripId = localStorage.getItem('selectedTripId');
            if (!selectedTripId) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.carService.enableBooking.next(false);
                return;
            }
        }
        let request = this.generatePayload();
        this.onCreate(request);
    }

    generatePayload() {
        const currentUser=(JSON.parse(localStorage.getItem('currentUser')));
        const created_by_id =currentUser['id'];
        let formValues = this.regConfig.value;
        let cabPolicy;
        if(currentUser && currentUser.auth_role_id==2){
            let carEligibilityCheck=this.showPolicyRemark? "Beyond Cab Eligibility":"Within Cab Eligibility";
            cabPolicy = {
                PolicyType: 'VechicleType',
                Eligible: this.policyCabType,
                EligibilityCheck:carEligibilityCheck,
                Selected: this.regConfig.get('vechicleType').value,
                Remark: this.regConfig.get('policyRemark').value
            };
        }
        else{
            cabPolicy=[];
        }

        let request = {
            "NoOfPasseneger": formValues.noOfPassenger,
            // "SelectReason": "SICK",
            "CarDetails": {
                "City": formValues.departureCity,
                "PickupAddress": formValues.pickupAddress,
                "DropAddress": formValues.dropAddress,
                "PickupDate": moment(formValues.pickupDate).format("YYYY-MM-DD"),
                "PickupTime": formValues.pickupTime,
                "DropDate":  moment(formValues.pickDropDate).format("YYYY-MM-DD"),
                "DropTime": formValues.dropTime,
                "VechicalType": formValues.vechicleType,
                "SpecialInstructionIfany": formValues.instruction,
                "DutyType": formValues.DutyType
            },
            "CorporateID": +(localStorage.getItem('selectedCorporateId')),
            "Purpose": localStorage.getItem('selectedPurpose'),
            "BookingType": localStorage.getItem('bookingType'),
            "TrainingId": localStorage.getItem('selectedTrainingId'),
            "TrainingName": localStorage.getItem('selectedTrainingName'),
            "TripId": localStorage.getItem('selectedTripId'),
            "TripName":localStorage.getItem('selectedTripName'),
            "UserType": "Employee",
            "UserId":created_by_id,
            "PolicyDetails":cabPolicy
        };
        return request;
    }

    onCreate(request) {
        this.loading = true;
        this.apiHandlerService.apiHandler('carCreate', 'POST', '', '', request).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.createForm();
                this.swalService.alert.success(res.Message);
                this.router.navigate(['/reports/car-booking-details']);               }
            else {
                this.loading = false;
                this.swalService.alert.oops(res.Message);
            }
        }, (err) => {
                this.loading = false;
                this.swalService.alert.oops(err.error.Message);
        });
    }

    onCheckIn(event) {
        if (event) {
            const eventDate = new Date(event);
            eventDate.setDate(eventDate.getDate() + 1);
            this.regConfig.patchValue({
                pickDropDate: ''
            });
            // this.checkoutDate.nativeElement.click();
            this.minDropDate = eventDate;
        }
    }

    getSearchedList(event: any): void {
        if (event && event.target.value) {
            const city_name = `${event.target.value}`;
            this.apiHandlerService.apiHandler('autoCompleteCrs', 'POST', '', '', { city_name })
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
        let cityName = `${event.cityName} (${event.countryCode})`;
        if (cityName) {
            this.regConfig.patchValue({ departureCity: cityName });
            this.searchedList.length = 0;
        }
    }
    ngOnDestroy() {

    }
}
