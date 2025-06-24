import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { ModalConfigDataI } from 'projects/student/src/app/shared/service/mat-modal.service';
import { SubSink } from 'subsink';
import { HotelService } from '../../hotel.service';

export function getAlertConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), {
        placement: 'right',
        container: 'body',
    });
}

@Component({
    selector: 'app-hotel-booking',
    templateUrl: './hotel-booking.component.html',
    styleUrls: ['./hotel-booking.component.scss'],
    providers: [{ provide: TooltipConfig, useFactory: getAlertConfig }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelBookingComponent implements OnInit {

    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue'
    };
    isCollapsed = true;
    isCollapsedFareSumm = true;
    isCollapsedGst = true;
    isCollapsedServiceReqs = true;
    modalConfigData: ModalConfigDataI;
    hotel: any;
    flightString: any;
    traveller: any = false;
    travellerString: any;
    contactForm: FormGroup;
    usaDetailsForm: FormGroup;
    titles: any = [];
    infantsTitles: any = [];
    countries: any = [];
    loading: boolean;
    isConfirmed = false;
    maxDate = new Date();
    maxDateAdult: any;
    minDateAdult: any;
    maxDateChild: any;
    minDateChild: any;
    maxDateInfant: any;
    minDateInfant: any;
    extraServices = false;
    currentUser: any;
    airline_logo: string = '';
    protected subs = new SubSink();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private hotelService: HotelService,
        private utility: UtilityService,
        private cdRef: ChangeDetectorRef,
    ) {
    }
    ngOnInit() {
        this.currentUser = this.utility.readStorage('studentCurrentUser', localStorage);
        this.airline_logo = this.hotelService.hotel_logo;
        this.hotelService.userTitleList.subscribe(res => {
            if (res) {
                this.titles = res;
                this.infantsTitles = res.filter(t => t.id == 3 || t.id == 4);
            }
        });
        this.hotelService.countryList.subscribe(res => {
            this.countries = res;
        });
        this.subs.sink = this.hotelService.loading.subscribe(res => {
            this.loading = res;
        });
        this.setHotelTraveller();
        this.setBookingHotelData();
        this.subs.sink = this.hotelService.bookingHotelData.subscribe(res => {
            if (!res) {
                this.router.navigate(['/dashboard']);
            }
            this.traveller = this.hotelService.traveller;
            // if (res && res.RoomDetails) {
            //     res.RoomDetails = res.RoomDetails.sort((a, b) => a.Price.Amount - b.Price.Amount);
            // }
            this.hotel = res;
            this.cdRef.detectChanges();
        });
        this.maxDateAdult = this.addYearsToDate(-12);
        this.minDateAdult = this.addYearsToDate(-100);

        this.maxDateChild = this.addYearsToDate(-2);
        this.minDateChild = this.addYearsToDate(-12);

        this.maxDateInfant = new Date();
        this.minDateInfant = this.addYearsToDate(-2);
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }


    addYearsToDate(y: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month, day);
        return c;
    }

    setBookingHotelData() {
        const storedState = localStorage.getItem('b2bBookingHotelData');
        if (storedState) {
            this.hotelService.bookingHotelData.next(JSON.parse(storedState));
        }
    }

    setHotelTraveller() {
        this.hotelService.setHotelTraveller();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
