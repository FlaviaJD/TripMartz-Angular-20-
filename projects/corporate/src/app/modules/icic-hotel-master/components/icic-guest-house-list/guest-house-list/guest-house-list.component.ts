import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { IcichotelmaterService } from '../../../icichotelmater.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-guest-house-list',
  templateUrl: './guest-house-list.component.html',
  styleUrls: ['./guest-house-list.component.scss']
})
export class GuestHouseListComponent implements OnInit {
    @Output() GuestListUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "selected_city", value: 'City Name' },
        { key: "location_name", value: 'Location Name' },
        { key: "hotel_code", value: 'Guest House Code' },
        { key: "guest_house_name", value: 'Guest House Name' },
        { key: "adsress", value: 'Address' },
        { key: "contact_no", value: 'Contact No' },
        
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
        
        this.apiHandlerService.apiHandler('getGuestHouseList', 'post', {}, {},{
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
         this.IcichotelmaterService.icicGuestHouseUpdateData.next(data);
         this.GuestListUpdate.emit({ tabId: 'create/update_cost', data });
     }
     
     onCostCenterDelete(data){
         this.swalService.alert.delete((action)=>{
             if(action){
                 //api call to delete the record 
                 this.subSunk.sink = this.apiHandlerService.apiHandler('deleteGuestHouseList', 'post', {}, {},
                         {"id":data.id})
                         .subscribe(response => {
                             if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                             this.swalService.alert.success(`Guest House ${data.GuestHouseName} has been deleted successfully`);
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
