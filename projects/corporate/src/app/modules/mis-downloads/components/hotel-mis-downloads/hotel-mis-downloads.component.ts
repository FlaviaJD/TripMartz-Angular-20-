import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { formatDate } from 'ngx-bootstrap/chronos';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';

@Component({
    selector: 'app-hotel-mis-downloads',
    templateUrl: './hotel-mis-downloads.component.html',
    styleUrls: ['./hotel-mis-downloads.component.scss']
})
export class HotelMisDownloadsComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['Citiy Wise Booking', 'Property Wise', 'Top 10 Property Wise', 'Top 10 Guest Wise', 'Hotel Sales Report']
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    billingColumnName = ["Select All", "De-Select All", ",Bill", "No Bill", "Date", "Billing State", "Location", "SOL ID", "Vendor Submission No."]

    itineraryColumnName = ["Select All", "De-Select All", "HOTEL NAME", "City", "Categorization", 'DCB TIEUP', 'EB', 'EB diff', 'HoTELANGANA RATE', 'Diff', "COMB"]

    passengerColumnName = ["Select All", "De-Select All", "Check-In Date", "Check-Out Date", "Total Days", "Room Type", "Purpose",]

    pricingolumnName = ["Select All", "De-Select All", "Basic", "PER DAY COST", "ACTUAL BASIC", "SERVICE FEES", "Taxes", "SGST", "CGST", "IGST", "TOTAL GST", "GST %", "Tariff Amount (Rs.)", "Total Amount (Rs.)"]

    othersColumnName = ["Select All", "De-Select All", "Employee Name", "Employee ID", "Grade", "Employee's State", "Cost Center Sol ID", "TripMartz Remark", "REMARKS", "Remarks 2"]
    employeeName = ['Amit', 'Anikesh', 'Aman', 'Ankush', 'Arpit', 'Ashish', 'Anish', 'Aryan', 'Ankur', 'Ajeet', 'Akansha', 'Arpita']
    employeeNameList: Array<any> = []
    hotelMisData: Array<any> = [];
    loggedInUser: any;
    hideExport:boolean=false;
    date_type = [
    ];

    constructor(
        private fb: FormBuilder,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService
    ) { 
        this.loggedInUser = JSON.parse(localStorage.getItem('currentCorpUser'));
        const isLoggedInUser243 = this.loggedInUser['id'] === 243;
        this.setDateType(isLoggedInUser243); 
        if (this.loggedInUser['id'] == 243) {
            this.hideExport = true;
        }
        this.createForm()
    }

    setDateType(isLoggedInUser243) {
        this.date_type = [
            {
                name: 'Booking Date',
                code: 'booking_date'
            },
            {
                name: 'CheckIn Date',
                code: 'check_in'
            },
            {
                name: 'Cancellation Date',
                code: 'cancellation_date'
            },
            {
                name: 'Confirmed Date',
                code: 'confirmed_date'
            },
        ];
        if (isLoggedInUser243) {
            this.date_type=this.date_type.filter(element=>element.name!='Confirmed Date');
            this.date_type[0].code = 'confirmed_date';
        }
    }

    ngOnInit() {
      
    }

    createForm() {
        const date = this.utility.setToDate();
        const filterType = this.loggedInUser['id'] === 243 ? 'confirmed_date' : 'booking_date';
        this.regConfig = this.fb.group({
            filter_type: new FormControl(filterType, Validators.required),
            fromDate: new FormControl(date, Validators.required),
            toDate: new FormControl(date, Validators.required),
            report_type: new FormControl('MIS'),
            checkBoxExcel: new FormControl('')
        });
    }
    

    onDownloadMISReport() {
        const from_date = formatDate(this.regConfig.get('fromDate').value, 'YYYY-MM-DD');
        const to_date = formatDate(this.regConfig.get('toDate').value, 'YYYY-MM-DD');
        const reqBody = {
            filter_type:this.regConfig.get('filter_type').value,
            from_date: from_date || "",
            to_date: to_date || "",
            report_type:this.regConfig.get('report_type').value,
            keys: [],
            UserType:'corporate'
        };
        this.apiHandlerService.apiHandler('hotelMisDownloadData', 'POST', '', '', reqBody).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
                this.hotelMisData = res.data;
                this.excelDonwload();
            }
            else {
                this.hotelMisData = [];
                this.swalService.alert.oops("No Record Found");

            }
        }, (err) => {
            this.hotelMisData = [];
            this.swalService.alert.oops("No Record Found");

        });
    }

    excelDonwload() {
        if (this.hotelMisData.length) {
            let fileToExport = this.hotelMisData.map((response: any, index: number) => {
                return {
                    // "Sl No.": index + 1,
                    ...response,
                    Confirmed_date:response.Confirmed_date? new Date(response.Confirmed_date):'',
                    Requested_Date:response.Requested_Date?new Date(response.Requested_Date):'',
                    Checkin:response.Checkin?new Date(response.Checkin):'',
                    Checkout:response.Checkout?new Date(response.Checkout):''
                }
            });

            const columnWidths = [
                { wch: 30 }
            ];
            const fieldsLength = this.hotelMisData[0].length;
            for (let i = 0; i < fieldsLength; i++) {
                columnWidths.push({ wch: 30 })
            }

            const todayDate: string = new Date().toLocaleDateString('en-GB');
            const fileName = `hotel_corporate_mis_report_${todayDate}`;
            this.utility.exportToExcel(
                fileToExport,
                fileName,
                columnWidths
            );
        }
    }

    onViewMISAsGraph() {
    }

    getAutoComplete(event) {
        return this.employeeNameList = this.employeeName;
    }

    selectedName(name) {
        this.employeeNameList = []
    }

    checkBoxSelection(inputEvent: any, checkedItem: string) {

    }

    checkBoxBillingSelection(inputEvent: any, checkedItem: string) {

    }
    checkBoxItineraySelection(inputEvent: any, checkedItem: string) {

    }

    checkBoxPassengerSelection(inputEvent: any, checkedItem: string) {

    }

    checkBoxPricingSelection(inputEvent: any, checkedItem: string) {

    }

    checkBoxOtherSelection(inputEvent: any, checkedItem: string) {

    }

}
