import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SubSink } from 'subsink';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { AlertService } from '../../../../core/services/alert.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    maxDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: "YYYY-MM-DD",
        rangeInputFormat: "YYYY-MM-DD",
        containerClass: "theme-blue",
        showWeekNumbers: false
    };
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;

    profileForm: FormGroup;
    countries: any = [];
    currentUser: any = {};
    protected subs = new SubSink();
    isOpen = false as boolean;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private swalService: SwalService,
        public datepipe: DatePipe,
         private router: Router,
        
        
    ) { }

    ondateChange(e) { }
    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentCorpUser'));
        this.createForm();
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'POST')
            .subscribe(res => {
                if (res.Status) {
                    this.countries = res.data.popular_countries.concat(res.data.countries);
                }
            });
        this.subs.sink = this.apiHandlerService.apiHandler('editProfile', 'POST', '', '', { id: this.currentUser.id })
            .subscribe(res => {
                if (res.Status) {
                    let date_of_birth = this.datepipe.transform(res.data.date_of_birth, 'yyyy-MM-dd');
                    this.profileForm.patchValue({
                        user_id: res.data.id,
                        email: res.data.email,
                        business_name: res.data.business_name,
                        business_number: res.data.business_number,
                        business_phone: res.data.business_phone,
                        status: res.data.status,
                        title: res.data.title,
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        address: res.data.address,
                        date_of_birth: date_of_birth,
                        country_code: res.data.country,
                        phone: res.data.phone,
                        image: ''
                    });
                } else {
                    this.alertService.error(res.Message);
                }
            });
    }

    createForm() {
        this.profileForm = this.fb.group({
            title: ['', [Validators.required]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            date_of_birth: ['', [Validators.required]],
            country_code: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            business_phone: ['', [Validators.required]],
            business_name: ['', [Validators.required]],
            business_number: ['', [Validators.required]],
            image: [''],
            status: ['', [Validators.required]],
            // domain_image:['',[Validators.required]],
            user_id: [this.currentUser.id, [Validators.required]]
        });
    }

    onFileSelected($event) {
    const file = $event.target.files[0];
    if (file && file.size) {
        let result=this.validateFileSize(file.size);
        if(!result){
            return;
        }
    }
        if (file.name) {
            this.profileForm.patchValue({
                image: file,
                // domain_image: file
            });
            const reader = new FileReader();
            reader.readAsDataURL(file);
    }
  }

  validateFileSize(fileSize) {
    if (fileSize >1048576) {
        this.swalService.alert.oops("Maximum upload file size: 1 MB");
        return false;
    }
    else {
        return true
    }
}


    onSubmit() {
        if (this.profileForm.invalid) {
            return;
        }
            const formData =  new FormData();
            formData.append('first_name', this.profileForm.value.first_name);
            formData.append('last_name', this.profileForm.value.last_name);
            formData.append('address', this.profileForm.value.address);
            formData.append('date_of_birth', this.profileForm.value.date_of_birth);
            formData.append('country_code', this.profileForm.value.country_code);
            formData.append('phone', this.profileForm.value.phone);
            formData.append('business_phone', this.profileForm.value.business_phone);
            formData.append('business_name', this.profileForm.value.business_name);
            formData.append('business_number', this.profileForm.value.business_number);
            formData.append('status', this.profileForm.value.status);
            formData.append('user_id', this.profileForm.value.user_id);
            formData.append('title', this.profileForm.value.title);
            formData.append('image', this.profileForm.get('image').value);
        this.subs.sink = this.apiHandlerService.apiHandler('updateProfile', 'POST', '', '', formData)
            .subscribe(res => {
                if (res.Status) {
                    this.swalService.alert.success('Profile updated successfully!');
                                      this.router.navigate(['/']);
                } else {
                    this.swalService.alert.oops(res.Message);
                }
            }, (errorResponse) => {
                this.swalService.alert.oops(errorResponse.error.msg);

            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
