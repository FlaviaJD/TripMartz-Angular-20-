import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';
import { Options } from '@angular-slider/ngx-slider';

@Component({
    selector: 'app-hotel-price-filter',
    templateUrl: './hotel-price-filter.component.html',
    styleUrls: ['./hotel-price-filter.component.scss']
})
export class HotelPriceFilterComponent implements OnInit, AfterViewInit, OnDestroy {
    invert = true;
    flights: any;
    flightsCopy: any;
    myValue: any;
    minPrice: any;
    maxPrice: any;

    min1 = 560.00;
    max1 = 0.00;
    step = 100;
    stepRange = [this.min1, this.max1];
    currency = 'INR';
    // showRange: boolean = false;

    protected subs = new SubSink();
    minValue: number = 0;
    maxValue: number = 0;
    options: Options = {
        floor: 0,
        ceil: 0,
        hideLimitLabels:true
    }

    constructor(
        private hotelService: HotelService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subs.sink = this.hotelService.maxPrice.subscribe(res => {
            this.maxPrice = res;
            if (this.maxPrice >=0) {
                this.max1 = Math.ceil(res);
                // this.showRange = true;
                this.cdr.detectChanges();
            }
        });
        this.subs.sink = this.hotelService.minPrice.subscribe(res => {
            this.minPrice = res;
            if (this.minPrice >=0) {
                this.min1 = Math.floor(res);
                this.cdr.detectChanges();
                
            }
        });
        this.subs.sink = combineLatest([this.hotelService.minPrice, this.hotelService.maxPrice]).subscribe(res => {
            if (res[0] >=0 && res[1] >=0) {
                this.stepRange = [Math.floor(res[0]), Math.ceil(res[1])];
                this.minValue = Math.floor(res[0])
                this.maxValue = Math.floor(res[1])
                if(Math.floor(res[0]) == Math.floor(res[1])){
                    this.options = {
                        floor: Math.floor(res[0]),
                        ceil: Math.floor(res[1]),
                        hideLimitLabels:true
                    }
                }else{
                    this.options = {
                        floor: Math.floor(res[0]),
                        ceil: Math.floor(res[1]),
                        hideLimitLabels:true
                    }
                }
                
                this.cdr.detectChanges();
            }
        });
    }

    rangeChanged(r: any) {
        this.hotelService.myValue.next(r[1]);
        this.hotelService.myValueStart.next(r[0]);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }

    valueChange(minVal){
        this.hotelService.myValueStart.next(minVal);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }
    highValueChange(maxVal){
        this.hotelService.myValue.next(maxVal);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }
    clearPriceFilter() {
        this.hotelService.myValue.next(this.hotelService.maxPrice.value);
        this.hotelService.myValueStart.next(this.hotelService.minPrice.value);
        this.hotelService.maxPrice.next(this.hotelService.maxPrice.value);
        this.hotelService.minPrice.next(this.hotelService.minPrice.value);
        this.hotelService.changeSlider();
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
