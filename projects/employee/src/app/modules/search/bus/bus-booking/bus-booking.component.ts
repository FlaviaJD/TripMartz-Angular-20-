import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiHandlerService } from "projects/employee/src/app/core/api-handlers";
import { SwalService } from "projects/employee/src/app/core/services/swal.service";
import { BusService } from "../bus.service";
import { formatDate } from "projects/employee/src/app/core/services/format-date";
import { UtilityService } from '../../../../core/services/utility.service';

@Component({
  selector: 'app-bus-booking',
  templateUrl: './bus-booking.component.html',
  styleUrls: ['./bus-booking.component.scss']
})
export class BusBookingComponent implements OnInit {
  @ViewChild('employeeList', { static: false }) employeeList: ElementRef;
  @ViewChild('state',{ static: false }) state: ElementRef;
  bookingBusData: any
  contactForm: FormGroup;
  phoneCodes: Array<any> = [];
  terms: boolean = true;
  submitted: boolean = false;
  titles: any = [];
  ageOptions = Array.from({ length: 99 }, (_, i) => i + 1);
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  loading:boolean=false;
  travellerList: any = [];
  selectedTitle: any;
  dropDownCity: any;
    slectededIndex: any;
    currentUser: any;
    respData: any;
    isSelfBooking: boolean;

  constructor(private router: Router,
    private busService: BusService,
    private cdRef: ChangeDetectorRef,
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private util: UtilityService,
    private renderer: Renderer2
    
  ) { }

  ngOnInit(): void {
    // this.renderer.listen('document', 'click', (event: MouseEvent) => {
    //   if (this.employeeList && !this.employeeList.nativeElement.contains(event.target) && !this.state.nativeElement.contains(event.target)) {
    //       this.slectededIndex = -1;
    //       this.cdRef.detectChanges();
    //   }
    // });
    this.currentUser = this.util.getStorage('currentUser');
    this.getPhoneCodeList();
    this.createContactForm();
    let bookingType = localStorage.getItem('bookingType');
    this.isSelfBooking = bookingType === 'Self' ? true : false;
    this.getTitleList();
    this.setBookingBusData();
  }

    getTitleList() {
        this.apiHandlerService.apiHandler('userTitlelist', 'POST')
            .subscribe(res => {
                if (res) {
                    this.titles = res.data;
                    if (this.isSelfBooking) {
                        this.setValue();
                    }
                    this.cdRef.detectChanges();
                }
                else {
                    this.setValue();
                }
            });
    }

    setValue() {
        const contact = this.contactForm.get('Contact') as FormGroup; // Get the Contact FormGroup
        if (contact) {
            contact.patchValue({
                Phone: this.currentUser.phone,
                Mobile: this.currentUser.phone,
                Email: this.currentUser.email,
                CustomerName: this.currentUser.first_name
            });
            contact.get('Phone').disable();
            contact.get('Mobile').disable();
            contact.get('Email').disable();
            this.setPaxDetails();
        }
    }

