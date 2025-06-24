import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';
import { HotelCrsService } from '../../hotel-crs.service';

const log = new Logger('hotel-crs/HotelComponent')

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  activeIdString = "list_hotels";
  add:boolean=true;
  hotelData: any;
  priceDirectData:any;
  selected:any;
  eventData:boolean=false;
  priceEvent:boolean=false;
  priceManagementEvent:boolean=false;
  constructor(
    private hotelCrsService: HotelCrsService,
  ) { }

  ngOnInit(): void {
    this.resetValue()
  }

  beforeChange(e) {
    log.debug('tabChanged', e)
    console.log("eee",e)
  }
  onTabSelected(event) {
    console.log(event)
    this.activeIdString = event.nextId;
    this.resetValue();
}

resetValue(){
    if (this.activeIdString == 'list_hotels') {
        this.hotelCrsService.updateData.next({});
    }
}
  triggerTab(data: any) {
    console.log("data",data)
     this.eventData =data.roomImageRedirect;
     this.priceDirectData=data;
     this.priceEvent=data.roomPriceRedirect;
     this.priceManagementEvent=data.roomPriceManageRedirect;
      this.hotelData = data.hotel;
      this.selected = data.hoteltrigger;
     this.tabs.select(data.tabId)
      }
  }



