import { ChangeDetectorRef, Component, OnInit, } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { BusService } from '../../../bus.service';
import { combineLatest } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bus-price-filter',
  templateUrl: './bus-price-filter.component.html',
  styleUrls: ['./bus-price-filter.component.scss']
})
export class BusPriceFilterComponent implements OnInit {
  bus: any;
  busCopy: any;
  myValue: any;
  minPrice: any;
  maxPrice: any;
  min1 = 500;
  max1 = 0;
  step = 100;
  sliderRange: Array<number> = [0, 1];
  stepRange = [this.min1, this.max1];
  currency: string = '';
  minValue: number = 40;
  maxValue: number = 480;
  options: Options = {
    floor: 0,
    ceil: 500,
    hideLimitLabels:true
  };
  priceForm: FormGroup;
  isLoading: boolean = true;

  constructor(
    private busService: BusService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.busService.busCopy.subscribe(res => {
      if (res.length) {
        this.busCopy = res;
        this.currency = this.busCopy[0]['currency_code'];
      } else {
        this.busCopy = [];
      }
      this.cdr.detectChanges();
    });

    this.busService.minPrice.subscribe(res => {
      this.minPrice = res;
      if (this.minPrice > 0) {
        this.min1 = Math.floor(res);
        this.cdr.detectChanges();
      }
    });
    setTimeout(() => {
      this.busService.maxPrice.subscribe(res => {
        this.maxPrice = res;
        if (this.maxPrice > 0) {
          this.max1 = Math.ceil(res);
        }
      });
    });
    combineLatest([this.busService.minPrice, this.busService.maxPrice]).subscribe(res => {
      if (res[0] > 0 && res[1] > 0) {
        this.minValue = Math.floor(res[0]);
        this.maxValue = Math.floor(res[1]);
        this.options = {
          floor: Math.floor(res[0]),
          ceil: Math.floor(res[1]),
          hideLimitLabels:true
        }
      }
    });
    this.cdr.detectChanges();

  }

  createPriceForm(): void {
    this.priceForm = this.fb.group({
      min: new FormControl(this.min1),
      max: new FormControl(this.max1)
    })
  }

  getMaxMinValues() {
    this.busService.minPrice.subscribe(min => {
      this.busService.maxPrice.subscribe(max => {
        this.min1 = Math.floor(min);
        this.max1 = Math.ceil(max) + 1;
        this.cdr.detectChanges();
        this.priceForm.patchValue({
          min: this.min1,
          max: this.max1,
        }, { emitEvent: false });
        this.isLoading = false;
        if (this.max1 > this.min1)
          this.sliderRange = [this.min1, this.max1];
        this.cdr.detectChanges();
      });
    });
    this.cdr.detectChanges();
  }

  onSliderChange(event) {
    this.priceForm.patchValue({
      min: event[0],
      max: event[1],
    }, { emitEvent: false });
    this.busService.myValue.next(event[1]);
    this.busService.myValueStart.next(event[0]);
    this.busService.changeSlider();
    this.cdr.detectChanges();
  }

  rangeChanged(r: any) {
    this.busService.myValue.next(r[1]);
    this.busService.myValueStart.next(r[0]);
    this.busService.changeSlider();
    this.cdr.detectChanges();
  }

  valueChange(minVal) {
    this.busService.myValueStart.next(minVal);
    this.busService.changeSlider();
    this.cdr.detectChanges();
  }

  highValueChange(maxVal) {
    this.busService.myValue.next(maxVal);
    this.busService.changeSlider();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  clearPriceFilter() {
    this.busService.clearPriceFilter();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
  }


}
