import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { formatDate } from 'ngx-bootstrap/chronos';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
@Component({
    selector: 'app-flight-mis-download',
    templateUrl: './flight-mis-download.component.html',
    styleUrls: ['./flight-mis-download.component.scss']
})
export class FlightMisDownloadsComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['Airline wise','Sector wise','Pax wise','Fare wise','User wise', 'Day to Departure', 'Low Cost Carrier']
    isOpen = false as boolean;
    maxDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    billingColumnName=["Select All","De-Select All","Bill", "No Bill", "Date","Gst Invoice No",]
    itineraryColumnName=["Select All","De-Select All","Sector","Airline Name","Airline Code",]
    passengerColumnName=["Select All","De-Select All","Ticket No.", "PNR No.","Pax Name", "Travel Date","Flt Class # 1", ]
    pricingolumnName=["Select All","De-Select All","Basic Fare", "Taxes (YQ)", "Taxes (YR)", "Taxes (K3)", "Taxes (Others)", "MANAGEMENT fee", "IGST",
    "CGST", "SGST", "Total Gst","Net Amount"]
    othersColumnName=["Select All","De-Select All","Sales Amount","Emp ID","Department","Category", "C.Note No.", "Cancellation Charges","COST CODE", "Sol ID", "REF STATE","Vendor Invoices"]
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
    respData: Array<any> = [];
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
            filter_type:new FormControl('booking_date', [Validators.required]),
            flightFromDate: new FormControl('', [Validators.required]),
            flightToDate: new FormControl('', [Validators.required]),
            // flightReportType: new FormControl('', [Validators.required]),
            // checkBoxExcel:new FormControl(''),
            // corporate: new FormControl('', [Validators.maxLength(120)]),
        })
    }

    onSelectionChanged(event) {
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
        const flightFromDate = formatDate(this.regConfig.get('flightFromDate').value, 'YYYY-MM-DD');
        const flightToDate = formatDate(this.regConfig.get('flightToDate').value, 'YYYY-MM-DD');
        const reqBody = {
            "status": "BOOKING_CONFIRMED",
            "report_type": 'MIS',
            "booked_from_date": flightFromDate,
            "booked_to_date": flightToDate,
            "corporate":false,
            "filter_type": this.regConfig.get('filter_type').value
        }
        this.apiHandlerService.apiHandler('flightMis', 'post',  '', '', reqBody)
        .subscribe(resp =>{
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
                let taxDetails = JSON.parse(response.TaxDetails.replace(/\'/gi, "\""));
                let empDetails = JSON.parse(response.EmployeeDetails.replace(/\'/gi, "\""));
                const { TaxDetails,EmployeeDetails, ...rest } = response;
                return {
                    ...rest,
                    // JN: taxDetails.JN_Tax || 0,
                    // YQ: taxDetails.YQ_Tax || 0,
                    // OCT: taxDetails.OC_Tax || 0,
                    // YR: taxDetails.YR_Tax || 0,
                    // IGT: taxDetails.IGT_Tax || 0,
                    // CGT: taxDetails.CGT_Tax || 0,
                    // SGT: taxDetails.SGT_Tax || 0,
                    // Other_Taxes: taxDetails.Other_Taxes || 0,
                    Basic_Fare: taxDetails.Basic_Fare || 0,
                    PromoDis: taxDetails.promoDis || 0,
                    TotalCost: taxDetails.totalCost || 0,
                    EmployeeId:empDetails.EmployeeId,
                    EmployeeBand:empDetails.EmployeeBand,
                    EmployeeCostCenter:empDetails.EmployeeCostCenter,
                    Department:empDetails.Department
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
        const fileName = `flight_supervision_mis_report_${todayDate}`;
        this.utility.exportToExcel(
            misData,
            fileName,
            columnWidths
        );
    }

    onViewMISAsGraph() {
        
    }

    checkBoxBillingSelection(inputEvent:any,checkedItem:string){
    }
   
    checkBoxItineraySelection(inputEvent:any,checkedItem:string){

    }

    checkBoxPassengerSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxPricingSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxSelection(inputEvent:any,checkedItem:string){
    
    }
}
