import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers/api-handlers.service';
import { SwalService } from '../../../core/services/swal.service';

@Component({
  selector: 'app-policy-approval',
  templateUrl: './policy-approval.component.html',
  styleUrls: ['./policy-approval.component.scss']
})
export class PolicyApprovalComponent implements OnInit {
    private subSunk = new SubSink();
    policyForm: FormGroup;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean = false;
    selectedPolicy: boolean = false;
    encryptedData:any;
    approveDetailsList:any;
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.generateForm();
        this.route.queryParams.subscribe(params => {
            this.encryptedData = params['encryptedData'] || '';
            const status = params['status'] || '';
            if (this.encryptedData != '') {
                this.policyForm.patchValue({
                    encoded_string: this.encryptedData
                })
            }
            if (status != '') {
                this.policyForm.patchValue({
                    status: status
                })
                this.toggleRemarkRequired(null,status);
            }
        })
        this.approveDetails();
    }

    generateForm() {
        this.policyForm = this.fb.group({
            encoded_string: ['', [Validators.required]],
            remarks: [''],
            status: ['', [Validators.required]]
        });
    }


    onSubmit() {
        if (!this.policyForm.valid) {
            return;
        }
        this.loading = true;
        const payload = this.policyForm.value;
        let message = payload.status == 'Approve' ? 'Request has been approved successfully.' : 'Request has been rejected successfully.';
        this.apiHandlerService.apiHandler('approvarBooking', 'POST', '', '', payload)
            .subscribe(res => {
                if (res.data) {
                    this.loading = false;
                    //this.swalService.alert.success(message);
                    this.onReset();
                    this.router.navigate(['/booking/policy-confirmation'], { queryParams: { status: payload.status } });
                } else {
                    this.loading = false;
                    this.swalService.alert.oops("Unable To Submit");
                    this.onReset();
                }
            }, err => {
                this.loading = false;
                this.swalService.alert.oops('Unable To Submit');
                this.onReset();
            });
    }
    approveDetails() {
        this.loading = true;
        const payload ={
            encoded_string : this.encryptedData ,
            remarks: "",
            status: "Display"
        };
        this.apiHandlerService.apiHandler('approveDetails', 'POST', '', '', payload)
            .subscribe(res => {
                if (res.data) {
                    this.loading = false;
                    this.approveDetailsList = res.data ? res.data : "";
                } else {
                    this.loading = false;
                    this.swalService.alert.oops("No data found");
                }
            }, err => {
                this.loading = false;
                this.swalService.alert.oops('No data found');
            });
    }
    toggleRemarkRequired(event: Event,value?) {
     const selectedStatus = event==null ? value : (event.target as HTMLInputElement).value;
        if (selectedStatus === 'Approve') {
            this.selectedPolicy=false;
            this.policyForm.get('remarks').clearValidators();
        } else {
            this.selectedPolicy=true;
            this.policyForm.get('remarks').setValidators(Validators.required);
        }

        this.policyForm.get('remarks').updateValueAndValidity();
    }

   
    onReset() {
        this.policyForm.patchValue({
            remarks: ''
        });
    }

}