    findEmployeeId(value: any,item,travellerIndex): void {
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
                this.setEmployee(this.respData,item)
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

    setPaxDetails() {
        let passengers = this.contactForm.get('passengers') as FormArray;
        let titleArray = this.titles.filter(element => element.id === this.currentUser.title);
        let title = titleArray.length > 0 ? titleArray[0].title : '';  // Fallback if not found
        if (passengers.length > 0) {
          const firstPassengerGroup = passengers.at(0) as FormGroup;
          firstPassengerGroup.patchValue({
            Title: title,
            Name: `${this.currentUser.first_name} ${this.currentUser.last_name}`, // Assuming you want a full name
            Gender: this.currentUser.gender || '',  // Fallback if gender is missing
            Age: this.currentUser.age || '',  // Fallback if age is missing
            EmployeeBand: this.currentUser.band,
            EmployeeCostCenter: this.currentUser.cost_center,
            Department: this.currentUser.department_name,
              EmployeeId: this.currentUser.business_number,
              Email: this.currentUser.email,
              ContactNo: this.currentUser.phone,
              Mobile: this.currentUser.phone
          });


     if (title == 'Mstr' || title == 'Miss') {
this.ageOptions = Array.from({ length: 11 }, (_, i) => i + 1);
}
else {
this.ageOptions = Array.from({ length: 88 }, (_, i) => i + 12);
}
            firstPassengerGroup.controls['Title'].disable();
            firstPassengerGroup.controls['Name'].disable();
            firstPassengerGroup.controls['Gender'].disable();
            firstPassengerGroup.controls['Mobile'].disable();
            firstPassengerGroup.controls['Email'].disable();
            firstPassengerGroup.controls['Phone_Code'].disable();
        }
      }
      
    
  getPhoneCodeList() {
    this.apiHandlerService.apiHandler('phoneCodeList', 'POST')
      .subscribe(res => {
        if (res && res.data.length) {
          this.phoneCodes = res.data;
          //this.cdRef.detectChanges();
        }
      });
  }

  setBookingBusData() {
    this.busService.setBookingBusData();
    this.busService.bookingBusData.subscribe(res => {
      if (typeof res == 'object' && res.hasOwnProperty('BusData')) {
        this.bookingBusData = res;
        res.SeatsData.forEach(seatData => this.addPassenger(seatData));
      } else {
        this.router.navigate(['/']);
      }
      this.cdRef.detectChanges();
    });
  }


  createContactForm() {
    this.contactForm = this.fb.group({
      passengers: this.fb.array([]),
      Contact: this.fb.group({
        Phone: ['', [Validators.required]],
        Phone_Code:['91', [Validators.required]],
        Mobile: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(8)]],
        Email: ['', [Validators.required, Validators.email]],
        CustomerName: ['', [Validators.required]]
      })
    });
  }

  onTerms(e) {
    this.terms = e
  }

  hasContactError = (controlName: string, errorName: string, arrayControl?: string) => {
    if (typeof arrayControl !== 'undefined') {
      let formArrayName = this.contactForm.get(arrayControl) as FormArray;
      if (formArrayName && formArrayName != null)
        return ((this.submitted || formArrayName.controls[controlName].touched) && formArrayName.controls[controlName].hasError(errorName));
    }
  }

  hasError = (controlName: string, errorName: string, arrayControl?: string, i?: number) => {
    if (typeof arrayControl !== 'undefined') {
      let formArrayName = this.contactForm.get(arrayControl) as FormArray;
      if (formArrayName && formArrayName != null)
        return ((this.submitted || formArrayName.controls[i]['controls'][controlName].touched) && formArrayName.controls[i]['controls'][controlName].hasError(errorName));
    } else {
      return ((this.submitted || this.contactForm.controls[controlName].touched) && this.contactForm.controls[controlName].hasError(errorName));
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  addPassenger(seat) {
    this.passengers.push(this.createPassenger(seat));
  }

  createPassenger(seat): FormGroup {
    return this.fb.group(
      {
        Title: ['', [Validators.required]],
        Name: ['', [Validators.required]],
        Gender: ['', [Validators.required]],
        Age: ['', [Validators.required]],
        selectedEmployee:new FormControl(''),
        SeatIndex: seat.name,
        ladiesSeat:seat.ladiesSeat,
        PassengerSelection: '',// Used for passenger selection,
         Department:'',
         EmployeeBand:'',
         EmployeeCostCenter:'',
         EmployeeId:'',
         Email:['', [Validators.required,Validators.email]],
         Phone_Code:'91',
         Mobile:''

      }
    );
  }

  get passengers() {
    return this.contactForm.get('passengers') as FormArray;
  }

  onTitleChange(event: Event, item: any): void {
    const selectedTitle = (event.target as HTMLSelectElement).value;
    if (selectedTitle == 'Mr' || selectedTitle == 'Mstr') {
      item.patchValue({
        Gender: 'Male'
      })
    }
    else {
      item.patchValue({
        Gender: 'Female'
      })
    }
    item.controls['Gender'].disable();
    if (selectedTitle == 'Mstr' || selectedTitle == 'Miss') {
      this.ageOptions = Array.from({ length: 11 }, (_, i) => i + 1);
    }
    else {
this.ageOptions = Array.from({ length: 88 }, (_, i) => i + 12);
    }
  }

  onSubmit() {
    this.submitted = true;
    const passengersDetails = (this.contactForm.get('passengers') as FormArray).getRawValue();
    for (const passenger of passengersDetails) {
      const isMaleTitle = passenger.Title === 'Mr' || passenger.Title === 'Mstr';
      if (passenger.ladiesSeat=='true' && isMaleTitle) {
        this.swalService.alert.oops(
          `Seat No ${passenger.SeatIndex} is reserved for ladies`
        );
        return;
      }
    }
    // const contactDetails:any = (this.contactForm.get('Contact') as FormArray).getRawValue();
    this.contactForm.get('Contact.CustomerName').setValue(passengersDetails[0].Name);
    this.contactForm.get('Contact.Email').setValue(passengersDetails[0].Email);
    this.contactForm.get('Contact.Phone').setValue(passengersDetails[0].Mobile);
    this.contactForm.get('Contact.Mobile').setValue(passengersDetails[0].Mobile);
    if (this.contactForm.valid && this.terms) {
      this.loading = true;
      this.createAppReference();
    }
  }
  
  createAppReference() {
    this.apiHandlerService.apiHandler('createAppReference', 'POST', '', '', {
      module: "bus"
    }).subscribe(res => {
      if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
        let appRef = res.data;
        this.addPaxDetails(appRef);
      }
    },
      (err) => {
        this.loading = false;
        this.cdRef.detectChanges();
        this.swalService.alert.oops(err.error.Message);
      });
  }

  addPaxDetails(appRef) {
    const passengersDetails = (this.contactForm.get('passengers') as FormArray).getRawValue();
    const contactDetails:any = (this.contactForm.get('Contact') as FormArray).getRawValue();
    let request = {
        ResultToken: this.bookingBusData.ResultIndex,
        AppReference: appRef,
        booking_source: this.bookingBusData.BusData.booking_source,
        ContactInfo: contactDetails,
        PassengerDetails: passengersDetails,
        UserId: JSON.parse(localStorage.getItem('currentUser'))['id'], 
        BookingSource: 'B2B'
    }
    this.apiHandlerService.apiHandler('busAddPaxDetails', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.loading=false;
        this.busService.addBusBookingPaxDetails.next(response.data);
        this.router.navigate(['/search/bus/bus-payment'], { queryParams: { appReference: response.data.BookingDetails.app_reference,bookingSource:this.bookingBusData.BusData.booking_source } });
      }
    }, (err) => {
      this.loading=false;
      this.cdRef.detectChanges();
      this.swalService.alert.oops(err.error.Message);
    });
  }

  getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  openStaticPage(page_title) {
    localStorage.setItem('static_title', page_title);
    const url = this.router.serializeUrl(
        this.router.createUrlTree(['auth/cms'])
    );
    window.open( url, '_blank');
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


setEmployee(event: any,item): void {
    this.setPassengerTitle(event,item);
     item.patchValue({
         Title:this.selectedTitle,
         Name:event.first_name,
         Email:event.email,
        // Age:event.Age,
         Gender:event.gender,
         Department:event.department_name,
         EmployeeBand:event.position_name,
         EmployeeCostCenter:event.cost_center,
         selectedEmployee:event.first_name,
         EmployeeId:event.business_number,
         Mobile:event.phone
     })
     item.controls['Title'].disable();
     item.controls['Name'].disable();
     item.controls['Gender'].disable();
     item.controls['Email'].disable();
    //  item.controls['Phone_Code'].disable();
     item.controls['Mobile'].disable();

     if (this.selectedTitle == 'Mstr' || this.selectedTitle == 'Miss') {
this.ageOptions = Array.from({ length: 11 }, (_, i) => i + 1);
}
else {
this.ageOptions = Array.from({ length: 88 }, (_, i) => i + 12);
}
 }


   isCurrentInput(t) {
    return this.dropDownCity == t;
}
setCurrentInput(t) {
    this.dropDownCity = t;
}

   setPassengerTitle(event,type) {
    let titleArray = this.titles.filter(element => (element.id === (+event.title)));
    if (titleArray.length == 0) {
        this.selectedTitle = "";
    } else {
        this.selectedTitle =  titleArray[0].title;
    }
}


setDateOfBirth(bookingFlightData: any, key: string, i: number): Date | string {
    if (bookingFlightData && bookingFlightData.hasOwnProperty('SearchData') && bookingFlightData.SearchData[key][i] != null) {
        return new Date(formatDate(new Date(bookingFlightData.SearchData[key][i]), 'DD/MM/YYYY'));
    } else {
        return '';
    }
}

    setDetails(passengerDetails, index) {
        this.contactForm.controls['passengers']['controls'][index].patchValue({
            Title: passengerDetails.title,
            Name: `${passengerDetails.first_name.toUpperCase()} ${passengerDetails.last_name.toUpperCase()}`,
            Gender: passengerDetails.gender,
            Age: this.calculateAge(passengerDetails.date_of_birth) > 0 ? this.calculateAge(passengerDetails.date_of_birth) : null
        });
    }

    calculateAge(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const diffMs = Date.now() - dob.getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

  clearDetails(traveller) {
    traveller.patchValue({
      Title: '',
      Name: '',
      Gender: '',
      Age: '',
      selectedEmployee:'',
      PassengerSelection: '',// Used for passenger selection,
       Department:'',
       EmployeeBand:'',
       EmployeeCostCenter:'',
       EmployeeId:'',
       Email:'',
       Phone_Code:'91',
       Mobile:''
  })

  traveller.controls['Title'].enable();
  traveller.controls['Name'].enable();
  traveller.controls['Gender'].enable();
  traveller.controls['Email'].enable();
 //  item.controls['Phone_Code'].disable();
 traveller.controls['Mobile'].enable();

  }
}




