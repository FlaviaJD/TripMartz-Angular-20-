import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MasterService } from '../../master.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-update-city',
  templateUrl: './add-update-city.component.html',
  styleUrls: ['./add-update-city.component.scss']
})
export class AddUpdateCityComponent implements OnInit {

    @Output() cityUpdate = new EventEmitter<any>();
    cityConfig: FormGroup;
    cityFileConfig: FormGroup;
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
        this.cityConfig = this.fb.group({
            city_name: new FormControl('', [Validators.required]),
            city_code: new FormControl('', [Validators.required]),
            xlpro_city_code: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
        }
        );
    }

    createFileUploadForm() {
        this.cityFileConfig = this.fb.group({
            city_file_upload: new FormControl('', [Validators.required]),
            uploadFile: new FormControl('')
        }
        );
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.cityUpdateData.subscribe((data=>{
            if(data.city_name){
                this.cityConfig.patchValue({
                    'city_name': data.city_name,
                    'city_code': data.CityCode,
                    'xlpro_city_code': data.xlpro_city_code,
                    'status': data.status
                });
                this.isUpdate=true;
                this.id=data.id;
            }
        }))
      }

    onSubmit() {
        const data={
            city_name:this.cityConfig.get('city_name').value,
            CityCode:this.cityConfig.get('city_code').value,
            xlpro_city_code:this.cityConfig.get('xlpro_city_code').value,
            status:this.cityConfig.get('status').value
        }
        if(this.cityConfig.valid){
            if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addCity', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('City has been added successfully')
                        this.cityUpdate.emit({ tabId: 'city_list', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
                this.subSunk.sink = this.apiHandlerService.apiHandler('updateCity', 'post', {}, {},{
                    "id": this.id,  
                    ...data
                })
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('City has been updated successfully')
                        this.masterService.airportUpdateData.next('')
                        this.cityConfig.reset();
                        this.isUpdate=false;
                        this.cityUpdate.emit({ tabId: 'city_list', data });
                        }
                    },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }
        }
    }

    onCSVUpload(){
        const file = this.cityFileConfig.get('uploadFile').value;
        if (file) {
          if (file.name.endsWith('.csv')) {
            const formData = new FormData();
            formData.append('csv', file);
            this.subSunk.sink = this.apiHandlerService.apiHandler('uploadCityCSV', 'post', {}, {},
            formData
            ).subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.swalService.alert.success('City CSV has been added successfully')
                this.cityUpdate.emit({ tabId: 'city_list', data:'CSV Upload' });
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
        this.cityConfig.reset();
    }

    onDownload() {
    }

    uploadFile($event) {
        const file=$event.target.files[0];
        this.cityFileConfig.get('uploadFile').patchValue(file);
        this.csvFileName=file.name
    }

    radioSelection(radioValue:any){
        return this.cityConfig.get('status').value == radioValue;
      }
    
    onFileSubmit() {

    }

    onSampleDownload(event: Event) {
        event.preventDefault();
        const csvContent = this.generateCsvContent();
        this.downloadFile(csvContent, 'city_sample_data.csv');
        this.isClicked=true;
    }
    
    private generateCsvContent(): string {
        const header = 'city_name,CityCode,xlpro_city_code,status\n';
        const row = 'NewPriyamCity,NPC,765762,1\n';
        return header + row;
    }

    private downloadFile(content: string, fileName: string) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    onFileReset() {
        this.cityConfig.reset();
        this.csvFileName='';
    }
}
