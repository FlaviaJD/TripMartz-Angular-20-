import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { SettingService } from '../../../settings/setting.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterService } from '../../master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Action' },
        { key: "position_name", value: 'Position Name' },
        { key: "air_dom", value: 'Air Domestic' },
        { key: "air_int", value: 'Air International' },
        { key: "cabin", value: 'Cabin' },
        { key: "flight_is_short_sector", value: 'Is Short Sector' },
        { key: "short_sector", value: 'Short Sector' },
        { key: "flight_is_day_to_departure", value: 'Is Day Limit' },
        { key: "flight_departure_noOfDays", value: 'No Of Days' },
        { key: "hotel_dom", value: 'Hotel Domestic' },
        { key: "hotel_int", value: 'Hotel International' },
        // { key: "car", value: 'Car' },
        // { key: "bus", value: 'Bus' },
        // { key: "train", value: 'Train' },
        
    ];
    noData: boolean = true;
    respData: any;
    status;
    searchText:string='';

    private subSunk = new SubSink();

    @Output() toUpdate = new EventEmitter<any>();

    constructor(
        private settingService: SettingService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private masterService:MasterService,
        private route:Router
    ) { }

    ngOnInit() {
        this.getPoliciyList();
        this.masterService.policyUpdateData.next('');
    }

    getPoliciyList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPolicyList', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.respData=res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
                this.formatSector(this.respData);
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    formatSector(policyData:any){
        let shortSector=''
        policyData.forEach(element => {
            let flightShortSector = element['flight_short_sector'];
            if(flightShortSector !=undefined || flightShortSector.length>1){
                var shortSectors = JSON.parse(flightShortSector);
                var formattedSectors = shortSectors.map(function(sector) {
                    return sector.fromAirport + '-' + sector.toAirport;
                });
                shortSector = formattedSectors.join(',');
            }
            element['short_sector']=shortSector;
        });
    }

    onPolicyUpdate(data): void {
        this.masterService.policyUpdateData.next(data);
        this.route.navigate(['master/manage-policy'])
    }

    onPolicyDelete(data){
        this.swalService.alert.delete((action)=>{
            if(action){
                this.subSunk.sink = this.apiHandlerService.apiHandler('deletePolicy', 'post', {}, {},
                        {"id":data.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success(`Policy has been deleted successfully`);
                            this.getPoliciyList();
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
