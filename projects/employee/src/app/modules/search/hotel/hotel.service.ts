export function tempTraveller() {
    return {
        adults: 1,
        childrens: 1,
        rooms: 0
    }
}

import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { UtilityService } from '../../../core/services/utility.service';
import * as moment from 'moment';
import { SwalService } from '../../../core/services/swal.service';

@Injectable({
    providedIn: 'root'
})
export class HotelService implements OnDestroy {

    isDevelopment = false;
    formFilled: any = false;
    searchHotelSubmitted: any = false;
    hotels = new BehaviorSubject<any>([]);
    hotelsCopy = new BehaviorSubject<any>([]);
    loading = new BehaviorSubject<boolean>(false);
    changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
    private _hotelsCopy: any = [];
    maxPrice = new BehaviorSubject<any>(0);
    minPrice = new BehaviorSubject<any>(0);
    myValue = new BehaviorSubject<any>(0);
    myValueStart = new BehaviorSubject<any>(0);
    searchingHotel = new BehaviorSubject<any>('');
    currentCurrency: any;
    currentCurrencyRate: any;
    noHotel = new BehaviorSubject<boolean>(false);;
    serverError = new BehaviorSubject<boolean>(false);
    searchResponseCopy = new BehaviorSubject<any>(false);
    bookingType = new BehaviorSubject<any>('Self');
    nearByAirportsCopy = new BehaviorSubject<any>([]);
    traveller: any = this.isDevelopment ? tempTraveller() : undefined;
    proceedBooking = new BehaviorSubject<boolean>(true);
    enableBooking = new BehaviorSubject<boolean>(true);
    resultToken: any;
    appReference: any;
    bookingHotelData = new BehaviorSubject<any>(undefined);
    blockHotelRoom = new BehaviorSubject<any>(undefined);
    userTitleList = new BehaviorSubject<any>([]);
    countryList = new BehaviorSubject<any>(false);
    addHotelBookingPaxDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    hotelConfirmationData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    hotelVoucherData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    isCollapsed = new BehaviorSubject<boolean>(true);
    hotel_logo = 'https://www.travelsoho.com/antrip_v1/extras/system/library/images/airline_logo/';
    ratingReset = new BehaviorSubject<boolean>(false);
    rating1 = new BehaviorSubject<boolean>(false);
    rating2 = new BehaviorSubject<boolean>(false);
    rating3 = new BehaviorSubject<boolean>(false);
    rating4 = new BehaviorSubject<boolean>(false);
    rating5 = new BehaviorSubject<boolean>(false);
    stars: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    applySortingAfterFilter = new BehaviorSubject<boolean>(false);
    availableOptions: {} = {
        stars: [],
        sorts: []
    };
    amenities: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    location: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    boardType: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    clearAmenities = new BehaviorSubject<boolean>(false);
    scrollToRoomDetails: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    sendRequest: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    clearLocation = new BehaviorSubject<boolean>(false);
    clearAccomodation = new BehaviorSubject<boolean>(false);
    clearBoardType = new BehaviorSubject<boolean>(false);
    clearRating = new BehaviorSubject<boolean>(false);
    clearHotelName = new BehaviorSubject<boolean>(false);
    private subSunk = new SubSink();
    dialogClose = new BehaviorSubject<boolean>(false);
    closeDialog = new BehaviorSubject<boolean>(false);
    searchHotelName = new BehaviorSubject<string>(undefined);
    private isActive = new BehaviorSubject<boolean>(false);
    clearStatus = new BehaviorSubject<boolean>(false);
    private key = 'hoteltimer';  // The key used to store timer value in localStorage
    constructor(
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private utility: UtilityService,
        private swalService: SwalService
    ) {
        this.apiHandlerService.apiHandler('userTitleList', 'POST', {}, {}, {}).subscribe(res => {
            this.userTitleList.next(res.data);
        });
        this.apiHandlerService.apiHandler('countryList', 'POST').subscribe(res => {
            this.countryList.next(res.data.popular_countries.concat(res.data.countries));
        });
    }
    counter: number = 0;
    searchResult(data: any) {
        this.saveTime(0);
        let currentUser = this.utility.readStorage('currentUser', localStorage);
        const created_by_id = currentUser.id;
        let response = JSON.parse(localStorage.getItem('policyList'));
        if (currentUser && currentUser.auth_role_id == 2 && response && response.length > 0) {
            // if(response && response.length==0){
            //     this.close("");
            //     return;
            // }
            let countryCode = localStorage.getItem('hotelCountryCode');
            if (response) {
                const hotel_dom = response[0].hotel_dom; // Whether domestic air is enabled
                const hotel_int = response[0].hotel_int; // Whether international air is enabled
                const selected = countryCode === 'IN'; // Whether the country is IN
                switch (true) {
                    case (!hotel_dom && !hotel_int):
                        this.close("Both");
                        return;
                    case (hotel_dom && hotel_int):
                        this.proceedWithBooking(data, created_by_id, currentUser);
                        break;
                    case (hotel_dom && !selected):
                        this.close("International");
                        break;
                    case (hotel_int && selected):
                        this.close("Domestic");
                        return;
                }
            }
            else {
                this.proceedWithBooking(data, created_by_id, currentUser);
            }
        }
        else {
            this.proceedWithBooking(data, created_by_id, currentUser);
        }
    }

