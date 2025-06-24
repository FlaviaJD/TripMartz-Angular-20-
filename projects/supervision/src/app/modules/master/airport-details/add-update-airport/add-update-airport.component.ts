import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MasterService } from '../../master.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-update-airport',
  templateUrl: './add-update-airport.component.html',
  styleUrls: ['./add-update-airport.component.scss']
})
export class AddUpdateAirportComponent implements OnInit {

    @Output() airportUpdate = new EventEmitter<any>();
    airportConfig: FormGroup;
    airportFileConfig:FormGroup;
    isUpdate:boolean=false;
    csvFileName:string;
    subSunk=new SubSink();
    id:any
    isClicked: boolean = false;

    constructor(
      private fb: FormBuilder,
      private apiHandlerService: ApiHandlerService,
      private swalService: SwalService,
      private masterService:MasterService
    ) { }
  
    showDiv = {
        Details : true,
        Csv : false,
      }

      ngOnInit() {
          this.createForm();
          this.createFileUploadForm();
          this.updatePreFilledData();
      }
  
      createForm() {
          this.airportConfig = this.fb.group({
              airport_name: new FormControl('', [Validators.required]),
              airport_country: new FormControl('', [Validators.required]),
              airport_city: new FormControl('', [Validators.required]),
              airport_code: new FormControl('', [Validators.required]),
              status: new FormControl('1', [Validators.required]),
          }
          );
      }
  
      createFileUploadForm() {
          this.airportFileConfig = this.fb.group({
              airport_file_upload: new FormControl('', [Validators.required]),
              uploadFile:new FormControl('')
          }
          );
      }

      updatePreFilledData(){
        this.subSunk.sink=this.masterService.airportUpdateData.subscribe((data=>{
            if(data.name){
                this.airportConfig.patchValue({
                    'airport_name': data.name,
                    'airport_country': data.country,
                    'airport_city': data.city,
                    'airport_code': data.code,
                    'status': data.status
                });
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
      }
  
      onSubmit() {
        const data={
            name:this.airportConfig.get('airport_name').value,
            country:this.airportConfig.get('airport_country').value,
            city:this.airportConfig.get('airport_city').value,
            code:this.airportConfig.get('airport_code').value,
            status:this.airportConfig.get('status').value
        }
        if(this.airportConfig.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addAirport', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Airport has been added successfully')
                        this.airportUpdate.emit({ tabId: 'airport_list', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateAirport', 'post', {}, {},{
                    "id": this.id,  
                    ...data
                })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Airport has been updated successfully')
                        this.masterService.airportUpdateData.next('')
                        this.airportConfig.reset();
                        this.isUpdate=false;
                        this.airportUpdate.emit({ tabId: 'airport_list', data });
                        }
                    },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }
        }
      }

      radioSelection(radioValue:any){
        return this.airportConfig.get('status').value == radioValue;
      }

      onCSVUpload(){
        const file = this.airportFileConfig.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadAirportCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Airport CSV has been added successfully')
                this.airportUpdate.emit({ tabId: 'airport_list', data:'CSV Upload' });
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
          this.airportConfig.reset();
      }
  
      onDownload() {
      }
  
      uploadFile($event){
        const file=$event.target.files[0];
        this.airportFileConfig.get('uploadFile').patchValue(file);
        this.csvFileName=file.name
      }

      onSampleDownload(event: Event) {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'airport_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'name,country,city,code,status\n';
        const row = 'Kannur,India,Bangalore,KAU,1\n';
        return header + row;
    }

    private downloadFile(content: string, fileName: string) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
      
      onFileSubmit(){
  
      }
  
      onFileReset(){
        this.airportFileConfig.reset();
        this.csvFileName='';
      }
}
