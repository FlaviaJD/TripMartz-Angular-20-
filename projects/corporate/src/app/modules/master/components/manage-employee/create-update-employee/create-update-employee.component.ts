import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-create-update-employee',
  templateUrl: './create-update-employee.component.html',
  styleUrls: ['./create-update-employee.component.scss']
})
export class CreateUpdateEmployeeComponent implements OnInit {

    @Output() toUpdate = new EventEmitter<any>();
    employeeForm:FormGroup;
    fileUploadForm:FormGroup;
    isCSVUploaded:boolean=false;
    titleList=[];
    bandList=['2A','3A','3B','4A','4B','5A','6A','6B']
    positionList=[];
    departmentList=[];
    costCenterList=[];
    countryList:any=[];
    approvarList=[]
    userStatusOptions=[{"id":1,"label":"Active"},{"id":0,"label":"Inactive"}]
    isUpdate:boolean=false;
    subSunk=new SubSink();
    id:any;
    csvFileName:string;
    lastKeyupTstamp: number = 0;
    statesList:Array<any>=[];
    isClicked: boolean = false;
    showDiv = {
        Details : true,
        Csv : false,
      }
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean = false;
    access:Array<string>=[];
    accessList:Array<any>=[
        {name:'On Behalf',value:'on_behalf',isChecked:false},
        {name:'Personal',value:'personal',isChecked:false}
    ]
    cityList: any;
    currentUser: any;
    constructor(
              private fb:FormBuilder,
              private apiHandlerService: ApiHandlerService,
              private swalService:SwalService,
              private masterService:MasterService
    ) { }
  
    ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentCorpUser')) || {};

