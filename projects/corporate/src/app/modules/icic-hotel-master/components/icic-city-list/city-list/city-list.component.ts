import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { MasterService } from '../../../../master/master.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { IcichotelmaterService } from '../../../icichotelmater.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {
    @Output() icicCityUpdate = new EventEmitter<any>();
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "city_code", value: 'City ID' },
        { key: "city_name", value: 'City Name' },
        { key: "tier", value: 'Tier' },
    ];
    noData: boolean = true;
    respData: any;
    status;
    searchText:string='';
    private subSunk = new SubSink();
  constructor( private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private masterService:MasterService,
    private IcichotelmaterService:IcichotelmaterService) { }

  ngOnInit() {
    this.getIcicCityList()
  }
  
  getIcicCityList(): void {
    
   this.apiHandlerService.apiHandler('getIcicCity', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.respData=res.data;
                respDataCopy = res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
}
onCostCenterUpdate(data): void {
    this.IcichotelmaterService.icicCityUpdateData.next(data);
    this.icicCityUpdate.emit({ tabId: 'create/update_cost', data });
}

onCostCenterDelete(data){
    this.swalService.alert.delete((action)=>{
        if(action){
            //api call to delete the record 
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteCity', 'post', {}, {},
                    {"id":data.id})
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                        this.swalService.alert.success(`City name ${data.City} has been deleted successfully`);
                        this.getIcicCityList()
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}

sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...respDataCopy];
    if (!sort.active || sort.direction === '') {
        this.respData = data;
        return;
    }
    this.respData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
            case 'city_code': return this.utility.compare('' + a.CityCode, '' + b.CityCode, isAsc);
            case 'city_name': return this.utility.compare('' + a.City.toLocaleLowerCase(), '' + b.City.toLocaleLowerCase(), isAsc);
            case 'tier': return this.utility.compare(+ a.Tier, + b.Tier, isAsc);
            default: return 0;
        }
    });
}

  
  exportAsExcel(){
    const fileToExport = this.respData.map((response: any, index: number) => {
        return {
            "Sl No.": index + 1,  
            "City Code": response.CityCode,
            "City": response.City ,
            "Tier":response.Tier
        }
    });

    const columnWidths = [ 
        { wch: 5 },
        { wch: 20 },
        { wch: 30 }
    ];

    this.utility.exportToExcel(
        fileToExport,
        'City List Report',
        columnWidths
    );
}


}
