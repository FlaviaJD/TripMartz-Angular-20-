import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';

@Component({
    selector: 'app-employee-aprroval-create',
    templateUrl: './employee-aprroval-create.component.html',
    styleUrls: ['./employee-aprroval-create.component.scss']
})
export class EmployeeAprrovalCreateComponent implements OnInit {
    private subSunk = new SubSink();
    @Output() toUpdate = new EventEmitter<any>();
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean = false;
    filteredCorp: Observable<string[]>;
    employeeForm: FormGroup;
    corporateList: any;
    loggedInUser;
    isUpdate: any;
    id: any;
    constructor(
        private fb:FormBuilder,
        private apiHandlerService:ApiHandlerService,
        private swalService:SwalService,
        private masterService:MasterService
    ) {
        this.createForm();
        this.updatePreFilledData();
    }

    createForm() {
        this.loggedInUser = (JSON.parse(localStorage.getItem('currentCorpUser')));
        this.employeeForm = this.fb.group({
            employee_code: new FormControl('', [Validators.required]),
            corporate_code: new FormControl(this.loggedInUser.id, [Validators.maxLength(120)]),
            approved_required: new FormControl('No'),
        })
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.approvalUpdateData.subscribe((data=>{
            if(data.EmployeeCode){
                this.employeeForm.patchValue({'employee_code':data.EmployeeCode})
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
    }

    onReset(){
        this.createForm();
    }
    
    onSubmit(){
        if(this.employeeForm.valid){
            let data=this.employeeForm.value;
            this.loading=true;
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('employeeApproval', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Employee approval added successfully')
                        this.toUpdate.emit({ tabId: 'employeeApprovalList', data });
                        this.loading=false;
                    }
                    else{
                        this.swalService.alert.error('Unable to add');
                        this.loading=false;
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                    this.loading=false;
                });
            }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateEmployeeApproval', 'post', {}, {},{
                "id": this.id,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Employee approval has been updated successfully')
                    this.employeeForm.reset();
                    this.isUpdate=false;
                    this.loading=false;
                    this.toUpdate.emit({ tabId: 'employeeApprovalList', data });
                    }
                    else{
                        this.loading=false;
                        this.swalService.alert.error('Unable To Update');
                    }
                },(err: HttpErrorResponse) => {
                    this.loading=false;
                this.swalService.alert.error(err['error']['Message']);
            });
            }
        }
    }


    ngOnInit() {
    }

}
