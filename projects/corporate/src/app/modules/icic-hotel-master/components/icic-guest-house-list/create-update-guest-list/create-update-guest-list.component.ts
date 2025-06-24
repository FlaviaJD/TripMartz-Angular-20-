import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core';
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
  selector: 'app-create-update-guest-list',
  templateUrl: './create-update-guest-list.component.html',
  styleUrls: ['./create-update-guest-list.component.scss']
})
export class CreateUpdateGuestListComponent implements OnInit,OnDestroy {
    @Output() GuestListUpdate = new EventEmitter<any>();
    guesthouseform: FormGroup;
    subSunk=new SubSink();
    constCenterId:any;
    fileUploadForm:FormGroup;
    csvFileName:string;
    lastKeyupTstamp:number=0;
    cityList:Array<any>=[];
    locationList:Array<any>=[];
    isClicked:boolean=false;
    locationCode=[]
    cityCodes=[];
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
        // this.getCityList();
        this. guestHouseUpdatePreFilledData();
        //this.getLocationList();
        this.createFileUploadForm();
      }
      createLocationForm(){
        this.guesthouseform=this.fb.group({
            cityname:new FormControl('',[Validators.required]),
            locationname:new FormControl(''),
            hotelcode:new FormControl('',[Validators.required]),
            guesthousename:new FormControl('',[Validators.required]),
            address:new FormControl(''),
            contactno:new FormControl(''),
            citycode:new FormControl(''),
            locationcode:new FormControl('')
        })
      }
    getLocationList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getLocation', 'post', '', '').subscribe(res => {
            this.locationList= res.data
            
        });
    }
 
      onSubmit(){
        const data={
            CityCode:this.guesthouseform.get('citycode').value,
            LocationCode:this.guesthouseform.get('locationcode').value,
            HotelCode:this.guesthouseform.get('hotelcode').value,
            GuestHouseName:this.guesthouseform.get('guesthousename').value,
            Address:this.guesthouseform.get('address').value,
            Contact:this.guesthouseform.get('contactno').value,
        }
        
        if(this.guesthouseform.valid){
            if(!this.isUpdateCostCenter){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addGuestHouseList', 'post', {}, {},{
            ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                        this.swalService.alert.success('City name has been added successfully')
                        this.GuestListUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
                });
            }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updateGuestHouseList', 'post', {}, {},{
                "id": this.constCenterId,  
                ...data
            })
                .subscribe(response => {
                    if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('City name has been updated successfully')
                    this.IcichotelmaterService.icicGuestHouseUpdateData.next('')
                   this.guesthouseform.reset();
                    this.isUpdateCostCenter=false;
                    this.GuestListUpdate.emit({ tabId: 'costCenterList', data });
                    }
                },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
            }
        }
        }

        guestHouseUpdatePreFilledData(){
            this.subSunk.sink=this.IcichotelmaterService.icicGuestHouseUpdateData.subscribe((data=>{
                if(data.id){
                    this.guesthouseform.patchValue({
                    'cityname':data.City,
                    'citycode':data.CityCode,
                    'locationcode':data.LocationCode,
                    'locationname':data.LocationName,
                    'hotelcode':data.HotelCode,
                    'guesthousename':data.GuestHouseName,
                    'address':data.Address,
                    'contactno':data.Contact,})
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
                this.subSunk.sink = this.apiHandlerService.apiHandler('uploadGuestHouseCSV', 'post', {}, {},
                formData
                ).subscribe(response => {
                if (response.statusCode == 200 || response.statusCode == 201) {
                    this.swalService.alert.success('Guest house has been added successfully')
                    this.GuestListUpdate.emit({ tabId: 'costCenterList', data:'CSV Upload' });
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
            this.guesthouseform.patchValue({
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
            this.guesthouseform.patchValue({
                        'locationname':location.LocationName,
                        'locationcode':location.LocationCode,
                        });
            this.locationList.splice(0);
            this.locationCode=location.LocationCode;
        }
        onSampleDownload(event: Event) {
            event.preventDefault();
            const csvContent = this.generateCsvContent();
            this.downloadFile(csvContent, 'Guest_house_sample_data.csv');
            this.isClicked=true;
          }
          private generateCsvContent(): string {
            const header = 'city_code,location_code,hotel_code,guest_house_name,address,contact\n';
            const row = 'BLR,TT1,HSS,RAJ,electronics city banglore,9343232345\n';
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
