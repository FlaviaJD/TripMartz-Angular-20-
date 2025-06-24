import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from "@angular/forms";
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { UtilityService } from "projects/supervision/src/app/core/services/utility.service";
import { SubSink } from "subsink";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserManagementService } from "../../user-management.service";
import { GlobalConstants } from "projects/supervision/src/app/core/services/global-constants";

@Component({
  selector: "app-finance-create",
  templateUrl: "./finance-create.component.html",
  styleUrls: ["./finance-create.component.scss"],
})
export class FinanceCreateComponent implements OnInit {
  @Output() b2bUserUpdate = new EventEmitter<any>();
  public financeForm: FormGroup;
  private subSunk = new SubSink();
  public cityList: any;
  public lastKeyupTstamp: number = 0;
  public statesList: Array<any> = [];
  public countriesList: any;
  public userTitleList: any;
  public addOrUpdate: string = "";
  public searchText: string = "";
  public filteredCity: any;
  selectedHotelApiCheckboxes: Array<any> = [];
  selectedModuleCheckboxes: Array<any> = [];
  selectedHotelPricing: Array<any> = [];
flightApiList = [
    { id: 'ZBAPINO000026', name: 'Birdres',isChecked:false},
    { id: 'ZBAPINO00015', name: 'TBO',isChecked:false}
];
moduleList = [
    { id: 'flight', name: 'Flight',isChecked:false},
    { id: 'hotel', name: 'Hotel',isChecked:false},
];
hotelApiList = [
  { id: 'ZBAPINO00014', name: 'TBO',isChecked:false},
];

