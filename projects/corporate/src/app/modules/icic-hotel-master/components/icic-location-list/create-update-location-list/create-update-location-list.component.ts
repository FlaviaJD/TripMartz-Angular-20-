import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { IcichotelmaterService } from '../../../icichotelmater.service';
import { shareReplay } from 'rxjs/operators';
import { untilDestroyed } from 'projects/corporate/src/app/core/services/until-destroyed';
@Component({
  selector: 'app-create-update-location-list',
  templateUrl: './create-update-location-list.component.html',
  styleUrls: ['./create-update-location-list.component.scss']
})
export class CreateUpdateLocationListComponent implements OnInit,OnDestroy {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    @Output() icicLocationUpdate = new EventEmitter<any>();
    locationlistform: FormGroup;
    fileUploadForm:FormGroup;
    subSunk=new SubSink();
    cityList:Array<any>=[];
    lastKeyupTstamp:number=0;
    csvFileName:string;
    constCenterId:any;
    isClicked: boolean = false;
    showDiv = {
        Details : true,
        Csv : false,
      }
      locationId:any;
      isUpdateCostCenter:boolean=false;
      constructor(private apiHandlerService: ApiHandlerService, 
        private fb:FormBuilder,
        private swalService:SwalService,
        private IcichotelmaterService:IcichotelmaterService
        ) { }
    
      ngOnInit() {
       this.createLocationForm();
       this. locationUpdatePreFilledData();
       this. createFileUploadForm();
      }
      createLocationForm(){
        this.locationlistform=this.fb.group({
            cityname:new FormControl('',[Validators.required]),
            locationname:new FormControl('',[Validators.required]),
            locationcode:new FormControl('',[Validators.required]),
            citycode:new FormControl(''),
        })
      }
      getCityList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getCity', 'post', '', '').subscribe(res => {
            this.cityList= res.data
        });
    }
      onSubmit(){
        const data={
            CityCode:this.locationlistform.get('citycode').value,
            LocationName:this.locationlistform.get('locationname').value,
            LocationCode:this.locationlistform.get('locationcode').value
        }
        if(this.locationlistform.valid){
            if(!this.isUpdateCostCenter){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addLocation', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('Location name has been added successfully')
                        this.icicLocationUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateLocation', 'post', {}, {},{
                "id": this.constCenterId,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('City name has been updated successfully')
                    this.IcichotelmaterService.icicLocationUpdateData.next('')
                   this.locationlistform.reset();
                    this.isUpdateCostCenter=false;
                    this.icicLocationUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
            }
        }
        }

        locationUpdatePreFilledData(){
            this.subSunk.sink=this.IcichotelmaterService.icicLocationUpdateData.subscribe((data=>{
                if(data.id){
                    this.locationlistform.patchValue({'cityname':data.City,
                    'locationname':data.LocationName,
                    'locationcode':data.LocationCode,
                    'citycode':data.CityCode})
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
                this.subSunk.sink = this.apiHandlerService.apiHandler('uploadLocationCSV', 'post', {}, {},
                formData
                ).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Cost center has been added successfully')
                    this.icicLocationUpdate.emit({ tabId: 'costCenterList', data:'CSV Upload' });
                }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
              } else {
                this.swalService.alert.error('Please select a valid csv file');
              }
            }
          }
        //   getAutoCompleteState(event, type) {
        //     let inpValue = event.target.value;
        //     if (inpValue.length > 0 && (event.timeStamp - this.lastKeyupTstamp) > 10) {
        //         this.subSunk.sink = this.apiHandlerService.apiHandler('getIcicCity', 'post', {}, {}, {
        //             state_name: `${inpValue}`
        //         }).subscribe(resp => {
        //             if (resp.statusCode == 201 || resp.statusCode == 200) {
        //                 this.cityList = resp.data || [];
        //             } else {
        //                 // log.error('Something went wrong')
        //             }
        //         }, err => { 
        //             // log.error(err)
        //          });
        //         this.lastKeyupTstamp = event.timeStamp;
        //     }
        // }

        
        // onCitySelect(state:any) {
        //    this.locationlistform.patchValue({
        //         'cityname':state.City,
        //         'citycode':state.CityCode,
                
        //     });
        //     this.cityList=[];
        // }
        getSearchedList(event: any): void {
            if (event && event.target.value) {
                const City = `${event.target.value}`;
                this.apiHandlerService.apiHandler('findAllCity', 'POST', '', '', { City })
                    .pipe(
                        shareReplay(1),
                        untilDestroyed(this)
                    )
                    .subscribe((resp: any) => {
                        if (resp.Status) {
                            this.cityList = resp.data;
                        } else {
                            const msg = resp['Message'];
                            this.cityList.length = 0;
                        }
                    });
            }
        }
        onCitySelect(city){
            this.locationlistform.patchValue({
                        'cityname':city.City,
                        'citycode':city.CityCode,
                        
                    });
            this.cityList.splice(0);
        }
        onSampleDownload(event: Event) {
            event.preventDefault();
            const csvContent = this.generateCsvContent();
            this.downloadFile(csvContent, 'Location_list_sample_data.csv');
            this.isClicked=true;
          }
          private generateCsvContent(): string {
            const header = 'city_code,location_name,location_code\n';
            const row = 'BLR,SElectronics city,BLR\n';
            return header + row;
        }
        private downloadFile(content: string, fileName: string) {
            const blob = new Blob([content], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        }
        ngOnDestroy(): void {
            
        }
}
