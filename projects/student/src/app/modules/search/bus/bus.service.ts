import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '../../../core/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class BusService implements OnDestroy {
  formFilled: BehaviorSubject<any> = new BehaviorSubject<any>({});
  changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
  serverError = new BehaviorSubject<boolean>(false);
  searchResponseCopy = new BehaviorSubject<any>(false);
  applySortingAfterFilter = new BehaviorSubject<boolean>(false);
  bookingBusData = new BehaviorSubject<any>(undefined);
  addBusBookingPaxDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  holdBusData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  busConfirmationData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  bus = new BehaviorSubject<any>([]);
  busCopy = new BehaviorSubject<any>([]);
  maxPrice = new BehaviorSubject<any>(0);
  minPrice = new BehaviorSubject<any>(0);
  myValue = new BehaviorSubject<any>(0);
  myValueStart = new BehaviorSubject<any>(0);
  searchingBus = new BehaviorSubject<any>('');
  noBus = new BehaviorSubject<boolean>(false);
  loading = new BehaviorSubject<boolean>(false);
  private _busCopy: any = [];
  earlyMorning = new BehaviorSubject<boolean>(true);
  midDay = new BehaviorSubject<boolean>(true);
  evening = new BehaviorSubject<boolean>(true);
  night = new BehaviorSubject<boolean>(true);
  arrivalEarlyMorning = new BehaviorSubject<boolean>(true);
  arrivalMidDay = new BehaviorSubject<boolean>(true);
  arrivalEvening = new BehaviorSubject<boolean>(true);
  arrivalNight = new BehaviorSubject<boolean>(true);
  busOperators = new BehaviorSubject<any>([]);
  busType = new BehaviorSubject<any>([]);
  private _jsonURL = 'assets/searchResponse.json';
  initialValue = { arrivalEarlyMorning: false, arrivalMidDay: false, arrivalEvening: false, arrivalNight: false };
  departureValue = { earlyMorning: false, midDay: false, evening: false, night: false };
  arrivalInitialValue = new BehaviorSubject<any>({ arrivalEarlyMorning: false, arrivalMidDay: false, arrivalEvening: false, arrivalNight: false });
  departureInitialValue = new BehaviorSubject({ earlyMorning: false, midDay: false, evening: false, night: false });
  enableBooking = new BehaviorSubject<boolean>(true);
  key="busTimer";
  constructor(
    private apiHandlerService: ApiHandlerService,
    private alertService: AlertService,
    private http: HttpClient,
    private utility: UtilityService,

  ) { }

  searchResult(data) {
    data.JourneyDate = moment(data.JourneyDate).format('YYYY-MM-DD');
    const created_by_id = this.utility.readStorage('studentCurrentUser', localStorage)['id'];
    data["UserId"] = created_by_id;
    data["UserType"] = "Employee";
    this.searchingBus.next(true);
    this.loading.next(true);
    this.bus.next([]);
    this.updateData(data);
    this.apiHandlerService.apiHandler('searchBus', 'post', '', '', data).subscribe(searchResponse => {
      if (searchResponse.statusCode == 200 && searchResponse.data && Object.keys(searchResponse.data).length) {
        this.getResponse(searchResponse.data);
      }
      else {
        this.hideLoader(searchResponse);
      }
      this.changeDetectionEmitter.emit();
    }, (error) => {
      this.serverError.next(true);
      this.loading.next(false);
      this.bus.next(error.error);
    }
    );
  }

  saveTime(seconds: number): void {
    localStorage.setItem(this.key, seconds.toString());
  }


  updateData(data){
    data.CorporateID=+(localStorage.getItem('selectedCorporateId'));
    data.Purpose=localStorage.getItem('selectedPurpose');
    data.BookingType=localStorage.getItem('bookingType');
    data.TrainingId=localStorage.getItem('selectedTrainingId');
    data.TrainingName=localStorage.getItem('selectedTrainingName');
    data.TripId=localStorage.getItem('selectedTripId');
    data.TripName=localStorage.getItem('selectedTripName');
}

  hideLoader(searchResponse) {
    this.serverError.next(false);
    this.searchingBus.next(false);
    this.loading.next(false);
    this.bus.next(searchResponse);
    this.noBus.next(true);
    this.loading.next(false);
    this.alertService.error(searchResponse.Message);
  }

  getResponse(searchResponse: any) {
    searchResponse=searchResponse.sort((a, b) => a.totalFares-b.totalFares);
    this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
    this.bus.next(searchResponse);
    this.changeDetectionEmitter.emit();
    const busCopy = JSON.parse(JSON.stringify(searchResponse));
    this.busCopy.next(busCopy);
    this._busCopy = busCopy;
    let maxPrice = Math.max.apply(Math, busCopy.map(o => o['totalFares']));
    maxPrice = maxPrice == -Infinity ? 1 : maxPrice;
    this.maxPrice.next(maxPrice);
    let minPrice = Math.min.apply(Math, busCopy.map(o => o['totalFares']));
    minPrice = minPrice == -Infinity ? 1 : minPrice;
    this.minPrice.next(minPrice);
    this.myValue.next(maxPrice);
    this.myValueStart.next(minPrice);
  }

  changeSlider() {
    this.multipleFiltersApply();
  }

  multipleFiltersApply() {
    let bus = this.changeSliderExt();
    bus = this.filterByType(bus);
    bus = this.filterByDepartureTimeExt(bus);
    bus = this.filterByArrivalTimeExt(bus);
    bus = this.filterByOperators(bus);
    this.bus.next(bus);
  }

  changeSliderExt() {
    this.myValue.next(Math.ceil(this.myValue.value + 1));
    this.myValueStart.next(Math.floor(this.myValueStart.value));
    const result = this._busCopy.filter(bus => {
      const result = bus.totalFares <= this.myValue.value && bus.totalFares >= this.myValueStart.value;
      return result;
    });
    return !result.length ? this._busCopy : result;
  }

  diffMinutes(dt2: any, dt1: any) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  filterByDepartureTime() {
    this.multipleFiltersApply();
  }

  filterByDepartureTimeExt(bus) {
    const timeRanges = [
      { label: "earlyMorning", range: [5, 9] },
      { label: "midDay", range: [9, 17] },
      { label: "evening", range: [17, 21] },
      { label: "night", range: [21, 5] }
    ];

    const selectedRanges = timeRanges.filter(range => this[range.label].value);
    if (selectedRanges.length === 0 || selectedRanges.length === 4) {
      return bus;
    }
    return bus.filter(bus => {
      const time = bus.departureTime.split(':').map(Number);
      const t=time[0];
      return selectedRanges.some(range => {
        if (range.range[0] === 21 && range.range[1] === 5) {
          return t <= range.range[1] || t >= range.range[0];
        }
        else {
          return t <= range.range[1] && t >= range.range[0];
        }
      });
    });
  }

  filterByArrivalTime() {
    this.multipleFiltersApply();
  }

  filterByArrivalTimeExt(bus) {
    const arrivalTimeRange = [
      { label: "arrivalEarlyMorning", range: [5, 9] },
      { label: "arrivalMidDay", range: [9, 17] },
      { label: "arrivalEvening", range: [17, 21] },
      { label: "arrivalNight", range: [21, 5] }
    ];
    const selectedRanges = arrivalTimeRange.filter(range => this[range.label].value);
    if (selectedRanges.length === 0 || selectedRanges.length === 4) {
      return bus;
    }
    return bus.filter(busDetails => {
      const time= busDetails.arrivalTime.split(':').map(Number);
      const t=time[0];
      return selectedRanges.some(range => {
        if (range.range[0] === 21 && range.range[1] === 5) {
          return t <= range.range[1] || t >= range.range[0];
        }
        else {
          return t <= range.range[1] && t >= range.range[0];
        }
      });
    });
  }

  filterBusOperators() {
    this.multipleFiltersApply();
  }

  filterByOperators(bus) {
    const checkedBuses = this.busOperators.value.filter(b => b.isChecked);
    if (checkedBuses.length === 0) {
      return bus;
    }
    return bus.filter(b => checkedBuses.some(c => c.name === b.travels));
  }

  filterBusType() {
    this.multipleFiltersApply();
  }

  filterByType(bus) {
    const checkedBusTypes = this.busType.value.filter(b => b.isChecked);
    if (checkedBusTypes.length === 0) {
      return bus;
    }
    return bus.filter(b => checkedBusTypes.some(c => c.name === b.busType));
  }

  resetFilter() {
    this.bus.next(this._busCopy);
    this.clearPriceFilter();
    this.clearFilterByBusType();
    this.clearFilterByDepartureTime();
    this.clearBusArrivalFilter();
    this.clearFilterByBusOperators();
    this.changeDetectionEmitter.emit();
  }

  clearPriceFilter() {
    this.myValue.next(this.maxPrice.value);
    this.myValueStart.next(this.minPrice.value);
    this.maxPrice.next(this.maxPrice.value);
    this.minPrice.next(this.minPrice.value);
    this.changeSlider();
  }

  clearBusArrivalFilter() {
    this.arrivalInitialValue.next(this.initialValue);
    this.arrivalEarlyMorning.next(false);
    this.arrivalMidDay.next(false);
    this.arrivalEvening.next(false);
    this.arrivalNight.next(false);
    this.filterByArrivalTime();
  }

  clearFilterByDepartureTime() {
    this.departureInitialValue.next(this.departureValue);
    this.earlyMorning.next(false);
    this.midDay.next(false);
    this.evening.next(false);
    this.night.next(false);
    this.filterByDepartureTime();
  }

  clearFilterByBusType() {
    this.busCopy.next(this._busCopy)
    this.busType.next([]);
    this.filterBusType();
  }

  clearFilterByBusOperators() {
    this.busCopy.next(this._busCopy)
    this.busOperators.next([]);
    this.filterBusOperators();
  }

  setBookingBusData() {
    const storedState = localStorage.getItem('bookingBusData');
    if (storedState) {
      this.bookingBusData.next(JSON.parse(storedState));
    }
  }

  ngOnDestroy() {
  }
  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

}
