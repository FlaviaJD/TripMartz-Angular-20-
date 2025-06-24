import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Logger } from 'projects/employee/src/app/core/logger/logger.service';
import { MarkupsService } from '../../markups.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/employee/src/app/core/api-handlers';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';

const log = new Logger('report/TransactionLogsComponent');

@Component({
    selector: 'app-hotel',
    templateUrl: './hotel.component.html',
    styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {
    markuplist: any;
    respData: any;
    updateGeneral: boolean = false;
    noData: boolean = true;
    generalMarkupId: number;
    generalMarkupForm: FormGroup;
    submitted: boolean;
    protected subs = new SubSink();
    activeIdString: any = "middle";
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";
    
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private markupService: MarkupsService,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
    ) {
        this.generalMarkupForm = this.fb.group({
            mark_up_type: ['plus', Validators.required],
            mark_up_value: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.activeIdString = "middle";
        this.getMarkupData();
    }
    hasgeneralMarkupError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.generalMarkupForm.controls[controlName].touched) && this.generalMarkupForm.controls[controlName].hasError(errorName));
    }

    getMarkupData() {
        this.respData = this.markupService.fetchMarkupReport().subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.respData = resp.data;
                this.markuplist = resp.data
                this.markuplist = this.respData.filter((data) => {
                    return data.type === "generic" && data.module_type === "b2b_hotel"
                })
                if (this.markuplist.length != 0) {
                    this.updateGeneral = true;
                    this.generalMarkupId = this.markuplist[0].id;
                    this.generalMarkupForm.patchValue({
                        mark_up_value: this.markuplist[0].value ? this.markuplist[0].value : '',
                        mark_up_type: this.markuplist[0].value_type ? this.markuplist[0].value_type : '',
                    })
                }
            }
            else {
                this.noData = true;
            }
        });
    }

    updateGeneralMarkup(data) {
        let generalMarkup = [{
            id: this.generalMarkupId,
            value: parseInt(data.mark_up_value),
            value_type: data.mark_up_type,
            markup_currency: 'INR'
        }]
        this.subs.sink = this.apiHandlerService.apiHandler('updateFlightMarkup', 'POST', '', '', generalMarkup).subscribe(res => {
            if (res.Status) {
                this.getMarkupData();
                this.swalService.alert.success("Markup added successfully.");
                this.submitted = false;
            } else {
                this.swalService.alert.oops(res.Message);
            }
        });
    }

    onAddGeneralMarkup(data) {
        if (this.generalMarkupForm.invalid) {
            return;
        }
        if (this.updateGeneral) {
            this.updateGeneralMarkup(data);
        } else {
            this.onHotelAdd(data);
        }

    }

    onHotelAdd(hotelData) {
        this.submitted = true;
        if (this.generalMarkupForm.invalid) {
            return;
        }
        let markupForm = {
            flight_airline_id: 0,
            value_type: hotelData.mark_up_type,
            value: parseInt(hotelData.mark_up_value),
            type: "generic",
            domain_list_fk: 0,
            module_type: "b2b_hotel",
            markup_currency: "INR",
            fare_type: "Public",
        }

        this.subs.sink = this.apiHandlerService.apiHandler('addMarkup', 'POST', '', '', markupForm).subscribe(res => {
            if (res.Status) {
                this.getMarkupData();
                this.swalService.alert.success("Markup added successfully.");
                this.submitted = false;
            } else {
                this.swalService.alert.oops(res.Message);
            }
        });
    }

    clearGeneralMarkup() {
        this.generalMarkupForm.reset();
    }
    
    onSearchTypeChange(value) {
        this.router.navigate(["markup/" + value])
    }

}
