import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers/api-handlers.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';

@Component({
  selector: 'app-create-update-cost-center',
  templateUrl: './create-update-cost-center.component.html',
  styleUrls: ['./create-update-cost-center.component.scss']
})
export class CreateUpdateCostCenterComponent implements OnInit {


  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  @Output() costCenterUpdate = new EventEmitter<any>();
  costCenterForm:FormGroup;
  fileUploadForm:FormGroup;
  subSunk=new SubSink();
  isUpdateCostCenter:boolean=false;
  constCenterId:any;
  csvFileName:string;
  isClicked: boolean = false;
  showDiv = {
    Details : true,
    Csv : false,
  }

  constructor(
        private fb:FormBuilder,
        private router:Router,
        private apiHandlerService:ApiHandlerService,
        private swalService:SwalService,
        private masterService:MasterService
  ) { }

  ngOnInit() {
    this.createCostCenterForm();
    this.createFileUploadForm();
    this.costCenterUpdatePreFilledData();
  }

  createCostCenterForm(){
    this.costCenterForm=this.fb.group({
        costCenterName:new FormControl('',[Validators.required])
    })
  }

  createFileUploadForm(){
    this.fileUploadForm=this.fb.group({
        upload_file:new FormControl('',[Validators.required]),
        uploadFile:new FormControl('')
    })
  }

  costCenterUpdatePreFilledData(){
    this.subSunk.sink=this.masterService.costCenterUpdateData.subscribe((data=>{
        if(data.cost_center_name){
            this.costCenterForm.patchValue({'costCenterName':data.cost_center_name})
            this.isUpdateCostCenter=true;
            this.constCenterId=data.id
        }
    }))
  }

  onSampleDownload(event: Event) {
    event.preventDefault();
    const csvContent = this.generateCsvContent();
    this.downloadFile(csvContent, 'costCenter_sample_data.csv');
    this.isClicked=true;
  }

    private generateCsvContent(): string {
        const header = 'cost_center_name\n';
        const row = 'TestCostCenter\n';
        return header + row;
    }

    private downloadFile(content: string, fileName: string) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

  uploadFile($event:any){
    const file=$event.target.files[0];
    this.fileUploadForm.get('uploadFile').patchValue(file);
    this.csvFileName=file.name
  }
  
  onFileReset(){
    this.fileUploadForm.reset();
    this.csvFileName='';
  }

  onSubmit(){
    // let fromValue=this.costCenterForm.value;
    const data={
        cost_center_name:this.costCenterForm.get('costCenterName').value
    }
    if(this.costCenterForm.valid){
      if(!this.isUpdateCostCenter){
        this.subSunk.sink = this.apiHandlerService.apiHandler('addCostCenter', 'post', {}, {},{
        ...data
        })
          .subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201) {
                  this.swalService.alert.success('Cost center has been added successfully')
                  this.costCenterUpdate.emit({ tabId: 'costCenterList', data });
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
      }else{
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateCostCenter', 'post', {}, {},{
            "id": this.constCenterId,  
            ...data
        })
          .subscribe(response => {
              if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Cost Center data has been updated successfully')
                this.masterService.costCenterUpdateData.next('')
                this.costCenterForm.reset();
                this.isUpdateCostCenter=false;
                this.costCenterUpdate.emit({ tabId: 'costCenterList', data });
              }
          },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
        });
        // this.swalService.alert.success('Insied Update');
        // this.masterService.costCenterUpdateData.next('')
        // this.costCenterForm.reset();
        // this.isUpdateCostCenter=false;
        // this.costCenterUpdate.emit({ tabId: 'costCenterList', data });
      }
    }
  }

  onCSVUpload(){
    const file = this.fileUploadForm.get('uploadFile').value;
    if (file) {
      if (file.name.endsWith('.csv')) {
        const formData = new FormData();
        formData.append('csv', file);
        this.subSunk.sink = this.apiHandlerService.apiHandler('uploadCSV', 'post', {}, {},
        formData
        ).subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
            this.swalService.alert.success('Cost center has been added successfully')
            this.costCenterUpdate.emit({ tabId: 'costCenterList', data:'CSV Upload' });
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

}
