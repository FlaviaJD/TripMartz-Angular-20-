import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Logger } from '../../../../../../core/logger/logger.service';
import { formatDate } from '../../../../../../core/services/format-date';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Router } from '@angular/router';

const log = new Logger('Hotel/AddUpdateHotel');
@Component({
  selector: 'app-hotel-crs-detail',
  templateUrl: './hotel-crs-detail.component.html',
  styleUrls: ['./hotel-crs-detail.component.scss']
})
export class HotelCrsDetailComponent implements OnInit,AfterViewInit {
    @ViewChild ('file',{static: false}) fileUploader:ElementRef;
    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
    map: google.maps.Map;
    geocoder: google.maps.Geocoder;
    mapOptions: google.maps.MapOptions;
    marker: google.maps.Marker;
    center;
    hotelForm: FormGroup;
    isHotelImage: boolean;
    submittedHotel: boolean = false;
    submittedHotelImage: boolean = false;
    addedHotelDetail: any;
    coreCityList: any;
    @Input() hotelOne: object = {};
    @Output() callResult = new EventEmitter<any>();
    @Output() isHotelDetails =new EventEmitter<any>()
    @Output() someEvent = new EventEmitter<any>();
    imagePath: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-green'
    };
    file: any;
    selectedCityName: string = '';
    isHotelDetail: boolean;
    multiSelectAmenity = [];
    noData: boolean;
    hotelAmenityList: any;
    hotelData: any;
    hotelTypeList: any;
    coreCountryList: any;
    coreStateList: any;
    imgURL;
    updateImage;
    isHotelImageActive: boolean;
    dropdownSettingsForHotel = {};
    isOpen = false as boolean;
  constructor(    private hotelCrsService: HotelCrsService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router:Router) { 
        this.dropdownSettingsForHotel = {
            singleSelection: false,
            idField: 'id',
            textField: 'hotel_amenity_name',
            maxHeight: 197,
            itemsShowLimit: 2,
        };
        this.getHotelAmenityList();
    }

  ngOnInit() {
    console.log("hotelOne",this.hotelOne)
    this.createHotelDetailForm();
    this.getHotelAmenityList();
    this.getHotelTypeList();
    this.getCoreCountryList();
    
    // try {
       this.hotelCrsService.updateData.subscribe((data=>{
        console.log("data",data)
        console.log("Object.keys(data).length",Object.keys(data).length)
            if(Object.keys(data).length){
        // if (!this.utilityService.isEmpty(this.hotelOne)) {
            console.log("this.hotelOne",this.hotelOne)
            const data = [
                { id: this.hotelOne['id'] }
            ];
            data['topic'] = 'editHotel';
            this.hotelCrsService.fetch(data).subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.hotelData = resp.data;
                    this.patchHotelAfterAmenitiesLoaded();
                   // this.patchHotel();
                } else {
                    this.noData = true;
                    this.swalService.alert.oops();
                }
            });
        //}
    }
}))
        
    // } catch (e) { console.log(e); }
}
ngAfterViewInit(){
    //this.getGeoCoords();
}
    // getGeoCoords() {
    //     navigator.geolocation.getCurrentPosition(pos => {
    //         this.center = {
    //             lat: pos.coords.latitude,
    //             lng: pos.coords.longitude
    //         };
    //         if (this.center) {
    //             this.mapInitializer();
    //         }
    //     }, err => {
    //         log.error(`Browser dose not support GeoLocation`, err);
    //     })
    // }
