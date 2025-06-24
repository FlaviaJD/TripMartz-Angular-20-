import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-hotel-mis-download',
    templateUrl: './hotel-mis-download.component.html',
    styleUrls: ['./hotel-mis-download.component.scss']
})
export class HotelMisDownloadComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['All', 'TripMartz', 'DCB Bank', 'DP Power', 'ICICI'];
    billingList=["Select All","De-Select All","Bill", "No Bill", "Date","Billing State","Location","SOL ID","Vendor Submission No."]
    itineraryList=["Select All","De-Select All","HOTEL NAME","City","Categorization",'DCB TIEUP','EB','EB diff','HoTELANGANA RATE','Diff',"COMB"]
    passengerList=["Select All","De-Select All", "Check-In Date","Check-Out Date","Total Days","Room Type","Purpose",]
    pricingList=["Select All","De-Select All","Basic","PER DAY COST","ACTUAL BASIC","SERVICE FEES","Taxes","SGST","CGST","IGST","TOTAL GST","GST %","Tariff Amount (Rs.)","Total Amount (Rs.)"]
    otherList=["Select All","De-Select All","Employee Name","Employee ID","Grade","Employee's State","Cost Center Sol ID","TripMartz Remark","REMARKS","Remarks 2"]
    isOpen = false as boolean;
    maxDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    filteredCorp: Observable<string[]>;
    corporateList: string[] = ['TripMartz'];
    hotelMisData:Array<any>=[];
    date_type = [
        {
            name: 'Booking Date',
            code: 'booking_date'
        },
        {
            name: 'Confirmed Date',
            code: 'confirmed_date'
        },
        {
            name: 'CheckIn Date',
            code: 'check_in'
        },
        {
            name: 'Cancellation Date',
            code: 'cancellation_date'
        },
    ];

    constructor(
        private fb: FormBuilder,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService
    ) { }

    ngOnInit() {
        this.createForm();
        this.setCorporate();
    }

    createForm() {
        let date = this.utility.setToDate();
        this.regConfig = this.fb.group({
            filter_type: new FormControl('booking_date',Validators.required),
            hotelFromDate: new FormControl(date, [Validators.required]),
            hotelToDate: new FormControl(date, [Validators.required]),
            hotelReportType: new FormControl('MIS'),
            checkBoxExcel:new FormControl(''),
            corporate: new FormControl('', [Validators.maxLength(120)]),
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
        const from_date = formatDate(this.regConfig.get('hotelFromDate').value, 'YYYY-MM-DD');
        const to_date = formatDate(this.regConfig.get('hotelToDate').value, 'YYYY-MM-DD');
        const reqBody = {
            filter_type:this.regConfig.get('filter_type').value,
            from_date: from_date || "",
            to_date: to_date || "",
            report_type:this.regConfig.get('hotelReportType').value,
            keys: [],
            UserType:'Supervision'
        };
        this.apiHandlerService.apiHandler('hotelMisDownloadData', 'POST', '', '', reqBody).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
                this.hotelMisData = res.data;
                this.excelDownload();
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

    excelDownload(){
        if(this.hotelMisData.length){
            const fileToExport = this.hotelMisData.map((response: any, index: number) => {
                return {
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
            const fieldsLength=this.hotelMisData[0].length;
            for(let i=0;i<fieldsLength;i++){
                columnWidths.push({wch:30})
            }
    
            const todayDate: string = new Date().toLocaleDateString('en-GB');
            const fileName = `hotel_mis_report_${todayDate}`;
            this.utility.exportToExcel(
                fileToExport,
                fileName,
                columnWidths
            );
        }
    }

    checkBoxPricingSelection(inputEvent:any,checkedItem:string){
    }

    onViewMISAsGraph() {
        
    }

    checkBoxSelection(inputEvent:any,checkedItem:string){
    }

    onSelectionChanged(event) {
    }

    checkBoxOtherSelection(inputEvent:any,checkedItem:string){

    }

    checkBoxPassengerSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxItineraySelection(inputEvent:any,checkedItem:string){
    }

    checkBoxBillingSelection(inputEvent:any,checkedItem:string){
    }
}
