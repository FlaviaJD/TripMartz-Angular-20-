import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { MasterService } from '../../../../master/master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IcichotelmaterService } from '../../../icichotelmater.service';

@Component({
  selector: 'app-create-update-city-list',
  templateUrl: './create-update-city-list.component.html',
  styleUrls: ['./create-update-city-list.component.scss']
})
export class CreateUpdateCityListComponent implements OnInit {
    isUpdateCostCenter:boolean=false;
    subSunk=new SubSink();
    id:any;
    isClicked: boolean = false;
    fileUploadForm:FormGroup;
    constCenterId:any;
    @Output() icicCityUpdate = new EventEmitter<any>();
    showDiv = {
      Details : true,
      Csv : false,
    }
    citylistform: FormGroup;
    csvFileName:string;
    constructor( private apiHandlerService: ApiHandlerService, 
        private fb:FormBuilder,
        private swalService:SwalService,
        private IcichotelmaterService:IcichotelmaterService) { }
  
    ngOnInit() {
      this.createCityForm();
      this.cityUpdatePreFilledData();
      this.createFileUploadForm();   
     }
     createCityForm(){
        this.citylistform=this.fb.group({
            cityname:new FormControl('',[Validators.required]),
            citycode:new FormControl('',[Validators.required]),
            tier:new FormControl('',[Validators.required])
        })
      }
    onSubmit(){
        const data={
            City:this.citylistform.get('cityname').value,
            CityCode:this.citylistform.get('citycode').value,
            Tier: (this.citylistform.get('tier').value)
        }
        if(this.citylistform.valid){
            if(!this.isUpdateCostCenter){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addIcicCity', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('City name has been added successfully')
                        this.icicCityUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateCity', 'post', {}, {},{
                "id": this.constCenterId,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('City name has been updated successfully')
                    this.IcichotelmaterService.icicCityUpdateData.next('')
                   this.citylistform.reset();
                    this.isUpdateCostCenter=false;
                    this.icicCityUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
            }
        }
        }

        cityUpdatePreFilledData(){
            this.subSunk.sink=this.IcichotelmaterService.icicCityUpdateData.subscribe((data=>{
                if(data.id){
                    this.citylistform.patchValue({'cityname':data.City,'citycode':data.CityCode,'tier':data.Tier})
                    this.isUpdateCostCenter=true;
                    this.constCenterId=data.id
                }
            }))
          }

          uploadFile($event:any){
            const file=$event.target.files[0];
            this.fileUploadForm.get('uploadFile').patchValue(file);
            this.csvFileName=file.name
          }
          createFileUploadForm(){
            this.fileUploadForm=this.fb.group({
                upload_file:new FormControl('',[Validators.required]),
                uploadFile:new FormControl('')
            })
        }
          onCSVUpload(){
            const file = this.fileUploadForm.get('uploadFile').value;
            if (file) {
              if (file.name.endsWith('.csv')) {
                const formData = new FormData();
                formData.append('csv', file);
                this.subSunk.sink = this.apiHandlerService.apiHandler('uploadCityCSV', 'post', {}, {},
                formData
                ).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Cost center has been added successfully')
                    this.icicCityUpdate.emit({ tabId: 'costCenterList', data:'CSV Upload' });
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
            this.downloadFile(csvContent, 'city_sample_data.csv');
            this.isClicked=true;
          }
          private generateCsvContent(): string {
            const header = 'city,city_code,tier\n';
            const row = 'Banglore,BLR,1\n';
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