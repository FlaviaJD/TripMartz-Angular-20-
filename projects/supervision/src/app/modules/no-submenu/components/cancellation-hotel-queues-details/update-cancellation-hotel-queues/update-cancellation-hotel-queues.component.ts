import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-update-cancellation-hotel-queues',
    templateUrl: './update-cancellation-hotel-queues.component.html',
    styleUrls: ['./update-cancellation-hotel-queues.component.scss']
})
export class UpdateCancellationHotelQueuesComponent implements OnInit {
    @Input() updateData: any;
    @Output() back = new EventEmitter<any>();
    cancellationConfig: FormGroup;
    protected subs = new SubSink();
    loading:boolean=false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) {

    }

    ngOnInit(): void {
        this.createForm();
    }

    createForm() {
        this.cancellationConfig = this.fb.group({
            EmployeeCancellationRemarks: new FormControl(this.updateData.employee_cancellation_remark),
            AdminCancellationRemarks: new FormControl('', [Validators.required]),
            CancellationCharges: new FormControl(''),
            RefundStatus: new FormControl('', [Validators.required]),
            NumberOfNightsToRefund: new FormControl(''),
        }
        );
    }

    onSubmit() {
        if (!(this.cancellationConfig.valid)) {
            return;
        }
        this.updateCancellationDetails(this.cancellationConfig.value);
    }

    updateCancellationDetails(formValue) {
        this.loading=true;
        let reqBody={
            AdminCancellationRemarks:formValue.AdminCancellationRemarks,
            AppReference:this.updateData.app_reference,
            CancellationCharges:formValue.CancellationCharges,
            RefundStatus:formValue.RefundStatus,
            NumberOfNightsToRefund:formValue.NumberOfNightsToRefund,
            EmployeeCancellationRemarks:formValue.EmployeeCancellationRemarks
        }
        this.subs.sink = this.apiHandlerService.apiHandler('cancelHotel', 'post', {}, {}, reqBody)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.loading=false;
                    this.swalService.alert.success(resp.Message);
                    this.back.next(true)
                }
                else{
                    this.loading=false;
                    this.swalService.alert.oops("Unable to update");
                    this.back.next(true) 
                }
            }, err => {
                this.loading=false;
                this.swalService.alert.oops("Unable to update");
                this.back.next(true)

            });
    }

    onRefundStatusChange(value) {
        const numberOfNightsControl = this.cancellationConfig.get('NumberOfNightsToRefund');
        if(value=='Retention'){
            numberOfNightsControl.setValidators([Validators.required]);
        }
        else{
            numberOfNightsControl.clearValidators();
        }
        numberOfNightsControl.updateValueAndValidity();
    }

    onChange(value) {
        const cancellation_charges = this.cancellationConfig.get('CancellationCharges');
        if(value=='Enter Amount'){
            cancellation_charges.setValidators([Validators.required]);
        }
        else{
            cancellation_charges.clearValidators();
        }
        cancellation_charges.updateValueAndValidity();
    }

}
