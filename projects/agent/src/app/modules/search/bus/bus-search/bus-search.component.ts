import { PlatformLocation } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppService } from 'projects/agent/src/app/app.service';
import { tap } from 'rxjs/operators';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { BusService } from '../bus.service';
export let browserRefresh = false;

@Component({
  selector: 'app-bus-search',
  templateUrl: './bus-search.component.html',
  styleUrls: ['./bus-search.component.scss']
})
export class BusSearchComponent implements OnInit {

  minDate = new Date();
  isOpen = false as boolean;
  bsDateConf: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    showWeekNumbers: false,
    containerClass: 'theme-blue',
  };
  setMinDate: any;
  regConfig: FormGroup;
  departureLocations = [];
  desitnationLocations = [];
  isDesitnationCityLoading: boolean = false;
  isDepartureCityLoading: boolean = false;
  lastKeyupTstamp: number = 0;
  submitted: boolean = false;
  city: any;
  fromCityId: any;
  toCityId: any;
  @ViewChild('departureCity', { static: false }) departureCity: ElementRef<HTMLElement>;
  @ViewChild('destinationCity', { static: false }) destinationCity: ElementRef<HTMLElement>;
  @ViewChild('checkinDate', { static: false }) checkinDate: ElementRef<HTMLElement>;
  @Output() callResult = new EventEmitter<any>();
  public browserRefresh: boolean;
  formFilled: boolean;
  isCorporateSelected:boolean=false;
  loggedInUser;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private busService: BusService,
    public location: PlatformLocation,
    private appService:AppService) {
  }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    this.appService.isCorporateSelected.subscribe(data=>{
        this.loggedInUser.auth_role_id==3?this.isCorporateSelected=data:this.isCorporateSelected=true;
    })
    this.location.onPopState(() => {
      this.locationBack();
    });
    this.createForm();
    this.setModifySearch();
  }

  onCheckIn(event) {
    if (event) {
      setTimeout(() => {
        this.setMinDate = event;
      }, 10)
    }
  }

  createForm(): void {
    this.regConfig = this.fb.group({
      departureCity: new FormControl('', [Validators.required]),
      destinationCity: new FormControl('', [Validators.required]),
      checkinDate: new FormControl('', [Validators.required]),
      booking_source:new FormControl('',[Validators.required])
    });
  }

  getAutoCompleteLocations(event, control) {
    let inpValue = event.target.value;
    if (inpValue == "") {
      this.setValidator(control);
    }
    this.departureLocations.length = 0;
    this.desitnationLocations.length = 0;
    if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp > 10)) {
      if (control == 'departureCity') {
        this.isDepartureCityLoading = true;
      }
      else {
        this.isDesitnationCityLoading = true;
      }
      const city_name = `${event.target.value}`;
      this.getCityList(event, control, city_name);
    }
  }

  setValidator(control) {
    this.regConfig.get(control).setValidators(Validators.required);
    this.regConfig.get(control).updateValueAndValidity();
  }

  getCityList(event, control, city_name) {
    let request = { 'city_name': city_name, 'booking_source': "ZBAPINO00023" }
    this.apiHandlerService.apiHandler('busCityList', 'POST', '', '', request)
      .pipe(
        tap(() => {
          this.isDepartureCityLoading = false;
          this.isDesitnationCityLoading = false;
        })
      )
      .subscribe((resp: any) => {
        if (resp.statusCode == 200) {
          if (control == 'departureCity') {
            this.departureLocations = resp.data.sort((a, b) => {
              return a.cityName.localeCompare(b.cityName);
            }).map(item => item);
            console.log(this.departureLocations);
          }
          else {
            this.desitnationLocations = resp.data.sort((a, b) => {
              return a.cityName.localeCompare(b.cityName);
            }).map(item => item);
          }
          this.cdr.detectChanges();
        }
      }, err => {
      });
    this.lastKeyupTstamp = event.timeStamp;
  }

  hasError = (controlName: string, errorName: string) => {
    return ((this.submitted || this.regConfig.controls[controlName].touched) && this.regConfig.controls[controlName].hasError(errorName));
  }

  selectedLocation(control, location) {
    this.city = location;
    if (control == 'departureCity') {
      this.regConfig.patchValue({
        departureCity: `${location['cityName']}`,
        booking_source:`${location['bookingSource']}`
      })
      this.fromCityId = location['cityId'];
      this.departureLocations = [];
      this.destinationCity.nativeElement.focus();
    }
    else {
      this.regConfig.patchValue({
        destinationCity: `${location['cityName']}`,
        booking_source:`${location['bookingSource']}`
      })
      this.toCityId = location['cityId'];
      this.desitnationLocations = [];
      this.checkinDate.nativeElement.focus();
      this.checkinDate.nativeElement.click();
    }
    return;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.regConfig.valid) {
      return;
    }
    // if (this.loggedInUser.auth_role_id == 2) {
    //     const selectedTripId = localStorage.getItem('selectedTripId');
    //     if (!selectedTripId) {
    //         window.scrollTo({ top: 0, behavior: 'smooth' });
    //         this.busService.enableBooking.next(false);
    //         return;
    //     }
    // }
    const formData = {
      FromCityId: this.fromCityId,
      ToCityId: this.toCityId,
      JourneyDate: this.regConfig.value.checkinDate,
      booking_source:this.regConfig.value.booking_source
    };
    localStorage.removeItem('busFormData');
    localStorage.removeItem('busSearchData');
    localStorage.setItem('busFormData', JSON.stringify(this.regConfig.value));
    localStorage.setItem('busSearchData', JSON.stringify(formData));
    this.submitForm(formData);

    this.busService.formFilled.next(this.regConfig.value);
    if (this.router.url == 'bus/result') {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigateByUrl("/search/bus/result");
    }
    else {
      this.router.navigateByUrl("/search/bus/result");
    }
  }

  submitForm(data: any) {
    this.busService.busCopy.next([]);
    this.busService.bus.next([]);
    this.callResult.emit(data);
  }

  setModifySearch() {
    this.busService.formFilled.subscribe(data => {
      if (data && data.hasOwnProperty('departureCity')) {
        this.formFilled = true;
      }
      else {
        this.formFilled = false;
      }
    });
    this.browserRefresh = browserRefresh;
    if (this.formFilled) {
      let busFormData = localStorage.getItem('busFormData');
      busFormData = JSON.parse(busFormData);
      let searchData = localStorage.getItem('busSearchData');
      searchData = JSON.parse(searchData);
      this.fromCityId = searchData['FromCityId'];
      this.toCityId = searchData['ToCityId'];
        if (busFormData) {
            this.regConfig = this.fb.group({
                departureCity: busFormData['departureCity'],
                destinationCity: busFormData['destinationCity'],
                checkinDate: new Date(busFormData['checkinDate']),
                booking_source: busFormData['booking_source']
            })
        }
    }
  }

  locationBack() {
    const formData = {
      FromCityId: this.fromCityId,
      ToCityId: this.toCityId,
      JourneyDate: this.regConfig.value.checkinDate,
      booking_source: this.regConfig.value.booking_source
    };
    localStorage.setItem('busFormData', JSON.stringify(this.regConfig.value));
    localStorage.setItem('busSearchData', JSON.stringify(formData));
    this.busService.busCopy.next([]);
    this.busService.bus.next([]);
  }

}