patchHotel() {
    this.dropdownSettingsForHotel = {
        singleSelection: false,
        idField: 'id',
        textField: 'hotel_amenity_name',
        maxHeight: 197,
        itemsShowLimit: 2,
    };
    const selectedCountryId = this.hotelData['core_country_id'];
    this.getStateList({ target: { value: selectedCountryId } });
    const selectedCityId = this.hotelData['core_city_id'];
    this.getCityList({ target: { value: selectedCityId } });
    console.log("this.hotelData",this.hotelData)
    this.hotelForm.patchValue({
        hotel_name: this.hotelData['hotel_name'] || '',
        contract_expiry_date: new Date(this.hotelData['contract_expiry_date']) || '',
        star_rating: this.hotelData['star_rating'] || '',
        hotel_description: this.hotelData['hotel_description'] || '',
        hotel_hotel_type_id: this.hotelData['hotel_hotel_type_id'] || '',
        core_country_id: this.hotelData['core_country_id'] || '',
        core_state_id: this.hotelData['core_state_id'] || '',
        city_name: this.hotelData['city_name'] || '',
        address: this.hotelData['address'] || '',
        latitude: this.hotelData['latitude'] || '',
        longitude: this.hotelData['longitude'] || '',
        phone_number: this.hotelData['phone_number'] || '',
        email: this.hotelData['email'] || '',
        image: this.hotelData['image'] || '',
        xl_hotel_code:this.hotelData['xl_hotel_code'] || '',
        gst_state:this.hotelData['gst_state'] || '',
        gst_number:this.hotelData['gst_number'] || '',
        ifsc_code:this.hotelData['ifsc_code'] || '',
        beneficiary_account_number:this.hotelData['beneficiary_account_number'] || '',
        beneficiary_name:this.hotelData['beneficiary_name'] || '',
        bank_name:this.hotelData['bank_name'] || '',
        location:this.hotelData['location'] || '',
        status: Number(this.hotelData['status']) ? true : false,
        priority:this.hotelData['priority'] ? true : false,
        hotel_hotel_amenities: this.getAlreadySelectedAmenities(this.hotelData['hotel_hotel_amenities']),
    });
    this.updateImage = this.hotelData['image']
    //console.log("this.getAlreadySelectedAmenities(this.hotelData['hotel_hotel_amenities_ids'])",this.getAlreadySelectedAmenities(this.hotelData['hotel_hotel_amenities_ids']))
}

getAlreadySelectedAmenities(amenities) {
    const amenityIds = amenities.split(',');
    console.log("amenityIds",amenityIds)
    console.log("hotelAmenityList",this.hotelAmenityList)
    const selectedAmenities = this.hotelAmenityList.filter(amenity => amenityIds.includes(String(amenity.hotel_amenity_name)));
    console.log("selectedAmenities",selectedAmenities)
    return selectedAmenities;
}
// mapInitializer() {
//     this.mapOptions = {
//         center: this.center,
//         zoom: 10,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//     }
//     this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
//     this.placeMarker();
// }
//    placeMarker() {
//         this.marker = new google.maps.Marker({
//             position: this.center,
//             map: this.map
//         });
//         this.map.addListener('click', (event) => {
//             if (!this.marker) {
//                 this.marker = new google.maps.Marker({
//                     position: event.latLng,
//                     map: this.map
//                 });
//             } else {
//                 this.marker.setPosition(event.latLng)
//                 this.hotelForm.get("latitude").setValue(event.latLng.lat());
//                 this.hotelForm.get("longitude").setValue(event.latLng.lng());
//                 this.getAddress(event.latLng);
//             }
//         });
//         this.marker.addListener('dblclick', () => {
//             this.map.setZoom(12);
//             this.map.setCenter(this.marker.getPosition());
//         })
//     }
    // getAddress(latLng) {
    //     let geocoder = new google.maps.Geocoder();
    //     let self = this;
    //     geocoder.geocode({ 'location': latLng }, (results, status) => {
    //         if (status == google.maps.GeocoderStatus.OK) {
    //             if (results[0]) {
    //                 self.hotelForm.get("address").setValue(results[0]['formatted_address']);
    //                 let address = results[0].address_components;
    //                 let zipcode = address[address.length - 1].long_name;
    //                 self.hotelForm.get("postal_code").setValue(zipcode);
    //             }
    //             else {
    //             }
    //         }
    //         else {
    //         }
    //     });
    // }
numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

