import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-train-mis-downloads',
    templateUrl: './train-mis-downloads.component.html',
    styleUrls: ['./train-mis-downloads.component.scss']
})
export class TrainMisDownloadsComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['Train Report']
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    billingColumnName = ["Select All", "De-Select All",];
    itineraryColumnName = ["Select All", "De-Select All", "TRAIN NAME", "TRAIN NUMBER", "TRIP ID"];
    passengerColumnName = ["Select All", "De-Select All", "REQUISTER NAME", "REQUEST DATE", "DESTINATION(FROM)", "DESTINATION(TO)", "CLASS", "TRAVEL DATE", "TICKET BOOKING DATE",
        "AGEING", "BUCKET", "Ticket No", "PNR No.", "NUMBER  W", "STATE   W"];
    pricingolumnName = ["Select All", "De-Select All", "BASE FARE", "MANAGEMENT FEE", "IGST", "CGST", "SGST", "TOTAL GST", "TOTAL FARE", "REFUND AMOUNT"];
    othersColumnName = ["Select All", "De-Select All", "NAME", "EMP CODE", "GRADE", "DESIGNATION", "DEPARTMENT", "COST CENTRE", "DEPT HEAD(IL1)", "CANCELLATION CHARGE", "CREDIT",
        "NOTE NO", "CANCELLATION DATE", "NET AMOUNT", "TripMartz", "RELIANCE"];
    employeeName = ['Amit', 'Anikesh', 'Aman', 'Ankush', 'Arpit', 'Ashish', 'Anish', 'Aryan', 'Ankur', 'Ajeet', 'Akansha', 'Arpita']
    employeeNameList: Array<any> = []
    respData: Array<any> = [];
    loggedInUser: any;
    hideExport:boolean=true;
    date_type = [
    ];
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private swalService: SwalService

    ) { }

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem('currentCorpUser'));
        if (this.loggedInUser['id'] == 243) {
           // this.hideExport = true;
        }
        const isLoggedInUser243 = this.loggedInUser['id'] === 243;
        this.setDateType(isLoggedInUser243); 
        this.createForm()
    }

    setDateType(isLoggedInUser243) {
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
        if (isLoggedInUser243) {
            this.date_type=this.date_type.filter(element=>element.name!='Confirmed Date');
            this.date_type[0].code = 'confirmed_date';
        }
    }

    createForm() {
        let date = this.utility.setToDate();
        const filterType = this.loggedInUser['id'] === 243 ? 'confirmed_date' : 'booking_date';
        this.regConfig = this.fb.group({
            // employeeName: new FormControl('', [Validators.required]),
            filter_type: new FormControl(filterType,Validators.required),
            fromDate: new FormControl(date, [Validators.required]),
            toDate: new FormControl(date, [Validators.required]),
            reportType: new FormControl('', [Validators.required]),
            checkBoxExcel: new FormControl('')
        })
    }

    onDownloadMISReport() {
        const from_date = formatDate(this.regConfig.get('fromDate').value, 'YYYY-MM-DD');
        const to_date = formatDate(this.regConfig.get('toDate').value, 'YYYY-MM-DD');
        const reqBody = {
            "Status": "BOOKING_CONFIRMED",
            "ReservationCode": "",
            "ReportType":'MIS',
            "BookedFromDate": from_date,
            "BookedToDate": to_date,
            "filter_type": this.regConfig.get('filter_type').value,
            "UserType":"corporate"
        }
        this.apiHandlerService.apiHandler('trainFindAll', 'POST', '', '', reqBody).subscribe(res => {
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
        data.forEach(trainDetail => {
            trainDetail.PaxDetails.forEach(passenger => {
                const info = {
                    Application_Reference: trainDetail.TrainDetails.AppReference ? trainDetail.TrainDetails.AppReference : '',
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
                    // CancelConfirmationFeedback:trainDetail.TrainDetails.CancelConfirmationFeedback|| 'N/A',
                    Travel_Date: trainDetail.TrainDetails.OnwardDate ? new Date(trainDetail.TrainDetails.OnwardDate) : '',
                    Booked_By:trainDetail.BookedByName,
                    Train_From:trainDetail.TrainDetails.From,
                    Train_To:trainDetail.TrainDetails.To,
                    Fare_Quota: trainDetail.TrainDetails.TicketType ? trainDetail.TrainDetails.TicketType : '',
                    Class:trainDetail.TrainDetails.PreferredClass,
                    Train_Name: trainDetail.TrainDetails.TrainName? trainDetail.TrainDetails.TrainName : '',
                    Train_No:trainDetail.TrainDetails.TrainNumber,
                    ArrivalDate:trainDetail.TrainDetails.ArrivalDate ? new Date(trainDetail.TrainDetails.ArrivalDate) : 'N/A',
                    ArrivalTime:trainDetail.TrainDetails.ArrivalTimeTrain ? trainDetail.TrainDetails.ArrivalTimeTrain: 'N/A',
                    //CurrentStatus:trainDetail.TrainDetails.CurrentStatus
                    // Ticket_Status:trainDetail.TrainDetails.TicketStatus
               }

               if (this.loggedInUser['id'] != 243) {
                info['ApprovalStatus'] = trainDetail.TrainDetails.ApprovalStatus;
                info['ApprovalName'] = trainDetail.TrainDetails.ApprovalName;
                info['ApprovalTime'] =  trainDetail.TrainDetails.ApprovalTime ? new Date(trainDetail.TrainDetails.ApprovalTime) : '';
                info['ApprovalRemark'] =  trainDetail.TrainDetails.ApprovalRemark;
                info['TripId'] =  trainDetail.TrainDetails.TripId;
                info['TripName'] =  trainDetail.TrainDetails.TripName;
               }

               if (this.regConfig.get('filter_type').value=='cancellation_date') {
                info['CancellationDate'] = trainDetail.TrainDetails.CancellationDate;
                info['CancellationTime'] = trainDetail.TrainDetails.CancellationTime;
                info['CancelConfirmationDate'] = trainDetail.TrainDetails.CancelConfirmationDate;
                info['CancelConfirmationTime'] = trainDetail.TrainDetails.CancelConfirmationTime;
                info['CancellationCharges'] = trainDetail.TrainDetails.CancellationCharges;
                info['CancellationFeedback'] = trainDetail.TrainDetails.CancellationFeedback;
                info['CancelConfirmationFeedback'] = trainDetail.TrainDetails.CancelConfirmationFeedback;
            }

                result.push(info)
            });
        });
        this.downloadExcel(result);
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
            const fileName = `train_corporate_mis_report_${todayDate}`;
            this.utility.exportToExcel(
                misData,
                fileName,
                columnWidths
            );
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
