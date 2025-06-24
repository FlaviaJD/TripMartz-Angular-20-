import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import * as XLSX from 'xlsx';
import { formatDate } from 'ngx-bootstrap/chronos';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';


@Component({
    selector: 'app-train-mis-download',
    templateUrl: './train-mis-download.component.html',
    styleUrls: ['./train-mis-download.component.scss']
})
export class TrainMisDownloadComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['All','ICICI Corporate','MidMark','DCB Bank'];
    billingColumnName=["Select All","De-Select All",];
    itineraryColumnName=["Select All","De-Select All","TRAIN NAME","TRAIN NUMBER","TRIP ID"];
    passengerColumnName=["Select All","De-Select All","REQUISTER NAME","REQUEST DATE","DESTINATION(FROM)","DESTINATION(TO)","CLASS","TRAVEL DATE","TICKET BOOKING DATE",
                "AGEING","BUCKET","Ticket No","PNR No.","NUMBER  W","STATE   W"];
    pricingolumnName=["Select All","De-Select All","BASE FARE","MANAGEMENT FEE","IGST","CGST","SGST","TOTAL GST","TOTAL FARE","REFUND AMOUNT"];
    othersColumnName=["Select All","De-Select All","NAME","EMP CODE","GRADE","DESIGNATION","DEPARTMENT","COST CENTRE","DEPT HEAD(IL1)","CANCELLATION CHARGE","CREDIT",
            "NOTE NO","CANCELLATION DATE","NET AMOUNT","TripMartz","RELIANCE"];
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
    private subSunk = new SubSink();
    respData:Array<any>=[];
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
        private apiHandlerService: ApiHandlerService,
        private utility:UtilityService,
        private swalService:SwalService
    ) { }

    ngOnInit() {
        this.createFlightForm();
        this.setCorporate();
    }

    createFlightForm() {
        let date = this.utility.setToDate();
        this.regConfig = this.fb.group({
            filter_type: new FormControl('booking_date',Validators.required),
            trainFromDate: new FormControl(date, [Validators.required]),
            trainToDate: new FormControl(date, [Validators.required]),
            trainReportType: new FormControl(''),
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
    checkBoxSelection(inputEvent:any,checkedItem:string){
    }
  
    checkBoxBillingSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxItineraySelection(inputEvent:any,checkedItem:string){
    }

    checkBoxPassengerSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxPricingSelection(inputEvent:any,checkedItem:string){
    }

    checkBoxOtherSelection(inputEvent:any,checkedItem:string){
    }
    
    onDownloadMISReport() {
        const from_date = formatDate(this.regConfig.get('trainFromDate').value, 'YYYY-MM-DD');
        const to_date = formatDate(this.regConfig.get('trainToDate').value, 'YYYY-MM-DD');
        this.respData = [];
        let reqBody = {};
        reqBody = {
            "Status": "BOOKING_CONFIRMED",
            "ReservationCode": "",
            "ReportType":'MIS',
            "BookedFromDate": from_date,
            "BookedToDate": to_date,
            "filter_type": this.regConfig.get('filter_type').value
        }
        this.apiHandlerService.apiHandler('trainFindAll', 'POST', '', '', reqBody).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
                this.respData = res.data;
                this.formateData(this.respData);
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
        data.forEach(trainDetail => {
            trainDetail.PaxDetails.forEach(passenger => {
                const info = {
                    Application_Reference: trainDetail.TrainDetails.AppReference ? trainDetail.TrainDetails.AppReference : '',
                    InvoiceNo:trainDetail.TrainDetails.XlproInvoiceNo || 'N/A',
                    Booking_Status:trainDetail.TrainDetails.BookingStatus,
                    Booking_Type:trainDetail.TrainDetails.BookingType,
                    Request_Created_Date: trainDetail.TrainDetails.RequestDate ? new Date(trainDetail.TrainDetails.RequestDate) : '',
                    Booking_Confirmation_Date:trainDetail.TrainDetails.BookingConfirmedDate ? new Date(trainDetail.TrainDetails.BookingConfirmedDate): '',
                    PNR: trainDetail.TrainDetails.PNR ? trainDetail.TrainDetails.PNR : 'N/A',
                    Corporate_Name:trainDetail.TrainDetails.CompanyName,
                    Passenger_Name: passenger.FirstName + ' ' + passenger.LastName,
                    Employee_ID: passenger.EmployeeId ? passenger.EmployeeId : 'N/A',
                    Band:passenger.EmployeeBand,
                    Cost_Centre:passenger.EmployeeCostCenter? passenger.EmployeeCostCenter :'N/A',
                    Phone:passenger.MobileNo,
                    Email:passenger.Email,
                    Travel_Date: trainDetail.TrainDetails.OnwardDate ? new Date(trainDetail.TrainDetails.OnwardDate) : '',
                    Booked_By:trainDetail.BookedByName,
                    Train_From:trainDetail.TrainDetails.From,
                    Train_To:trainDetail.TrainDetails.To,
                    Fare_Quota: trainDetail.TrainDetails.TicketType ? trainDetail.TrainDetails.TicketType : '',
                    Class:trainDetail.TrainDetails.PreferredClass,
                    Train_Name: trainDetail.TrainDetails.TrainName? trainDetail.TrainDetails.TrainName : '',
                    Train_No:trainDetail.TrainDetails.TrainNumber,
                    Ticket_Status:trainDetail.TrainDetails.TicketStatus,      
                    ApprovalStatus:trainDetail.TrainDetails.ApprovalStatus || "PENDING",
                    CurrentStatus:trainDetail.TrainDetails.CurrentStatus,
                    ApprovalName:trainDetail.TrainDetails.ApprovalName,
                    ApprovalTime:trainDetail.TrainDetails.ApprovalTime ? new Date(trainDetail.TrainDetails.ApprovalTime) : '',
                    ApprovalRemark:trainDetail.TrainDetails.ApprovalRemark,
                    CancellationDate:trainDetail.TrainDetails.CancellationDate ? new Date(trainDetail.TrainDetails.CancellationDate) : '',
                    CancelConfirmationDate:trainDetail.TrainDetails.CancelConfirmationDate ? new Date(trainDetail.TrainDetails.CancelConfirmationDate) : '',
                    // CancelConfirmationFeedback:trainDetail.TrainDetails.CancelConfirmationFeedback|| 'N/A',
                    TripId:trainDetail.TrainDetails.TripId || 'N/A',
                    TripName:trainDetail.TrainDetails.TripName || 'N/A',
                    BookingConfirmedById:trainDetail.TrainDetails.BookingConfirmedById || 'N/A',
                    UpdatedBy:trainDetail.TrainDetails.UpdatedBy || 'N/A',
                    CancelledById:trainDetail.TrainDetails.CancelledById || 'N/A',
                    CancelledByName:trainDetail.TrainDetails.CancelledByName || 'N/A',
                    ArrivalDate:trainDetail.TrainDetails.ArrivalDate ? new Date(trainDetail.TrainDetails.ArrivalDate) : 'N/A',
                    ArrivalTime:trainDetail.TrainDetails.ArrivalTimeTrain ? trainDetail.TrainDetails.ArrivalTimeTrain: 'N/A',
                }
                result.push(info)
            });
        });
        this.downloadExcel(result);
    }

    convertToExcelFormat(data: any[]) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Train MIS Details');
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      }
    
      downloadExcel(misData) {
        const columnWidths = [
            { wch: 30}
        ];
        const fieldsLength = misData.length;
        for (let i = 0; i < fieldsLength; i++) {
            columnWidths.push({ wch: 30 })
        }
        const todayDate: string = new Date().toLocaleDateString('en-GB');
            const fileName = `train_mis_report_${todayDate}`;
            this.utility.exportToExcel(
                misData,
                fileName,
                columnWidths
            );
    }

    
      downloadFile(data: any, filename: string) {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    onSelectionChanged(event) {
    }

    
}