        this.getCityList();
      this.createEmployeeForm();
      this.createFileUploadForm();
      this.getCountriesList();
      this.getCostCenterList();
      this.getDepartmentList();
      this.getPositionList();
      this.getEmployeeList();
      this.getTitleList();
    //   this.getStateList();
      this.updatePreFilledData();
    }
  
    createEmployeeForm(){
      this.employeeForm=this.fb.group({
        employeeId:new FormControl('',[Validators.required]),
        title:new FormControl('',[Validators.required]),
        firstName:new FormControl('',[Validators.required]),
        lastName:new FormControl('',[Validators.required]),
        band:new FormControl('2A',[]),
        positionName:new FormControl('',[Validators.required]),
        departmentName:new FormControl('',[Validators.required]),
        costCenter:new FormControl('N/A',[]),
        phoneNo: new FormControl('', 
            Validators.required),
       address:new FormControl('',[Validators.required]),
        city:new FormControl('',[Validators.required]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        pinCode:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
        userStatus:new FormControl('',[Validators.required]),
        xlproClientCode:new FormControl(''),
        approvar_id:new FormControl(731),
        approvarRequired:new FormControl('true',[]),
        gender:new FormControl('',Validators.required),
        is_approvar:new FormControl(true,[]),
        email:new FormControl('',[]),
        access:new FormControl('null',[]),
        locality: new FormControl('',[Validators.required]),
      })
    }
    getCityList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getCity', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.cityList=res.data;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    checkBoxSelection(inputEvent:any,checkedItem:string){
        let isChecked=inputEvent.target.checked;
        if(isChecked){
            this.access.push(checkedItem);
        } else{
            this.access = this.access.filter((item) => !item.toLowerCase().includes(checkedItem.toLowerCase()));
        }
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.employeeUpdateData.subscribe((data=>{
            if(data){
                this.employeeForm.patchValue({
                    'employeeId':data.employeeId,
                    'title': data.title,
                    'firstName': data.first_name,
                    'lastName': data.last_name,
                    'positionName': data.position_name,
                    'departmentName': data.department_name,
                    'costCenter': data.cost_center,
                    'phoneNo': data.phone,
                    'address': data.address,
                    'city': data.city,
                    'state': data.state,
                    'country': data.country,
                    'pinCode': data.pincode,
                    'userStatus': data.status,
                    'xlproClientCode': data.xlpro_client_code,
                    'approvar_id': data.approvar_id,
                    'approvarRequired': data.approvar_required,
                    'email': data.email,
                    'gender':data.gender,
                    'is_approvar':data.is_approvar,
                    'access':data.access,
                    'locality':data.locality,
                });
                this.access=data.access.split(',').map(c => c.trim());
                this.access = this.access.reduce((acc, value) => {
                    if (value !== '') {
                        acc.push(value);
                    }
                    return acc;
                }, []);
                this.accessList.forEach(item => {
                    if (this.access.includes(item.value)) {
                        item.isChecked = true;
                    }
                });
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
      }


    omitSpecialCharacters(event) {
        let k = event.charCode;
        if (
            (k > 64 && k < 91) ||  
            (k > 96 && k < 123)
        ) {
            return true;
        } else {
            return false;
        }
    }
    
    getCountriesList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
          this.countryList = res.data.countries
        });
    }

    getPositionList(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPosition', 'post', '', '').subscribe(res => {
            this.positionList = res.data;
        });
    }

    getCostCenterList(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('getCostCenter', 'post', '', '').subscribe(res => {
            this.costCenterList = res.data;
        });
    }

    getDepartmentList(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('getDepartment', 'post', '', '').subscribe(res => {
            this.departmentList = res.data
        });
    }

    getEmployeeList(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('getApprovalList', 'post', '','',{is_approvar:true}).subscribe(res => {
            this.approvarList= res.data;
        });
    }

    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitleList', 'post', '', '').subscribe(res => {
            this.titleList= res.data
        });
    }

    getAutoCompleteState(event, type) {
        let inpValue = event.target.value;
        if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
            this.subSunk.sink = this.apiHandlerService.apiHandler('stateList', 'post', {}, {}, {
                state_name: `${inpValue}`
            }).subscribe(resp => {
                if (resp.statusCode == 201 || resp.statusCode == 200) {
                    this.statesList = resp.data || [];
                } else {
                    // log.error('Something went wrong')
                }
            }, err => { 
                // log.error(err)
             });
            this.lastKeyupTstamp = event.timeStamp;
        }
    }
    
    
    onStateSelect(state:any) {
        this.employeeForm.patchValue({'state':state.name});
        this.statesList=[];
    }

    onSubmit(){
        let approvar_id=this.employeeForm.get('approvar_id').value=='null'?0:this.employeeForm.get('approvar_id').value;
        const data={
            status: this.employeeForm.get('userStatus').value,
            email: this.employeeForm.get('email').value,
            employeeId: this.employeeForm.get('employeeId').value,
            title: this.employeeForm.get('title').value,
            first_name: this.employeeForm.get('firstName').value,
            last_name: this.employeeForm.get('lastName').value,
            band: this.employeeForm.get('band').value,
            position_name: this.employeeForm.get('positionName').value,
            department_name: this.employeeForm.get('departmentName').value,
            cost_center: this.employeeForm.get('costCenter').value,
            address: this.employeeForm.get('address').value,
            phone: this.employeeForm.get('phoneNo').value,
            city: this.employeeForm.get('city').value,
            state: this.employeeForm.get('state').value,
            country: this.employeeForm.get('country').value,
            pincode: this.employeeForm.get('pinCode').value,
            xlpro_client_code: this.employeeForm.get('xlproClientCode').value,
            approvar_id: approvar_id,
            approvar_required: this.employeeForm.get('approvarRequired').value,
            gender:this.employeeForm.get('gender').value,
            access:this.access.join(','),
            is_approvar:this.employeeForm.get('is_approvar').value,
            locality: this.employeeForm.get('locality').value,
        }
        if(this.employeeForm.valid){
            this.loading=true;
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addEmployee', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Employee has been added successfully')
                        this.toUpdate.emit({ tabId: 'employeeList', data });
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
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateEmployee', 'post', {}, {},{
                "id": this.id,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Employee has been updated successfully')
                    this.masterService.positionUpdateData.next('')
                    this.employeeForm.reset();
                    this.isUpdate=false;
                    this.loading=false;
                    this.toUpdate.emit({ tabId: 'employeeList', data });
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

    onReset(){
        this.employeeForm.reset()
    }

    createFileUploadForm(){
        this.fileUploadForm=this.fb.group({
            upload_file:new FormControl('',[Validators.required]),
            uploadFile:new FormControl('')
        })
    }

    uploadFile($event){
        const file=$event.target.files[0];
        this.fileUploadForm.get('uploadFile').patchValue(file);
        this.csvFileName=file.name
    }

    onFileSubmit(){
        this.isCSVUploaded=true;
    }
    
    onFileReset(){
        this.fileUploadForm.reset();
        this.csvFileName='';
    }

    onCSVUpload(){
        const file = this.fileUploadForm.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadEmployeeCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Employee CSV Data has been added successfully')
                this.toUpdate.emit({ tabId: 'employeeList', data:'CSV Upload' });
            }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
          } else {
            this.swalService.alert.error('Please select a valid csv file');
          }
        }
    }

    onConfirmExcelUpload(){
        
    }

    onSampleDownload(event: Event) {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'employee_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header ='employeeId,title,first_name,last_name,position_name,department_name,cost_center,email,phone,address,city,state,country,pincode,xlpro_client_code,approvar_required,approvar_id,gender,is_approvar,access\n';
        const row ='EMP1001,1,Animesh,Singh,GROUP ASSOCIATE VICE PRESIDENT,DATA SCIENCE & INSIGHTS,3107,animeshtest@gmail.com,9876543210,Electronic City,Bangalore,Karnataka,151,56100,8765,TRUE,522,Male,TRUE,on_behalf,personal'
        return header + row;
    }

    private downloadFile(content: string, fileName: string) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

}
