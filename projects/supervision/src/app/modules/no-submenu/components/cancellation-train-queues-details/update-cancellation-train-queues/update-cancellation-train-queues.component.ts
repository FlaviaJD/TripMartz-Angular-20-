import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-update-cancellation-train-queues',
    templateUrl: './update-cancellation-train-queues.component.html',
    styleUrls: ['./update-cancellation-train-queues.component.scss']
})
export class UpdateCancellationTrainQueuesComponent implements OnInit {

    @Input() trainUpdateData: any;
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
            cancellation_feedback: new FormControl(this.trainUpdateData.TrainDetails.CancellationFeedback),
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
            AppReference:this.trainUpdateData.TrainDetails.AppReference,
            ConfirmationFeedback:formValue.confirmation_feedback,
            CancellationCharges:formValue.cancellation_charges
        }
        this.subs.sink = this.apiHandlerService.apiHandler('trainCancel', 'post', {}, {}, reqBody)
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
