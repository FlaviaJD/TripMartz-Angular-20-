import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers/api-handlers.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-update-department',
  templateUrl: './create-update-department.component.html',
  styleUrls: ['./create-update-department.component.scss']
})
export class CreateUpdateDepartmentComponent implements OnInit {

    @Output() departmentUpdate = new EventEmitter<any>();
    departmentForm:FormGroup;
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
      this.createCostCenterForm()
      this.createFileUploadForm()
      this.updatePreFilledData();
    }
  
    createCostCenterForm(){
      this.departmentForm=this.fb.group({
        departmentName:new FormControl('',[Validators.required])
      })
    }

    createFileUploadForm(){
        this.fileUploadForm=this.fb.group({
            upload_file:new FormControl('',[Validators.required]),
            uploadFile:new FormControl('')
        })
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.departmentUpdateData.subscribe((data=>{
            if(data.department_name){
                this.departmentForm.patchValue({'departmentName':data.department_name})
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
        department_name:this.departmentForm.get('departmentName').value
    }
    if(this.departmentForm.valid){
        if(!this.isUpdate){
        this.subSunk.sink = this.apiHandlerService.apiHandler('addDepartment', 'post', {}, {},{
        ...data
        })
            .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Department has been added successfully')
                    this.departmentUpdate.emit({ tabId: 'departmentList', data });
                }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
        }else{
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateDepartment', 'post', {}, {},{
            "id": this.id,  
            ...data
        })
            .subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Department has been updated successfully')
                this.masterService.departmentUpdateData.next('')
                this.departmentForm.reset();
                this.isUpdate=false;
                this.departmentUpdate.emit({ tabId: 'departmentList', data });
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
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadDepartmentCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Department CSV DATA has been added successfully')
                this.departmentUpdate.emit({ tabId: 'departmentList', data:'CSV Upload' });
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
        this.downloadFile(csvContent, 'department_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'department_name\n';
        const row = 'Sales\n';
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
