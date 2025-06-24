import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { environment } from '../../../../../../../../environments/environment';
import { ApiHandlerService } from '../../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../../core/services/utility.service';
import { HeaderService } from '../../../../../../../shared/components/header/header.service';
import { HotelService } from '../../../../hotel.service';
import { HotelPaymentConfirmationComponent } from '../hotel-payment-confirmation/hotel-payment-confirmation.component';
declare let Razorpay: any;
declare var Cashfree: any;
const b2b_url = `${environment.B2B_URL}/b2b`
export interface DialogData {
    appReference,
    paymentType,
    merchantInvoiceNumber: "Inv002"
}

let $: any
@Component({
    selector: 'app-hotel-payment-detail',
    templateUrl: './hotel-payment-detail.component.html',
    styleUrls: ['./hotel-payment-detail.component.scss']
})
export class HotelPaymentDetailComponent implements OnInit, OnDestroy {

    private subSink = new SubSink();
    room: any;
    paxDetails: any;
    hotel: any;
    pax: any;
    data: any;
    adultCount: any = 0;
    childCount: any = 0;
    currentUser: any;
    paymentForm: FormGroup;
    submitted: boolean;
    appReference: string = "";
    srcUrl: string = "";
    showPaymentModal: boolean = false;
    booking_source: string = '';
    confirmedData: any;
    showConfirmTicket: boolean = true;
    showPaymentDetails: boolean = false;
    paymentGateways: any;
    loadingTemplate: any;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    paymentData: any;

