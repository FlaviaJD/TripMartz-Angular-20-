import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Logger } from '../../../../../../core/logger/logger.service';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('hotel-crs/HotelList');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-hotel-list',
    templateUrl: './hotel-list.component.html',
    styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent implements OnInit,AfterViewInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    tohotelImageT:boolean=false;
    regConfig: FormGroup;
    searchText:string;
    isCollapsed = true;
    showFilter:boolean=true;
    hotelAmenityList: any;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "priority", value: 'Priority' },
        { key: "hotel_code", value: 'Hotel Code' },
        { key: "hotel_name", value: 'Hotel Name' },
        { key: "star_rating", value: 'Star Rating' },
        { key: "city", value: 'City' },
        { key: "country", value: 'Country' },
        { key: "city_code", value: 'City Code' },
        // { key: "address", value: 'Address' },
        { key: "phone_number", value: 'Phone Number' },
        { key: "email", value: 'Email' },
        {key: "image", value: 'Display Image'},
        { key: "status", value: 'Status' },
        { key: "action", value: 'Actions' },
    ];
    noData: boolean = true;
    respData: any;
    countData:any;
    status;
    priority;
    searchValue = new FormControl("", {});
    @Output() toUpdate = new EventEmitter<any>();
@Output() tohotelImage =new EventEmitter<any>()
    constructor(
        private hotelCrsService: HotelCrsService,
        private swalService: SwalService,
        private utility: UtilityService,
        private fb: FormBuilder,
        private apiHandlerService:ApiHandlerService,
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            hotel_name: new FormControl('', [Validators.maxLength(120)]),
            hotel_code: new FormControl('', [Validators.maxLength(120)]),
            city_name: new FormControl('', [Validators.maxLength(120)]),
        });
        this.getHotelList();
        this.getHotelCount();
        this. getHotelAmenityList();
    }
    ngAfterViewInit() {
       
           this.fetchSearchData();
          
        }
    getHotelList(event?): void {
        if(event){
            this.pageSize = event;
        }
       
        this.noData = true;
        this.respData = [];
        let reqBody = {};
        const offset = (this.page -1)*this.pageSize;
        if (!this.utility.isEmpty(this.regConfig.value)) {
            reqBody = {
                "hotel_name": this.regConfig.value.hotel_name || "",
                "hotel_code": this.regConfig.value.hotel_code || "",
                "city_name": this.regConfig.value.city_name || "",
                "offset":offset,
                "limit":this.pageSize,
                
            }
        }else {
            reqBody = {}
        }
        const data = [reqBody]
        data['topic'] = 'hotelList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.respData = resp.data;
                respDataCopy = [...this.respData];
                this.collectionSize = this.countData;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        },
        (err) => {
            this.noData = false;
            this.respData = [];
        });
    }
    getHotelCount(): void {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
       
        const data = [reqBody]
        data['topic'] = 'hotelCount';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.countData = resp.data.hotel_count;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        },
        (err) => {
            this.noData = false;
            this.respData = [];
        });
    }
    fetchSearchData() {
        this.searchValue.valueChanges.pipe(distinctUntilChanged(),debounceTime(800)).subscribe(() => {
            if( this.searchValue.value ==''){
                this.pageSize = 10;
                this.getHotelList()
            }else{
             this.searchValueData();
            }
        });
      }

      searchValueData(): void {
        this.noData = true;
        this.respData = [];
        let reqBody = {
            "query" :this.searchValue.value
        };
        if(reqBody.query ==""){
            this.pageSize =10;
            this.getHotelList
        }else{
       
        const data = [reqBody]
        data['topic'] = 'searchHotels';
        
        this.hotelCrsService.fetch(data).subscribe(resp => {
            log.debug(resp);
            if (resp.statusCode == 200) {
                this.noData = false;
                this.respData = resp.data;
            }
            else if (resp.statusCode == 404) {
                this.noData = true;
                this.swalService.alert.error();
            }
        },
        (err) => {
            this.noData = false;
            this.respData = [];
        });
    }
}
    onStatusUpdate(val, index): void {
        log.debug(index);
        const data = [{ id: val['id'] }];
        data['topic'] = 'editHotel';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
              //  const ami=this.getAlreadySelectedAmenities(resp.data['hotel_hotel_amenities'])
                const data = [{
                    id: resp.data['id'] || '',
                    hotel_name: resp.data['hotel_name'] || '',
                    contract_expiry_date: new Date(resp.data['contract_expiry_date']) || '',
                    star_rating: resp.data['star_rating'] || '',
                    hotel_description: resp.data['hotel_description'] || '',
                    hotel_hotel_type_id: resp.data['hotel_hotel_type_id'] || '',
                    core_country_id: resp.data['core_country_id'] || '',
                    core_state_id: resp.data['core_state_id'] || '',
                    city_name: resp.data['city_name'] || '',
                    address: resp.data['address'] || '',
                    latitude: resp.data['latitude'] || '',
                    longitude: resp.data['longitude'] || '',
                    phone_number: resp.data['phone_number'] || '',
                    email: resp.data['email'] || '',
                    image: resp.data['image'] || '',
                    xl_hotel_code:resp.data['xl_hotel_code'] || '',
                    gst_state:resp.data['gst_state'] || '',
                    gst_number:resp.data['gst_number'] || '',
                    ifsc_code:resp.data['ifsc_code'] || '',
                    beneficiary_account_number:resp.data['beneficiary_account_number'] || '',
                    beneficiary_name:resp.data['beneficiary_name'] || '',
                    bank_name:resp.data['bank_name'] || '',
                    location:resp.data['location'] || '',
                    status: Number(resp.data['status']) ? true : false,
                    priority:val['priority'] ? true : false,
                    hotel_hotel_amenities:resp.data['hotel_hotel_amenities'] ,
                    city_code:resp.data['city_code']

                }];
                data['topic'] = 'updateHotel';
                this.hotelCrsService.update(data).subscribe(resp => {
                    if (resp.statusCode == 201) {
                        this.getHotelList();
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
    getHotelAmenityList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'hotelAmenityList';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                this.hotelAmenityList = resp.data.filter(p => p.status == 1);
                }
        )
    }
    getAlreadySelectedAmenities(amenities) {
      const amenityIds = amenities.split(',');
    const selectedAmenities = this.hotelAmenityList.filter(amenity => amenityIds.includes(String(amenity.hotel_amenity_name)));
    return selectedAmenities;
    }
    updateHotel(data,ev) {
        this.hotelCrsService.updateData.next(data);
        this.toUpdate.emit({ tabId: 'add_hotel', hotel: data,hoteltrigger:ev });
        // this.toUpdate.emit({ tabId: 'add_hotel', hotel: data });
        // this.tohotelImage.emit(true)
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
                case 'city': return this.utility.compare('' + a.core_city_id, '' + b.core_city_id, isAsc);
                case 'country': return this.utility.compare('' + a.core_country_id, '' + b.core_country_id, isAsc);
                case 'city_code': return this.utility.compare('' + a.city_code, '' + b.city_code, isAsc);
                case 'address': return this.utility.compare('' + a.address, '' + b.address, isAsc);
                case 'phone_number': return this.utility.compare('' + a.phone_number, '' + b.phone_number, isAsc);
                case 'email': return this.utility.compare('' + a.email, '' + b.email, isAsc);
                default: return 0;
            }
        });
    }
 
