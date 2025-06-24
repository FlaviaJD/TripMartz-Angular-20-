import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../hotel.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-hotel-confirmation',
    templateUrl: './hotel-confirmation.component.html',
    styleUrls: ['./hotel-confirmation.component.scss']
})
export class HotelConfirmationComponent implements OnInit {

    protected subSink = new SubSink();
    hotelDetails: any;
    paxDetails: any;
    roomDetails: any;
    bookingDetails: any;
    totalFare: any = 0;
    nights: any;
    appReference: string = "";
    orderId: string = "";
    bookingSource: any;
    currentUser: any;
    isLoading: boolean;

    constructor(
        private hotelService: HotelService,
        private util: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.appReference = (params.AppReference).replace("/", "")
            this.bookingSource = params.source ? (params.source).replace("/", "") : null;
        })
        this.bookingConfirmation();
    }



    bookingConfirmation() {
        this.hotelService.loading.next(true);
        this.subSink.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {},  {
            "AppReference": this.appReference,
        })
            .pipe(
                finalize(() => {
                    this.hotelService.loading.next(false);
                    this.intializeValue();
                    this.isLoading = false;
                })
            )
            .subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.hotelService.loading.next(false);
                    this.hotelService.hotelConfirmationData.next(resp.data);
                }
            }, err => {
                this.hotelService.loading.next(false);
            });
    }

    reservation() {
        this.hotelService.loading.next(true);
        this.subSink.sink = this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
            AppReference: this.appReference,
            booking_source: this.bookingSource
        }).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.currentUser = this.util.getStorage('studentCurrentUser');
                let totalFare: any = 0;
                // resp.data["BookingItineraryDetails"].forEach(itinerary => {
                totalFare += resp.data["BookingItineraryDetails"][0].RoomPrice;
                // });
                let balance = String(this.currentUser.agent_balance - totalFare);
                this.subSink.sink = this.apiHandlerService.apiHandler('updateSubAgent', 'post', {}, {}, {
                    id: this.currentUser.id,
                    agent_balance: balance
                }).subscribe(res => {
                    if (resp.statusCode == 201) {
                        this.subSink.sink = this.apiHandlerService.apiHandler('getAgentById', 'post', {}, {}, {
                            id: this.currentUser.id
                        }).subscribe(data => {
                            res['data']['access_token'] = this.currentUser.access_token;
                            localStorage.setItem('studentCurrentUser', JSON.stringify(res['data']));
                        });
                    }
                })
                this.hotelService.hotelConfirmationData.next(resp.data);
                this.intializeValue()
            } else {
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 100);
            }
        }, err => {
            console.error(err);
        })
        this.hotelService.loading.next(false);
    }

    intializeValue() {
        this.subSink.sink = this.hotelService.hotelConfirmationData.subscribe(data => {
            if (Object.keys(data).length === 0) {
                this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: this.appReference, source:this.bookingSource } });
            }
            this.hotelDetails = data;
            this.paxDetails = this.hotelDetails.BookingPaxDetails;
            this.bookingDetails = this.hotelDetails.BookingDetails;
            this.roomDetails = this.hotelDetails.BookingItineraryDetails;
        })
        this.paxDetails = this.hotelDetails.BookingPaxDetails;
        this.bookingDetails = this.hotelDetails.BookingDetails;
        this.roomDetails = this.hotelDetails.BookingItineraryDetails;
    }

     getCancelationPolicy(cancellationPolicy) {
        if(cancellationPolicy){
            const penalty = this.hotelService.getCancelationPolicy(cancellationPolicy, this.bookingDetails.Currency);
            return penalty;
        }
       
    }

    getTotalTax() {
        let totalTax: number = 0;
        this.hotelDetails['BookingItineraryDetails'].forEach(o => {
            totalTax +=  (+(o.Tax));
        });
        return totalTax;
    }

    getTotalAmount() {
        let totalAmnt: number = 0;
        this.hotelDetails['BookingItineraryDetails'].forEach(o => {
            totalAmnt += o.RoomPrice;
        });
        return totalAmnt;
    }
    getHotelPhoto(imgArrStr) {
        if (imgArrStr != null) {
            return imgArrStr[0];
        } else {
            return '';
        }
    }

    goToVoucher(appRef: any) {
        this.router.navigate(['/search/hotel/voucher'], { queryParams: { AppReference: appRef } });
    }

}