    saveTime(seconds: number): void {
        localStorage.setItem(this.key, seconds.toString());
      }
    

    proceedWithBooking(data,created_by_id,currentUser){
           data.BookingType = localStorage.getItem('bookingType');
        this.hotels.next([]);
        data.CheckIn = moment(data['CheckIn']).format('YYYY-MM-DD');
        data.CheckOut = moment(data['CheckOut']).format('YYYY-MM-DD');
        if (data['RoomGuests']) {
            data['RoomGuests'].forEach(element => {
                element.ChildAge = this.setChildAge(element);
            });
        }
        data["UserId"] = created_by_id;
        delete data.UserType;
        this.searchHotelSubmitted = true;
        this.searchingHotel.next(true);
        this.loading.next(true);
        this.resetSearch();
        data.RequestID=0;
        this.subSunk.sink = this.apiHandlerService.apiHandler('searchHotel', 'post', '', '', data).subscribe(
            searchResponse => {
                if (searchResponse.statusCode == 200 && searchResponse.data && Object.keys(searchResponse.data).length) {
                    searchResponse.data = searchResponse.data.sort((a, b) => a.Price.Amount - b.Price.Amount);
                    let response = JSON.parse(localStorage.getItem('policyList'));
                    if(currentUser.auth_role_id==2 && response && response.length>0
                    ){
                        searchResponse.data = this.validatePolicy(searchResponse.data);
                        if(searchResponse.data==undefined){
                            this.closeModel();
                            return
                        }
                    }
                    this.getResponse(searchResponse.data);
                } else {
                    this.hotels.next(searchResponse);
                    this.noHotel.next(true);
                    this.loading.next(false);
                    this.alertService.error(searchResponse.Message);
                }
                this.serverError.next(false);
                this.searchingHotel.next(false);
                this.loading.next(false);
                this.dialogClose.next(true)
                this.changeDetectionEmitter.emit();
            }, (err) => {
                if (err.error.statusCode == 400) {
                    this.serverError.next(false);
                    this.loading.next(false);
                    this.dialogClose.next(true)
                } else {
                    this.serverError.next(true);
                    this.dialogClose.next(true)
                    this.loading.next(false);
                }
                this.noHotel.next(err.error.Message)
                this.searchingHotel.next(false);

            }
        );
    }

    closeModel(){
        this.serverError.next(false);
        this.loading.next(false);
        this.dialogClose.next(true);
        this.noHotel.next(true)
        this.searchingHotel.next(false);
    }

    validatePolicy(data) {
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        let startValidity = this.validateStarPolicy(data, policyList);
        let piceResponse = this.validatePricePolicy(startValidity, policyList);
        return piceResponse;
    }

