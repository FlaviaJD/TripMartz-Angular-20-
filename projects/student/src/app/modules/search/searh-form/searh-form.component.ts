import { PlatformLocation, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { AppService } from '../../../app.service';
import { AuthService } from '../../../auth/auth.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { ThemeOptions } from '../../../theme-options';
import { FlightService } from '../flight/flight.service';
import { HotelService } from '../hotel/hotel.service';
import { TrainService } from '../train/train.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CarService } from '../car/car.service';
import { BusService } from '../bus/bus.service';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { untilDestroyed } from '../../../core/services/until-destroyed';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../../shared/components/header/header.service';

@Component({
  selector: 'app-searh-form',
  templateUrl: './searh-form.component.html',
  styleUrls: ['./searh-form.component.scss']
})
export class SearhFormComponent implements OnInit {
  searchedList: any = [];
  private subSunk = new SubSink();
  showModuleSearchName: boolean = true;
  activeIdString = '';
  hideOther: boolean = false;
  desableTrain: boolean = false;
  desableHotel: boolean = false;
  visible: boolean = false;
  visibleHR: boolean = false;
  showtraining: boolean = false;
  searchSelector = "Business";
  selectedCorporate = "Select Corporate";
  corporateList: any = [];
  selectedCorporateId;
  loggedInUser;
  noData: boolean = true;
  respData: Array<any> = [];
  trainingList: any = [];
  selectedTrainingId: number | null = null;
  errorMessage: string | null = null;
  tripErrorMessage: string | null = null;
  isCorporateSelected:boolean=false;
  noHotelPolicyEnabled:boolean=false;
  noCarPolicyEnabled: boolean=false;
  noTrainPolicyEnabled: boolean=false;
  noFlightPolicyEnabled:boolean=false;
  subs = new SubSink();
  selectTripId='Select Trip';
  tripList: any[];
  stateNotSelected: boolean;
  stateForm: FormGroup;
  isFlight: boolean;
  isHotel: boolean;
  isBus: boolean;

  constructor(
    public globals: ThemeOptions,
    private router: Router,
    private flightService: FlightService,
    private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private authService: AuthService,
    public location: PlatformLocation,
    private currentLocation: Location,
    private hotelService: HotelService,
    private headerService:HeaderService,
    private trainService:TrainService,
    private appService:AppService,
    private carService:CarService,
    private busService:BusService,
    private fb: FormBuilder,
) {
  }

  ngOnInit() {
    this.appService.isCorporateSelected.next(false);
    this.appService.isStateSelected.next(false);
    this.getTripIdList();
    this.loggedInUser = JSON.parse(localStorage.getItem('studentCurrentUser'));
    if(this.loggedInUser.auth_role_id==3){
        this.createForm();
    }
    const modules = this.loggedInUser.corporate_details.module;
    if(modules){
    this.isFlight = modules.includes('Flight') && this.loggedInUser['auth_role_id']!=3;
    this.isHotel = modules.includes('Hotel') && this.loggedInUser['auth_role_id']!=3;
    this.isBus = modules.includes('Bus') && this.loggedInUser['auth_role_id']!=3;
   }
   else{
    this.isFlight=true;
    this.isHotel=true;
    this.isBus=true;
}


    if(this.loggedInUser.auth_role_id==2){
        this.checkPolicyEnabled();
        this.flightService.bookingType.next('Self');
        this.hotelService.bookingType.next('Self');
        this.trainService.bookingType.next('Self');
        localStorage.setItem('bookingType', 'Self');
        localStorage.setItem('selectedPurpose', this.searchSelector);
    }
    else{
        this.noHotelPolicyEnabled=false;
        this.noCarPolicyEnabled=false;
        this.noTrainPolicyEnabled=false;
        this.noFlightPolicyEnabled=false;
        localStorage.removeItem('bookingType');
        localStorage.removeItem('selectedPurpose');
        localStorage.removeItem('selectedState');
        localStorage.removeItem('selectedCorporateId');
        localStorage.removeItem('selectedCorporate');
    }
    localStorage.removeItem('selectedTrainingId');
    localStorage.removeItem('selectedTrainingName');
    localStorage.removeItem('selectedTripId');
    this.getCorporateList();
    this.flightService.proceedBooking.subscribe(resp=>{
        this.errorMessage = !resp ? "Please select a training before booking." : '';
    })
    this.hotelService.proceedBooking.subscribe(resp=>{
        this.errorMessage = !resp ? "Please select a training before booking." : '';
    })
    this.flightService.enableBooking.subscribe(resp=>{
        this.tripErrorMessage = !resp ? "Please select trip before booking." : '';
    })
    this.hotelService.enableBooking.subscribe(resp=>{
        this.tripErrorMessage = !resp ? "Please select trip before booking." : '';
    })
    this.trainService.enableBooking.subscribe(resp=>{
        this.tripErrorMessage = !resp ? "Please select trip before booking." : '';
    })
    this.carService.enableBooking.subscribe(resp=>{
        this.tripErrorMessage = !resp ? "Please select trip before booking." : '';
    })
    this.busService.enableBooking.subscribe(resp=>{
        this.tripErrorMessage = !resp ? "Please select trip before booking." : '';
    })
    localStorage.setItem('activeId', 'flight');
    this.hideOther = this.globals.hideOther;
    this.locationBack();
    this.activeIdString = localStorage.getItem('activeId');
    this.flightService.goToDashboardTabs.subscribe(tabvalue => {
      this.setParams(tabvalue);
    });
    // if (this.loggedInUser && this.loggedInUser.auth_role_id == 3) {
     if(!this.hideOther)
     {
        this.trainingDetailsList();
     }
    // }
  }

  createForm(){
     this.stateForm = this.fb.group({  
        state: [''],
     });

  }

    checkPolicyEnabled() {
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        const hasPolicies = policyList && policyList.length > 0;
        hasPolicies && !policyList[0].hotel_dom && !policyList[0].hotel_int ? this.noHotelPolicyEnabled = true : this.noHotelPolicyEnabled = false;
        hasPolicies && policyList[0].car==0 ? this.noCarPolicyEnabled = true : this.noCarPolicyEnabled = false;
        hasPolicies && policyList[0].train==0 ? this.noTrainPolicyEnabled = true : this.noTrainPolicyEnabled = false;
        hasPolicies && !policyList[0].air_dom && !policyList[0].air_int ? this.noFlightPolicyEnabled = true : this.noFlightPolicyEnabled = false;
    }
  
    getDynamicCity(event: any): void {
        let city = `${event.name}`;
        if (city) {
            this.stateNotSelected = false;
            this.appService.isStateSelected.next(false);
            this.stateForm.patchValue({
                state: city
            })
            localStorage.setItem('selectedState', city);
            this.appService.isStateSelected.next(true);
        }
    }

    getSearchedList(event: any): void {
        this.appService.isStateSelected.next(false);
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
    
  setSelectedTrainingId(data){
    for(let training of this.trainingList){
        training.isSelected=false;
    }
    data.isSelected=true;
    this.errorMessage='';
    this.selectedTrainingId = data.id;
    localStorage.setItem('selectedTrainingId', data.id);
    localStorage.setItem('selectedTrainingName', data.TrainingName);

  }
  trainingDetailsList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('trainingDetails', 'POST', {}, {}).subscribe(res => {
      if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length > 0) {
        this.trainingList = res.data;
      } else {
        this.trainingList = [];
      }
    }, (err) => {
      this.trainingList = [];
    }
    );
  }

  setParams(tabvalue) {
    this.route.queryParams.subscribe(params => {
      this.validateTabs(tabvalue);
      this.hideOther = this.globals.hideOther;
    })
  }

  validateTabs(tabvalue) {
    if (tabvalue == 'Flight') {
      this.activeIdString = "flight";
    }
    else if (tabvalue == 'Hotel') {
      this.activeIdString = "hotels";
    }
    else if (tabvalue == 'Train') {
      this.desableHotel = true;
      this.desableTrain = false;

      this.activeIdString = "trains";
    }
    else if (tabvalue == 'Bus') {
      this.activeIdString = "buses";
    }
    else if (tabvalue == 'Car') {
      this.activeIdString = "cars";
    }
    else if (tabvalue == 'Raiserequest') {
      this.desableTrain = true;
      this.desableHotel = false;
      this.activeIdString = "raiserequest";
    }

    (tabvalue == 'Train' || tabvalue == 'Raiserequest') ? this.visible = true : this.visible = false;
    (tabvalue == 'Raiserequest') ? this.visibleHR = true : this.visibleHR = false;
  }

  locationBack() {
    this.location.onPopState(() => {
      if (this.hideOther) {
        this.preventBackNavigation();
      }
    });
  }

  preventBackNavigation() {
    this.currentLocation.replaceState('/dashboard/search-form');
  }

  onSearchTypeChange(input: any) {
    localStorage.setItem('activeId', input);
    this.headerService.selectedModule.next(input);
    (input == 'trains' || input == 'raiserequest') ? this.visible = true : this.visible = false;
    (input == 'raiserequest') ? this.visibleHR = true : this.visibleHR = false;
  }

  ngDropDwonClick(value: any) {
    this.searchSelector = value;
    this.selectedTrainingId=null;
      for (let training of this.trainingList) {
          training.isSelected = false;
      }
    this.flightService.proceedBooking.next(false);
    this.hotelService.proceedBooking.next(false);
    localStorage.setItem('selectedPurpose', value);
    (value == 'HR Training') ? this.showtraining = true : this.showtraining = false;
    localStorage.removeItem('selectedTrainingId');
    localStorage.removeItem('selectedTrainingName');
 }

 setTrip(value: any) {
    this.selectTripId=(value.TripName)+' ('+(value.TripID) +')';
    this.tripErrorMessage='';
    localStorage.setItem('selectedTripName', value.TripName);
    localStorage.setItem('selectedTripId', value.TripID);
 }
  
  setSelectedCorporate(value: any) {
    this.selectedCorporate = value.business_name;
    this.selectedCorporateId = value.id;
    this.isCorporateSelected=true;
    this.appService.isCorporateSelected.next(true);
    localStorage.setItem('selectedCorporate', JSON.stringify(value));
    localStorage.setItem('selectedCorporateId', this.selectedCorporateId);
  }

  setBookingType(value) {
    this.flightService.bookingType.next(value);
    this.hotelService.bookingType.next(value);
    this.trainService.bookingType.next(value);
    localStorage.setItem('bookingType', value);
  }

  getCorporateList() {
    this.corporateList = "";
    this.subSunk.sink = this.apiHandlerService.apiHandler('corporateList', 'POST', '', '', {})
      .subscribe(res => {
        if (res.statusCode == 200 || res.statusCode == 201) {
          this.corporateList = res.data
          if (this.loggedInUser && this.loggedInUser.auth_role_id == 2) {
            let corporate = this.corporateList.filter(element => element.id == this.loggedInUser.created_by_id && element.status==1)
            if (corporate && corporate[0]) {
              this.setSelectedCorporate(corporate[0]);
            }
          }
          if (this.loggedInUser && this.loggedInUser.auth_role_id == 3) {
            this.corporateList = this.corporateList.filter(element => (this.loggedInUser.corporates.includes(element.id)) && element.status==1);   
           }
        } else {
          this.corporateList = [];
        }
      }, (err) => {
        this.corporateList = [];
      });
  }

  ngOnDestroy() {
}

  getTripIdList() {
    this.noData = true;
    this.respData = [];
    this.subs.sink = this.apiHandlerService.apiHandler('getTripIdList', 'POST', {}, {}).subscribe(res => {
        if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length > 0) {
            this.noData = false;
            this.tripList = res.data;
        } else {
            this.tripList = [];
        }
    }, (err: HttpErrorResponse) => {
        this.tripList = [];
    }
    );
}

}
