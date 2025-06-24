import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { GstService } from '../gst.service';

@Component({
  selector: 'app-gst-add-update',
  templateUrl: './gst-add-update.component.html',
  styleUrls: ['./gst-add-update.component.scss']
})
export class GstAddUpdateComponent implements OnInit {

  @Output() gstUpdate = new EventEmitter<any>();
  regConfig: FormGroup;
  fileConfig:FormGroup;
  isUpdate:boolean=false;
  csvFileName:string;
  subSunk=new SubSink();
  id:any;
  showDiv = {
    Details : true,
    Csv : false,
  }
  isClicked: boolean = false;
  clientList:Array<any>=[];
  moduleList=['Flight','Hotel'];
  typeList=['Business','Training'];
  userTitleList:Array<any>=[];
  statesList:Array<any>=[];
  lastKeyupTstamp:number=0;
  name:any;
  clientId:any;
  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private gstService:GstService
  ) { }

    ngOnInit() {
        this.createForm();
        this.createFileUploadForm();
        this.getTitleList();
        this.getClientList();
        this.updatePreFilledData();
    }

    createForm() {
        this.regConfig = this.fb.group({
            client_name: new FormControl(''),
            client_code: new FormControl('', [Validators.required]),
            client_id: new FormControl(''),
            gst_number: new FormControl('', [Validators.required]),
            client_address: new FormControl('', [Validators.required]),
            gst_phone_number: new FormControl('', [Validators.required]),
            gst_email_id: new FormControl('', [Validators.required]),
            gst_state: new FormControl('', [Validators.required]),
            gst_module_name: new FormControl('', [Validators.required]),
            gst_state_id:new FormControl(''),
            type:new FormControl(''),
            gst_state_code:new FormControl('')
        }
        );
    }

    createFileUploadForm() {
        this.fileConfig = this.fb.group({
            upload_client_name: new FormControl('', [Validators.required]),
            upload_module_name: new FormControl('', [Validators.required]),
            upload_file: new FormControl('', [Validators.required]),
            uploadFile:new FormControl('')
        }
        );
    }

    updatePreFilledData(){
        this.subSunk.sink=this.gstService.gstUpdateData.subscribe((data=>{
            if(data.client_id){
               this.regConfig.patchValue({
                    'client_name':data.client_name,
                    'client_code': data.client_code,
                    'client_id':data.client_id,
                    'gst_number': data.gst_number,
                    'client_address': data.client_address,
                    'gst_phone_number': data.gst_ph_number,
                    'gst_email_id': data.gst_email_id,
                    'gst_state': data.gst_state,
                    'gst_module_name': data.gst_for,
                    'gst_state_id': data.gst_state_id,
                    'gst_state_code': data.gst_state_code,
                    'type':data.type!==null?data.type:''
                });
                this.clientId=data.client_id;
                this.isUpdate=true;
                this.id=data.id;
                this.clientList=[data.client_name];
                this.regConfig.get('client_id').disable();
                // this.moduleList=[data.gst_for];
            }
        }))
      }

    getClientList(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            {"status": 1,"auth_role_id":GlobalConstants.CORPORATE_AUTH_ROLE_ID})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.clientList = resp.data || [];
                    if(this.clientId){
                        let list = this.clientList.filter(el => (el.id) == (+this.clientId));
                        this.clientList=list;
                    }
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });

    }

    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitleList', 'post', '', '').subscribe(res => {
            this.userTitleList= res.data
        });
    }

    title(targetId:any){
        for (let i = 0; i < this.userTitleList.length; i++) {
            if (this.userTitleList[i].id === targetId) {
                return this.userTitleList[i].title;
            }
        }
    }

    getFullName(title,firstName,lastName){
        const personTitle=this.title(title)
        return `${personTitle} ${firstName} ${lastName}`;
    }

    getAutoCompleteState(event, type) {
        let inpValue = event.target.value;
        if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
            this.subSunk.sink = this.apiHandlerService.apiHandler('hotelStates', 'post', {}, {}, {
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
        this.regConfig.patchValue({
            'gst_state':state.name,
            'gst_state_id':state.id,
            'gst_state_code':state.state_code,
        });
        this.statesList=[];
    }

    onSubmit() {
        const data={
            gst_for: this.regConfig.get('gst_module_name').value,
            client_name: this.name,
            client_id: this.clientId,
            gst_number: this.regConfig.get('gst_number').value,
            client_address: this.regConfig.get('client_address').value,
            gst_ph_number: this.regConfig.get('gst_phone_number').value,
            gst_email_id: this.regConfig.get('gst_email_id').value,
            gst_state: this.regConfig.get('gst_state').value,
            gst_state_id: this.regConfig.get('gst_state_id').value,
            gst_state_code: this.regConfig.get('gst_state_code').value,
            client_code: this.regConfig.get('client_code').value,
            type:this.regConfig.get('type').value
        }
        if(this.regConfig.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('AddGst', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Gst Information has been added successfully')
                        this.gstUpdate.emit({ tabId: 'gst_list', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
                this.subSunk.sink = this.apiHandlerService.apiHandler('UpdateGst', 'post', {}, {},{
                    "id": this.id,  
                    ...data
                })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Gst Information has been updated successfully')
                        this.regConfig.reset();
                        this.isUpdate=false;
                        this.gstUpdate.emit({ tabId: 'gst_list', data });
                        }
                    },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }
        }
    }

    onChange(event){
        if(event){
            this.name = event.business_name;
            this.clientId = event.id;
        }
    }

    onReset() {
        //this.userManagementService.b2bUserUpdateData.next({});
        this.regConfig.reset();
    }

    onCSVUpload(){
        const file = this.fileConfig.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadGstCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('GST CSV Data has been added successfully')
                this.gstUpdate.emit({ tabId: 'gst_list', data:'CSV Upload' });
            }
            }),(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            };
          } else {
            this.swalService.alert.error('Please select a valid csv file');
          }
        }
    }

    onDownload() {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'gst_sample_data.csv');
        this.isClicked=true;
    }

    private generateCsvContent(): string {
        const header = 'client_name,client_code,gst_number,client_address,gst_ph_number,gst_email_id,gst_state,gst_for,gst_state_id,gst_state_code,client_id,type\n';
        const row ='DCB Bank,D003B,10AAACD1461F1ZH,"Patna Branch, Konark Shere, Behind RBI, Exhibition Road, Patna - 800 001",0,gstinvoices@dcbbank.com,Bihar,Hotel,10,BR,470,Training\n';
        return header+row;
    }

    downloadFile(content: string, fileName: string) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    uploadFile($event){
        const file=$event.target.files[0];
        this.fileConfig.get('uploadFile').patchValue(file);
        this.csvFileName=file.name
    }
    onFileSubmit(){

    }

    onFileReset(){
        this.fileConfig.reset();
        this.csvFileName='';
    }
}