    validateStarPolicy(data, policyList) {
        let star_category = (policyList.length > 0) ? policyList[0].star_category : null;
        let response = [];
        if (policyList.length > 0 && !policyList[0].beyond_star) {
            localStorage.setItem('star_beyond_limit',JSON.parse(policyList[0].beyond_star))
            localStorage.setItem("policy_star_category",star_category);
            response = data.filter(element => star_category && star_category.includes(element.StarRating));
            return response;
        }
        else {
            localStorage.setItem('star_beyond_limit',JSON.parse('true'));
            localStorage.setItem("policy_star_category",star_category);
            return data;
        }
    }

    validatePricePolicy(data, policyList) {
        if (data && data.length > 0) {
            if (policyList && policyList.length > 0 && !policyList[0].hotel_beyond_limit) {
                this.setPolicyPrice(data, policyList);
                localStorage.setItem('price_beyond_limit', policyList[0].hotel_beyond_limit);
                const policyHotels = policyList[0].policyHotels || [];
                const cityId = data[0].searchRequest.CityIds[0];
                let filteredData = [];
                let filteredPolicyList = policyHotels.filter(policy => {
                    if (policy.cities.includes(',')) {
                        const citiesArray = policy.cities.split(',');
                        return citiesArray.includes(cityId);
                    } else {
                        // Handle the case where there's only one city in the string
                        return policy.cities === cityId;
                    }
                });
                if (filteredPolicyList.length > 0) {
                    const upperLimit = filteredPolicyList[0].upper_limit;
                    filteredData = data.filter(element => (element.Price.Amount == 0) || element.Price.Amount < upperLimit);
                }
                if (filteredPolicyList.length === 0 && policyList[0].generic_budget_limit) {
                    filteredData = data.filter(element => (element.Price.Amount == 0) || element.Price.Amount < policyList[0].generic_budget_limit);
                }
                return filteredData;
            }
            localStorage.setItem('price_beyond_limit', JSON.parse('true'));
            this.setPolicyPrice(data, policyList);
            return data;
        }

    }

    setPolicyPrice(data,policyList){
        const policyHotels = policyList[0].policyHotels || [];
        const cityId = data[0].searchRequest.CityIds[0];
        let filteredData = [];
        let filteredPolicyList = policyHotels.filter(policy => policy.cities.includes(cityId));
        if (filteredPolicyList.length > 0) {
            const upperLimit = filteredPolicyList[0].upper_limit;
            localStorage.setItem("policyPrice",upperLimit);
        }
        if (filteredPolicyList.length === 0 && policyList[0].generic_budget_limit) {
            localStorage.setItem("policyPrice",policyList[0].generic_budget_limit);
        }
    }


    close(text) {
        this.closeDialog.next(true);
        this.hotels.next([]);
        this.hotelsCopy.next([]);
        this._hotelsCopy=[];
        localStorage.setItem('b2bHotels', JSON.stringify(this.hotels.getValue()));
        this.swalService.alert.warning(`According to the policy, ${text} travel is restricted. Please contact to the Traveldesk.`);
    }

    getResponse(searchResponse: any) {
        if (!searchResponse || Object.keys(searchResponse).length === 0) {
            this.searchResponseCopy.next(null);
        } else {
            this.searchResponseCopy.next(JSON.parse(JSON.stringify(searchResponse)));
        }
        localStorage.setItem('b2bHotels', JSON.stringify(this.hotels.getValue()));
        this.changeDetectionEmitter.emit();
        let hotelsCopy;
        if (searchResponse && Object.keys(searchResponse).length > 0) {
            hotelsCopy = JSON.parse(JSON.stringify(searchResponse));
        }
        else{
            hotelsCopy=null
        }
        this.hotels.next(hotelsCopy);
        this.hotelsCopy.next(hotelsCopy);
        this._hotelsCopy = hotelsCopy;
        let maxPrice = Math.max.apply(Math, hotelsCopy.map(o => o['Price']['Amount']));
        maxPrice = maxPrice == -Infinity ? 1 : maxPrice;
        this.maxPrice.next(maxPrice);
        let minPrice = Math.min.apply(Math, hotelsCopy.map(o => o['Price']['Amount']));
        minPrice = minPrice == -Infinity ? 1 : minPrice;
        this.minPrice.next(minPrice);
        this.myValue.next(maxPrice);
        this.myValueStart.next(minPrice);
    }
    resetSearch() {
        this.hotelsCopy.next([]);
        this.hotels.next([]);
        localStorage.setItem('b2bHotels', JSON.stringify(this.hotels.getValue()));
        // this.maxPrice.next(0);
        // this.minPrice.next(0);
        // this.myValue.next(0);
        // this.myValueStart.next(0);
        this.changeDetectionEmitter.emit();
    }

