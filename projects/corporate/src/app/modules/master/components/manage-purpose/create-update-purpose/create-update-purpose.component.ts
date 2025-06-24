import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder,FormControl,Validators } from '@angular/forms';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers/api-handlers.service';

@Component({
  selector: 'app-create-update-purpose',
  templateUrl: './create-update-purpose.component.html',
  styleUrls: ['./create-update-purpose.component.scss']
})
export class CreateUpdatePurposeComponent implements OnInit {

    @Output() purposeUpdate = new EventEmitter<any>();
    purposeForm:FormGroup;
    fileUploadForm:FormGroup;
    isUpdate:boolean=false;
    subSunk=new SubSink();
    id:any;
    csvFileName:string;
    isClicked: boolean = false;
    showDiv = {
        Details : true,
        Csv : false,
      }

    constructor(
        private fb:FormBuilder,
        private apiHandlerService:ApiHandlerService,
        private swalService:SwalService,
        private masterService:MasterService
    ) { }
  
    ngOnInit() {
      this.createPurposeForm();
      this.createFileUploadForm();
      this.updatePreFilledData();
    }
  
    createPurposeForm(){
      this.purposeForm=this.fb.group({
        purposeName:new FormControl('',[Validators.required])
      })
    }

    createFileUploadForm(){
        this.fileUploadForm=this.fb.group({
            upload_file:new FormControl('',[Validators.required]),
            uploadFile:new FormControl('')
        })
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.purposeUpdateData.subscribe((data=>{
            if(data.purpose_name){
                this.purposeForm.patchValue({'purposeName':data.purpose_name})
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
    }

    uploadFile($event){
        const file=$event.target.files[0];
        this.fileUploadForm.get('uploadFile').patchValue(file);
        this.csvFileName=file.name
    }

    onFileSubmit(){
        
    }
    
    onFileReset(){
        this.fileUploadForm.reset();
        this.csvFileName='';
    }
    
    onSubmit(){
        const data={
            purpose_name:this.purposeForm.get('purposeName').value
        }
        if(this.purposeForm.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addPurpose', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Purpose has been added successfully')
                        this.purposeUpdate.emit({ tabId: 'purposeList', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updatePurpose', 'post', {}, {},{
                "id": this.id,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Purpose has been updated successfully')
                    this.masterService.purposeUpdateData.next('')
                    this.purposeForm.reset();
                    this.isUpdate=false;
                    this.purposeUpdate.emit({ tabId: 'purposeList', data });
                    }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
            }
        }
    }

    onCSVUpload(){
        const file = this.fileUploadForm.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadPurposeCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Purpose CSV DATA has been added successfully')
                this.purposeUpdate.emit({ tabId: 'purposeList', data:'CSV Upload' });
            }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
          } else {
            this.swalService.alert.error('Please select a valid csv file');
          }
        }
      }
    
    onReset(){
        
    }

    onSampleDownload(event: Event) {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'purpose_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'purpose_name\n';
        const row = 'Holidays\n';
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
