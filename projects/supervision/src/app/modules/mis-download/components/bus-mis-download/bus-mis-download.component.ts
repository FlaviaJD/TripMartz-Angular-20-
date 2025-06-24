import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

@Component({
    selector: 'app-bus-mis-download',
    templateUrl: './bus-mis-download.component.html',
    styleUrls: ['./bus-mis-download.component.scss']
})
export class BusMisDownloadComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['Bus Report'];
    billingColumnName=["Select All","De-Select All","Bill No","Bill Date"];
    itineraryColumnName=["Select All","De-Select All","Sector"]; 
    passengerColumnName=["Select All","De-Select All","Ticket No.","Pnr No.","Pax Name","Travel Date","QUOTA","PURPOSE","SUBJECT","STATE"]; 
    pricingolumnName=["Select All","De-Select All","Basic Fare","Serv. Chrgs","ST = CGST + SGST","Sales Amount","Net Amount"];
    othersColumnName=["Select All","De-Select All","Emp Id","Narration","Cost Code","Department","Sol Id","Refund Amount","C.Note No.","REMARK"];
    isOpen = false as boolean;
    maxDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    filteredCorp: Observable<string[]>;
    corporateList: string[] = ['TripMartz'];
    date_type = [
    ];
    loggedInUser: any;
    respData: any;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility:UtilityService
    ) { }

    ngOnInit() {
        this.setDateType(); 
        this.createForm()
    }

    setDateType() {
        this.date_type = [
            {
                name: 'Booking Date',
                code: 'booking_date'
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
    }

    createForm() {
        let date = this.utility.setToDate();

        this.regConfig = this.fb.group({
            busFromDate: new FormControl(date, [Validators.required]),
            busToDate: new FormControl(date, [Validators.required]),
            filter_type: new FormControl('booking_date', [Validators.required]),
            //checkBoxExcel:new FormControl(''),
            // corporate: new FormControl('', [Validators.maxLength(120)]),
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
        const from_date = formatDate(this.regConfig.get('busFromDate').value, 'YYYY-MM-DD');
        const to_date = formatDate(this.regConfig.get('busToDate').value, 'YYYY-MM-DD');
        const reqBody = {
            "status": "BOOKING_CONFIRMED",
            "ReportType":'MIS',
            "booked_from_date": from_date,
            "booked_to_date": to_date,
            "filter_type": this.regConfig.get('filter_type').value,
        }
        this.apiHandlerService.apiHandler('busReport', 'POST', '', '', reqBody).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
                this.respData = res.data;
                this.formateData(this.respData)
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
    formateData(data) {
        let result = [];
        if (this.respData && this.respData.length>0) {
            const fileToExport = this.respData.map((response: any, index: number) => {
                const status=this.getFormtedStatus(response.status);
                const departure_datetime=this.convertDatetime(response.itinerary[0].departure_datetime);
                const arrival_datetime=this.convertDatetime(response.itinerary[0].arrival_datetime);
                const created_at=this.convertDatetime(response.itinerary[0].created_at);
                return {
                    "Sl No.": index + 1,
                    "Application Reference":response.app_reference,
                    "Trip Id":response.trip_id,
                    "Trip Name":response.trip_name,
                    "Booking Status":response.status,
                    "Approvar Status": response.approvar_status || 'Pending',
                    "Departure Date": departure_datetime ? new Date(departure_datetime).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                    "Arrival Date": arrival_datetime ? new Date(arrival_datetime).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                    "Departure From": response.itinerary[0].departure_from,
                    "Arrival To": response.itinerary[0].arrival_to,
                    "Bus Type": response.itinerary[0].bus_type || 'N/A',
                    "Operator": response.itinerary[0].operator,
                    "PNR":response.pnr || 'N/A',
                    "Ticket":response.ticket || 'N/A',
                    "Currency":response.currency,
                    "TotalFare":response.total_fare,
    "Created At": created_at ? new Date(created_at).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',            }
            });
            const columnWidths = [
                { wch: 5 }
            ];
            const fieldsLength = this.respData.length;
            for (let i = 0; i < fieldsLength; i++) {
                columnWidths.push({ wch: 30 })
            }
            this.utility.exportToExcel(
                fileToExport,
                'Bus Report',
                columnWidths
            );
            }
    }

    convertDatetime(datetime) {
        if (datetime) {
            return datetime.replace(/\.$/, '.000Z');
        }
    };
    
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }
    onViewMISAsGraph() {
    }

    onSelectionChanged(event) {
    }

    checkBoxSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxOtherSelection(inputEvent:any,checkedItem:string){

    }

    checkBoxPricingSelection(inputEvent:any,checkedItem:string){

    }

    checkBoxPassengerSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxItineraySelection(inputEvent:any,checkedItem:string){
    }

    checkBoxBillingSelection(inputEvent:any,checkedItem:string){
          
    }
}