    changeSlider() {
        this.multipleFiltersApply();
    }

    changeSliderExt() {
        this.myValue.next(Math.ceil(this.myValue.value + 1));
        this.myValueStart.next(Math.floor(this.myValueStart.value));
        const result = this._hotelsCopy.filter(hotel => {
            const result = hotel.Price.Amount <= this.myValue.value && hotel.Price.Amount >= this.myValueStart.value;
            return result;
        });
        return !result.length ? this._hotelsCopy : result;
    }

    filterByStar() {
        this.multipleFiltersApply();
    }

    filterByStarEtx(hotels) {
        const tempStars = this.stars.value.filter(h => h.isChecked);
        if (this.stars.value.length === tempStars.length || tempStars.length === 0) {
            return hotels;
        }
        let tempHotels = [];
        for (let hotel of hotels) {
            const result = this.stars.value.find(t => t.stars === (Math.ceil(Number(hotel.StarRating))));
            if (typeof result !== 'undefined' && result.isChecked) {
                tempHotels.push(hotel);
            }
        }
        return tempHotels;
    }

    filterByAmenities() {
        this.multipleFiltersApply();
    }

    filterByLocation() {
        this.multipleFiltersApply();
    }

    filterByBoardType() {
        this.multipleFiltersApply();
    }

    filterByAmenitiesExt(hotels) {
        const selectedAmenities = this.amenities.value.filter(a => a.isChecked);
        if (selectedAmenities.length === 0) {
            return hotels; // No amenities selected, return all hotels
        }
        return hotels.filter(hotel => {
            const providedAmenities = (hotel['HotelAmenities'] || []);
            return selectedAmenities.some(t => {
                const match = t['amenity'];
                return t.isChecked && providedAmenities.includes(match);
            });
        });
    }

    filterByLocationExt(hotels) {
        const selectedLocation = this.location.value.filter(a => a.isChecked);
        if (selectedLocation.length === 0) {
            return hotels; // No amenities selected, return all hotels
        }
        return hotels.filter(hotel => {
            let providedLocation = (hotel['HotelLocation']);
            if (providedLocation && providedLocation != '') {
                providedLocation = providedLocation.toLowerCase()
            }
            return selectedLocation.some(t => {
                const match = t['location'];
                return t.isChecked && providedLocation.toLowerCase() == match;
            });
        });
    }

    filterByBoardTypeExt(hotels) {
        const selectedBoardType = this.boardType.value.filter(a => a.isChecked);
        if (selectedBoardType.length === 0) {
            return hotels; // No amenities selected, return all hotels
        }
        return hotels.filter(hotel => {
            const providedBoardType = (hotel['BoardType'] || []);
            return selectedBoardType.some(t => {
                const match = t['boardType'];
                return t.isChecked && providedBoardType.includes(match);
            });
        });
    }

    filterByHotelNameExt(hotels) {
        const searchText = this.searchHotelName.getValue();
        if (!searchText) {
            return hotels;
        }
        let searchHotelName = searchText.trim();
        const searchTerm = searchHotelName.toLowerCase();
        return hotels.filter(hotel => hotel.HotelName.toLowerCase().includes(searchTerm));
    }

    multipleFiltersApply() {
        let hotels = this.changeSliderExt();
        hotels = this.filterByStarEtx(hotels);
        hotels = this.filterByHotelNameExt(hotels);
        hotels = this.filterByStatusExt(hotels);
        hotels = this.filterByAmenitiesExt(hotels);
        hotels = this.filterByLocationExt(hotels);
        hotels = this.filterByBoardTypeExt(hotels);
        this.hotels.next(hotels);
        //localStorage.setItem('b2bHotels', JSON.stringify(this.hotels.getValue()));
        this.changeDetectionEmitter.emit();
    }

