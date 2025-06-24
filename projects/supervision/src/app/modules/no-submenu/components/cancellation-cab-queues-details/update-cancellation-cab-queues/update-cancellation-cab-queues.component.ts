import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-update-cancellation-cab-queues',
    templateUrl: './update-cancellation-cab-queues.component.html',
    styleUrls: ['./update-cancellation-cab-queues.component.scss']
})
export class UpdateCancellationCabQueuesComponent implements OnInit {
    @Input() cabUpdateData: any;
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
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.cancellationConfig = this.fb.group({
            cancellation_feedback: new FormControl(this.cabUpdateData.CarDetails.CancellationFeedback),
            confirmation_feedback: new FormControl('', [Validators.required]),
            cancellation_charges: new FormControl('', [Validators.required]),
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
            id:this.cabUpdateData.UserId,
            ConfirmationFeedback:formValue.confirmation_feedback,
            CancellationCharges:formValue.cancellation_charges
        }
        this.subs.sink = this.apiHandlerService.apiHandler('carCancel', 'post', {}, {}, reqBody)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.loading=false;
                    this.swalService.alert.success(resp.Message);
                    this.back.next(true);
                }
                else{
                    this.loading=false;
                    this.swalService.alert.oops("Unable to update");
                    this.back.next(true);

                }
            }, err => {
                this.loading=false;
                this.swalService.alert.oops("Unable to update");
                this.back.next(true);
            });
    }

}
