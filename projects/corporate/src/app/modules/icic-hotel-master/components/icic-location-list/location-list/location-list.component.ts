import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { IcichotelmaterService } from '../../../icichotelmater.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
    @Output() icicLocationUpdate = new EventEmitter<any>();
    pageSize = 10;
    page = 1;
    private subSunk = new SubSink();
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "selected_city", value: 'City Name' },
        { key: "location_code", value: 'Location Code' },
        { key: "location_name", value: 'Location Name' },
       
    ];
    noData: boolean = true;
    respData: any;
    status;
    searchText:string='';

  constructor(private swalService: SwalService,
    //private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private IcichotelmaterService:IcichotelmaterService) { }

  ngOnInit() {
    this.getLocationList()
  }
  getLocationList(): void {
    
    this.apiHandlerService.apiHandler('getLocation', 'post', {}, {},{
         })
           .subscribe(res => {
               if (res.statusCode == 200 || res.statusCode == 201) {
                 this.respData=res.data;
                 this.noData=false;
                 this.collectionSize = res.data.length;
               }
             },(err: HttpErrorResponse) => {
                 this.swalService.alert.error(err['error']['Message']);
          });
 }
 onCostCenterUpdate(data): void {
     this.IcichotelmaterService.icicLocationUpdateData.next(data);
     this.icicLocationUpdate.emit({ tabId: 'create/update_cost', data });
 }
 
 onCostCenterDelete(data){
     this.swalService.alert.delete((action)=>{
         if(action){
             //api call to delete the record 
             this.subSunk.sink = this.apiHandlerService.apiHandler('deleteLocation', 'post', {}, {},
                     {"id":data.id})
                     .subscribe(response => {
                         if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                         this.swalService.alert.success(`Location name ${data.LocationName} has been deleted successfully`);
                         this.getLocationList()
                         }
                     },(err: HttpErrorResponse) => {
                         this.swalService.alert.error(err['error']['Message']);
                     }
                 );
         }
     })
 }
  sortData(sort: Sort) {
        
  }
  
  exportAsExcel(){
  }

}
