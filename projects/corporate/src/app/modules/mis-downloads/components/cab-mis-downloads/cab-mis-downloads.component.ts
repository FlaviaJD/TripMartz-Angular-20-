import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-cab-mis-downloads',
  templateUrl: './cab-mis-downloads.component.html',
  styleUrls: ['./cab-mis-downloads.component.scss']
})
export class CabMisDownloadsComponent implements OnInit {

    regConfig: FormGroup;
    reportTypeList: Array<string> = ['Cab Report']
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
        private utility: UtilityService,
        private swalService: SwalService

    ) { }

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem('currentCorpUser'));
        if (this.loggedInUser['id'] == 243) {
           // this.hideExport = true;
        }
        this.createForm()
    }

    createForm() {
        let date = this.utility.setToDate();
        this.regConfig = this.fb.group({
            // employeeName: new FormControl('', [Validators.required]),
            filter_type: new FormControl('booking_date',Validators.required),
            fromDate: new FormControl(date, [Validators.required]),
            toDate: new FormControl(date, [Validators.required]),
            reportType: new FormControl(''),
            checkBoxExcel: new FormControl('')
        })
    }

    onDownloadMISReport() {
        if(!this.regConfig.valid)
        {
            return;
        }
        const from_date = formatDate(this.regConfig.get('fromDate').value, 'YYYY-MM-DD');
        const to_date = formatDate(this.regConfig.get('toDate').value, 'YYYY-MM-DD');
        const reqBody = {
            "Status": "BOOKING_CONFIRMED",
            "ReservationCode": "",
            "ReportType":'MIS',
            "BookedFromDate": from_date,
            "BookedToDate": to_date,
            "filter_type": this.regConfig.get('filter_type').value
        }
        this.apiHandlerService.apiHandler('carFindAll', 'POST', '', '', reqBody).subscribe(res => {
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
        data.forEach(objData => {
                const info = {
                Application_Reference:objData.AppReference? objData.AppReference :'N/A',
                Booking_Status: objData.CarDetails.BookingStatus? objData.CarDetails.BookingStatus :'N/A',
                company_name: objData.CarDetails.CompanyName ? objData.CarDetails.CompanyName: 'N/A',
                billing_entity: objData.CarDetails.BillingEntityName ? objData.CarDetails.BillingEntityName :'N/A',
                // app_status:objData.CarDetails.BookingStatus,
                no_of_guest: objData.NoOfPasseneger ? objData.NoOfPasseneger: 'N/A',
                employee_code: objData.CarDetails.EmployeeCode ? objData.CarDetails.EmployeeCode : 'N/A',
                employee_name: objData.EmployeeName ? objData.EmployeeName : 'N/A',
                mobile_number: objData.MobileNo ?  objData.MobileNo : 'N/A',
                email: objData.CarDetails.EmployeeEmail ? objData.CarDetails.EmployeeEmail : 'N/A',
                cab_type:objData.CarDetails.VehicleType ? objData.CarDetails.VehicleType : 'N/A',
                rental_city: objData.CarDetails.City ? objData.CarDetails.City : 'N/A',
                date_of_requirement: objData.CarDetails.PickupDate ? objData.CarDetails.PickupDate : 'N/A',
                reporting_address:objData.CarDetails.PickupAddress ? objData.CarDetails.PickupAddress : 'N/A',
                pickup_Time:objData.CarDetails.PickupTime ? objData.CarDetails.PickupTime : 'N/A',
                reporting_Time: objData.CarDetails.ReportingTime ? objData.CarDetails.ReportingTime : 'N/A',
                dropAddress: objData.CarDetails.DropAddress ? objData.CarDetails.DropAddress : 'N/A',
                dropDate: objData.CarDetails.DropDate ? objData.CarDetails.DropDate : 'N/A',
                dropTime: objData.CarDetails.DropTime ? objData.CarDetails.DropTime : 'N/A',
                driver_Name: objData.CarDetails.DriverName ? objData.CarDetails.DriverName : 'N/A',
                driver_Phone:objData.CarDetails.DriverPhone ? objData.CarDetails.DriverPhone : 'N/A',
                booked_By:objData.CarDetails.BookedBy ? objData.CarDetails.BookedBy : 'N/A',
                usage: objData.CarDetails.Usage ? objData.CarDetails.Usage : 'N/A',
                special_instructions:objData.CarDetails.SpecialInstructionIfany ? objData.CarDetails.SpecialInstructionIfany : 'N/A',
                admin_cancellation_ts:objData.CarDetails.CancelConfirmationDate,
                cancellation_charge:objData.CarDetails.CancellationCharges,
                cancelled_by_id:objData.CarDetails.CancelledByName,
                created_Date: objData.CreatedAt ? objData.CreatedAt : 'N/A',
                Duty_type:objData.CarDetails.DutyType ? objData.CarDetails.DutyType : 'N/A',
                Approval_name:objData.CarDetails.ApprovalName ? objData.CarDetails.ApprovalName : 'N/A',
                Approval_status:objData.CarDetails.ApprovalStatus ? objData.CarDetails.ApprovalStatus : 'Pending',
                Approval_remark:objData.CarDetails.ApprovalRemark ? objData.CarDetails.ApprovalRemark : 'N/A',
                Approval_time:objData.CarDetails.ApprovalTime ? objData.CarDetails.ApprovalTime : 'N/A',
                TripId:objData.CarDetails.TripId ? objData.CarDetails.TripId : 'N/A',
                TripName:objData.CarDetails.TripName? objData.CarDetails.TripName : 'N/A',
               }

                result.push(info)
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
            const fileName = `cab_corporate_mis_report_${todayDate}`;
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
