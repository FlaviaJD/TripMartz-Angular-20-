import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { IcichotelmaterService } from '../../../icichotelmater.service';
import { HttpErrorResponse } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { untilDestroyed } from 'projects/corporate/src/app/core/services/until-destroyed';
@Component({
  selector: 'app-create-update-hotel-list',
  templateUrl: './create-update-hotel-list.component.html',
  styleUrls: ['./create-update-hotel-list.component.scss']
})
export class CreateUpdateHotelListComponent implements OnInit,OnDestroy {
    @Output() hotelListUpdate = new EventEmitter<any>();
    hotellistform: FormGroup;
    subSunk=new SubSink();
    cityList=[];
    locationList=[]
    locationCode=[]
    cityCodes=[];
    isClicked:boolean=false;
    constCenterId:any;
    fileUploadForm:FormGroup;
    lastKeyupTstamp:number=0;
    csvFileName:string;
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    showDiv = {
        Details : true,
        Csv : false,
      }
      isUpdateCostCenter:boolean=false;
      constructor(private apiHandlerService: ApiHandlerService, 
        private fb:FormBuilder,
        private swalService:SwalService,
        private IcichotelmaterService:IcichotelmaterService) { }
    
      ngOnInit() {
        this.createLocationForm();
        this. hotelUpdatePreFilledData();
        this.createFileUploadForm()
      }
      createLocationForm(){
        this.hotellistform=this.fb.group({
            cityname:new FormControl(  '',[Validators.required]),
            locationname:new FormControl('',[Validators.required]),
            hotelname:new FormControl('',[Validators.required]),
            hotelcode:new FormControl('',[Validators.required]),
            singleprice:new FormControl('0'),
            doubleprice:new FormControl('0'),
            plan:new FormControl(''),
            citycode:new FormControl(''),
            locationcode:new FormControl('')
        })
      }
  
      onSubmit(){
        const data={
            CityCode:this.hotellistform.get('citycode').value,
            LocationCode:this.hotellistform.get('locationcode').value,
            HotelName:this.hotellistform.get('hotelname').value,
            HotelCode:this.hotellistform.get('hotelcode').value,
            Plan:this.hotellistform.get('plan').value,
            Single:this.hotellistform.get('singleprice').value,
            Double:this.hotellistform.get('doubleprice').value
        }
        if(this.hotellistform.valid){
            if(!this.isUpdateCostCenter){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addHotelList', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('City name has been added successfully')
                        this.hotelListUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateHotelList', 'post', {}, {},{
                "id": this.constCenterId,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Hotel name has been updated successfully')
                    this.IcichotelmaterService.icicHotelUpdateData.next('')
                   this.hotellistform.reset();
                    this.isUpdateCostCenter=false;
                    this.hotelListUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
            }
        }
        }

        hotelUpdatePreFilledData(){
            this.subSunk.sink=this.IcichotelmaterService.icicHotelUpdateData.subscribe((data=>{
                if(data.id){
                    this.hotellistform.patchValue({
                    'cityname':data.City,
                    'citycode':data.CityCode,
                    'locationcode':data.LocationCode,
                    'locationname':data.LocationName,
                    'hotelname':data.HotelName,
                    'hotelcode':data.HotelCode,
                    'singleprice':data.Single,
                    'doubleprice':data.Double,
                    'plan':data.Plan})
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
                this.subSunk.sink = this.apiHandlerService.apiHandler('uploadHotelCSV', 'post', {}, {},
                formData
                ).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Cost center has been added successfully')
                    this.hotelListUpdate.emit({ tabId: 'costCenterList', data:'CSV Upload' });
                }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
              } else {
                this.swalService.alert.error('Please select a valid csv file');
              }
            }
          }

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
            this.hotellistform.patchValue({
                        'cityname':city.City,
                        'citycode':city.CityCode,
                        
                    });
            this.cityList.splice(0);
            this.cityCodes=city.CityCode;
        }
    
        getAutoCompleteLocation(event: any): void {
            const searchData={
                CityCode: this.cityCodes,
                LocationName: `${event.target.value}`
            }
            if (this.cityCodes) {
                this.apiHandlerService.apiHandler('cityLocationList', 'POST', '', '', { ...searchData })
                    .pipe(
                        shareReplay(1),
                        untilDestroyed(this)
                    )
                    .subscribe((resp: any) => {
                        if (resp.Status) {
                            this.locationList = resp.data;
                        } else {
                            const msg = resp['Message'];
                            this.locationList.length = 0;
                        }
                    });
            }
        }
        onLocationSelect(location){
            //this.hotellistform.get("locationname").patchValue(location.LocationName);
            this.hotellistform.patchValue({
                        'locationname':location.LocationName,
                        'locationcode':location.LocationCode,
                        
                    });
            this.locationList.splice(0);
            this.locationCode=location.LocationCode;
        }
      
        onSampleDownload(event: Event) {
            event.preventDefault();
            const csvContent = this.generateCsvContent();
            this.downloadFile(csvContent, 'Hotel_list_sample_data.csv');
            this.isClicked=true;
          }
          private generateCsvContent(): string {
            const header = 'city_code,location_code,hotel_code,hotel_name,plan,single,double\n';
            const row = 'BLR,BLR,electronics city,Raj,Raj Hotel,rent,4000,5000\n';
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
