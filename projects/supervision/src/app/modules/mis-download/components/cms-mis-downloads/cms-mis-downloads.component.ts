import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { formatDate } from 'ngx-bootstrap/chronos';

@Component({
    selector: 'app-cms-mis-downloads',
    templateUrl: './cms-mis-downloads.component.html',
    styleUrls: ['./cms-mis-downloads.component.scss']
})
export class CmsMisDownloadsComponent implements OnInit {

    regConfig: FormGroup;
    isOpen = false as boolean;
    cmsMisData: any;
    maxDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
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
            name: 'Cancellation Date',
            code: 'cancellation_date'
        }
    ];

    constructor(
        private fb: FormBuilder,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        
        this.createForm();
    }

    createForm() {
        let date = this.utility.setToDate();
        this.regConfig = this.fb.group({
            filter_type: new FormControl('booking_date',Validators.required),
            from_date: new FormControl(date,Validators.required),
            to_date: new FormControl(date,Validators.required),
            report_type: new FormControl(''),
            UserType:'Supervision'
        })
    }

    onDownloadMISReport() {
        const from_date = formatDate(this.regConfig.get('from_date').value, 'YYYY-MM-DD');
        const to_date = formatDate(this.regConfig.get('to_date').value, 'YYYY-MM-DD');
        const reqBody = {
            ...this.regConfig.value,
            from_date: from_date || "",
            to_date: to_date || ""
        };
        this.apiHandlerService.apiHandler('cmsHotelBooking', 'POST', '', '', reqBody).subscribe(
            (res) => {
                if (res && [200, 201].includes(res.statusCode) && res.data && res.data.length > 0) {
                    this.cmsMisData = res.data;
                    this.excelDownload();
                } else {
                    this.handleNoRecordFound();
                }
            },
            () => this.handleNoRecordFound()
        );
    }
    
    private handleNoRecordFound() {
        this.cmsMisData = [];
        this.swalService.alert.oops("No Record Found");
    }
    

    excelDownload() {
        if (this.cmsMisData.length) {
            const fileToExport = this.cmsMisData.map((response: any, index: number) => {
                return {
                    // "Sl No.": index + 1,
                    ...response,
                    Confirmed_date:new Date(response.Confirmed_date),
                    Request_date:new Date(response.Request_date),
                    Checkin:new Date(response.Checkin),
                    Checkout:new Date(response.Checkout)
                }
            });
            const columnWidths = [
                { wch: 30}
            ];
            const fieldsLength = this.cmsMisData[0].length;
            for (let i = 0; i < fieldsLength; i++) {
                columnWidths.push({ wch: 30 })
            }
            const todayDate: string = new Date().toLocaleDateString('en-GB');
            const fileName = `cms_mis_report_${todayDate}`;
            this.utility.exportToExcel(
                fileToExport,
                fileName,
                columnWidths
            );
        }
    }
}