  selectedApiCheckboxes: Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private router: Router,
    private userManagementService: UserManagementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getTitleList();
    this.getCityList();
    this.createForm();
    this.getCountriesList();
    this.getToUpdate();
  }

  createForm() {
    this.financeForm = this.fb.group({
      business_name: new FormControl("", [Validators.required]),
      // office_email: new FormControl("", [
      //   Validators.required,
      //   Validators.email,
      // ]),
      business_address: new FormControl("", [Validators.required]),
      locality: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      zip_code: new FormControl("", [Validators.required]),
      business_phone: new FormControl("", [Validators.required]),
      xlpro_client_code: new FormControl(""),
      title: new FormControl("", [Validators.required]),
      first_name: new FormControl("", [Validators.required]),
      last_name: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
      position_name: new FormControl("", [Validators.required]),
      department_name: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      // user_rights: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirm_password: new FormControl('',[Validators.required]),
      id: new FormControl(""),
      website: new FormControl("",[]),
      agent_address: new FormControl(""),
      daily_amount: new FormControl(""),
      weekly_amount: new FormControl(""),
      monthly_amount: new FormControl(""),
      product_module: new FormControl(""),
      gst_type: new FormControl(""),
      prefered_gst: new FormControl(""),
      prefered_airline: new FormControl(""),
      airline_name: new FormControl("",[]),
      hotel_pricing: new FormControl("",[]),
      flight_pricing: new FormControl("",[]),
      bio: new FormControl(""),
      module: new FormControl([],[]),
      flight_api: new FormControl([],[]),
    },
    {
      validator: this.matchPassword
    });
  }
  private matchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const confirm_password = AC.get('confirm_password').value;
    if (password != confirm_password) {
      AC.get('confirm_password').setErrors({ matchPassword: true })
    } else {
      AC.get('confirm_password').setErrors(null);
    }
  }
  getToUpdate() {
    this.subSunk.sink = this.userManagementService.b2bUserUpdateData.subscribe(
      (data) => {
        if (!this.utility.isEmpty(data)) {
          this.addOrUpdate = "update";
          this.financeForm.patchValue(
            {
              id: data.id ? data.id : "",
              uuid: data.uuid ? data.uuid : "",
              business_name: data.business_name ? data.business_name : "",
              business_phone: data.business_phone ? data.business_phone : "",
              business_address: data.address ? data.address : "",
              title: data.title ? data.title : "",
              first_name: data.first_name ? data.first_name : "",
              prefered_gst: data.prefered_gst ? data.prefered_gst : '',
              last_name: data.last_name ? data.last_name : "",
              email: data.email ? data.email : "",
              phone_code: data.phone_code ? data.phone_code : "",
              phone: data.phone ? data.phone : "",
              country: data.country ? data.country : "",
              address: data.address ? data.address : "",
              city: data.city ? data.city : "",
              state: data.state ? data.state : "",
              zip_code: data.zip_code ? data.zip_code : "",
              locality:data.locality?data.locality:'',
              position_name:data.position_name?data.position_name:'',
              department_name:data.department_name?data.department_name:'',
              password: "Test@123",
              date_of_birth: data.date_of_birth ? data.date_of_birth : "",
              status: data.status == 1 ? "1" : "0"
            },
            { emitEvent: false }
          );
        } else {
          this.addOrUpdate = "add";
        }
        if(data.flight_api){
           this.selectedApiCheckboxes=data.flight_api.split(',').map(api => api.trim());
               this.flightApiList.forEach(api => {
        if (this.selectedApiCheckboxes.includes(api.id)) {
          api.isChecked = true;
        }
         if (data.hotel_pricing !== '') {
        const hotel = JSON.parse(data.hotel_pricing);  // Parse once and store in a variable
        // Check if hotel is a string and contains a comma, indicating a split is necessary
        if (typeof hotel === 'string' && hotel.includes(',')) {
          this.selectedHotelPricing = hotel.split(',').map(m => m.trim());
        } else {
          this.selectedHotelPricing = hotel;  // If not a comma-separated string, just assign the parsed object
        }
      }
      
          this.selectedApiCheckboxes=data.flight_api.split(',').map(api => api.trim());
      this.selectedModuleCheckboxes=data.module.split(',').map(m => m.trim());
      this.selectedHotelApiCheckboxes=data.hotel_pricing.split(',').map(m => m.trim());
      });
    }

     this.moduleList.forEach(module => {
        if (this.selectedModuleCheckboxes.includes(module.name)) {
            module.isChecked = true;
        }
      });
      this.moduleList.forEach(module => {
        if (this.selectedModuleCheckboxes.includes(module.name)) {
            module.isChecked = true;
        }
      });

      this.flightApiList.forEach(api => {
        if (this.selectedApiCheckboxes.includes(api.id)) {
          api.isChecked = true;
        }
      });
       this.hotelApiList.forEach(api => {
        if (this.selectedHotelPricing.includes(api.id)) {
          api.isChecked = true;
        }
      });

      }
    );
  }

  numberOnly(event): boolean {
    return this.utility.numberOnly(event);
  }

  omitSpecialCharacters(event) {
    return this.utility.omitSpecialCharacters(event);
  }

  getCityList(): void {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("getCity", "post", {}, {}, {})
      .subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.cityList = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err["error"]["Message"]);
        }
      );
  }

  onDropdownOpen() {
    this.searchText = '';
    this.filteredCity = [...this.cityList];
  }

  filteredCities(value) {
    const search = value.target.value.toLowerCase();
    this.filteredCity = this.cityList.filter(city =>
  city.city_name.toLowerCase().includes(search)
    );
    this.cdr.detectChanges();
  }
  getAutoCompleteState(event, type) {
    let inpValue = event.target.value;
    if (inpValue.length > 0 && event.timeStamp - this.lastKeyupTstamp > 10) {
      this.subSunk.sink = this.apiHandlerService
        .apiHandler(
          "hotelStates",
          "post",
          {},
          {},
          {
            state_name: `${inpValue}`,
          }
        )
        .subscribe(
          (resp) => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
              this.statesList = resp.data || [];
            } else {
            }
          },
          (err) => {}
        );
      this.lastKeyupTstamp = event.timeStamp;
    }
  }

  onStateSelect(state: any) {
    this.financeForm.patchValue({ state: state.name });
    this.statesList = [];
  }

  getCountriesList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("countryList", "post", "", "")
      .subscribe((res) => {
        this.countriesList = res.data.popular_countries.concat(
          res.data.countries
        );
      });
  }

  getTitleList() {
    this.subSunk.sink = this.userManagementService.fetchTitleList().subscribe(
      (resp) => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.userTitleList = resp.data.length
            ? resp.data
            : this.userManagementService.isDevelopement;
        } else {
          this.swalService.alert.oops();
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
        this.swalService.alert.oops();
      }
    );
  }

  onSubmit() {
    if (this.financeForm.invalid) {
      return;
    }
    let req = JSON.parse(JSON.stringify(this.financeForm.value));
    req["title"] = parseInt(req["title"]);
    req["auth_role_id"] = GlobalConstants.FINANCE_AUTH_ROLE_ID;
    req['flight_api'] = this.selectedApiCheckboxes;
    req['module'] = this.selectedModuleCheckboxes;
    req['hotel_pricing'] = typeof this.selectedHotelPricing =='string'?this.selectedHotelPricing:JSON.stringify(this.selectedHotelPricing);  
    switch (this.addOrUpdate) {
      case "add":
        delete req.uuid;
        delete req.id;
        delete req.confirm_password;
        this.subSunk.sink = this.userManagementService.addUsers(req).subscribe(
          (resp) => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success("Finance added successfully.");
              this.financeForm.reset();
              this.b2bUserUpdate.emit({ tabId: "finance_list" });
            } else {
              this.swalService.alert.oops("Unable to create user.");
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.oops(err.error.Message);
          }
        );
        break;
      case "update":
        if (req.password == "1234" && req.confirm_password == "1234") {
          delete req.password;
        }
        this.subSunk.sink = this.userManagementService
          .updateUsers(req)
          .subscribe(
            (resp) => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                resp.password = "1234";
                this.swalService.alert.success("Finance updated successfully.");
                this.financeForm.reset();
                this.b2bUserUpdate.emit({ tabId: "finance_list" });
              } else {
                this.swalService.alert.oops("Unable to update finance.");
              }
            },
            (err: HttpErrorResponse) => {
              this.swalService.alert.oops(err.error.Message);
            }
          );
        break;
      default:
        break;
    }
  }
onApiCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
        if (this.selectedApiCheckboxes.length === 0 || !this.selectedApiCheckboxes.includes(inclusion)) {
            this.selectedApiCheckboxes.push(inclusion);
        }
        if (inclusion === 'ZBAPINO00020' && this.selectedApiCheckboxes.filter(item => item === inclusion).length < 2) {
            this.selectedApiCheckboxes.push(inclusion);
        }
    } else {
        const index = this.selectedApiCheckboxes.indexOf(inclusion);
        if (index >= 0) {
            this.selectedApiCheckboxes.splice(index, 1);
        }
    }
  }

  onReset() {
    this.userManagementService.b2bUserUpdateData.next({});
    this.financeForm.reset();
    this.addOrUpdate = "add";
  }

  onModuleCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
      this.selectedModuleCheckboxes.push(inclusion);
    } else {
      const index = this.selectedModuleCheckboxes.indexOf(inclusion);
      if (index >= 0) {
        this.selectedModuleCheckboxes.splice(index, 1);
      }
    }
  }

   onHotelApiCheckBoxChange(checked:Boolean,inclusion:String) {
    if (checked) {
        if (this.selectedHotelPricing.length === 0 || !this.selectedHotelPricing.includes(inclusion)) {
            this.selectedHotelPricing.push(inclusion);
        }
    } else {
        const index = this.selectedHotelPricing.indexOf(inclusion);
        if (index >= 0) {
            this.selectedHotelPricing.splice(index, 1);
        }
    }
  }
}
