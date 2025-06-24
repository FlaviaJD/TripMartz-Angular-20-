import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers/api-handlers.service';


@Component({
  selector: 'app-create-update-position',
  templateUrl: './create-update-position.component.html',
  styleUrls: ['./create-update-position.component.scss']
})
export class CreateUpdatePositionComponent implements OnInit {

    @Output() toUpdate = new EventEmitter<any>();
    positionForm:FormGroup;
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
      this.createCostCenterForm();
      this.createFileUploadForm();
      this.updatePreFilledData();
    }
  
    createCostCenterForm(){
      this.positionForm=this.fb.group({
        positionName:new FormControl('',[Validators.required])
      })
    }

    onPostionSave(){
    }

    createFileUploadForm(){
        this.fileUploadForm=this.fb.group({
            upload_file:new FormControl('',[Validators.required]),
            uploadFile:new FormControl('')
        })
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.positionUpdateData.subscribe((data=>{
            if(data.position_name){
                this.positionForm.patchValue({'positionName':data.position_name})
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
            position_name:this.positionForm.get('positionName').value
        }
        if(this.positionForm.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addPosition', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Position has been added successfully')
                        this.toUpdate.emit({ tabId: 'positionList', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updatePosition', 'post', {}, {},{
                "id": this.id,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Position has been updated successfully')
                    this.masterService.positionUpdateData.next('')
                    this.positionForm.reset();
                    this.isUpdate=false;
                    this.toUpdate.emit({ tabId: 'positionList', data });
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
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadPositionCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Position CSV Data has been added successfully')
                this.toUpdate.emit({ tabId: 'purposeList', data:'CSV Upload' });
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
        this.downloadFile(csvContent, 'position_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'position_name\n';
        const row = 'Manager\n';
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
