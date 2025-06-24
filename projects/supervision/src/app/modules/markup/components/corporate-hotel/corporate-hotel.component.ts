import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { AppService } from 'projects/supervision/src/app/app.service';

@Component({
    selector: 'app-corporate-hotel',
    templateUrl: './corporate-hotel.component.html',
    styleUrls: ['./corporate-hotel.component.scss']
})
export class CorporateHotelComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    respData: Array<any> = [];
    defaultCurrency: string = 'USD';
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private util: UtilityService,
        private appService: AppService
    ) { }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createForm();
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            "module_type": "b2b_hotel",
            "type": "generic",
            "user_id": this.util.readStorage('currentSupervisionUser', localStorage).id,
            "is_deleted": 0
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.respData = resp.data;
                this.regConfig.patchValue({
                    markupType: this.respData[0].value_type,
                    markupValue: this.respData[0].value
                })
            } else {
                this.swalService.alert.oops();
            }
        }, (err: HttpErrorResponse) => {
            this.swalService.alert.oops();
        });
        this.formValueChanges();
    }

    createForm() {
        this.regConfig = this.fb.group({
            markupType: ['', Validators.required],
            markupValue: ['', Validators.required]
        });
    }

    onSubmit(val) {
        if (this.regConfig.invalid)
            return;

        this.subSunk.sink = this.apiHandlerService.apiHandler('addB2bMarkup', 'post', {}, {},
            {
                "type": "generic",
                "fare_type": "Public",
                "module_type": "b2b_hotel",
                "flight_airline_id": 0,
                "value": Number(this.regConfig.get('markupValue').value),
                "value_type": this.regConfig.get('markupType').value,
                "domain_list_fk": 1,
                "markup_currency": this.defaultCurrency,
                "auth_user_id": this.util.readStorage('currentSupervisionUser', localStorage).id,
            }).subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success();
                    this.regConfig.reset();
                }
            })

    }

    formValueChanges() {
        const markupValueControl = this.regConfig.get('markupValue');

        this.regConfig.get('markupType').valueChanges
            .subscribe(markupType => {
                if (markupType == "plus") {
                    markupValueControl.setValidators([Validators.required, Validators.max(100000)]);
                }

                if (markupType == "percentage") {
                    markupValueControl.setValidators([Validators.required, Validators.max(100)]);
                }
                markupValueControl.updateValueAndValidity();
            })
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
