import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'projects/agent/src/app/auth/auth.service';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { environment } from '../../../../../environments/environment';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { AlertService } from '../../../../core/services/alert.service';
import { DatePipe } from '@angular/common';

const baseUrl2 = environment.B2B_URL
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('theFile', { static: true }) theFile: ElementRef;
    logoUri = baseUrl2;
    maxDate = new Date();
    userTitleList: Array<any> = [];
    public profile_logo = "assets/images/login-images/assets/profile_logo.png";
    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
    onFileChange(files: FileList) {
        this.labelImport.nativeElement.innerText = Array.from(files)
            .map(f => f.name)
            .join(', ');

        this.fileToUpload = files.item(0);
        if (this.fileToUpload.name) {
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ 'user_image': this.fileToUpload });
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }
    formImport: FormGroup;
    logoConfig: FormGroup;
    fileToUpload: File = null;
    profileForm: FormGroup;
    countries: any = [];
    currentUser: any = {};
    protected subs = new SubSink();
    imgObj = {
        isLogoToUpdate: false,
        isUploaded: false
    }
    submitted: boolean = false;
    userImage: string;
    agentData: any;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private alertService: AlertService,
        private authService: AuthService,
        private swalService: SwalService,
        private datePipe: DatePipe,
    ) { }

    ngOnInit() {
        this.maxDate.setDate(this.maxDate.getDate() - (18 * 356));
        this.getTitleList();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

        this.createForm();
        this.getAgentById();
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'POST')
            .subscribe(res => {
                if (res.Status) {
                    this.countries = res.data.popular_countries.concat(res.data.countries);
                }
            });
        this.setDataToForm(this.currentUser)
    }

    getTitleList() {
        this.subs.sink = this.apiHandlerService.apiHandler('userTitlelist', 'post', '', '').subscribe(res => {
            this.userTitleList = res.data;

        });
    }

    getAgentById() {
        this.subs.sink = this.apiHandlerService.apiHandler('getAgentById', 'POST', {}, {}, { "id": this.currentUser.id })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.agentData = res.data;
                    this.setDataToForm(this.agentData);
                }
            });
    }

    createForm() {
        this.profileForm = this.fb.group({
            id: [],
            title: ['', [Validators.required]],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            date_of_birth: ['', [Validators.required]],
            country: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            //business_phone: ['', [Validators.required]],
            business_phone: [''],
            business_name: [''],
            business_number: ['', [Validators.required]],
            image: [''],
            importFile: [''],
            status: ['1', [Validators.required]],
            // user_id: [this.currentUser.user_id]
        });
        this.logoConfig = this.fb.group({
            user_image: new FormControl('')
        })
    }

    setDataToForm(userInfo) {
        let formattedDate = userInfo.date_of_birth? this.datePipe.transform(userInfo.date_of_birth , 'yyyy-MM-dd'):'';
        this.profileForm.patchValue({
            business_name: userInfo.business_name,
            business_number: userInfo.business_number,
            business_phone: userInfo.business_phone,
            first_name: userInfo.first_name,
            title: userInfo.title,
            last_name: userInfo.last_name,
            country: userInfo.country,
            phone: userInfo.phone,
            address: userInfo.address,
            date_of_birth: formattedDate,
            image: userInfo.image,
            id: userInfo.id
        });
        this.userImage = userInfo.image ? userInfo.image : '';

    }
    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    imageSrc;
    onFileSelected($event) {
        const file = $event.target.files[0];
        if (file.name) {
            this.imgObj.isLogoToUpdate = true;
            this.logoConfig.setValue({ 'user_image': file });
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;
            reader.readAsDataURL(file);
        } else {
            this.imgObj.isLogoToUpdate = false;
        }
    }

    uploadImg() {
        const formData = new FormData();
        formData.append('image', this.logoConfig.get('user_image').value);
        this.subs.sink = this.apiHandlerService.apiHandler('uploadUserProfilePhoto', 'post', {}, {}, formData).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data) {
                this.imgObj.isUploaded = true;
                this.currentUser['image'] = resp.data;
                setTimeout(() => {
                    this.userImage = resp.data;
                    this.update({ image: resp.data });
                    // this.authService.logout();
                }, 1000)
            } else {
                this.imgObj.isUploaded = false;
            }
        })
    }

    onSubmit(form, data) {
        if (this.profileForm.invalid) {
            return
        }
        // const jsonData = {
        //     id: this.currentUser.id,
        //     business_name: data.business_name,
        //     business_number: data.business_number,
        //     title: this.currentUser.title,
        //     address: data.address,
        //     first_name: this.currentUser.first_name,
        //     last_name: this.currentUser.last_name,
        //     phone: this.currentUser.phone,
        //     country: this.currentUser.country,
        //     date_of_birth: data.date_of_birth,
        //     business_phone: data.business_phone,
        //     image: data.image
        // }
        let req = JSON.parse(JSON.stringify(this.profileForm.value));
        req['country'] = (this.profileForm.value.country);
        req['title'] = parseInt(this.profileForm.value.title);
        req['status'] = parseInt(this.profileForm.value.status);
        delete req['importFile'];
        //  req['date_of_birth']=formatDate(this.profileForm.value.date_of_birth, 'YYYY-MM-DD')
        if (!this.imgObj.isLogoToUpdate) {
            req['image'] = this.userImage;
        }
        // this.subs.sink = this.apiHandlerService.apiHandler('updateAgent', 'POST', '', '', { ...jsonData })
        this.subs.sink = this.apiHandlerService.apiHandler('updateAgent', 'POST', '', '', req)
            .subscribe(res => {
                if (res.statusCode == 201) {
                    if (this.imgObj.isLogoToUpdate) {
                        this.uploadImg();
                        this.submitted = false;

                    }
                    this.currentUser['first_name'] = req['first_name'];
                    this.currentUser['last_name'] = req['last_name'];
                    this.currentUser['phone'] = req['phone'];
                    this.swalService.alert.success("Profile updated successfully.");
                    setTimeout(() => {
                        this.update({ first_name: req['first_name'], last_name: req['last_name'], phone: req['phone'] });
                        // this.authService.logout();
                    }, 1000)

                } else {
                    // this.alertService.error(res.Message);
                    this.swalService.alert.error(res.Message);
                }
            });
    }

    update(value) {
        let prevData = this.currentUser;
        Object.keys(value).forEach(function (val, key) {

            prevData[val] = value[val];
        })
        localStorage.setItem('currentUser', JSON.stringify(prevData));
        this.authService.b2bUserSubject.next(JSON.parse(localStorage.getItem('currentUser')));
    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
