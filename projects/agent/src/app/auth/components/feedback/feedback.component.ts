import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../core/api-handlers';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../../core/services/utility.service';
import { SwalService } from '../../../core/services/swal.service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
    feedBackForm: FormGroup;
    app_reference: any;
    loading: boolean;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private activatedRoute: ActivatedRoute,
        private utility: UtilityService,
        private router: Router,
        private swalService:SwalService
    ) {
        this.createForm();
        this.activatedRoute.queryParams.subscribe(q => {
            if (!this.utility.isEmpty(q)) {
                this.app_reference = q.encryptedData
            }
        });
    }

    createForm(){
        this.feedBackForm = this.fb.group({
            hotelProperty: ['', [Validators.required]],
            foodQuality: ['', [Validators.required]],
            cleanliness: ['', [Validators.required]],
            services: ['', [Validators.required]],
            proximity_from_office: ['', [Validators.required]],
            value_for_money: ['', [Validators.required]],
            comments: ['', [Validators.required]]
        });
    }

    ngOnInit() {
    }

    submit() {
        if (!this.feedBackForm.valid) {
            return;
        }
        this.loading = true;
        let request = this.feedBackForm.value;
        request.app_reference = this.app_reference;
        this.apiHandlerService.apiHandler('feedBack', 'post', '', '', request)
            .subscribe(resp => {
                if (resp && ([200, 201].includes(resp.statusCode)) && resp.data && resp.data.length > 0) {
                    this.loading = false;
                    // this.swalService.alert.success("Feedback submitted successfully.");
                    this.router.navigate(['/feedback-confirmation'], { queryParams: { status: true } });
                }
                else {
                    this.loading = false;
                    // this.swalService.alert.oops("Unable to submit feedback");
                    this.router.navigate(['/feedback-confirmation'], { queryParams: { status: false } });
                }
            }, (err) => {
                this.loading = false;
                // this.swalService.alert.oops("Unable to submit feedback");
                this.router.navigate(['/feedback-confirmation'], { queryParams: { status: false } });

            });
    }

}