    filterByStatusExt(hotels) {
        const isActive = this.isActive.getValue();
        if (isActive) {
            return hotels.filter(hotel => hotel.Priority === 1);
        } else {
            return hotels; // Show all hotels if inactive
        }
    }
    resetFilter() {
        this.myValue.next(this.maxPrice.value);
        this.myValueStart.next(this.minPrice.value);
        this.maxPrice.next(this.maxPrice.value);
        this.minPrice.next(this.minPrice.value);
        this.clearHotelName.next(true);
        this.clearStatus.next(true)
        this.clearAmenities.next(true)
        this.ratingReset.next(true);
        this.clearLocation.next(true);
        this.clearBoardType.next(true);
        this.changeDetectionEmitter.emit();
    }

    updateData(data) {
        data.CorporateID = +(localStorage.getItem('selectedCorporateId'));
        data.Purpose = localStorage.getItem('selectedPurpose');
        data.BookingType = localStorage.getItem('bookingType');
        data.TrainingId = localStorage.getItem('selectedTrainingId');
        data.TrainingName = localStorage.getItem('selectedTrainingName');
        data.TripId = localStorage.getItem('selectedTripId');
        data.TripName=localStorage.getItem('selectedTripName');
    }

    setHotelInvoiceNumber(appReference) {
        let invoiceNumber = "";
        if (appReference) {
            invoiceNumber = "INV-" + (appReference.split("-")[1]);
        }
        return invoiceNumber;
    }

    setChildAge(child) {
        let childAge = [];
        if (child && child.ChildAge) {
            child.ChildAge.forEach(element => {
                element.childAge ? childAge.push(+(element.childAge)) : childAge.push(+element);
            });
            return childAge;
        }
    }

    setHotelTraveller() {
        const storedState = localStorage.getItem('b2bHotelTraveller');
        if (storedState) {
            this.traveller = (JSON.parse(storedState));
        }
    }

    filterByHotelName(searchText) {
        this.searchHotelName.next(searchText);
        this.multipleFiltersApply();
    }
    
    filterByStatus(isActive: boolean) {
        this.isActive.next(isActive);
        this.multipleFiltersApply();
    }

    getCancelationPolicy(cancellationPolicy, currency) {
        // let policy = JSON.parse(cancellationPolicy.replace(/'/gi, "\""));
        // if (policy.CancelPenalty[0] && policy.CancelPenalty[0].CancelPenalty) {
        //     return policy.CancelPenalty[0].CancelPenalty;
        // }
        if(cancellationPolicy){
            return cancellationPolicy;
        }
        else {
            return "No Cancellation Policy Found"
        }
    }

    getUniqueAmenities(hotels): string[] {
        // Use Set to ensure uniqueness
        const uniqueAmenitiesSet = new Set<string>();
        hotels.forEach((hotel) => {
            // Check if HotelAmenities is defined and not empty
            if (hotel.HotelAmenities && hotel.HotelAmenities.length > 0) {
                hotel.HotelAmenities.forEach((amenity: string) => {
                    uniqueAmenitiesSet.add(amenity);
                });
            }
        });
        // Convert Set back to an array
        return Array.from(uniqueAmenitiesSet);
    }

    getUniqueLocation(hotels): string[] {
        const locationsSet = new Set<string>();
        hotels.forEach(hotel => {
            if (hotel.HotelLocation && hotel.HotelLocation != '') {
                locationsSet.add(hotel.HotelLocation.toLowerCase()); // Case-insensitive comparison
            }
        });
        return Array.from(locationsSet);
    }

    getUniqueBoardType(hotels): string[] {
        // Use Set to ensure uniqueness
        const uniqueBoardTypeSet = new Set<string>();
        hotels.forEach((hotel) => {
            // Check if HotelAmenities is defined and not empty
            if (hotel.BoardType && hotel.BoardType.length > 0) {
                hotel.BoardType.forEach((boardType: string) => {
                    uniqueBoardTypeSet.add(boardType);
                });
            }
        });
        // Convert Set back to an array
        return Array.from(uniqueBoardTypeSet);
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
