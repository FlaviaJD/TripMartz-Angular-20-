import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Router } from "@angular/router";
import { browserRefresh } from "projects/agent/src/app/app.component";
import { ApiHandlerService } from "projects/agent/src/app/core/api-handlers";
import { SwalService } from "projects/agent/src/app/core/services/swal.service";
import { UtilityService } from "projects/agent/src/app/core/services/utility.service";
import { BusService } from "../bus.service";
import { BusLoaderComponent } from "./components/bus-loader/bus-loader.component";

@Component({
  selector: 'app-bus-result',
  templateUrl: './bus-result.component.html',
  styleUrls: ['./bus-result.component.scss']
})
export class BusResultComponent implements OnInit {
    ReadMore: boolean = true
  visible: boolean = false//hiding info box
  searchPayload: any;
  noBus = false;
  loading: boolean;
  searchingBus: boolean = false;
  serverError: boolean = false;
  noBusMessage: any;
  bus: any = [];
  cancelPolicy: any = [];
  busDetails: any = [];
  enableCancPolicy: boolean = false;
  enableViewMore: boolean = false;
  seatLayoutResponse: any = [];
  seatDetails: any = [];
  browserRefresh: boolean;
  primaryColour: any;
  secondaryColour: any;
  loadingTemplate: any;
  enablePickup:boolean=false;
  enableDropOff:boolean=false;
  endSlice: number = 20;
  throttle;
  isCollapsed = true;
  busInfo;
  maxSeats: number;
  
  constructor(
    private router: Router,
    private busService: BusService,
    private dialog: MatDialog,
    private util: UtilityService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {
   }

  onclick(bus) {
    bus.collapse = !bus.collapse;
    if (bus.collapse) {
      bus.isSeatLayoutLoading = true;
      bus.SelectedSeats=[];
      bus.PickUpID=undefined;
      bus.DropOffID=undefined;
      bus.boarding_location_details='';
      bus.dropping_location_details='';
      this.getSeatLayout(bus);
    }
  }

  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      this.busService.loading.next(true);
      this.busService.loading.subscribe(res => {
        this.loading = res;
      });
      this.busService.formFilled.next(JSON.parse(localStorage.getItem('busFormData')));
    }

