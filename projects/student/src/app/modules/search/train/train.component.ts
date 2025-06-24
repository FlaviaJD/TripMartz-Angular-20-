import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/student/src/app/core/services';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { ThemeOptions } from 'projects/student/src/app/theme-options';
import { shareReplay } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { UtilityService } from '../../../core/services/utility.service';
import { TrainService } from './train.service';

@Component({
    selector: 'app-train',
    templateUrl: './train.component.html',
    styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {
    @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
    @ViewChild('destinationCity', { static: false }) destinationCity: ElementRef<HTMLElement>;
    @ViewChild('onwardDate', { static: false }) onwardDate: ElementRef<HTMLElement>;
    departureCityError:boolean=false;
    destinationCityError:boolean=false;
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
    minDateArr = Array(5).fill(new Date());
    maxDate;
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

    showDiv = {
        newbook : true,
        extendbook : false,
      }
    respData: any[];
    cdRef: any;
    currentUser: any;
    slectededIndex: any;
    selectedTitle: any;
    titles: any;
    newFormGroup: FormGroup;
    isSelfBooking:boolean=false;
    isCorporateSelected:boolean=false;
    constructor(private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private http:HttpClient,
        private globals: ThemeOptions,
        private router:Router,
        private util: UtilityService,
        private trainService:TrainService,
        private appService:AppService
    ) { }

    ngOnInit() {
        this.currentUser = this.util.getStorage('studentCurrentUser');
        this.appService.isCorporateSelected.subscribe(data=>{
            this.currentUser.auth_role_id==3?this.isCorporateSelected=data:this.isCorporateSelected=true;
        })
        this.hideOther = this.globals.hideOther;
        this.createForm();
        this.trainService.bookingType.subscribe(data => {
            if(data=='Self' && this.currentUser.auth_role_id==2){
                this.isSelfBooking=true;
                this.setPaxDetails();
            }else if(data=='Behalf' && this.currentUser.auth_role_id==2){
                this.isSelfBooking=false;
                this.removeControl();
                this.resetPaxDetails();
                this.addFormToFormArray();
            }
            else{
                this.removeControl();
                this.isSelfBooking=false;
                this.addFormToFormArray();
                this.resetPaxDetails();
            }                
        });
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

    removeControl(){
        while (this.formArray.length !== 0) {
            this.formArray.removeAt(0);
        }
    }
    createForm(): void {
        this.regConfig = this.fb.group({
            emailId: ['', [Validators.required, Validators.email]],
            department: ['', [Validators.required]],
            reason: ['', [Validators.required]],
            remarks: ['', [Validators.required]],
            paxDetails: this.fb.array([]),
            departureCity: ['', [Validators.required]],
            destinationCity: ['', [Validators.required]],
            onwardDate: ['', [Validators.required]],
            onwardTime: ['',[Validators.required]],
            // arrivalDate: ['', [Validators.required]],
            // arrivalTimeTrain: ['',[Validators.required]],
            preferredClass: ['Sleeper'],
            iciciRequestId: [''],
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
            Age: ['', [Validators.required]],
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
    
    
    setEmployee(event: any,formGroup,value?,flag?): void {
        let gender;
        if(this.currentUser.auth_role_id == 8){
            gender=event.gender=='Male'?'Male':'Female'
        }

        formGroup.patchValue({
             FirstName:event.first_name,
             LastName:event.last_name,
             MobileNo:this.currentUser.auth_role_id == 8 ? event.phone_number : event.phone,
             EmailId:event.email,
             Age:event.Age,
             Department:this.currentUser.auth_role_id == 8 ?'':event.department_name,
             EmployeeBand: this.currentUser.auth_role_id == 8 ?'':event.position_name, 
             EmployeeCostCenter:this.currentUser.auth_role_id == 8 ?'': event.cost_center, 
             selectedEmployee:flag?value:event.first_name,
             Gender:this.currentUser.auth_role_id == 8 ? gender:'',
             EmployeeId:this.currentUser.auth_role_id == 8 ?'':event.business_number,
         })
     }

     isCurrentInput(t) {
        return this.dropDownCity == t;
    }
    setCurrentInput(t) {
        this.dropDownCity = t;
    }
    
    bookingRequest(bookingRequest) {
        this.regConfig.patchValue({
            emailId: bookingRequest.Email,
            department: bookingRequest.Department,
            iciciRequestId:bookingRequest.app_reference
        });
        this.regConfig.get('emailId').disable();
        this.regConfig.get('department').disable();
        this.removeControl();
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
                //EmployeeId: [groupTraveller[employeeKey]],
                FirstName: [groupTraveller[firstNameKey], [Validators.required]],
                LastName: [groupTraveller[lastNameKey], [Validators.required]],
                MobileNo: [groupTraveller[mobileKey], [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
                EmailId: [groupTraveller[emailKey], [Validators.required, Validators.email]],
                Age: ['', [Validators.required]],
                Gender: ['', [Validators.required]],
                selectedEmployee:new FormControl(''),
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
            Age: ['', [Validators.required]],
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


    getSearchedList(event: any,controlName:string): void {
        if (controlName === 'departureCity' || controlName === 'destinationCity') {
            this[`${controlName}Error`] = true;
        }
        if (event && event.target.value) {
            const station_name = `${event.target.value}`.trim();
            if (station_name && station_name.length >= 3) {
                this.apiHandlerService.apiHandler('trainCity', 'POST', '', '', { station_name })
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

    getDynamicCity(event: any): void {
        let city = `${event.stationName}(${event.stationCode})`;
        if (city) {
            if (event.inputFor === 'departureCity') {
                this.departureCityError=false;
                this.regConfig.get('departureCity').patchValue(city)
            } else {
                this.destinationCityError=false;
                this.onwardDate.nativeElement.click();
                this.regConfig.get('destinationCity').patchValue(city)
            }
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

    closePrefferedClass() {
        this.prefClass = false;
    }

    onPrefferedClassChange(inputClass: string) {
        this.regConfig.patchValue({
            preferredClass: inputClass
        });
        this.prefClass = false;
    }

    onChange(event: Event) {
        this.regConfig.patchValue({
            onwardTime: event
        })
    }

    onChangeTime(event: Event) {
        this.regConfig.patchValue({
            arrivalTimeTrain: event
        })
    }

    onDepart(event: Event) {

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
        if(this.destinationCityError || this.departureCityError){
            window.scrollTo({top: 0, behavior: 'smooth'});
            return;
        }
        if (this.currentUser.created_by_id != 243 && this.currentUser.created_by_id == 2) {
            const selectedTripId = localStorage.getItem('selectedTripId');
            if (!selectedTripId) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.trainService.enableBooking.next(false);
                return;
            }
        }
        let request = this.generatePayload();
        this.onCreate(request);
    }

    generatePayload() {
        const created_by_id =(JSON.parse(localStorage.getItem('studentCurrentUser')))['id'];
        let bookingType = (this.bookingRequestData && this.bookingRequestData.BookingType) ? this.bookingRequestData.BookingType : "";
        bookingType=(bookingType=='')? localStorage.getItem('bookingType'):bookingType;
        let formValues = this.regConfig.getRawValue();
        formValues.reason = (formValues.reason === "Others") ? formValues.otherReason : formValues.reason;
        let request = {
            "PersonalDetails": {
                "EmailId": formValues.emailId,
                "Department": formValues.department,
                "Reason": formValues.reason,
                "Remarks": formValues.remarks,
                
            },
            "PaxDetails": formValues.paxDetails,
            "TrainDetails": {
                "From": formValues.departureCity,
                "To": formValues.destinationCity,
                "OnwardDate": moment(formValues.onwardDate).format("YYYY-MM-DD"),
                "OnwardTime": formValues.onwardTime,
                // "ArrivalDate": moment(formValues.arrivalDate).format("YYYY-MM-DD"),
                // "ArrivalTimeTrain": formValues.arrivalTimeTrain,
                "BookingType": bookingType,
                "Gender": formValues.gender,
                "Age": formValues.age,
                "PreferredClass": formValues.preferredClass,
                "Remarks": formValues.remark
            },
            "IciciRequestId":formValues.iciciRequestId,
            "BookingRequestType":formValues.bookingRequestType,
            "BookingRequestId":formValues.bookingRequestId,
            "UserType":"Employee",
            "UserId":created_by_id,
            "CorporateID": +(localStorage.getItem('selectedCorporateId')),
            "Purpose": localStorage.getItem('selectedPurpose'),
            "BookingType": localStorage.getItem('bookingType'),
            "TrainingId": localStorage.getItem('selectedTrainingId'),
            "TrainingName": localStorage.getItem('selectedTrainingName'),
            "TripId": localStorage.getItem('selectedTripId'),
            "TripName":localStorage.getItem('selectedTripName'),
            
        };
        return request;
    }

    onCreate(request) {
        this.loading = true;
        this.apiHandlerService.apiHandler('trainCreate', 'POST', '', '', request).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.createForm();
                this.swalService.alert.success(res.Message);
                this.router.navigate(['/reports/train-booking-details']);            }
            else {
                this.loading = false;
                this.swalService.alert.oops(res.Message);
            }
        }, (err) => {
            if (err && err.error && err.error.Message) {
                this.loading = false;
                this.swalService.alert.oops(err.error.Message);
            }
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

    findEmployeeId(value: any,travellerIndex,formGroup): void {
        this.slectededIndex=travellerIndex
        const query = `${value}`.trim();
        let corporate_id=localStorage.getItem('selectedCorporateId');
        this.apiHandlerService.apiHandler("findEmployeeId", "POST",{},{},{
            "employeeId":query
        }).subscribe((res) => {
            if (res && res.statusCode==201) {
                this.respData = res.data;
                this.setEmployee(this.respData,formGroup,value,true)
            }
            else{
                this.respData = [];
                this.cdRef.detectChanges();
            }
        });
    }
    
    ngOnDestroy(): void {
    }

    setPaxDetails() {
        this.removeControl();
        const newFormGroup = this.fb.group({
            FirstName: [this.currentUser.first_name, [Validators.required]],
            LastName: [this.currentUser.last_name, [Validators.required]],
            MobileNo: [this.currentUser.phone, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
            EmailId: [this.currentUser.email, [Validators.required, Validators.email]],
            Age: ['', [Validators.required]],
            Gender: [this.currentUser.gender, [Validators.required]],
            Department: [this.currentUser.department_name, [Validators.required]],
            Reason: [''],
            EmployeeId:[this.currentUser.business_number],
            EmployeeBand:[this.currentUser.band, [Validators.required]],
            EmployeeCostCenter:[this.currentUser.cost_center]
        });
        this.formArray.push(newFormGroup);
        this.desablePaxDetails(newFormGroup)
        this.regConfig.patchValue({
            emailId:this.currentUser.email,
            department:this.currentUser.department_name
        });
        this.regConfig.get('emailId').disable();
        this.regConfig.get('department').disable();
    }

    resetPaxDetails(){
        this.regConfig.patchValue({
            emailId:'',
            department:''
        });
        this.regConfig.get('emailId').enable();
        this.regConfig.get('department').enable();
    }

    clearDetails(control) {
        control.patchValue({
            FirstName:'',
            LastName:'',
            MobileNo:'',
            EmailId:'',
            Age:'',
            Department:'',
            EmployeeBand:'',
            EmployeeCostCenter:'',
            selectedEmployee:'',
            EmployeeId:''
        })
    }

}

