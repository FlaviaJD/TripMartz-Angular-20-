import { Component, OnDestroy, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../../user-management.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { AppService } from 'projects/supervision/src/app/app.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-manage-active-create-agent',
  templateUrl: './manage-active-create-agent.component.html',
  styleUrls: ['./manage-active-create-agent.component.scss']
})
export class ManageActiveCreateAgentComponent implements OnInit, OnDestroy {
    @Output() b2bUserUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    subagentId;
    userTitleList: Array<any> = [];
    userTypeList: Array<any> = [];
    phoneCodeList: Array<any> = [];
    regConfig: FormGroup;
    isOpen = false as boolean;
    addOrUpdate: string = '';
    countriesList = [];
    countryCode: string;
    lastKeyupTstamp: number = 0;
    statesList: Array<any> = [];
    selectedModuleCheckboxes: Array<any> = [];
    selectedApiCheckboxes: Array<any> = [];
    selectedHotelApiCheckboxes: Array<any> = [];
    selectedPaymentMode: Array<any> = [];
    selectedFlightPricing: Array<any> = [];
    selectedHotelPricing: Array<any> = [];
    flightPricing: Array<any> = [];
    dropdownSettings:IDropdownSettings;
    airlineDropdownList = [];
    selectedAirlineList = [];
    moduleList = [
      { id: 'flight', name: 'Flight',isChecked:false},
      { id: 'hotel', name: 'Hotel',isChecked:false},
      // { id: 'bus', name: 'Bus',isChecked:false}
  ];
  
  priceList = [
    { id: 'retail', name: 'Retail',isChecked:false},
    { id: 'corporate', name: 'Corporate',isChecked:false},
    { id: 'sme_are', name: 'SME Fare',isChecked:false},
    { id: 'all', name: 'All',isChecked:false}
  ];
  
  flightApiList = [
      { id: 'ZBAPINO00002', name: 'Travelport',isChecked:false},
      { id: 'ZBAPINO00015', name: 'TBO',isChecked:false}
  ];
  
  hotelApiList = [
    { id: 'ZBAPINO00014', name: 'TBO',isChecked:false},
    // { id: 'ZBAPINO00024', name: 'Travclan',isChecked:false}
  ];
  paymentMode = [
    { id: 'deposite', name: 'Deposite',isChecked:false},
    { id: 'credit', name: 'Credit',isChecked:false},
    { id: 'payment_gateway', name: 'Payment Gateway',isChecked:false}
  ];
    cityList: any;
    constructor(
      private router: Router,
      private userManagementService: UserManagementService,
      private swalService: SwalService,
      private fb: FormBuilder,
      private utility: UtilityService,
      private apiHandlerService: ApiHandlerService,
      private appService: AppService,
      private formBuilder: FormBuilder
    ) {
      this.countryCode = this.appService.countryId;
    }
  
