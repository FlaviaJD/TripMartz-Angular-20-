import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MasterService } from '../../master.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-add-update-state',
    templateUrl: './add-update-state.component.html',
    styleUrls: ['./add-update-state.component.scss']
})
export class AddUpdateStateComponent implements OnInit {

    @Output() stateUpdate = new EventEmitter<any>();
    regConfig: FormGroup;
    fileConfig: FormGroup;
    isUpdate:boolean=false;
    csvFileName:string;
    subSunk=new SubSink();
    id:any;
    showDiv = {
        Details : true,
        Csv : false,
      }
    isClicked: boolean = false;

    constructor(
      private fb: FormBuilder,
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private masterService:MasterService
    ) { }

    ngOnInit() {
        this.createForm();
        this.createFileUploadForm();
        this.updatePreFilledData();
    }

    createForm() {
        this.regConfig = this.fb.group({
            state_name: new FormControl('', [Validators.required]),
            state_code: new FormControl('', [Validators.required]),
            state_id: new FormControl('', [Validators.required]),
            xlpro_state_code: new FormControl('', [Validators.required]),
            status: new FormControl('1', [Validators.required])
        }
        );
    }

    createFileUploadForm() {
        this.fileConfig = this.fb.group({
            state_file_upload: new FormControl('', [Validators.required]),
            uploadFile: new FormControl('')
        }
        );
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.stateUpdateData.subscribe((data=>{
            if(data.name){
                this.regConfig.patchValue({
                    'state_name': data.name,
                    'state_code': data.state_code,
                    'state_id':data.state_id,
                    'xlpro_state_code': data.xlpro_client_code,
                    'status': data.status
                });
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
      }

    onSubmit() {
        const data={
            name:this.regConfig.get('state_name').value,
            state_code:this.regConfig.get('state_code').value,
            state_id:+ (this.regConfig.get('state_id').value),
            xlpro_client_code:this.regConfig.get('xlpro_state_code').value,
            status:this.regConfig.get('status').value
        }
        if(this.regConfig.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addState', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('City has been added successfully')
                        this.stateUpdate.emit({ tabId: 'state_list', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateState', 'post', {}, {},{
                    "id": this.id,  
                    ...data
                })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('City has been updated successfully')
                        this.masterService.stateUpdateData.next('')
                        this.regConfig.reset();
                        this.isUpdate=false;
                        this.stateUpdate.emit({ tabId: 'state_list', data });
                        }
                    },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }
        }
    }

    radioSelection(radioValue:any){
        return this.regConfig.get('status').value == radioValue;
    }

    onCSVUpload(){
        const file = this.fileConfig.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadStateCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('City CSV has been added successfully')
                this.stateUpdate.emit({ tabId: 'state_list', data:'CSV Upload' });
            }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
          } else {
            this.swalService.alert.error('Please select a valid csv file');
          }
        }
      }

    onReset() {
        this.regConfig.reset();
    }

    onSampleDownload(event: Event) {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'state_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'name,state_code,state_id,xlpro_client_code,status\n';
        const row = 'East PState,EPS,12,765765,1\n';
        return header + row;
    }

    private downloadFile(content: string, fileName: string) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    onDownload() {
    }

    uploadFile($event) {
        const file=$event.target.files[0];
        this.fileConfig.get('uploadFile').patchValue(file);
        this.csvFileName=file.name
    }
    
    onFileSubmit() {

    }

    onFileReset() {
        this.fileConfig.reset();
        this.csvFileName='';
    }

}