//     onFilter(){
//         console.log("this.showFilter",this.showFilter)
//    this.showFilter=this.showFilter == false? this.showFilter : !this.showFilter
//    }
   onfliterChange($event){
   }
    
    onSearchSubmit(data) {
    if(data){
            this.pageSize=5000;
            this.getHotelList(); 
        }
    }
    onReset() {
        this.regConfig.reset();
        this.searchText=''
        this.pageSize=10;
        this.getHotelList();
    }
    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any, index: number) => {
                return {
                    "Sl No.": index + 1,
                    "Hotel Code":response.hotel_code,
                    "Hotel Name": response.hotel_name,
                    "Star Rating": response.star_rating,
                    "City": response.core_city_id,
                    "Country": response.core_country_id,
                    "City Code":response.city_code,
                    "Address": response.address,
                    "Phone Number": response.phone_number,
                    "Email": response.email,
                   
                }
            });

            const columnWidths = [
                { wch: 5 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 40 },
                { wch: 15 },
               
            ];

            this.utility.exportToExcel(
                fileToExport,
                'Hotel CRS Report',
                columnWidths
            );
        }
    }
    onDelete(hotelData){
        this.swalService.alert.delete((action)=>{
            if(action){
                const data = [{ id:hotelData['id']}]
                data['topic'] = 'deleteHotel';
                this.hotelCrsService.fetch(data).subscribe(response => {
                 
                            if (response.statusCode == 200 || response.statusCode == 201 ) {
                            this.swalService.alert.success(`Hotel has been deleted successfully`);
                            this.getHotelList();
                            }
                        },(err: HttpErrorResponse) => {
                            this.swalService.alert.error(err['error']['Message']);
                        }
                    );
            }
        })
    }
    // onDelete(hotelData){
    //     const data = [{ id:hotelData['id']}]
    //     data['topic'] = 'deleteHotel';
    //     this.hotelCrsService.fetch(data).subscribe(resp => {
    //         if (resp.statusCode == 201) {
    //             // this.hotelImage = resp.data;
    //             this.getHotelList();
    //             this.swalService.alert.success("hotel deleted successfully!")
    //         }
    
    //     });
    // }
}
