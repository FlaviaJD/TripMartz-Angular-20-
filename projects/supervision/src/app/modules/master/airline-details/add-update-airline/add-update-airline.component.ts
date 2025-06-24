import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MasterService } from '../../master.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-update-airline',
  templateUrl: './add-update-airline.component.html',
  styleUrls: ['./add-update-airline.component.scss']
})
export class AddUpdateAirlineComponent implements OnInit {

    @Output() airlineUpdate = new EventEmitter<any>();
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
              airline_name: new FormControl('', [Validators.required]),
              airline_code: new FormControl('', [Validators.required]),
              airline_image: new FormControl(''),
              status: new FormControl('', [Validators.required]),
          }
          );
      }
  
      createFileUploadForm() {
          this.fileConfig = this.fb.group({
              upload_file: new FormControl('', [Validators.required]),
              uploadFile: new FormControl('')
          }
          );
      }

      updatePreFilledData(){
        this.subSunk.sink=this.masterService.airlineUpdateData.subscribe((data=>{
            if(data.name){
                this.regConfig.patchValue({
                    'airline_name': data.name,
                    'airline_code': data.code,
                    'airline_image': data.images,
                    'status': data.status
                });
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
      }
  
      onSubmit() {
        const data={
            name:this.regConfig.get('airline_name').value,
            code:this.regConfig.get('airline_code').value,
            // image:this.regConfig.get('airline_image').value,
            status:this.regConfig.get('status').value
        }
        if(this.regConfig.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addAirline', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Airline has been added successfully')
                        this.airlineUpdate.emit({ tabId: 'airline_list', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateAirline', 'post', {}, {},{
                    "id": this.id,  
                    ...data
                })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Airline has been updated successfully')
                        this.masterService.airlineUpdateData.next('')
                        this.regConfig.reset();
                        this.isUpdate=false;
                        this.airlineUpdate.emit({ tabId: 'airline_list', data });
                        }
                    },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }
        }
      }

      onCSVUpload(){
        const file = this.fileConfig.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadAirlineCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Airline CSV has been added successfully')
                this.airlineUpdate.emit({ tabId: 'airline_list', data:'CSV Upload' });
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

      radioSelection(radioValue:any){
        return this.regConfig.get('status').value == radioValue;
      }
  
      onDownload() {
      }
  
      uploadFile($event){
        const file=$event.target.files[0];
        this.fileConfig.get('uploadFile').patchValue(file);
        this.csvFileName=file.name
      }
      onFileSubmit(){
  
      }

      onSampleDownload(event: Event) {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'airline_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'name,code,status\n';
        const row = 'LiveIt,LIT,1\n';
        return header + row;
    }

    private downloadFile(content: string, fileName: string) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
  
      onFileReset(){
          this.fileConfig.reset();
          this.csvFileName='';
      }

}