    this.searchPayload = this.prepareSearchPayloadFromSessionData('busSearchData');
    this.searchResult(this.searchPayload);
    this.setResult();
  }

  setResult() {
    this.busService.loading.next(true);
    this.busService.searchingBus.subscribe(res => {
      this.searchingBus = res;
    });
    this.busService.serverError.subscribe(res => {
      this.serverError = res;
    });
    this.busService.loading.subscribe(res => {
      this.loading = res;
    });
    this.busService.bus.subscribe(res => {
      this.setResponse(res)

    });
    this.busService.noBus.subscribe(res => {
      this.noBus = res;
    });
    this.busService.loading.next(false);
  }

  private prepareSearchPayloadFromSessionData(sessionKey: string): any {
    const ssd = JSON.parse(localStorage.getItem(sessionKey));
    const reqBody = {
      FromCityId: ssd.FromCityId,
      ToCityId: ssd.ToCityId,
      JourneyDate: ssd.JourneyDate,
      booking_source:ssd.booking_source
    };
    return reqBody;
      }

  searchResult(data: any) {
    this.busService.formFilled.subscribe(d => {
        this.busInfo=this.busService.formFilled.value;
      if (!this.util.isEmpty(d)) {
        const params = d;
        if (params) {
          let config = new MatDialogConfig();
          config.height = '600px';
          config.width = '1000px';
          config.panelClass = "copy-items-modal";
          config.disableClose = true;
          config.data = {
            data: this.busService.formFilled.value
          }
          let copyDialog = this.dialog.open(BusLoaderComponent, config);
        }
      }
    })
    this.busService.searchResult(data);
  }

  showCancelPolicy(bus) {
    this.enableCancPolicy = true;
    this.cancelPolicy = bus.cancellationPolicies;
  }

  hide(event) {
    if (event) {
      this.enableCancPolicy = false;
      this.enableViewMore = false;
      this.enableDropOff=false;
      this.enablePickup=false;
    }
  }

  showViewMore(bus) {
        this.enableViewMore = true;
    this.busDetails = bus;
  }

  getSeatLayout(bus) {
    const created_by_id = this.util.readStorage('currentUser', localStorage)['id'];
    let request = {
      ResultToken: bus.ResultIndex,
      booking_source:bus.booking_source,
      UserId:created_by_id
    }
    this.apiHandlerService.apiHandler('seatLayoutBus', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.seatLayoutResponse = response.data;
        this.setSeatData(this.seatLayoutResponse.layout.SeatDetails, bus);
      }
      else {
        bus.isSeatLayoutLoading = false;
        bus.upperBirth=[];
        bus.lowerBirth=[];
        this.cd.detectChanges();
      }
    }, (err) => {
      bus.isSeatLayoutLoading = false;
      bus.upperBirth=[];
      bus.lowerBirth=[];
      this.cd.detectChanges();
      this.swalService.alert.oops(err.error.Message);
    });
  }

  onSubmit(bus) {
    this.loading=true;
    let seatsResultToken = bus.SelectedSeats.map(item => item.ResultIndex);
    let request = {
      PickUpID: bus.PickUpID,
      DropOffID: bus.DropOffID,
      BusResultToken: bus.ResultIndex,
      SeatsResultToken: seatsResultToken,
      booking_source:bus.booking_source,
      boarding_location_details:bus.boarding_location_details,
      dropping_location_details:bus.dropping_location_details,
      UserId:JSON.parse(localStorage.getItem('currentUser'))['id'],
      UserType:'B2B'
    }
    this.apiHandlerService.apiHandler('seatBusInfo', 'post', '', '', request).subscribe(response => {
      if (response.statusCode == 200 && response.data) {
        this.loading=false;
        this.busService.bookingBusData.next(response.data);
        localStorage.setItem('b2bBookingBusData', JSON.stringify(response.data));
        this.router.navigate(["/search/bus/bus-booking"]);
      }
      else {
      }
    }, (err) => {
      this.loading=false;
      this.swalService.alert.oops(err.error.Message);
    });
  }

  setSeatData(seatLayoutResponse, bus) {
    bus['upperBirth'] = seatLayoutResponse.filter((element) =>  (element.zIndex=="1") && (element.zIndex==1));
    bus['lowerBirth'] = seatLayoutResponse.filter((element) =>  (element.zIndex=="0") && (element.zIndex==0));
    const upperBirth = {};
    if(bus['upperBirth'].length){
        bus['upperBirth'].forEach(seat => {
            const rowIndex = seat.row;
            const colIndex = seat.column;
    
            if (!upperBirth[rowIndex]) {
                upperBirth[rowIndex] = [];
            }
            upperBirth[rowIndex][colIndex] = seat;
        });
    }
    bus['upperBirth']=upperBirth;
    const lowerBirth = {};
    if(bus['lowerBirth'].length){
        bus['lowerBirth'].forEach(seat => {
            const rowIndex = seat.row;
            const colIndex = seat.column;
    
            if (!lowerBirth[rowIndex]) {
                lowerBirth[rowIndex] = [];
            }
            lowerBirth[rowIndex][colIndex] = seat;
        });
    }
    bus['lowerBirth']=lowerBirth;
    this.addLowerBirthMissingKeys(bus.lowerBirth);
    this.addLowerBirthMissingKeys(bus.upperBirth);
    bus.isSeatLayoutLoading = false;
    this.cd.detectChanges();
  }

  addLowerBirthMissingKeys(value) {
    let keys = Object.keys(value); // Get the keys of the object
    keys.sort((a, b) => parseInt(a) - parseInt(b)); // Sort the keys numerically
    for (let i = 0; i < keys.length - 1; i++) {
        let currentKey = parseInt(keys[i]);
        let nextKey = parseInt(keys[i + 1]);
        
        // Check for missing keys
        if (nextKey !== currentKey + 1) {
            // Add missing keys
            for (let j = currentKey + 1; j < nextKey; j++) {
                value[j] = []; // Initialize the missing key with an empty array
            }
        }
    }
}

