import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MasterService } from '../../master.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-update-country',
  templateUrl: './add-update-country.component.html',
  styleUrls: ['./add-update-country.component.scss']
})
export class AddUpdateCountryComponent implements OnInit {

    @Output() countryUpdate = new EventEmitter<any>();
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
              country_name: new FormControl('', [Validators.required]),
              two_digit_code: new FormControl('', [Validators.required]),
              three_digit_code: new FormControl('', [Validators.required]),
              status: new FormControl('', [Validators.required]),
          }
          );
      }
  
      createFileUploadForm() {
          this.fileConfig = this.fb.group({
              upload_file: new FormControl('', [Validators.required]),
              uploadFile: new FormControl(''),
          }
          );
      }

      updatePreFilledData(){
        this.subSunk.sink=this.masterService.countryUpdateData.subscribe((data=>{
            if(data.name){
                this.regConfig.patchValue({
                    'country_name': data.name,
                    'two_digit_code': data.two_code,
                    'three_digit_code': data.code,
                    'status': data.status
                });
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
      }
  
      onSubmit() {
        const data={
            name:this.regConfig.get('country_name').value,
            two_code:this.regConfig.get('two_digit_code').value,
            code:this.regConfig.get('three_digit_code').value,
            status:this.regConfig.get('status').value
        }
        if(this.regConfig.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addCountry', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Country has been added successfully')
                        this.countryUpdate.emit({ tabId: 'country_list', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateCountry', 'post', {}, {},{
                    "id": this.id,  
                    ...data
                })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Country has been updated successfully')
                        this.masterService.airportUpdateData.next('')
                        this.regConfig.reset();
                        this.isUpdate=false;
                        this.countryUpdate.emit({ tabId: 'country_list', data });
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
  
      onReset() {
          this.regConfig.reset();
          this.csvFileName='';
      }

      onCSVUpload(){
        const file = this.fileConfig.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadCountryCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('Country CSV has been added successfully')
                this.countryUpdate.emit({ tabId: 'country_list', data:'CSV Upload' });
            }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
          } else {
            this.swalService.alert.error('Please select a valid csv file');
          }
        }
      }

    onSampleDownload(event: Event) {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'country_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'name,two_code,code,status\n';
        const row = 'USA East,UE,USE,1\n';
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
