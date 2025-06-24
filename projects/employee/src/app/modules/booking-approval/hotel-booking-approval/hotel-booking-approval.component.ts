import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { HotelService } from '../../search/hotel/hotel.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-hotel-booking-approval',
  templateUrl: './hotel-booking-approval.component.html',
  styleUrls: ['./hotel-booking-approval.component.scss']
})
export class HotelBookingApprovalComponent implements OnInit {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    app_reference: "";
    noOfAdults: number = 0;
    noOfRooms: number = 0;
    noOfChilds: number = 0;
    domainInformation: any;
    loading: boolean = false;
    isDcbBooking:boolean=true;
    logInUser: any;
    loadingTemplate:any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'print_voucher',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };
    searchData: any;
    loader: boolean;
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private hotelService: HotelService
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });
        let hotel=JSON.parse(localStorage.getItem('selectedHotels'));
        this.searchData=hotel[0];
        this.gethotelVoucher();
        this.getDomain();
    }

    gethotelVoucher() {
        this.loading=true;
        this.logInUser = JSON.parse(localStorage.getItem("currentUser"));
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {},
            {
                "AppReference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.voucherData = resp.data || [];
                    this.loading=false;
                    this.noOfAdults = 0;
                    this.noOfChilds = 0;
                    this.voucherData['BookingPaxDetails'].forEach((element, i) => {
                        if (i < this.voucherData['BookingPaxDetails'].length) {
                            if (element['PaxType'] == 'Child') {
                                this.noOfChilds++;
                            } else if (element['PaxType'] == 'Adult') {
                                this.noOfAdults++;
                            }
                        }
                    });
                }
                else {
                    this.loading=false;
                    this.swalService.alert.error(resp.msg || '');
                }
            }, err => {
                this.loading=false;
            });
    }

    calculateDiff(fromDate, toDate) {
        return ''
    }

    getTime(t) {
        return t.split(" ")[1];
    }

    cancelBooking() {

    }


    getRoomType(roomName: string): string {
        roomName = roomName.split('-')[0].trim();
        return `${roomName}`;
    }


    findLeaduserDetails(data, type) {
        if (data) {
            let leadUser, value = "";
            leadUser = data.filter(x => x.LeadPax == true);
            switch (type) {
                case 'name':
                    value = `${leadUser[0].Title}. ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
                    break;
                case 'email':
                    value = `${leadUser[0].Email}`;
                    break;
                case "phone":
                    value = `${leadUser[0].PhoneNumber}`;
                    break;
            }
            return value;
        } else return 'N/A';
    }

    getCancelationPolicy(cancellationPolicy) {
        if (cancellationPolicy && cancellationPolicy.length>0 && cancellationPolicy[0].CancelPenalty) {
            const penalty = cancellationPolicy[0].CancelPenalty;
            return penalty;
        }
        else {
            return "No Cancellation Policy Found";
        }
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    getDomain() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'post', {}, {},
            {})
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.domainInformation = resp.data[0];

                }
            })
    }

    print() {
        window.print();
      }

    downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName = this.voucherData['BookingDetails']['AppReference'];
        window['html2canvas'] = html2canvas;
        const date = new Date().toDateString();
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
        });
        const content = this.print_voucher.nativeElement;
        doc.html(content, {
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                scale: 600 / content.scrollWidth
            },
            callback: async (doc) => {
                doc.save(`${fileName}.pdf`);
                this.swalService.alert.success();
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

    getHotelPhoto(imgArrStr) {
        if (imgArrStr != null) {
            return imgArrStr[0];
        } else {
            return '';
        }
    }

    getTotalAmount() {
        let totalAmnt: number = 0;
        this.voucherData['BookingItineraryDetails'].forEach(o => {
            totalAmnt += o.RoomPrice;
        });
        return totalAmnt;
    }

    getTotalTax() {
        let total = this.getTotalAmount();
        return this.voucherData.BookingDetails.TotalFair - total;
    }

    getTotalBaseAmount() {
        let totalAmnt: number = 0;
        this.searchData['RoomDetails'].forEach(o => {
            totalAmnt += o.TotalFare;
        });
        return totalAmnt;
    }

    getTotalTaxAmount() {
        let totalAmnt: number = 0;
        this.searchData['RoomDetails'].forEach(o => {
            totalAmnt += o.TotalTax;
        });
        return totalAmnt;
    }

    validatePolicy() {
        let filteredData = [];
        let policyList = JSON.parse(localStorage.getItem('policyList')) || [];
        const policyHotels = policyList[0].policyHotels || [];
        const cityId = this.searchData.searchRequest.CityIds[0];
        let filteredPolicyList = policyHotels.filter(policy => {
            if (policy.cities.includes(',')) {
                const citiesArray = policy.cities.split(',');
                return citiesArray.includes(cityId);
            } else {
                return policy.cities === cityId;
            }
        });
        if (filteredPolicyList.length > 0) {
            const upperLimit = filteredPolicyList[0].upper_limit;
            if(this.searchData.Price.Amount< upperLimit){
                this.approvalReservations();
            }
            else{
                this.swalService.alert.oops("Policy check is not satisfied.Please raise a new request");
            }
        }
        else if (filteredPolicyList.length === 0 && policyList[0].generic_budget_limit) {
            if(this.searchData.Price.Amount < policyList[0].generic_budget_limit){
                this.approvalReservations();
            }
            else{
                this.swalService.alert.oops("Policy check is not satisfied.Please raise a new request");
            }
        }
        else {
            this.swalService.alert.oops("Policy check is not satisfied.Please raise a new request");
        }
    }

    approvalReservations() {
        this.loader = true;
        let request = {
            ResultToken: this.searchData.ResultIndex,
            booking_source: this.searchData.booking_source,
            BookingSource: "B2B"
        }
        this.apiHandlerService.apiHandler('approvalReservations', 'post', '', '', request)
            .subscribe(resp => {
                if (resp && ([200, 201].includes(resp.statusCode)) && resp.data && resp.data.length > 0) {
                    this.loader = false;
                    this.router.navigate(['/reports/hotel-voucher'], { queryParams: { appReference: this.app_reference } });
                }
                else {
                    this.loader = false;
                    this.swalService.alert.oops(resp.Message);
                }
            }, (err) => {
                this.loader = false;
                this.swalService.alert.oops(err.error.Message);
            });
    }
    

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();

    }
}

