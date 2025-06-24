import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { IcichotelmaterService } from '../../../icichotelmater.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
    @Output() hotelListUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "selected_city", value: 'City Name' },
        { key: "location_name", value: 'Location Name' },
        { key: "hotel_name", value: 'Hotel Name' },
        { key: "hotel_code", value: 'Hotel Code' },
        { key: "single_room_price", value: 'Single Room Price' },
        { key: "double_room_price", value: 'Double Room Price' },
        { key: "plan", value: 'Plan' },
        
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
this.getHotelList();
}
getHotelList(): void {
    
    this.apiHandlerService.apiHandler('getHotelList', 'post', {}, {},{
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
     this.IcichotelmaterService.icicHotelUpdateData.next(data);
     this.hotelListUpdate.emit({ tabId: 'create/update_cost', data });
 }
 
 onCostCenterDelete(data){
     this.swalService.alert.delete((action)=>{
         if(action){
             //api call to delete the record 
             this.subSunk.sink = this.apiHandlerService.apiHandler('deleteHotelList', 'post', {}, {},
                     {"id":data.id})
                     .subscribe(response => {
                         if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                         this.swalService.alert.success(`Hotel name ${data.HotelName} has been deleted successfully`);
                         this.getHotelList()
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
