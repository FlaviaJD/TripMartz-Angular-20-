import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { browserRefresh } from '../../../../app.component';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { BusService } from '../bus.service';

@Component({
    selector: 'app-bus-confirmation',
    templateUrl: './bus-confirmation.component.html',
    styleUrls: ['./bus-confirmation.component.scss']
})
export class BusConfirmationComponent implements OnInit {
    bookingSource: any;
    orderId: any;
    appReference: string = "";
    loading: boolean = true;
    bookSeatResponse: any = [];
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    browserRefresh: boolean;

    constructor(
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private swalService: SwalService,
        private busService: BusService

    ) { }

    ngOnInit(): void {
        this.browserRefresh = browserRefresh;
        this.route.queryParams.subscribe(params => {
            this.appReference = (params.appReference).replace("/", "")
            //this.orderId = (params.OrderId).replace("/", ""),
            this.bookingSource = (params.booking_source).replace("/", "")
        });
        this.getVoucherData();
        if (this.browserRefresh) {
            this.setConfirmationData();
            return;
        }
        //this.checkPaymentStatus();
    }

    getVoucherData() {
        this.loading = true;
        this.apiHandlerService.apiHandler('busVoucher', 'POST', '', '', {
          AppReference: this.appReference,
          booking_source:this.bookingSource
        }).subscribe(res => {
          if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
            this.bookSeatResponse = res.data;
            this.loading = false
            this.cdRef.detectChanges();
          }
        },
          (err) => {
            this.loading = false;
            this.cdRef.detectChanges();
            this.swalService.alert.oops(err.error.Message);
          });
      }
    
    

      
    checkPaymentStatus() {
        this.loading = true;
        let req = {
            app_reference: this.appReference,
            order_id: this.orderId
        }
        this.apiHandlerService.apiHandler('busPaymentConfirmation', 'post', {}, {},
            req).subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.reservation();
                }
                else {
                    this.intializeValue();
                }
            }, (err) => {
                this.intializeValue();
            });
    }

    reservation() {
        let request = {
            "AppReference": this.appReference
        }
        this.apiHandlerService.apiHandler('bookSeats', 'post', '', '', request).subscribe(response => {
            if (response.statusCode == 200 && response.data) {
                this.busService.busConfirmationData.next(response.data);
            }
            else {
                this.busService.busConfirmationData.next({});
                this.intializeValue();
            }
        }, (err) => {
            this.busService.busConfirmationData.next({});
            this.swalService.alert.oops(err.error.Message);
            this.intializeValue();
        });
    }

    intializeValue() {
        this.busService.busConfirmationData.subscribe(data => {
            if (Object.keys(data).length === 0) {
                this.router.navigate(['/']);
            }
            this.bookSeatResponse = data;
            localStorage.setItem('bookSeatResponse', JSON.stringify(this.busService.busConfirmationData.getValue()));
            this.loading = false;
            this.cdRef.detectChanges();
        })
    }

    getFormtedStatus(status: string) {
        if (status != null) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
        }
    }

    setConfirmationData(){
        const storedState = localStorage.getItem('bookSeatResponse');
        if (storedState) {
            this.busService.busConfirmationData.next(JSON.parse(storedState));
            this.intializeValue();
        }
    }
    

    onSubmit() {
        this.router.navigate(['/bus-voucher'], { queryParams: { appReference: this.appReference } });
    }
}
