import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/agent/src/app/core/api-handlers';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';
import { UtilityService } from 'projects/agent/src/app/core/services/utility.service';
import { HeaderService } from 'projects/agent/src/app/shared/components/header/header.service';
import { SubSink } from 'subsink';
import { environment } from '../../../../../../environments/environment';
import { browserRefresh } from '../../../../../app.component';
import { FlightService } from '../../flight.service';

const b2b_url = `${environment.B2B_URL}/b2b`
@Component({
    selector: 'app-booking-confirm',
    templateUrl: './booking-confirm.component.html',
    styleUrls: ['./booking-confirm.component.scss']
})
export class BookingConfirmComponent implements OnInit {
    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    srcUrl: string = "";
    public browserRefresh: boolean;
    currentUser: any;
    todayDate = new Date();
    confirmedData: any;
    contact: any;
    airline_logo: string = '';
    private subSunk = new SubSink();
    isChild = false;
    showConfirmTicket: boolean = true;
    showConfirmButtons: boolean = true;
    appReference: string;
    ReservationResultIndex: string;
    ticketServerData: any;
    journeyListData: any;
    loading: boolean;
    primaryColour: any;
    secondaryColour: any;
    loggedInUser: any;
    navigationData: any;
    paymentGateways: any;
    orderId: "";
    segment_indicator0:any;
    segment_indicator1:any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'print_voucher',
        options: {
            jsPDF: {
                orientation: 'portrait'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    paymentForm: FormGroup;
    submitted: boolean;
    showPaymentDetails: boolean;
    paymentData: any;
    passengersDetails:any=[];
    app_reference;

    constructor(
        private flightService: FlightService,
        private router: Router,
        private exportAsService: ExportAsService,
        private swalService: SwalService,
        private util: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private headerService: HeaderService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getLoggedInUser();
        this.subSunk.sink = this.flightService.loading.subscribe(res => {
            this.loading = res;
        });
        //this.createPaymentForm();
        this.browserRefresh = browserRefresh;
        //this.checkPayment();
        let ticket = this.util.readStorage('ticketCache', localStorage);
        if ( ticket) {
            this.app_reference=ticket.AppReference;
            this.getVoucherData();
            // this.confirmedData = ticket;
            // this.setPNRData(this.confirmedData);
            // if (this.confirmedData.BookingStatus.toUpperCase()==="BOOKING_CONFIRMED") {
            //     this.showConfirmTicket = false; // Added to hide "confirm ticket" button when status is BOOKING_CONFIRMED
            // }
            // if (this.confirmedData.PassengerDetails[0].TicketNumber) {
            //     this.showConfirmTicket = false;
            // }
            // this.airline_logo = this.flightService.airline_logo;
            // this.currentUser = this.util.readStorage('currentUser', localStorage);
            return;
        }
        this.onPageLoadBackup();
    }

    getVoucherData() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.generatePassengerData(resp);
                    for(let flightTransaction of resp.data[0].FlightBookingTransaction){
                        flightTransaction.flightBookingTransactionItineraries.forEach((element, i) => {
                          if (element.attributes) {
                                let attributes = element.attributes.replace(/\"/gi, "\"");
                                element.attributes = JSON.parse(attributes);
                            }
                        });
                    }
                    this.confirmedData = resp.data[0] || [];
                    let flightItineraries:any=this.flightService.filterUniqueZBAPINO00003Source(this.confirmedData);
                    const combinedFlights = [].concat(...flightItineraries);
                    this.confirmedData.FlightBookingTransaction= combinedFlights.sort((a, b) => a.segment_indicator - b.segment_indicator);
                
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
    }

    generatePassengerData(resp) {
        if (resp && resp.data && resp.data.length > 0) {
            let data = resp.data[0];
            this.passengersDetails= [];
            data.FlightBookingTransaction.forEach((flightTransaction) => {
                flightTransaction.flightBookingTransactionPassengers.forEach((passenger, index) => {
                    if (!this.passengersDetails[index]) {
                        this.passengersDetails[index] = [];
                    }
                    this.passengersDetails[index].push(passenger);
                });
            });
        }
    }

   
    getLoggedInUser(){
        this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.loggedInUser && this.loggedInUser['auth_role_id'] == 5)
            this.getPrevilegeForThisUser();
    }