getHotelTypeList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'hotelTypeList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.hotelTypeList = resp.data.filter(p => p.status == 1);
        }
    });
}
getCoreCountryList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'countryList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            this.coreCountryList = resp.data.countries;
        }
    )
}
getStateList(event) {
    let country_id = event.target.value
    const data = [{ core_country_id: country_id, offset: 0, limit: 10 }]
    data['topic'] = 'stateList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            this.coreStateList = resp.data;
        }
    )
}
getCityList(event): void {
  console.log("event ccc",event)
    let state_id = event.target.value
    const data = [{ core_state_id: state_id, offset: 0, limit: 10 }]
    data['topic'] = 'commonCityList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            this.coreCityList = resp.data;
        }
    )
}
  createHotelDetailForm(): void {
    this.hotelForm = this.fb.group({
        hotel_name: ['', Validators.required],
        contract_expiry_date: ['', Validators.required],
        star_rating: ['', [Validators.required]],
        hotel_description: ['', [Validators.required, Validators.minLength(6)]],
        hotel_hotel_type_id: ['', Validators.required],
        hotel_hotel_amenities: [this.multiSelectAmenity, Validators.required],
        core_country_id: ['', Validators.required],
        core_state_id: ['', Validators.required],
        city_name: ['', Validators.required],
        address: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        phone_number: ['', Validators.required],
        xl_hotel_code: [''],
        gst_state: [''],
        gst_number: [''],
        location: [''],
        bank_name: [''],
        beneficiary_name: [''],
        beneficiary_account_number: [''],
        ifsc_code: [''],
        city_code:[''],
        // fax_number:[''],
        // postal_code:[''],
        email: ['', Validators.required],
        // image: ['', Validators.required],
        status: [true],
        priority: new FormControl('')
    });
}
onCityChange(event) {
    let cityId = event;
    const selectedCity = this.coreCityList.find(city => city.city_name === cityId);
    this.selectedCityName = selectedCity ? selectedCity.CityCode : '';
  }
  onSubmitHotelDetail() {
    this.submittedHotel = true;
    if (this.hotelForm.valid) {
        const dt = new Date(this.hotelForm.value.contract_expiry_date);
        this.hotelForm.value.contract_expiry_date = formatDate(dt, '');

        this.hotelForm.value.hotel_hotel_amenities = this.hotelForm.value.hotel_hotel_amenities.map(v => v.hotel_amenity_name).join(",");
        this.hotelForm.value.city_code= this.selectedCityName;
        let data = Object.assign({}, this.hotelForm.value);
        if (data['priority']) {
            data['priority'] = true;
        } else {
            data['priority'] = false;
        }
        try {
            if (!this.utilityService.isEmpty(this.hotelOne)) {
                data['id'] = this.hotelOne['id'];
                data['city_code']=this.hotelOne['city_code'];
                data = [data];
                data['topic'] = 'updateHotel';
            }
            else {
                data = [data];
                data['topic'] = 'addHotel';
            }
        } catch (error) {
            log.debug(error)
        }
        this.hotelCrsService.update(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.addedHotelDetail = resp['data'];
                // this.onSubmitHotelImage( this.addedHotelDetail);
               // this.hotelCrsService.addedHotelDetail.next(this.addedHotelDetail);
               if(this.imagePath){
                const formData = new FormData();
                formData.append('image', this.imagePath);
                formData.append('id', this.addedHotelDetail['id'])
                data = [{ data: formData }];
                data['topic'] = 'uploadHotelLogo';
                this.hotelCrsService.update(data).subscribe(res => {
                    if (res.statusCode == 201) {
                        log.debug("Image Uploaded Successfully... ", res)
                    }
                })
            }
                this.hotelForm.reset();
                this.isHotelDetail = false;
                if(data['topic'] == 'addHotel'){
                    this.swalService.alert.success("Room detail added successfully!") 
                }else{
                    this.swalService.alert.success("Room detail Updated successfully!")
                }
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/hotels/hotel-crs-lists']);
            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.msg)
            }
            else {
                this.swalService.alert.oops(resp.msg);
            }
        })
    } else {
        return;
    }
}

    preview(event) {
        this.file = event.target.files[0];
        if (this.file && this.file.size) {
            let result = this.hotelCrsService.validateFileSize(this.file.size);
            if (!result) {
                this.fileUploader.nativeElement.value = null;
                return;
            }
        }
        if (this.file.name) {
            var reader = new FileReader();
            this.imagePath = event.target.files[0];
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (_event) => {
                this.imgURL = reader.result;
            }
        }
    }

getHotelAmenityList(): void {
    const data = [{ offset: 0, limit: 10 }]
    data['topic'] = 'hotelAmenityList';
    this.hotelCrsService.fetch(data).subscribe(
        resp => {
            this.hotelAmenityList = resp.data.filter(p => p.status == 1);
            if (this.hotelData) {
                this.patchHotel();
            }
            }
    )
}
patchHotelAfterAmenitiesLoaded() {
    // If amenities are already loaded, patch the hotel form
    if (this.hotelAmenityList) {
        this.patchHotel();
    }
}
   backToHotel(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/hotels/hotel-crs-lists']);
   }
get hotel() { return this.hotelForm.controls; }
}
