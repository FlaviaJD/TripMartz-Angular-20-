import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Logger } from '../../../../../../core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Sort } from '@angular/material/sort';

const log = new Logger('hotel-crs/HotelList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-hotel-list',
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "hotel_name", value: 'Hotel Name' },
        { key: "star_rating", value: 'Star Rating' },
        { key: "address", value: 'Address' },
        { key: "phone_number", value: 'Phone Number' },
        { key: "email", value: 'Email' },
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];
    noData: boolean = true;
    respData: any;
    status;

    @Output() toUpdate = new EventEmitter<any>();

    constructor(
        private hotelCrsService: HotelCrsService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getHotelList();
    }

    getHotelList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'hotelList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.respData = resp.data;
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        });
    }

    onStatusUpdate(val, index): void {
        log.debug(index);
        const data = [{ id: val['id'] }];
        data['topic'] = 'editHotel';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                const data = [{
                    id: resp.data['id'] || '',
                    hotel_name: resp.data['hotel_name'] || '',
                    contract_expiry_date: resp.data['contract_expiry_date'] || '',
                    star_rating: resp.data['star_rating'] || '',
                    hotel_description: resp.data['hotel_description'] || '',
                    hotel_hotel_type_id: resp.data['hotel_hotel_type_id'] || '',
                    hotel_hotel_amenities_ids: resp.data['hotel_hotel_amenities_ids'] || '',
                    core_country_id: resp.data['core_country_id'] || '',
                    core_state_id: resp.data['core_state_id'] || '',
                    core_city_id: resp.data['core_city_id'] || '',
                    address: resp.data['address'] || '',
                    latitude: resp.data['latitude'] || '',
                    longitude: resp.data['longitude'] || '',
                    postal_code: resp.data['postal_code'] || '',
                    phone_number: resp.data['phone_number'] || '',
                    fax_number: resp.data['fax_number'] || '',
                    email: resp.data['email'] || '',
                    image: resp.data['image'] || '',
                    status: val['status'] ? true : false,
                }];
                data['topic'] = 'updateHotel';
                this.hotelCrsService.update(data).subscribe(resp => {
                    if (resp.statusCode == 201) {
                        this.swalService.alert.update();
                    }
                    else
                        this.swalService.alert.oops();
                })
            } else {
                this.swalService.alert.opps();
            }
        });

    }
    updateHotel(data) {
        this.toUpdate.emit({ tabId: 'add_hotel', hotel: data });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                hotel_name: objData.hotel_name,
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];
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
                case 'hotel_name': return this.utility.compare('' + a.hotel_name, '' + b.hotel_name, isAsc);
                case 'star_rating': return this.utility.compare('' + a.star_rating, '' + b.star_rating, isAsc);
                case 'address': return this.utility.compare('' + a.address, '' + b.address, isAsc);
                case 'phone_number': return this.utility.compare('' + a.phone_number, '' + b.phone_number, isAsc);
                case 'email': return this.utility.compare('' + a.email, '' + b.email, isAsc);
                default: return 0;
            }
        });
    }
}