    onPageLoadBackup() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.appReference = (params.AppReference).replace("/", "");
            this.ReservationResultIndex = (params.ReservationResultIndex).replace("/", "");
            if (this.appReference && this.appReference != "") {
                let req = { 'ReservationResultIndex': this.ReservationResultIndex }
                this.subSunk.sink = this.apiHandlerService.apiHandler('reservationResponse', 'post', '', '', req).subscribe(res => {
                    if (res && res.data) {
                        this.flightService.FinalBookingResponse.next(res.data.FinalBooking.BookingDetails);
                        this.ticketServerData = res.data.FinalBooking.BookingDetails;
                        this.confirmedData = this.ticketServerData;
                        this.setPNRData(this.confirmedData);
                        this.util.writeStorage("ticketCache", this.ticketServerData, localStorage)
                        this.journeyListData = this.confirmedData.JourneyList;
                        if (this.confirmedData.PassengerDetails[0].TicketNumber) {
                            this.showConfirmTicket = false;
                        }
                        this.airline_logo = this.flightService.airline_logo;
                        this.currentUser = this.util.readStorage('currentUser', localStorage);
                        // this.contact = res.data.PassengerContactDetails;
                        // this.isChild = Boolean(res.PassengerDetails.filter(t => t.PassengerType == 'Child').length);
                    }
                    else{
                        this.router.navigate(['/dashboard']);
                    }
                },(err)=>{
                    this.swalService.alert.oops(err.error.Message);
                    this.router.navigate(['/dashboard']);
                });
            } else {
                this.confirmedData = this.util.readStorage('ticketCache', localStorage);
                if (this.confirmedData.PassengerDetails[0].TicketNumber) {
                    this.showConfirmTicket = false;
                }
                this.airline_logo = this.flightService.airline_logo;
            }
        })
    }

    onPageLoad() {
        this.currentUser = this.util.readStorage('currentUser', localStorage);
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
            let Countries = res.data.popular_countries.concat(res.data.countries);
            let country = Countries.find(list => list.id === this.currentUser.country);
            this.currentUser.country = country.name;
        });
        this.airline_logo = this.flightService.airline_logo;
        this.flightService.FinalBookingResponse.subscribe(res => {
            if (typeof res == 'object' && res.hasOwnProperty('BookingId')) {
                this.confirmedData = res;
                this.util.writeStorage("ticketCache", res, localStorage)
                this.isChild = Boolean(res.PassengerDetails.filter(t => t.PassengerType == 'Child').length);
                this.contact = res.PassengerContactDetails;
            } else {
                this.router.navigate(['/dashboard']);
            }
        });

    }

    checkPayment() {
        this.activatedRoute.queryParams.subscribe(params => {
            let appReference = (params.AppReference).replace("/", "");
            //this.orderId = params.orderId ? (params.orderId).replace("/", "") : '';
            if (appReference && this.orderId) {
                let req = {
                    app_reference: appReference,
                    //order_id: this.orderId
                    booking_source: "ZBAPINO00019"
                }
                this.subSunk.sink = this.apiHandlerService.apiHandler('paymentConfirmation', 'post', {}, {},
                    req).subscribe(resp => {
                        if ((resp.statusCode == 201 || resp.statusCode == 200) && resp.data) {
                            this.callPnrTicket(this.confirmedData);
                        }
                    })
            }
        })
    }

    passengerType(code: string): string {
        let result = 'Infant';
        switch (code) {
            case 'ADT':
                result = 'Adult';
                break;

            case 'CHD':
                result = 'Child';
                break;

            default:
                break;
        }
        return result;
    }

    duration(origin, destination) {
        const startDate = new Date(origin);
        // Do your operations
        const endDate = new Date(destination);
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        return hours + ' hr ' + (minutes - (hours * 60)) + ' min';

    }

    getFormtedStatus(status: string) {
        if (status != null) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
        }
    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'Kg' || bg[1] == 'KGS') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    downloadA4(type: SupportedExtensions, orientation?: string): void {
        this.loading=true;
        window['html2canvas'] = html2canvas;
        const date = new Date().toDateString();
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
            // x: '0px',
            // y: '0px'
        });
        const content = this.print_voucher.nativeElement;
        doc.html(content, {
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                scale: 600 / content.scrollWidth
            },
            callback: async (doc) => {
                doc.save(`confirm_booking.pdf`);
                this.swalService.alert.success();
                this.loading=false;
                this.cdr.detectChanges();
            }
        });

    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    createPaymentForm() {
        this.paymentForm = this.fb.group({
            paymentMethod: new FormControl('', [Validators.required])
        });
    }

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    hide() {
        this.showPaymentDetails = false;
        //this.showConfirmTicket = false; // Commented since it was hiding confirm ticketing button while trying to close the payment model
    }


    paymentConfirm() {
        this.submitted = true;
        this.loading = true;
        if (!this.paymentForm.valid){
            this.loading = false; // Added since UI was blocked with the loader if clicked on confirm without selecting the payment gateway
            return;
        }
        let data = this.paymentData;
        if (this.paymentForm.value.paymentMethod && this.paymentForm.value.paymentMethod != '') {
            switch (this.paymentForm.value.paymentMethod) {
                case 'nagad':
                    data['paymentType'] = 'nagad';
                    this.nagadPayment(data);
                    break;
                case 'bKash':
                    this.srcUrl = `${b2b_url}/paymentGateway/${this.confirmedData['BookingAppReference']}`
                    window.location.replace(this.srcUrl);
                    break;
                case 'wallet':
                    this.walletPayment(data);
                    break;
                case 'sslCommerz':
                    data['paymentType'] = 'sslCommerz';
                    this.sslCommerzPayment(data);
                    break;

                default:
                    break;
            }
        }
    }

    submitTicket(data) {
        this.getPaymentGateWays();
        this.paymentData = data;
    }

    walletPayment(data) {
        this.flightService.loading.next(true);
        this.subSunk.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data.BookingAppReference })
            .subscribe(res => {
                if (res && res.data[0].ticketFare) {
                    if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                        this.flightService.loading.next(false);
                        this.swalService.alert.oops("Your wallet balence is not sufficient.");

                    } else {
                        const bookingFlightData = this.flightService.bookingFlightData.getValue();
                        let brandResultToken=bookingFlightData.JourneyList.BrandResultToken;
                        let TicketData = {
                            AppReference: data.BookingAppReference,
                            booking_source: data.booking_source,
                            payment_type:'wallet',
                            UserType: "B2B",
                            UserId:this.currentUser.id,
                            BrandResultToken:brandResultToken.BrandResultToken
                        }
                        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData)
                            .subscribe(res => {
                                if (res) {
                                    this.confirmedData = res.data.FinalBooking.BookingDetails;
                                    this.util.writeStorage("ticketCache", res.data.FinalBooking.BookingDetails, localStorage)
                                    this.showConfirmTicket = false;
                                    this.flightService.loading.next(false);
                                    this.loading = false;
                                    if (this.confirmedData.BookingStatus.toUpperCase()==="BOOKING_CONFIRMED") {
                                        this.deductFromWallet(data);
                                    }
                                    else
                                    {
                                        this.loading = false;
                                        this.showPaymentDetails = false;
                                        this.flightService.loading.next(false);
                                        this.swalService.alert.oops("Sorry unable to process your request. Please contact reservation.");
                                        this.router.navigate(['/']);
                                    }
                                }
                            }, (err => {
                                this.flightService.loading.next(false);
                                this.loading = false;
                                this.showPaymentDetails = false;
                                this.swalService.alert.oops(err.error.Message)
                            })
                            );
                    }
                }
                else{
                    this.swalService.alert.oops(res.msg);
                }
            }, (err => {
                this.flightService.loading.next(false);
                this.swalService.alert.oops(err.error.Message)
                this.showPaymentDetails = false;
            }));
    }

    deductFromWallet(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.BookingAppReference }).subscribe(res => {
            if (res) {
                this.swalService.alert.success("Sucess Your Booking is Confirmed");
                this.headerService.agentData.next(true);
                this.hide();
            }
            else{
                this.swalService.alert.oops(res.msg);
            }
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    nagadPayment(data) {
        let invoiceNumber= this.flightService.setInvoiceNumber(data.BookingAppReference);
        let date = (new Date().getTime()).toString();
        this.subSunk.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: data.BookingAppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.callBackUrl
            }
        })
    }

    sslCommerzPayment(data) {
        let invoiceNumber= this.flightService.setInvoiceNumber(data.BookingAppReference);
        let date = (new Date().getTime()).toString();
        this.subSunk.sink = this.apiHandlerService.apiHandler('sslTransactionInit', 'post', {}, {}, {
            app_reference: data.BookingAppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.ssl
            }
        })
    }

    callPnrTicket(data) {
        let TicketData = {
            AppReference: data.BookingAppReference,
            booking_source: data.booking_source,
            order_id:this.orderId,
            BrandResultToken:[]
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData)
            .subscribe(res => {
                if (res) {
                    this.confirmedData = res.data.FinalBooking.BookingDetails;
                    this.util.writeStorage("ticketCache", res.data.FinalBooking.BookingDetails, localStorage)
                    this.showConfirmTicket = false;
                }
            }, (err => {
                this.swalService.alert.oops(err.error.Message)
            }));
    }

    getTime(date: any) {
        return date.substr(11, 5);
    }

    replaceDateSlash(lastDate) {
        if(lastDate)
        return lastDate.replace(/-/g, "/");
    }

    public download(): void {
        this.showConfirmButtons = false;
        window.scrollTo(0, 0);
        var data = document.getElementById('print_voucher');

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
                pdf.save(`${this.confirmedData['BookingAppReference']}.pdf`);
                this.showConfirmButtons = true;
            });

        }, 1000)
    }

    getPrevilegeForThisUser() {
        this.navigationData = JSON.parse(localStorage.getItem('userPrevilige'))
    }

    isMenuExists(menu) {
        if (this.navigationData && this.navigationData.length > 0) {
            if (this.navigationData.some((el) => el.description == menu))
                return true;
            else
                return false;
        } else {
            return true;
        }
    }

    getPaymentGateWays() {
        this.apiHandlerService.apiHandler('getPaymentGateWays', 'POST', '', '', {}).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode))) {
                if (res.data && res.data.length > 0) {
                    this.paymentGateways =  res.data.filter((ele) =>ele.status==1);
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

    setPNRData(data){
        this.segment_indicator0=data.JourneyList.FlightDetails.Details[0];
        this.segment_indicator1=data.JourneyList.FlightDetails.Details[1];
        this.cdr.detectChanges()
    }
}