addUpperBirthMissingKeys(value) {
    let keys = Object.keys(value); // Get the keys of the object
    keys.sort((a, b) => parseInt(a) - parseInt(b)); // Sort the keys numerically
    for (let i = 0; i < keys.length - 1; i++) {
        let currentKey = parseInt(keys[i]);
        let nextKey = parseInt(keys[i + 1]);
        
        // Check for missing keys
        if (nextKey !== currentKey + 1) {
            // Add missing keys
            for (let j = currentKey + 1; j < nextKey; j++) {
                value[j] = []; // Initialize the missing key with an empty array
            }
        }
    }
}

  setResponse(res) {
    if (!res.length) {
      this.bus = [];
      if (res.Message)
        this.dialog.closeAll();
      this.noBusMessage = res.Message;
    } else {
      this.busService.loading.next(false);
      res = res.map((val, i) => {
        val.collapse = false;
        val.IsSelected = false;
        val.Total = 0;
        val.SelectedSeats = [];
        return val;
      });
      this.bus = res || [];
      if (!this.loading) {
        setTimeout(_ => {
          this.dialog.closeAll();
        }, 100);
      }
    }
  }

  getSeatImage(seatType: string): string {
    switch (seatType) {
      case 'Seater':
        return 'assets/images/seats/seat-IG - Copy.png';
      case 'Horizontal Sleeper':
        return 'assets/images/seats/sleeper_w1_h2.png';
      case 'Vertical Sleeper':
        return 'assets/images/seats/sleeper_w2_h1.png';
    }
  }

  getLadiesSeatImage(seatType: string): string {
    switch (seatType) {
      case 'Seater':
        return 'assets/images/seats/seat-B-F - Copy.png';
      case 'Horizontal Sleeper':
        return 'assets/images/seats/sleeper-B-F.png';
      case 'Vertical Sleeper':
        return 'assets/images/seats/sleeper_ladies_w2_h1.png';
    }
  }

  getMaleSeatImage(seatType: string): string {
    switch (seatType) {
      case 'Seater':
        return 'assets/images/seats/seat-B-M - Copy.png';
      case 'Horizontal Sleeper':
        return 'assets/images/seats/sleeper-B-M.png';
      case 'Vertical Sleeper':
        return 'assets/images/seats/sleeper-B-M 1.png';
    }
  }


  getBlockedSeatImage(seatType: string): string {
    switch (seatType) {
      case 'Seater':
        return 'assets/images/seats/seat-B-Mmm.png';
      case 'Horizontal Sleeper':
        return 'assets/images/seats/sleeper-not.png';
      case 'Vertical Sleeper':
        return 'assets/images/seats/sleeper_v-not.png';
    }
  }

  getBlockedLadiesSeatImage(seatType: string): string {
    switch (seatType) {
      case 'Seater':
        return 'assets/images/seats/seat-B-F-F.png';
      case 'Horizontal Sleeper':
        return 'assets/images/seats/sleeperB-B-F.png';
      case 'Vertical Sleeper':
        return 'assets/images/seats/sleeperB-B-FF.png';
    }
  }

  getBlockedMaleSeatImage(seatType: string): string {
    switch (seatType) {
      case 'Seater':
        return 'assets/images/seats/seat-B-M - Copy.png';
      case 'Horizontal Sleeper':
        return 'assets/images/seats/sleeper-B-M (copy).png';
      case 'Vertical Sleeper':
        return 'assets/images/seats/sleeper_v-B-F.png';
    }
  }

  getSelectedImage(seatType: string): string {
    switch (seatType) {
      case 'Seater':
        return 'assets/images/seats/seat_select.png';
      case 'Horizontal Sleeper':
        return 'assets/images/seats/b3.png';
      case 'Vertical Sleeper':
        return 'assets/images/seats/c3.png';
    }
  }
  
  

  setSelectedSeat(selectedSeat, bus) {
    let selectedBookingType=localStorage.getItem('bookingType');
    this.maxSeats=(selectedBookingType=='Self')? 1 : 6;
    const numSelectedSeats = bus.SelectedSeats.filter(s => s.IsSelected).length;
    // If the maximum number of seats has been reached and the currently selected seat is not already selected,
    // then do not allow the user to select it.
    if (numSelectedSeats >= this.maxSeats && !selectedSeat.IsSelected) {
      bus.MaxSeatSelected=true;
      return;
    }
    bus.MaxSeatSelected=false;
    selectedSeat.IsSelected = !selectedSeat.IsSelected;
    const fareChange = selectedSeat.IsSelected ? (+selectedSeat.fare) : -(+selectedSeat.fare);
    bus.Total += fareChange;
    const foundIndex = bus.SelectedSeats.findIndex((item) => item.ResultIndex === selectedSeat.ResultIndex);
    if (foundIndex !== -1) {
      bus.SelectedSeats.splice(foundIndex, 1);
    } else {
      bus.SelectedSeats.push(selectedSeat);
    }
}

  setPickupPoint(bus, value) {
    bus.PickUpID = value || undefined;
    if(this.seatLayoutResponse && this.seatLayoutResponse.boardingTimes){
    const selectedBoardingoff = this.seatLayoutResponse.boardingTimes.find((boardingTimes: any) => boardingTimes.bpId === value);
    if (selectedBoardingoff) {
      bus.boarding_location_details = selectedBoardingoff.location_details;
    }
  }
  }

  setDropPoint(bus, value) {
    bus.DropOffID = value || undefined;
    if(this.seatLayoutResponse && this.seatLayoutResponse.droppingTimes){
      const selectedDropoff = this.seatLayoutResponse.droppingTimes.find((dropoff: any) => dropoff.bpId === value);
      if (selectedDropoff) {
        bus.dropping_location_details = selectedDropoff.location_details;
      }
    }
  }

  showPickUp(bus){
      this.enablePickup = true;
      this.busDetails = bus;
    }

    showDropoffs(bus){
      this.enableDropOff = true;
      this.busDetails = bus;
    }

  onScrollDown() {
    this.endSlice += 20;
  }
  onScrollUp() {
    if (this.endSlice != 20) {
      this.endSlice -= 20;
    }
  }

    resetAll(){
      this.busService.resetFilter();
      
    }
}