    ngOnInit() {
      this.getTitleList();
      this.getTypeList();
      this.getCityList();
      this.createForm();
      this.getAutoCompleteAirline()
      this.getPhoneCodeList();
      this.getCountriesList();
      this.getStateList()
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'code',
          textField: 'name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 10,
          allowSearchFilter: true
        };
    }
  
    onItemSelect(item: any) {
      this.selectedAirlineList.push(item.name)
    }
    onSelectAll(items: any) {
      this.selectedAirlineList=this.airlineDropdownList;
    }
  
    onItemDeSelect(item:any){
      this.selectedAirlineList = this.selectedAirlineList.filter(airline => airline!== item);
    }
  
    getAutoCompleteAirline() {
      this.subSunk.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'post', {}, {}, {
              text: ''
          }).subscribe(resp => {
              if (resp.statusCode == 201 || resp.statusCode == 200) {
                  this.airlineDropdownList=resp.data
                  this.getToUpdate();
              } 
          },err => { 
              this.getToUpdate();
              this.swalService.alert.error(err['error']['Message'])
          });
      }
  
      getCityList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getCity', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.cityList=res.data;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }
  
    getCountriesList() {
      this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
        this.countriesList = res.data.popular_countries.concat(res.data.countries);
      });
    }
  
    getStateList() {
      this.subSunk.sink = this.apiHandlerService.apiHandler('stateList', 'post', '', '').subscribe(res => {
        this.countriesList = res.data.popular_countries.concat(res.data.countries);
      });
    }
  
    getTitleList() {
      this.subSunk.sink = this.userManagementService.fetchTitleList()
        .subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.userTitleList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;
  
          } else {
            this.swalService.alert.oops();
          }
        }, (err: HttpErrorResponse) => {
          console.error(err);
          this.swalService.alert.oops();
        })
    }
  
    getTypeList() {
      this.subSunk.sink = this.userManagementService.getUserTypeList()
        .subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.userTypeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;
  
          } else {
            this.swalService.alert.oops();
          }
        }, (err: HttpErrorResponse) => {
          this.swalService.alert.oops();
        })
    }
  
    createForm() {
      this.regConfig = this.fb.group({
        business_name: new FormControl('', [Validators.required]),
        business_address: new FormControl('', [Validators.required]),
        website: new FormControl(''),
        business_phone: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zip_code: new FormControl('', [Validators.required]),
        xlpro_client_code: new FormControl(''),
        title: new FormControl('', [Validators.required]),
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
      //   countrycode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        agent_address: new FormControl('', [Validators.required]),
        daily_amount: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        weekly_amount: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        monthly_amount: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        status: new FormControl('', [Validators.required]),  
        product_module: new FormControl('', [Validators.required]),
      //   module: new FormControl('', [Validators.required]),
        gst_type: new FormControl(''),
      //   corp_list: new FormControl('', [Validators.required]),
        prefered_gst: new FormControl('', [Validators.required]),
        prefered_airline: new FormControl(''),
      //   prefered_airline: new FormControl('', [Validators.required]),
        airline_name: new FormControl(''),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        password: new FormControl('',[Validators.required]),
        confirm_password: new FormControl('',[Validators.required]),
        id: new FormControl(''),
        uuid: new FormControl(''),
        hotel_pricing:new FormControl(''),
        flight_pricing:new FormControl(''),
        bio: new FormControl('Yes'),
        auth_role_id: new FormControl(GlobalConstants.B2B_AUTH_ROLE_ID, [Validators.required]),
      },
        {
          validator: this.matchPassword
        });
    }
  
    private matchPassword(AC: AbstractControl) {
      const password = AC.get('password').value
      const confirm_password = AC.get('confirm_password').value
      if (password != confirm_password) {
        AC.get('confirm_password').setErrors({ matchPassword: true })
      } else {
        AC.get('confirm_password').setErrors(null);
      }
    }
  
    getToUpdate() {
      this.subSunk.sink = this.userManagementService.b2bUserUpdateData.subscribe(data => {
        if (!this.utility.isEmpty(data)) 
        {
          // let airline_name=(data.airline_name.split(', ').map(api => api.trim()));
         // this.selectedAirlineList = this.airlineDropdownList.filter(item => airline_name.includes(item.name));
          this.addOrUpdate = 'update';
          this.regConfig.patchValue({
          id: data.id ? data.id : '',
          uuid: data.uuid ? data.uuid : '',
          business_name: data.business_name ? data.business_name : '',
          business_phone: data.business_phone ? data.business_phone : '',
          business_address:data.address ? data.address : '',
          website:data.website ? data.website : '',
          bio:data.bio?data.bio:'',
          xlpro_client_code:data.xlpro_client_code ? data.xlpro_client_code : '',
          iata: data.iata ? data.iata : '',
          title: data.title ? data.title : '',
          first_name: data.first_name ? data.first_name : '',
          middle_name: data.middle_name ? data.middle_name : '',
          last_name: data.last_name ? data.last_name : '',
          email: data.email ? data.email : '',
          phone_code: data.phone_code ? data.phone_code : '',
          phone: data.phone ? data.phone : '',
          country: data.country ? data.country : '',
          address: data.address ? data.address : '',
          agent_address: data.address2 ? data.address2 : '',
          daily_amount: data.daily_amount ? data.daily_amount : '',
          weekly_amount: data.weekly_amount ? data.weekly_amount : '',
          monthly_amount: data.monthly_amount ? data.monthly_amount : '',
          product_module: data.product_module ? data.product_module : '',
          gst_type: data.gst_type ? data.gst_type : '',
          prefered_gst: data.prefered_gst ? data.prefered_gst : '',
          prefered_airline: data.prefered_airline ? data.prefered_airline : '',
          // airline_name: data.airline_name ? data.airline_name : '',
          //hotel_pricing: data.hotel_pricing ? data.hotel_pricing : '',
          flight_pricing: data.flight_pricing ? data.flight_pricing : '',
          city: data.city ? data.city : '',
          state: data.state ? data.state : '',
          zip_code: data.zip_code ? data.zip_code : '',
          password:'Test@123',
          confirm_password: 'Test@123',
          date_of_birth: data.date_of_birth ? data.date_of_birth : '',
          status: data.status == 1 ? '1' : '0',
          }, { emitEvent: false })
        } else {
          this.addOrUpdate = 'add';
        }
        this.selectedApiCheckboxes=data.flight_api.split(',').map(api => api.trim());
        this.selectedModuleCheckboxes=data.module.split(',').map(m => m.trim());
        this.selectedHotelApiCheckboxes=data.hotel_pricing.split(',').map(m => m.trim());
        let paymentMode=JSON.parse(data.website);
        if(paymentMode.includes(',')){
          this.selectedPaymentMode=JSON.parse(data.website).split(',').map(m => m.trim());
        }
        else{
          this.selectedPaymentMode=paymentMode;
        }
        let pricing=JSON.parse(data.flight_pricing);
        if(pricing.includes(',')){
          this.selectedFlightPricing=JSON.parse(data.flight_pricing).split(',').map(m => m.trim());
        }
        else{
          this.selectedFlightPricing=pricing;
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
        this.paymentMode.forEach(api => {
          if (this.selectedPaymentMode.includes(api.id)) {
            api.isChecked = true;
          }
        });
        this.priceList.forEach(api => {
          if (this.selectedFlightPricing.includes(api.name)) {
            api.isChecked = true;
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
      })
    }
  
    getPhoneCodeList() {
      this.subSunk.sink = this.userManagementService.fetchPhoneCodeList()
        .subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.phoneCodeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;
  
          } else {
            this.swalService.alert.oops();
          }
        }, (err: HttpErrorResponse) => {
          console.error(err);
          this.swalService.alert.oops();
        })
    }
  
    onSubmit() {
      if (this.regConfig.invalid) {
        return;
      }
      let req = JSON.parse(JSON.stringify(this.regConfig.value));
      req['title'] = parseInt(req['title']);
      req['auth_role_id'] =GlobalConstants.AGENT_AUTH_ROLE_ID;
      req['module'] = this.selectedModuleCheckboxes;
      req['flight_pricing'] = typeof this.selectedFlightPricing =='string'?this.selectedFlightPricing:JSON.stringify(this.selectedFlightPricing);  
      req['flight_api'] = this.selectedApiCheckboxes;
      req['hotel_pricing'] = typeof this.selectedHotelPricing =='string'?this.selectedHotelPricing:JSON.stringify(this.selectedHotelPricing);  
      req['website'] = typeof this.selectedPaymentMode =='string'?this.selectedPaymentMode:JSON.stringify(this.selectedPaymentMode);  
      switch (this.addOrUpdate) {
        case 'add':
          delete req.uuid;
          delete req.id;
          delete req.confirm_password;
          this.subSunk.sink = this.userManagementService.addUsers(req)
            .subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success("User added successfully.");
                this.regConfig.reset();
                this.b2bUserUpdate.emit({ tabId: 'b2cUsers_list' });
              } else {
                this.swalService.alert.oops("Unable to create user.");
              }
            }, (err: HttpErrorResponse) => {
              this.swalService.alert.oops(err.error.Message);
            })
          break;
        case 'update':
              if(req.password=='1234' &&  req.confirm_password=='1234'){
                  delete req.password;
                  delete req.confirm_password;
              }
          this.subSunk.sink = this.userManagementService.updateUsers(req)
            .subscribe(resp => {
              if (resp.statusCode == 200 || resp.statusCode == 201) {
                resp.password = '1234';
                resp.confirm_password = '1234';
                this.swalService.alert.success("User updated successfully.");
                this.regConfig.reset();
                this.b2bUserUpdate.emit({ tabId: 'b2cUsers_list' });
              } else {
                  this.swalService.alert.oops("Unable to update user.");
              }
            }, (err: HttpErrorResponse) => {
              this.swalService.alert.oops(err.error.Message);
            })
          break;
        default:
          break;
      }
    }
  
    omitSpecialCharacters(event) {
      return this.utility.omitSpecialCharacters(event);
    }
  
    numberOnly(event): boolean {
      return this.utility.numberOnly(event);
    }
  
    onReset() {
      this.userManagementService.b2bUserUpdateData.next({});
      this.regConfig.reset();
      this.addOrUpdate = 'add';
    }
  
    onCheckBoxChange(e) {
      const api_list: FormArray = this.regConfig.get('api_list') as FormArray;
      if (e.target.checked) {
          api_list.push(new FormControl(e.target.value));
      } else {
          let i = 0;
          api_list.controls.forEach((item: FormControl) => {
              if (item.value === e.target.value) {
                  api_list.removeAt(i);
                  return;
              }
              i++;
          });
      }
  }
  
  getAutoCompleteState(event, type) {
      let inpValue = event.target.value;
      if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
          this.subSunk.sink = this.apiHandlerService.apiHandler('hotelStates', 'post', {}, {}, {
              state_name: `${inpValue}`
          }).subscribe(resp => {
              if (resp.statusCode == 201 || resp.statusCode == 200) {
                  this.statesList = resp.data || [];
              } else {
                  // log.error('Something went wrong')
              }
          }, err => { 
              // log.error(err)
           });
          this.lastKeyupTstamp = event.timeStamp;
      }
  }
  
  onStateSelect(state:any) {
      this.regConfig.patchValue({'state':state.name});
      this.statesList=[];
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
  
    setFlightPricing(checked:Boolean,value:String) {
      if (checked) {
          if (this.selectedFlightPricing.length === 0 || !this.selectedFlightPricing.includes(value)) {
              this.selectedFlightPricing.push(value);
          }
      } else {
          const index = this.selectedFlightPricing.indexOf(value);
          if (index >= 0) {
              this.selectedFlightPricing.splice(index, 1);
          }
      }
    }
  
    onPaymentModeChange(checked: Boolean, inclusion: String) {
      if (checked) {
        // Add to the selected payment modes if not already added
        if (this.selectedPaymentMode.length === 0 || !this.selectedPaymentMode.includes(inclusion)) {
          this.selectedPaymentMode.push(inclusion);
          if (inclusion == 'credit') {
            this.selectedPaymentMode.push('deposite');
            this.setValue();
          }
          if (inclusion == 'deposite') {
            this.selectedPaymentMode.push('credit');
            this.setValue();
          }
        }
      } else {
        this.removeValue(inclusion);
        if (inclusion == 'credit') {
          this.removeValue('deposite');
          this.reinitializeKey();
        }
        if (inclusion == 'deposite') {
          this.removeValue('credit');
          this.reinitializeKey();
        }
      }
    }
    
    setValue() {
      this.paymentMode = [
        { id: 'deposite', name: 'Deposite', isChecked: true },
        { id: 'credit', name: 'Credit', isChecked: true },
        { id: 'payment_gateway', name: 'Payment Gateway', isChecked: this.selectedPaymentMode.includes('payment_gateway') }
      ];
    }
    
    reinitializeKey() {
      this.paymentMode = [
        { id: 'deposite', name: 'Deposite', isChecked: this.selectedPaymentMode.includes('deposite') },
        { id: 'credit', name: 'Credit', isChecked: this.selectedPaymentMode.includes('credit') },
        { id: 'payment_gateway', name: 'Payment Gateway', isChecked: this.selectedPaymentMode.includes('payment_gateway') }
      ];
    }
    
    removeValue(inclusion) {
      const index = this.selectedPaymentMode.indexOf(inclusion);
      if (index >= 0) {
        this.selectedPaymentMode.splice(index, 1);
      }
    }
    
  
    ngOnDestroy() {
      this.subSunk.unsubscribe();
    }
  
}
