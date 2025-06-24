import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { formatDate } from 'ngx-bootstrap/chronos';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';


@Component({
    selector: 'app-flight-mis-downloads',
    templateUrl: './flight-mis-downloads.component.html',
    styleUrls: ['./flight-mis-downloads.component.scss']
})
export class FlightMisDownloadsComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['Flight Dunmp', 'Day to Departure', 'Low Cost Carrier', 'Destination Wise', 'Carrier Wise', 'Divisiom']
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    //   excelColumnHeader=["Bill", "No Bill", "Date", "Ticket No.", "Pax Name", "Travel Date", "Sector", "PNR No.", "Airline Name", "Gst Invoice No",
    //     "Airline Code", "Flt Class # 1", "Basic Fare", "Taxes (YQ)", "Taxes (YR)", "Taxes (K3)", "Taxes (Others)", "MANAGEMENT fee", "SGST ON MGT FEES",
    //     "CGST ON MGT FEES", "SGST ON TAXABLE", "CGST ON TAXABLE", "Total Gst", "Sales Amount", "C.Note No.", "Cancellation Charges", "Net Amount","Emp ID",
    //     "COST CODE", "Sol ID", "Department", "REF STATE", "Category", "Vendor Invoices"
    //   ];
    billingColumnName = ["Select All", "De-Select All", "Bill", "No Bill", "Date", "Gst Invoice No",]
    itineraryColumnName = ["Select All", "De-Select All", "Sector", "Airline Name", "Airline Code",]
    passengerColumnName = ["Select All", "De-Select All", "Ticket No.", "PNR No.", "Pax Name", "Travel Date", "Flt Class # 1",]
    pricingolumnName = ["Select All", "De-Select All", "Basic Fare", "Taxes (YQ)", "Taxes (YR)", "Taxes (K3)", "Taxes (Others)", "MANAGEMENT fee", "IGST",
        "CGST", "SGST", "Total Gst", "Net Amount",]
    othersColumnName = ["Select All", "De-Select All", "Sales Amount", "Emp ID", "Department", "Category", "C.Note No.", "Cancellation Charges", "COST CODE", "Sol ID", "REF STATE", "Vendor Invoices"]
    selctedExcelHeader: Array<any> = ['Sl No.'];
    respData: any;
    employeeName = ['Amit', 'Anikesh', 'Aman', 'Ankush', 'Arpit', 'Ashish', 'Anish', 'Aryan', 'Ankur', 'Ajeet', 'Akansha', 'Arpita']
    employeeNameList: Array<any> = []
    filteredCorp: Observable<string[]>;
    corporateList: string[] = ['TripMartz'];
    date_type = [
        {
            name: 'Booking Date',
            code: 'booking_date'
        },
        {
            name: 'Confirmed Date',
            code: 'confirmed_date'
        }
    ];

    constructor(
        private fb: FormBuilder,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.createFlightForm();
        this.setCorporate();
    }


    createFlightForm() {
        this.regConfig = this.fb.group({
            // employeeName:new FormControl('',[Validators.required]),
            filter_type: new FormControl('booking_date', [Validators.required]),
            fromDate: new FormControl('', [Validators.required]),
            toDate: new FormControl('', [Validators.required]),
            // reportType:new FormControl('',[Validators.required]),
            // checkBoxExcel:new FormControl('')
        })
    }

    setCorporate() {
        this.filteredCorp = this.regConfig.controls.corporate.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.corporateList.filter(corporate => corporate.toLowerCase().includes(filterValue));
    }

    onDownloadMISReport() {
        if (!this.regConfig.valid) {
            return;
        }
        const fromDate = formatDate(this.regConfig.get('fromDate').value, 'YYYY-MM-DD');
        const toDate = formatDate(this.regConfig.get('toDate').value, 'YYYY-MM-DD');
        const reqBody = {
            "status": "BOOKING_CONFIRMED",
            "report_type": 'MIS',
            "booked_from_date": fromDate,
            "booked_to_date": toDate,
            "corporate": true,
            "filter_type": this.regConfig.get('filter_type').value,
            "UserType":'corporate'
        }
        this.apiHandlerService.apiHandler('flightMis', 'post', '', '', reqBody)
            .subscribe(resp => {
                if (resp && ([200, 201].includes(resp.statusCode)) && resp.data && resp.data.length > 0) {
                    this.respData = resp.data || [];
                    this.formateData()
                }
                else {
                    this.respData = [];
                    this.swalService.alert.oops("No Record Found");

                }
            }, (err) => {
                this.respData = [];
                this.swalService.alert.oops("No Record Found");

            });
    }

    formateData() {
        if (this.respData.length) {
            const fileToExport = this.respData.map((response: any, index: number) => {
                let taxDetails = JSON.parse(response.TaxDetails);
                let empDetails = JSON.parse(response.EmployeeDetails.replace(/\'/gi, "\""));
                const { TaxDetails, ...rest } = response;
                return {
                    ...rest,
                    JN: taxDetails.JN_Tax || 0,
                    YQ: taxDetails.YQ_Tax || 0,
                    OCT: taxDetails.OC_Tax || 0,
                    YR: taxDetails.YR_Tax || 0,
                    IGT: taxDetails.IGT_Tax || 0,
                    CGT: taxDetails.CGT_Tax || 0,
                    SGT: taxDetails.SGT_Tax || 0,
                    Other_Taxes: taxDetails.Other_Taxes || 0,
                    Basic_Fare: taxDetails.Basic_Fare || 0,
                    PromoDis: taxDetails.promoDis || 0,
                    TotalCost: taxDetails.totalCost || 0,
                    EmployeeId:empDetails.EmployeeId || '',
                    EmployeeBand:empDetails.EmployeeBand || '',
                    EmployeeCostCenter:empDetails.EmployeeCostCenter || '',
                    Department:empDetails.Department || ''
                }
            });
            this.downloadExcel(fileToExport);
        }
    }

    downloadExcel(misData) {
        const columnWidths = [
            { wch: 30 }
        ];
        const fieldsLength = misData.length;
        for (let i = 0; i < fieldsLength; i++) {
            columnWidths.push({ wch: 30 })
        }
        const todayDate: string = new Date().toLocaleDateString('en-GB');
        const fileName = `flight_corporate_mis_report_${todayDate}`;
        this.utility.exportToExcel(
            misData,
            fileName,
            columnWidths
        );
    }


    onViewMISAsGraph() {
    }

    employeeAutoComplete(event) {
        return this.employeeNameList = this.employeeName;
    }

    selectedName(name) {
        this.employeeNameList = []
    }

    checkBoxSelection(inputEvent: any, checkedItem: string) {

    }

    checkBoxBillingSelection(inputEvent: any, checkedItem: string) {
        let isChecked = inputEvent.target.checked;
        if (isChecked) {
            this.selctedExcelHeader.push(checkedItem);
        } else {
            this.selctedExcelHeader = this.selctedExcelHeader.filter((item) => !item.toLowerCase().includes(checkedItem.toLowerCase()));
        }
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
