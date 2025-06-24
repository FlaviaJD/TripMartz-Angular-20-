import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../user-management.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { AppService } from 'projects/supervision/src/app/app.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
@Component({
    selector: 'app-create-sub-admin',
    templateUrl: './create-sub-admin.component.html',
    styleUrls: ['./create-sub-admin.component.scss']
})
export class CreateSubAdminComponent implements OnInit, OnDestroy {

    @Output() staffUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    subagentId;
    dropdownList = [];
    selectedItems = [];
    dropdownSettings: IDropdownSettings;
    userTitleList: Array<any> = [];
    userTypeList: Array<any> = [];
    phoneCodeList: Array<any> = [];
    regConfig: FormGroup;
    isOpen = false as boolean;
    setMinDate: any;
    addOrUpdate: string = 'add';
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate = new Date();
    countriesList = [];
    countryId:string;
    corporateSelected: boolean=true;
    submitted:boolean=false;
    selectedCorporate: any[] = []; 
    selectedCorporateControl = new FormControl(); // Define a form control

    constructor(
        private router: Router,
        private userManagementService: UserManagementService,
        private swalService: SwalService,
        private fb: FormBuilder,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private appService: AppService,
        private datePipe: DatePipe
    ) {
        this.countryId = this.appService.countryId;
     }

    ngOnInit() {
        
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'business_name',
            itemsShowLimit: 3,
            allowSearchFilter: true,
            enableCheckAll:false
        };
        this.getTitleList();
        this.getTypeList();
        this.getUserList();
        this.createForm();
        this.getPhoneCodeList();
        this.getCountriesList();
    }

    
    onItemSelect(item: any) {
        this.corporateSelected=true;
        if (!this.selectedItems.includes(item.id)) {
            this.selectedItems.push(item.id);
        }
    }

    onItemDeselect(item: any) {
        this.corporateSelected=true;
        const index = this.selectedItems.indexOf(item.id);
        if (index !== -1) {
            this.selectedItems.splice(index, 1);
        }
    }

    // Event handler for selecting all items
    onSelectAll(items: any) {
        this.corporateSelected=true;
        // Add IDs of all selected items to the selectedItems array
        items.forEach((item: any) => {
            this.selectedItems.push(item.id);
        });
    }

    getCountriesList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
            this.countriesList = res.data.popular_countries.concat(res.data.countries);
        });
    }

    getTitleList() {
        this.subSunk.sink = this.userManagementService.fetchTitleList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.userTitleList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    getTypeList() {
        this.subSunk.sink = this.userManagementService.getUserTypeList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.userTypeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    createForm() {
        let date=new Date();
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            uuid:new FormControl(''),
            title: new FormControl('', [Validators.required]),
            first_name: new FormControl('', [Validators.required]),
            middle_name: new FormControl(''),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            password: new FormControl('', [Validators.required]),
            confirm_password: new FormControl('', [Validators.required]),
            phone_code:new FormControl(this.countryId, [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            date_of_birth: new FormControl(date, [Validators.required]),
            country: new FormControl(this.countryId, [Validators.required]),
            status: new FormControl('1', [Validators.required]),
            auth_role_id: new FormControl(GlobalConstants.STAFF_AUTH_ROLE_ID),
        },
            {
                validator: this.matchPassword
            });
    }

    private matchPassword(AC: AbstractControl) {
        const password = AC.get('password').value
        const confirm_password = AC.get('confirm_password').value
        if (password != confirm_password) {
            AC.get('confirm_password').setErrors({ matchPassword: true })
        } else {
            AC.get('confirm_password').setErrors(null);
        }
    }

    getToUpdate() {
        this.subSunk.sink = this.userManagementService.staffUpdateData.subscribe(data => {
            if (!this.utility.isEmpty(data)) {
                let formattedDate = data.date_of_birth? this.datePipe.transform(data.date_of_birth , 'yyyy-MM-dd'):'';
                this.addOrUpdate = 'update';
                this.selectedItems=JSON.parse(data.corporates)!=null? JSON.parse(data.corporates):[];
                this.selectedCorporate = this.dropdownList.filter(item => data.corporates.includes(item.id));
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    uuid:data.uuid ? data.uuid : '',
                    title: data.title ? data.title : '',
                    first_name: data.first_name ? data.first_name : '',
                    middle_name: data.middle_name ? data.middle_name : '',
                    last_name: data.last_name ? data.last_name : '',
                    email: data.email ? data.email : '',
                    country: data.country ? data.country.toString() : '',
                    password: '12345',
                    confirm_password: '12345',
                    phone_code:data.phone_code ? data.phone_code : '',
                    phone: data.phone ? data.phone : '',
                    date_of_birth: formattedDate,
                    status: data.status == 1 ? '1' : '0',
                }, { emitEvent: false })

            } else {
                this.addOrUpdate = 'add';
            }
        })
    }

    getUserList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userList', 'post', {}, {}, {
            auth_role_id: 7,
            status: 1
        }).subscribe(resp => {
            if (resp.statusCode === 200 || resp.statusCode === 201) {
                this.dropdownList = resp.data;
                this.getToUpdate();
            } else if (resp.statusCode === 404) {
                this.dropdownList=[];
                this.getToUpdate();
            }
        });
    }


    getPhoneCodeList() {
        this.subSunk.sink = this.userManagementService.fetchPhoneCodeList()
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.phoneCodeList = resp.data.length ? resp.data : this.userManagementService.isDevelopement;

                } else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    onSubmit() {
        this.submitted=true;
        if (this.regConfig.invalid) {
            return;
        }
        if(this.selectedItems.length==0){
            this.corporateSelected=false;
            return;
        }
        this.corporateSelected=true;
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        req['auth_role_id'] =GlobalConstants.STAFF_AUTH_ROLE_ID;
        req['address'] = "Bangalore";
        req['title'] = parseInt(req['title']);
        req['business_name'] = "";
        req['business_number'] = "";
        req['business_phone'] = "";
        req['city'] = "";
        req['state'] = "";
        req['zip_code'] = null;
        req['address2'] = "";
        req['corporates']=this.selectedItems;
        switch (this.addOrUpdate) {
            case 'add':
                delete req.id;
                delete req.uuid;
                delete req.confirm_password;
                this.subSunk.sink = this.userManagementService.addUsers(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Sub Admin added successfully.");
                            this.regConfig.reset();
                            this.staffUpdate.emit({ tabId: 'staff_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops();
                    })
                break;
            case 'update':
                if(req.password=='12345' &&  req.confirm_password=='12345'){
                    delete req.password;
                }
               // delete req.confirm_password;
                delete req.uuid;
                this.subSunk.sink = this.userManagementService.updateUsers(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Sub Admin updated successfully.");
                            this.regConfig.reset();
                            this.staffUpdate.emit({ tabId: 'staff_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops();
                    })
                break;
            default:
                break;
        }

    }

    omitSpecialCharacters(event) {
        return this.utility.omitSpecialCharacters(event);
    }
    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    onReset() {
        this.userManagementService.staffUpdateData.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
