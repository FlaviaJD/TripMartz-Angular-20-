import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LayoutsModule } from '../../layout/layout.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { BookingComponent, FormatTimePipe } from './flight/booking/booking.component';
import { FormExtensionComponent } from './flight/components/form-extension/form-extension.component';
import { PreferredAirlineComponent } from './flight/components/preferred-airline/preferred-airline.component';
import { TripInfoComponent } from './flight/result/flight-details/trip-info/trip-info.component';
import { SearchFromComponent } from './flight/search-from/search-from.component';
import { HotelPaymentConfirmationComponent } from './hotel/components/hotel-booking/components/hotel-payment-confirmation/hotel-payment-confirmation.component';
import { HotelProceedPaymentComponent } from './hotel/components/hotel-booking/components/hotel-proceed-payment/hotel-proceed-payment.component';
import { AmenitiesFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/amenities-filter/amenities-filter.component';
import { FilterHotelsComponent } from './hotel/components/hotel-result/components/filter-hotels/filter-hotels.component';
import { HotelAccomodationFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/hotel-accomodation-filter/hotel-accomodation-filter.component';
import { HotelNamesearchFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/hotel-namesearch-filter/hotel-namesearch-filter.component';
import { HotelPriceFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/hotel-price-filter/hotel-price-filter.component';
import { RatingFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/rating-filter/rating-filter.component';
import { HotelSearchLoaderComponent } from './hotel/components/hotel-result/components/hotel-search-loader/hotel-search-loader.component';
import { SortingHotelsComponent } from './hotel/components/hotel-result/components/sorting-hotels/sorting-hotels.component';
import {
  AirlineCarouselComponent, AirlineFeaturesComponent, AirlinesFilterComponent,
  AirportsNearbyFilterComponent, ArrivalTimeFilterComponent, BookingConfirmComponent, BookingFareSummaryComponent, BookingFlightDetailComponent, BookingStepsComponent, CancelInfoComponent, ConfirmPassengerComponent, DepartureTimeFilterComponent, FiltersComponent, FlightCityListComponent, FlightComponent, FlightDetailsBaggageComponent, FlightDetailsComponent, FlightDetailsFareComponent,
  FlightDetailsItineraryComponent, HotelBookingComponent, HotelBookingStepsComponent, HotelCityListComponent, HotelComponent, HotelConfirmationComponent, HotelDetailComponent,
  HotelDetailImagesComponent, HotelGuestDetailsComponent, SearhFormComponent,
  HotelPaymentDetailComponent, HotelResultComponent, HotelRoomDetailComponent, HotelVoucherComponent, LowBalanceAlertComponent, MulticityComponent,
  OnewayComponent, PreferencesFilterComponent, PriceFilterComponent, ResultComponent, RoundtripComponent, SendItineraryComponent, ServiceRequestsComponent, SimilarHotelsComponent, SortingComponent, StopoverCityFilterComponent, StopsFilterComponent,
  BusSearchComponent, BusResultComponent, BusBookingComponent, BusBookingStepsComponent, BusPaymentComponent, BusFilterComponent, BusPriceFilterComponent, BusTypeComponent, BusDepartureComponent, BusArrivalComponent, BusOperatorsComponent, BusSortingComponent, BusVoucherComponent, BusLoaderComponent, BusCancellationComponent, BusOtherDetailsComponent, BusConfirmationComponent, BusPickUpComponent, BusDropOffComponent
} from './index';
import { SafePipe } from './pipes/safe.pipe';
import { TypeofPipe } from './pipes/typeof.pipe';
import { SearchRoutingModule } from './search-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RoundTripComponent } from './flight/result/round-trip/round-trip.component';
import { SortingRoundComponent } from './flight/result/sorting-round/sorting-round.component';
import { CorporateSummaryComponent } from './flight/result/corporate-summary/corporate-summary.component';
import { RetailSummaryComponent } from './flight/result/retail-summary/retail-summary.component';
import { EnquiryComponent } from './flight/result/enquiry/enquiry.component';
import { RaiseRequestComponent } from './raise-request/raise-request.component';
import { TrainComponent } from './train/train.component';
import { CarComponent } from './car/car.component';
import { TrainCityListComponent } from './train/train-city-list/train-city-list.component';
import { CarCityListComponent } from './car/car-city-list/car-city-list.component';
import { MatFormFieldModule, MatIconModule } from '@angular/material';
import { HotelBoardTypeFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/hotel-board-type-filter/hotel-board-type-filter.component';
import { HotelStateListComponent } from './hotel/components/hotel-booking/components/hotel-state-list/hotel-state-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EnquiryHotelComponent } from './hotel/components/hotel-result/components/enquiry-hotel/enquiry-hotel.component';
import { NoPolicyComponent } from './no-policy/no-policy.component';
import { FlightConfirmationComponent } from './flight/booking/flight-confirmation/flight-confirmation.component';
import { BookingFailedComponent } from './booking-failed/booking-failed.component';
import { PriorityFilterComponent } from './hotel/components/hotel-result/components/filter-hotels/priority-filter/priority-filter.component';
import { FlightFareRuleComponent } from './flight/result/flight-details/flight-fare-rule/flight-fare-rule.component';
import { FlightDateChangeComponent } from './flight/result/flight-details/flight-date-change/flight-date-change.component';
import { StateListComponent } from './flight/booking/state-list/state-list.component';
import { BusBookingConfirmationComponent } from './bus/bus-booking-confirmation/bus-booking-confirmation.component';

export const allComponents = [
  FlightComponent,
  MulticityComponent,
  OnewayComponent,
  SearhFormComponent,
  RoundtripComponent,
  FlightCityListComponent,
  BookingConfirmComponent,
  ConfirmPassengerComponent,
  ServiceRequestsComponent,
  BookingFlightDetailComponent,
  BookingFareSummaryComponent,
  AirlineFeaturesComponent,
  SortingComponent,
  AirlineCarouselComponent,
  ResultComponent,
  FiltersComponent,
  PriceFilterComponent,
  StopsFilterComponent,
  DepartureTimeFilterComponent,
  ArrivalTimeFilterComponent,
  AirlinesFilterComponent,
  AirportsNearbyFilterComponent,
  StopoverCityFilterComponent,
  PreferencesFilterComponent,
  FlightDetailsBaggageComponent,
  FlightDetailsFareComponent,
  FlightFareRuleComponent,
  FlightDetailsItineraryComponent,
  FlightDetailsComponent,
  FormExtensionComponent,
  BookingStepsComponent,
  SendItineraryComponent,
  TripInfoComponent,
  HotelResultComponent,
  HotelBookingComponent,
  HotelComponent,
  HotelCityListComponent,
  HotelBookingStepsComponent,
  HotelDetailComponent,
  HotelDetailImagesComponent,
  HotelDetailImagesComponent,
  HotelRoomDetailComponent,
  SimilarHotelsComponent,
  HotelGuestDetailsComponent,
  HotelPaymentDetailComponent,
  HotelConfirmationComponent,
  HotelVoucherComponent,
  BusSearchComponent,
  BusResultComponent,
  BusBookingComponent, 
  BusBookingStepsComponent,
  BusPaymentComponent, 
  BusFilterComponent, 
  BusPriceFilterComponent, 
  BusTypeComponent, 
  BusDepartureComponent, 
  BusArrivalComponent, 
  BusOperatorsComponent, 
  BusSortingComponent, 
  BusVoucherComponent, 
  BusLoaderComponent, 
  BusCancellationComponent, 
  BusOtherDetailsComponent, 
  BusConfirmationComponent, 
  BusPickUpComponent, 
  BusDropOffComponent,
  CancelInfoComponent,
  LowBalanceAlertComponent,
]

@NgModule({
  declarations: [
    BookingComponent,
    ...allComponents,
    SearchFromComponent,
    SortingHotelsComponent,
    FilterHotelsComponent,
    PriceFilterComponent,
    AmenitiesFilterComponent,
    FormatTimePipe,
    RatingFilterComponent,
    HotelPriceFilterComponent,
    HotelAccomodationFilterComponent,
    HotelNamesearchFilterComponent,
    SafePipe,
    TypeofPipe,
    HotelPaymentConfirmationComponent,
    HotelProceedPaymentComponent,
    PreferredAirlineComponent,
    HotelSearchLoaderComponent,
    RoundTripComponent,
    SortingRoundComponent,
    TrainComponent,
    CarComponent,
    CorporateSummaryComponent,
    RetailSummaryComponent,
    EnquiryComponent,
    RaiseRequestComponent,
    TrainCityListComponent,
    CarCityListComponent,
    HotelBoardTypeFilterComponent,
    HotelStateListComponent,
    EmployeeListComponent,
    EnquiryHotelComponent,
    NoPolicyComponent,
    FlightConfirmationComponent,
    BookingFailedComponent,
    PriorityFilterComponent,
    FlightFareRuleComponent,
    FlightDateChangeComponent,
    StateListComponent,
    BusBookingConfirmationComponent,
    BusBookingStepsComponent,
  ],
  imports: [
    LayoutsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    SearchRoutingModule,
    CarouselModule,
    TabsModule.forRoot(),
    InfiniteScrollModule,
    NgxSliderModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    GalleryModule,
    LightboxModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  exports: [...allComponents],
  entryComponents: [
    TripInfoComponent,
    CancelInfoComponent,
    LowBalanceAlertComponent,
    HotelResultComponent,
    HotelPaymentConfirmationComponent,
    HotelSearchLoaderComponent,
    BusLoaderComponent
  ]
})
export class SearchModule {
  constructor() {
  }
}
