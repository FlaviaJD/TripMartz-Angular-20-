import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('support ticket/SentCallbackComponent');

@Component({
  selector: 'app-create-update-training-venue',
  templateUrl: './create-update-training-venue.component.html',
  styleUrls: ['./create-update-training-venue.component.scss']
})
export class CreateUpdateTrainingVenueComponent implements OnInit {
    regConfig: FormGroup;
    selectRqeType: string;
    noData: boolean = true;
    respData: any;
    requestTypes: any;
    protected subs = new SubSink();
    currentUser: any = {};

    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService
    ) { }

   ngOnInit() {
        this.createForm();
        this.currentUser = this.util.readStorage('currentUser', localStorage);
    }

    createForm() {
        this.regConfig = this.fb.group({
            Name: new FormControl('', [Validators.required]),
        })
    }
    onSubmit() {
        if (this.regConfig.invalid) {
            return;
        }
        let req = this.regConfig.value;
        this.subs.sink = this.apiHandlerService.apiHandler('trainingVenue', 'POST', {}, {}, req).subscribe(res => {
            if (res.result || res.Status) {
                this.swalService.alert.success("Training venue added successfully.");
                this.regConfig.reset();
            } else {
                this.swalService.alert.oops(res.Message);
            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
            console.error(err);
            this.swalService.alert.oops();
        }
        );
    }
  onReset() {

  }
}
