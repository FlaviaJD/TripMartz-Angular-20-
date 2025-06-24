import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../hotel.service';

@Component({
    selector: 'app-sorting-hotels',
    templateUrl: './sorting-hotels.component.html',
    styleUrls: ['./sorting-hotels.component.scss']
})
export class SortingHotelsComponent implements OnInit, OnDestroy {

    protected subs = new SubSink();
    active = 'byPrice';
    byName = true;
    byStars = true;
    byPrice = true;
    availableSotrs = [];

    constructor(
        private hotelService: HotelService
    ) { }

    ngOnInit() {
        this.availableSotrs = this.hotelService.availableOptions['sorts'];
        this.subs.sink = this.hotelService.applySortingAfterFilter.subscribe(res => {
            if (res) {
                switch (this.active) {
                    case 'byName':
                        this.sortByName(true);
                        break;
                    case 'byStars':
                        this.sortByStars(true);
                        break;
                    case 'byPrice':
                        this.sortByPrice(true);
                    default:
                        break;
                }
            }
        });
    }


    isDisabled(n: string): object {
        return { 'anchorDisabled': !this.availableSotrs.includes(n) }
    }

    sortByName(internalCall: boolean = false) {
        this.active = 'byName';
        this.byName = internalCall ? this.byName : !this.byName;
        let sortedHotels;
        const hotels = this.hotelService.hotels.value;
        if (this.byName) {
            sortedHotels = hotels.sort((a, b) => {
                const resultA = a['HotelName'].toUpperCase();
                const resultB = b['HotelName'].toUpperCase();
                return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
            });
        } else { // descending order
            sortedHotels = hotels.sort((a, b) => {
                const resultA = a['HotelName'].toUpperCase();
                const resultB = b['HotelName'].toUpperCase();
                return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
            });
        }
        this.hotelService.hotels.next(sortedHotels);
    }

    sortByStars(internalCall: boolean = false) {
        this.active = 'byStars';
        this.byStars = internalCall ? this.byStars : !this.byStars;
        let sortedHotels;
        const hotels = this.hotelService.hotels.value;
        if (this.byStars) {
            sortedHotels = hotels.sort((a, b) => {
                const resultA = Number(a['StarRating'] ? a['StarRating'] : 0);
                const resultB = Number(b['StarRating'] ? b['StarRating'] : 0);
                return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
            });
        } else { // descending order
            sortedHotels = hotels.sort((a, b) => {
                const resultA = Number(a['StarRating']);
                const resultB = Number(b['StarRating']);
                return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
            });
        }
        this.hotelService.hotels.next(sortedHotels);
    }

    sortByPrice(internalCall: boolean = false) {
        this.active = 'byPrice';
        this.byPrice = internalCall ? this.byPrice : !this.byPrice;
        let sortedHotels;
        const hotels = this.hotelService.hotels.value;
        if (this.byPrice) {
            sortedHotels = hotels.sort((a, b) => {
                const resultA = Number(a['Price']['Amount'] ? a['Price']['Amount'] : 0);
                const resultB = Number(b['Price']['Amount'] ? b['Price']['Amount'] : 0);
                return resultA == resultB ? 0 : resultA > resultB ? -1 : 1;
            });
        } else { // descending order
            sortedHotels = hotels.sort((a, b) => {
                const resultA = Number(a['Price']['Amount']);
                const resultB = Number(b['Price']['Amount']);
                return resultA == resultB ? 0 : resultA > resultB ? 1 : -1;
            });
        }
        this.hotelService.hotels.next(sortedHotels);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
