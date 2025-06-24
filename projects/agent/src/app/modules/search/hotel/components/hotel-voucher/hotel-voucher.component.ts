import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/employee/src/app/core/api-handlers';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { UtilityService } from 'projects/employee/src/app/core/services/utility.service';
import { finalize } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { HotelService } from '../../hotel.service';

@Component({
    selector: 'app-hotel-voucher',
    templateUrl: './hotel-voucher.component.html',
    styleUrls: ['./hotel-voucher.component.scss']
})
export class HotelVoucherComponent implements OnInit {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSink = new SubSink();
    voucher:any;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loggedInUser: any;
    isLoading: boolean = true;
    noOfAdults: number = 0;
    noOfChild: number = 0;
    showPayment: boolean = true;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'voucher-print',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    app_reference: any;
    order_id: any;
    razorpay_payment_id: any;
    loading: boolean;
    booking_source: any;
    queryParams: any;
    isCashFree: boolean;
    private subSunk = new SubSink();
    constructor(
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService,
        private hotelService: HotelService,
        private exportAsService: ExportAsService,
        private router: Router,
        private swalService: SwalService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
        this.hotelService.loading.next(true);
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams.AppReference);
            this.booking_source=queryParams.BookingSource ? (queryParams.BookingSource) : "";
           if (queryParams['OrderId']) {
               this.isCashFree = false;
               this.razorpay_payment_id = queryParams['paymentId'] ? (queryParams['paymentId']).replace("/", "") : "";
               this.order_id = queryParams['OrderId'] ? (queryParams['OrderId']).replace("/", "") : "";
           }
           if (queryParams['order_id']) {
               this.app_reference = localStorage.getItem("app_reference");
               this.booking_source = localStorage.getItem("booking_source");
               this.isCashFree = true;
               this.order_id = queryParams['order_id'] ? (queryParams['order_id']).replace("/", "") : "";
           }
       });
        if(this.razorpay_payment_id){
            this.checkPaymentStatus();
        }
        if (this.isCashFree) {
            this.checkCashifyPaymentGateway();
          }
        
        this.activatedRoute.queryParams.subscribe(q => {
            if (!this.util.isEmpty(q)) {
                this.queryParams=q;
                this.bookingConfirmation(q);
            }
        })
    }

    checkCashifyPaymentGateway() {
        this.loading=true;
        let req = {
            app_reference: this.app_reference,
            order_id: this.order_id,
            userId:this.loggedInUser.id
        }
        this.apiHandlerService.apiHandler('cashfreeTransactionStatus', 'post', {}, {},
            req).subscribe(resp => {
                this.loading=false;
                if (resp.statusCode == 200 && resp.data && resp.data.isSuccess) {
                    this.reservation();
                } else {
                    this.loading=false;
                    this.swalService.alert.oops(resp.msg);
                }
            }, err => {
                this.loading=false;
                this.swalService.alert.oops(err.error.Message);
            })
      }

    checkPaymentStatus() {
        this.loading=true;
        let req = {
            app_reference: this.app_reference,
            order_id: this.order_id,
            txnId:this.razorpay_payment_id,
            userId:this.loggedInUser.id
        }
        this.apiHandlerService.apiHandler('razorpayTransactionStatus', 'post', {}, {},
            req).subscribe(resp => {
                this.loading=false;
                if (resp.statusCode == 200 && resp.data && resp.data.isPaymentSuccess) {
                    this.reservation();
                } else {
                    this.loading=false;
                    this.swalService.alert.oops(resp.msg);
                }
            }, err => {
                this.loading=false;
                this.swalService.alert.oops(err.error.Message);
            })
    }

    reservation() {
        this.loading=true;
        this.subSink.sink = this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
            AppReference: this.app_reference,
            booking_source: this.booking_source
        }).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.loading=false;
                this.bookingConfirmation(this.queryParams);
                
            } else {
                this.loading=false;
                this.swalService.alert.oops(resp.msg);
            }
        }, err => {
            this.loading=false;
            this.swalService.alert.oops(err.error.Message);
        })
    }


    bookingConfirmation(q) {
        this.loading=true;
        this.subSink.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {}, q)
            .pipe(
                finalize(() => {
                    this.hotelService.loading.next(false);
                    this.loading = false;
                })
            )
            .subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.hotelService.loading.next(false);
                    this.voucher = resp.data;
                    this.voucher['BookingPaxDetails'].forEach((element, i) => {
                        if (i < this.voucher['BookingPaxDetails'].length ) {
                            if (element['PaxType'] == 'Child') {
                                this.noOfChild++;
                            } else if (element['PaxType'] == 'Adult') {
                                this.noOfAdults++;
                            }
                        }
                    });
                }
            }, err => {
                this.loading=false;
                this.hotelService.loading.next(false);
                console.error(err);
            });
    }

    
    getDatesFormat(date) {
        date = date.split(' ')[0];
        let d = new Date(date).getDate(), m = new Date(date).toDateString().split(' ')[1], y = new Date(date).getFullYear(), day = new Date(date).toDateString().split(' ')[0];
        day = this.util.getWeekDay(day);
        return `${day + ',&nbsp;' + d + '&nbsp;' + m + '&nbsp;' + y}`
    }


    getTimes(t: string): string {
        t = t.split(' ')[1];
        let time = Number(t.split(':')[0]);
        if (time > 12) {
            return `${t} PM`;
        } else if (time < 12) {
            return `${t} AM`;
        } if (time == 12) {
            return `${t} PM`;
        }
    }

    getRoomType(roomName: string): string {
        roomName = roomName.split('-')[0].trim();
        return `${roomName}`;
    }

    getTotalAmount() {
        let totalAmnt: number = 0;
        if (this.voucher.BookingDetails.booking_source == 'ZBAPINO00024') {
            this.voucher['BookingItineraryDetails'].forEach(o => {
                totalAmnt += o.RoomPrice;
            });
        }else{
            totalAmnt =this.voucher['BookingItineraryDetails'][0].RoomPrice;
    }
        return totalAmnt;
    }

    getTotalTax() {
        let totalTax: number = 0;
        if (this.voucher.BookingDetails.booking_source == 'ZBAPINO00024') {
            this.voucher['BookingItineraryDetails'].forEach(o => {
                totalTax +=  (+(o.Tax));
            });
        }else{
            totalTax =this.voucher['BookingItineraryDetails'][0].Tax;
    }
        return totalTax;
    }

    getBoardType(roomName: string): string {
        let temp = roomName.split('-'), boardType = '';
        temp.forEach((s, i) => {
            if (i > 0 && i < temp.length - 1) {
                boardType += s;
                boardType += (i < temp.length - 2) ? '-' : '';
            }
        })
        return `${boardType}`;
    }

    getCancelationPolicies(policyArr) {
        let cancellationPolicy: string = '';
        policyArr.forEach((policy) => {
            cancellationPolicy += `Cancellations made ${policy.HoursBefore} hours before Check-In, ${policy.Penalty.Currency} ${policy.Penalty.Value} will be charged as cancellation penalty.<br>`;
        });
        return cancellationPolicy;
    }

    getCancelationPolicy(cancellationPolicy) {
        if(cancellationPolicy){
            return cancellationPolicy;
        }
        else {
            return "No Cancellation Policy Found";
        }
    }
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    public downloadPDF(isWithPrice: boolean) {
        window.scroll(0, 0);

        var data = document.getElementById('print_voucher');
        const date = new Date().toDateString();
        setTimeout(() => {
            html2canvas(data, {
                allowTaint: true,
                useCORS: true
            }).then(canvas => {
                const contentDataURL = canvas.toDataURL('image/png', 1.0)
                let pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(contentDataURL);
                var width = pdf.internal.pageSize.getWidth() - 3;
                var height = (imgProps.height * width) / imgProps.width;
                pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
                this.swalService.alert.success();
                pdf.save(`${this.voucher['BookingDetails']['AppReference']}- ${this.voucher['BookingDetails']['ConfirmationReference']} -${date}.pdf`);
            });
        }, 1000)
    }

    download(type: SupportedExtensions, isWithPrice: boolean, orientation?: string) {
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `${this.voucher['BookingDetails']['AppReference']}- ${this.voucher['BookingDetails']['ConfirmationReference']} -${date}`).subscribe((_) => {
            // save started `${this.voucher['BookingDetails']['AppReference']}- ${this.voucher['BookingDetails']['ConfirmationReference']} -${date}`
        }, (err) => {
        });
    }

    cancel() {
        this.router.navigate(['/hotel/hotel-cancellation'], {
            queryParams: { "AppReference": this.voucher['BookingDetails']['AppReference'] }
        })
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    downloadWithPrice(t: boolean) {
        this.showPayment = t;
    }

    getTotalFare(itinarary: any) {
        let totalFare: any = 0;
        itinarary.forEach(element => {
            totalFare += element.TotalFare;
        });
        return totalFare;
    }

    getHotelPhoto(imgArrStr) {
        if (imgArrStr != null) {
            return imgArrStr[0];
        } else {
            return '';
        }

    }

    ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }

}