    constructor(
        private hotelService: HotelService,
        private util: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
        private swalService: SwalService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private headerService: HeaderService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.booking_source = params['source'];
            this.appReference = (params.appReference).replace("/", "")
        })
        this.subSink.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {}, {
            AppReference: this.appReference,
            booking_source: this.booking_source
        }).subscribe(data => {
            if (data.statusCode == 201 || data.statusCode == 200) {
                this.room = data.data.BookingItineraryDetails;
                this.hotel = data.data.BookingDetails;
                this.paxDetails = data.data.BookingPaxDetails;
                this.pax = this.paxDetails.length;
                this.paxDetails.forEach((element, i, arr) => {
                    if (i != arr.length) {
                        if (element.PaxType == 'Adult') {
                            this.adultCount += 1;
                        } else if (element.PaxType == 'Child') {
                            this.childCount += 1;
                        }
                    }
                });
            }
        })
        this.createPaymentForm()

    }

    createPaymentForm() {
        this.paymentForm = this.fb.group({
            paymentMethod: new FormControl('', [Validators.required])
        });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    proceedPayment(appReference) {
        this.getPaymentGateWays();
    }

    onBooking() {
        if(localStorage.getItem('bookingType')!='Personal'){
        this.submitted = true;
        let isApprovalRequired= JSON.parse(localStorage.getItem('studentCurrentUser')).approvar_required;
        (isApprovalRequired==1)?this.sendEmail():this.walletPayment(this.appReference); 
        // this.showPaymentDetails = false;
    }
        else{
            this.getPaymentGateWays();
        }
    }


    sendEmail(){
        this.loading = true;
        let request={
            AppReference:this.appReference,
            RequestType:"RaiseRequest"
        }
        this.apiHandlerService.apiHandler('hotelEmail', 'post', {}, {},request).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success("Ticket Is Sent For Approval.")
                this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: this.appReference, source: this.booking_source} })
            }
            else{
                this.loading=false;
                this.swalService.alert.oops(resp.Message);
            }
        }, err => {
            this.loading=false;
            this.swalService.alert.oops(err.error.msg);
        });
    }

   

    getCancelationPolicy(cancellationPolicy) {
        if(cancellationPolicy){
            const penalty = this.hotelService.getCancelationPolicy(cancellationPolicy, this.hotel.Currency);
            return penalty;
        }
       
    }

    getHotelPhoto(imgArrStr) {
        if (imgArrStr != null) {
            return imgArrStr[0];
        } else {
            return '';
        }
    }

    bKashPayment(appReference) {
        let invoiceNumber = this.hotelService.setHotelInvoiceNumber(appReference);
        this.subSink.sink = this.apiHandlerService.apiHandler('completeBooking', 'post', {}, {}, {
            app_reference: appReference,
            payment_type: "bKash",
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
            }
        })
    }

    nagadPayment() {
        this.hotelService.loading.next(true);
        let invoiceNumber = this.hotelService.setHotelInvoiceNumber(this.appReference);
        let date = (new Date().getTime()).toString();
        this.subSink.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: this.appReference,
            order_id: `HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: "nagad",
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.hotelService.loading.next(false);
                window.location = resp.data.callBackUrl
            }
        })
    }

    sslCommerzPayment() {
        let invoiceNumber = this.hotelService.setHotelInvoiceNumber(this.appReference);
        let date = (new Date().getTime()).toString();
        this.subSink.sink = this.apiHandlerService.apiHandler('sslTransactionInit', 'post', {}, {}, {
            app_reference: this.appReference,
            order_id: `HBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.ssl
            }
        })
    }

    paymentConfirm() {
        this.submitted = true;
        if (!this.paymentForm.valid)
            return;
        if (this.paymentForm.value.paymentMethod && this.paymentForm.value.paymentMethod != '') {
            switch (this.paymentForm.value.paymentMethod) {
                case 'razorpay':
                    this.initiatePayment();
                    break;
                case 'cashfree':
                    this.initiateCashFreePayment();
                    break;
                case 'wallet':
                    this.walletPayment(this.appReference);
                    break;
                default:
                    break;
            }
        }
    }

    initiateCashFreePayment(){
        this.currentUser = this.util.getStorage('studentCurrentUser');
        // let payment_session_id="session_FaZVusVzkMLOZDRoXS88-rB55FdWSyo8BIlj0Kw8zf-AG61X5w22NizwtgxEexMKk2YAOPXEodn_qrAG_NeNeM6Jxb3zecnm8sXOV5gAyxAoKCsC-QABKCstiQpaymentpayment"
        localStorage.setItem('app_reference', this.appReference);
        localStorage.setItem('booking_source', this.booking_source);
        if(this.currentUser.phone.length==10){
            let date = (new Date().getTime()).toString();
            let order_id=`order_${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`;
            localStorage.setItem('order_id', order_id);
            this.subSink.sink = this.apiHandlerService.apiHandler('cashfreeTransactionInit', 'post', {}, {}, {
                app_reference: this.appReference,
                order_id: order_id,
                source: "hotel",
                payment_type: "cashfree",
                userId: this.currentUser.id,
                email:this.currentUser.email,
                phone:this.currentUser.phone,
                merchantInvoiceNumber:'Inv002'
            }).subscribe(resp => {
                if (resp.statusCode == 201 || resp.statusCode == 200) {
                    let payment_session_id=resp.data.payment_session_id;
                    this.loadCashfreeCheckout(payment_session_id);
                }
            })
        }
        else{
            this.swalService.alert.opps("Phone Number Should be 10 digits or Please try with another payment gateway");
        }
    }

    loadCashfreeCheckout(sessionId: string) {
        const cashfree = new Cashfree({
            mode: "sandbox"  // Adjust to 'production' as needed
        });
        const getLocalStorageData = () => ({
            app_reference: localStorage.getItem('app_reference'),
            OrderId: localStorage.getItem('order_id'),
            booking_source: localStorage.getItem('booking_source')
        });
        const handleRedirect = (response) => {
            const { app_reference, OrderId, booking_source } = getLocalStorageData();
            const url = `/search/hotel/voucher?AppReference=${app_reference}&order_id=${OrderId}&BookingSource=${this.booking_source}`;
            window.location.href = url;
        };
        cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: "_modal"
        })
        .then((response) => {
            handleRedirect(response);  // Handle successful response
        })
        .catch((error) => {
            this.swalService.alert.opps(error);  // Handle error with alert
            const { app_reference, OrderId, booking_source } = getLocalStorageData();
            const url = `/search/hotel/voucher?AppReference=${app_reference}&order_id=${OrderId}&BookingSource=${this.booking_source}`;
            window.location.href = url;  // Handle redirection on error
        });
    }
    walletPayment(appReference) {
        this.loading = true;
        this.subSink.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
            .subscribe(res => {
                if (res && res.data[0].ticketFare) {
                    if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                        this.loading = false;
                        this.swalService.alert.oops("Your wallet balence is not sufficient.")
                    } else {
                        this.reservation();
                    }
                }
                else{
                    this.swalService.alert.oops(res.msg);
                }
            }, (err) => {
                this.loading = false;
                this.swalService.alert.oops(err.error.Message);
            });
    }

    reservation() {
        this.loading = true;
        this.subSink.sink = this.apiHandlerService.apiHandler('reservation', 'post', {}, {}, {
            AppReference: this.appReference,
            booking_source: this.booking_source
        }).subscribe(resp => {
            if (resp.statusCode == 200) {
                // this.updateSubAgent(resp);
                 this.deductFromWallet(this.appReference);
               // this.hotelService.hotelConfirmationData.next(resp.data);
                //this.router.navigate(['/search/hotel/voucher'], { queryParams: { AppReference: this.appReference } });
                //this.router.navigate(['/search/hotel/confirmation'], { queryParams: { AppReference: this.appReference, source: this.booking_source} });
            } else {
                this.swalService.alert.oops(resp.msg);
                setTimeout(() => {
                    this.loading = false;
                    this.router.navigate(['/search/hotel/payment'], { queryParams: { appReference: this.appReference } });
                }, 100);
            }
        }, err => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
        })
    }

    deductFromWallet(appReference) {
        this.subSink.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: appReference }).subscribe(res => {
            if (res) {
                if (res.data[2].order_id) {
                    this.swalService.alert.success("Booking Is Confirmed.")
                //this.hotelService.hotelConfirmationData.next(resp.data);
                this.router.navigate(['/search/hotel/voucher'], { queryParams: { AppReference: this.appReference } });
                }
            }
            else{
                this.swalService.alert.oops(res.msg);
            }

        }, (err) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);        });
    }

    updateSubAgent(resp) {
        this.currentUser = this.util.getStorage('studentCurrentUser');
        let totalFare: any = 0;
        totalFare += resp.data["BookingDetails"].TotalFair;
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
    }


    getPaymentGateWays() {
        this.showPaymentDetails = true;
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', {}).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.paymentGateways =  res.data.filter((ele) => ele.remarks !='Wallet' && ele.status==1);
                    this.showPaymentDetails = true;
                }
                else {
                    this.swalService.alert.oops('No payment gateway enabled.');
                    this.showPaymentDetails = false;
                }
            }
            else {
                this.swalService.alert.oops('Some thing went wrong');
                this.showPaymentDetails = false;
            }
        }, (err) => {
            if (err && err.err && err.error.msg) {
                this.swalService.alert.oops(err.error.msg);
                this.showPaymentDetails = false;
            }
        });
    }

    initiatePayment(){
        this.currentUser = this.util.getStorage('studentCurrentUser');
            let invoiceNumber = this.hotelService.setHotelInvoiceNumber(this.appReference);
            let date = (new Date().getTime()).toString();
            let order_id=`RAZ${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`;
            localStorage.setItem('order_id', order_id);
            this.subSink.sink = this.apiHandlerService.apiHandler('razorpayTransactionInit', 'post', {}, {}, {
                app_reference: this.appReference,
                order_id:order_id ,
                merchantInvoiceNumber: invoiceNumber,
                source: "hotel",
                payment_type: "razorpay",
                userId: this.currentUser.id,
                email:this.currentUser.email
            }).subscribe(resp => {
                if (resp.statusCode == 201 || resp.statusCode == 200) {
                    this.openRazorpayCheckout(resp.data);
                }
            })
        }

    openRazorpayCheckout(resp) {
        localStorage.setItem('app_reference', this.appReference);
        localStorage.setItem('booking_source', this.booking_source);
        const options = {
            key: resp.secret_id,  // Replace with your Razorpay Key ID
            amount: resp.amount,                // Amount in smallest currency unit (e.g., 50000 means 500.00 INR)
            currency: resp.currency,
            name: 'Test',
            description: 'Hotel Transaction',
            handler: function (response: any) {
                this.app_reference = localStorage.getItem('app_reference');
                this.OrderId = localStorage.getItem('order_id');
                this.booking_source = localStorage.getItem('booking_source');
                const url = `/search/hotel/voucher?AppReference=${this.app_reference}&OrderId=${this.OrderId}&BookingSource=${this.booking_source}&paymentId=${response.razorpay_payment_id}`;
                window.location.href = url;
            },
            theme: {
                color: '#F37254',
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    }

    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num)
            starArr.length = Math.round(num);
        return starArr;
    }

    getStarArrayRemaining(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
            starArr.length = 5 - Math.round(num);
        return starArr;
    }

    getTotalTax() {
        let totalTax: number = 0;
        if (this.hotel.booking_source == 'ZBAPINO00024') {
            this.room.forEach(o => {
                totalTax += (+(o.Tax));
            });
        }else{
            totalTax = this.room[0].Tax || 0;
        }
        
        return totalTax;
    }

    getTotal(){
        let totalAmnt: number = 0;
        // if (this.hotel.booking_source == 'ZBAPINO00024') {
        //     this.room.forEach(o => {
        //         totalAmnt += o.TotalFare;
        //     });
        // }
        // else {
            totalAmnt = this.room[0].TotalFare || 0;
       //}
            return totalAmnt;
    }

    getTotalAmount() {
        let totalAmnt: number = 0;
        if (this.hotel.booking_source == 'ZBAPINO00024') {
            this.room.forEach(o => {
                totalAmnt += o.RoomPrice;
            });
        }
        else{
            totalAmnt = this.room[0].RoomPrice || 0;
        }
        return totalAmnt;
    }


    ngOnDestroy() {
        this.subSink.unsubscribe();
    }
}
