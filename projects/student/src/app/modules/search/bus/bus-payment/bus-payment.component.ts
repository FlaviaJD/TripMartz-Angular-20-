import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { BusService } from '../bus.service';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
declare let Razorpay: any;
declare var Cashfree: any;  // Declare Cashfree object if it's loaded externally
import { SubSink } from 'subsink';

@Component({
    selector: 'app-bus-payment',
    templateUrl: './bus-payment.component.html',
    styleUrls: ['./bus-payment.component.scss']
})
export class BusPaymentComponent implements OnInit {
    private subSink = new SubSink();
    busBookingPaxDetails: any;
    booking_source: string = '';
    appReference: string = ""
    loading: boolean;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    showPaymentDetails: boolean = false;
    paymentGateways: any;
    submitted: boolean;
    paymentForm: FormGroup;
    currentUser: any;

    constructor(
        private util: UtilityService,
        private busService: BusService,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.booking_source = params['bookingSource'];
            this.appReference = params.appReference;
        })
        this.createPaymentForm()
        this.setVoucherResponse();
    }

    setVoucherResponse() {
        this.loading = true;
        this.apiHandlerService.apiHandler('busVoucher', 'POST', '', '', {
            AppReference: this.appReference,
            booking_source:this.booking_source
        }).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
                this.busBookingPaxDetails = res.data;
                this.loading = false;
                this.cdRef.detectChanges();
            }
        },
            (err) => {
                this.loading = false;
                this.cdRef.detectChanges();
                this.swalService.alert.oops(err.error.Message);
            });
    }

    setResponseData() {
        this.busService.addBusBookingPaxDetails.subscribe(res => {
            if (typeof res == 'object' && res.hasOwnProperty('BookingPaxDetails')) {
                this.busBookingPaxDetails = res;
            } else {
                this.router.navigate(['/']);
            }
            this.cdRef.detectChanges();
        });
    }

    onBooking() {
        // this.submitted = true;
        // if (!this.paymentForm.valid)
        //     return;

        // if (this.paymentForm.value.paymentMethod == "wallet") {
        this.holdSeat();
        // }
        // this.showPaymentDetails = false;
    }

    createPaymentForm() {
        this.paymentForm = this.fb.group({
            paymentMethod: new FormControl('', [Validators.required])
        });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    
    holdSeat() {
        this.loading = true;
        let request = {
            "AppReference": this.busBookingPaxDetails.BookingDetails.app_reference,
            "booking_source":this.busBookingPaxDetails.BookingDetails.booking_source
        }
        this.apiHandlerService.apiHandler('holdSeatsBus', 'post', '', '', request).subscribe(response => {
            if (response.statusCode == 200 && response.data) {
                this.busService.holdBusData.next(response.data);
                if(localStorage.getItem('bookingType')!='Personal'){
                this.walletPayment(this.appReference);}
                else{
                    this.getPaymentGateWays();
                }
                
            }
            else {
                this.router.navigate(['/']);
            }
        }, (err) => {
            this.swalService.alert.oops(err.error.Message);
            this.router.navigate(['/']);
        });
    }

    walletPayment(appReference) {
        this.loading = true;
         this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: appReference })
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
                this.swalService.alert.oops("Your wallet balence is not sufficient.")
            });
    }

    hide(){
        this.loading=false;
        this.showPaymentDetails=false
    }

    redirectToPayment() {
        this.loading = false;
        this.cdRef.detectChanges();
    }

    reservation() {
        let request = {
            "AppReference": this.appReference,
            "booking_source":this.booking_source
        }
        this.apiHandlerService.apiHandler('bookSeats', 'post', '', '', request).subscribe(response => {
            if (response.statusCode == 200 && response.data) {
                this.busService.busConfirmationData.next(response.data);
                let isApprovalRequired = JSON.parse(localStorage.getItem('studentCurrentUser')).approvar_required;
                (isApprovalRequired == 1) ?
                    this.swalService.alert.success("Ticket Is Sent For Approval.")
                    : this.swalService.alert.success("Ticket Is Confirmed.")
                this.loading = false;
                this.deductFromWallet(this.appReference);
            }
            else {
                this.redirectToPayment();
            }
        }, (err) => {
            this.swalService.alert.oops(err.error.Message);
            this.redirectToPayment();
        });
    }

    deductFromWallet(appReference) {
        this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: appReference }).subscribe(res => {
            if (res) {
                if (res.data[2].order_id) {
                   // this.swalService.alert.success("Your transaction successful.")
                    let isApprovalRequired= JSON.parse(localStorage.getItem('studentCurrentUser')).approvar_required;
                    (isApprovalRequired==1)?this.redirectToConfirmation():this.redirectVoucher();
                }
            }
            else{
                this.swalService.alert.oops(res.msg);
            }

        }, (err) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);        });
    }

    redirectToConfirmation(){
        this.router.navigate(['/search/bus/bus-confirmation'], { queryParams: { appReference: this.appReference,booking_source:this.booking_source } });
    }

    redirectVoucher(){
        this.router.navigate(['/search/bus/bus-voucher'], { queryParams: { appReference: this.appReference,booking_source:this.booking_source } });
    }


    proceedPayment() {
        // this.getPaymentGateWays();
        this.onBooking();
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

    initiatePayment(){
        this.currentUser = this.util.getStorage('studentCurrentUser');
            let date = (new Date().getTime()).toString();
            let order_id=`RAZ${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`;
            localStorage.setItem('order_id', order_id);
            this.subSink.sink = this.apiHandlerService.apiHandler('razorpayTransactionInit', 'post', {}, {}, {
                app_reference: this.appReference,
                order_id: order_id,
                source: "bus",
                payment_type: "razorpay",
                userId: this.currentUser.id,
                email:this.currentUser.email
            }).subscribe(resp => {
                if (resp.statusCode == 201 || resp.statusCode == 200) {
                    this.openRazorpayCheckout(resp.data);
                }
            })
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
                    source: "bus",
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
                const url = `/search/bus/bus-voucher?appReference=${app_reference}&order_id=${OrderId}&booking_source=${booking_source}`;
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
                const url = `/search/bus/bus-voucher?appReference=${app_reference}&booking_source=${booking_source}`;
                window.location.href = url;  // Handle redirection on error
            });
        }
    

    openRazorpayCheckout(resp) {
        localStorage.setItem('app_reference', this.appReference);
        localStorage.setItem('booking_source', this.booking_source);
        const options = {
            key: resp.secret_id,
            amount: resp.amount,
            currency: resp.currency,
            name: 'Test',
            description: 'Bus Transaction',
            handler: function (response: any) {
                this.app_reference = localStorage.getItem('app_reference');
                this.OrderId = localStorage.getItem('order_id');
                this.booking_source = localStorage.getItem('booking_source');
                const url = `/search/bus/bus-voucher?appReference=${this.app_reference}&OrderId=${this.OrderId}&booking_source=${this.booking_source}&paymentId=${response.razorpay_payment_id}`;
                window.location.href = url;
            },
            theme: {
                color: '#F37254',
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    }


    getPaymentGateWays() {
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', {}).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    res.data = res.data.filter(paymentGateway => paymentGateway.remarks !== 'Wallet' && paymentGateway.status==1)
                    this.paymentGateways = res.data;
                    if (res.data && res.data.length > 0) {
                        this.showPaymentDetails = true;
                        this.cdRef.detectChanges();
                    }
                    else {
                        this.showPaymentDetails = false;
                        this.cdRef.detectChanges();
                    }
                }
                else {
                    this.showPaymentDetails = false;
                    this.cdRef.detectChanges();
                }
            }
            else {
                this.swalService.alert.oops('Some thing went wrong');
                this.showPaymentDetails = false;
                this.cdRef.detectChanges();
            }
        }, (err) => {
            if (err && err.err && err.error.msg) {
                this.swalService.alert.oops(err.error.msg);
                this.showPaymentDetails = false;
                this.cdRef.detectChanges();
            }
        });
    }

    redirectToconfirmation(order_id) {
        this.router.navigate(['/bus-voucher'], { queryParams: { AppReference: this.appReference, OrderId: 12512, BookingSource: this.booking_source } });
    }

}
