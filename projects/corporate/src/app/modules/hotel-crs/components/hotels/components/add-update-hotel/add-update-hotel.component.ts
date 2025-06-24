import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from '../../../../../../core/logger/logger.service';
import { formatDate } from '../../../../../../core/services/format-date';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { HotelCrsService } from '../../../../hotel-crs.service';

const log = new Logger('Hotel/AddUpdateHotel');

@Component({
    selector: 'app-add-update-hotel',
    templateUrl: './add-update-hotel.component.html',
    styleUrls: ['./add-update-hotel.component.scss']
})
export class AddUpdateHotelComponent implements OnInit, AfterViewInit {

    isHotelActive: boolean;
    isRoomActive: boolean;
    isHotelImageActive: boolean;
    isRoomImageActive: boolean;
    isSeasonActive: boolean;
    isPriceActive: boolean;
    isCancellationActive: boolean;
    isHotelDetail: boolean;
    isRoomDetail: boolean;
    isHotelImage: boolean;
    isRoomImage: boolean;
    isSeason: boolean;
    isPrice: boolean;
    isCancellation: boolean;
    hotelData: any;
    hotelTypeList: any;
    hotelAmenityList: any;
    roomTypeList: any;
    roomAmenityList: any;
    coreCountryList: any;
    coreStateList: any
    coreCityList: any;
    hotelForm: FormGroup;
    hotelImageForm: FormGroup;
    roomDetailForm: FormGroup;
    roomImageForm: FormGroup;
    roomSeasonForm: FormGroup;
    roomPriceForm: FormGroup;
    roomCancellationPolicyForm: FormGroup;
    showInputOne = false;
    showInputTwo = false;
    showInputThree = false;
    showChildInput = false;
    showVat = false;
    showServiceCharge = false;
    multiSelectAmenity = [];

    minDate;
    maxDate;
    isOpen = false as boolean;
    isOpenFromDate = false as boolean;
    isOpenToDate = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-green'
    };
    submittedHotel: boolean = false;
    submittedHotelImage: boolean = false;
    submittedRoom: boolean = false;
    submittedRoomImage: boolean = false;
    submittedRoomSeason: boolean = false;
    submittedRoomPrice: boolean = false;
    submittedRoomCancelPolicy: boolean = false;
    dropdownSettingsForHotel = {};
    dropdownSettingsForRoom = {};

    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
    map: google.maps.Map;
    geocoder: google.maps.Geocoder;
    mapOptions: google.maps.MapOptions;
    marker: google.maps.Marker;
    center;

    @Output() someEvent = new EventEmitter<any>();
    @Input() hotelOne: object = {};
    addedHotelDetail: any;
    imagePath: any;
    imgURL;
    addedHotelImage: any;
    roomSeasonList: any;
    showRoomList: boolean;
    showRoomForm: boolean;
    roomList: any;
    showSeasonList: boolean;
    showSeasonForm: boolean;
    showPriceList: boolean;
    showPriceForm: boolean;
    addedRoomDetail: any;
    noDataMessage: string;
    addedSeasonDetail: any;
    addedPriceDetail: any;
    showCancelPolicyList: boolean;
    showCancelPolicyForm: boolean;
    addedCancelPolicyDetail: any;
    seasonList: any = [];
    noData: boolean;
    hotelImageList;
    hotelImages;
    constructor(
        private hotelCrsService: HotelCrsService,
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private swalService: SwalService,
    ) {
        this.isHotelActive = true;
        this.isRoomActive = false;
        this.isHotelImageActive = false
        this.isRoomImageActive = false;
        this.isSeasonActive = false;
        this.isPriceActive = false;
        this.isCancellationActive = false;
        this.isHotelDetail = true;
        this.isRoomDetail = false;
        this.isHotelImage = false;
        this.isRoomImage = false;
        this.isSeason = false;
        this.isPrice = false;
        this.isCancellation = false;
        this.dropdownSettingsForHotel = {
            singleSelection: false,
            idField: 'id',
            textField: 'hotel_amenity_name',
            maxHeight: 197,
            itemsShowLimit: 3,
        };
    }
    ngAfterViewInit() {
        this.getGeoCoords();
    }
    ngOnInit(): void {
        this.createHotelDetailForm();
        this.getHotelTypeList();
        this.getHotelAmenityList()
        this.getCoreCountryList();
        try {
            if (!this.utilityService.isEmpty(this.hotelOne)) {
                const data = [
                    { id: this.hotelOne['id'] }
                ];
                data['topic'] = 'editHotel';
                this.hotelCrsService.fetch(data).subscribe(resp => {
                    if (resp.statusCode == 200) {
                        this.noData = false;
                        this.hotelData = resp.data;
                        this.patchHotel();
                    } else {
                        this.noData = true;
                        this.swalService.alert.oops();
                    }
                });
            }
        } catch (e) {  }
    }
    createHotelDetailForm(): void {
        this.hotelForm = this.fb.group({
            hotel_name: ['', Validators.required],
            contract_expiry_date: ['', Validators.required],
            star_rating: ['', [Validators.required]],
            hotel_description: ['', [Validators.required, Validators.minLength(6)]],
            hotel_hotel_type_id: ['', Validators.required],
            hotel_hotel_amenities_ids: [this.multiSelectAmenity, Validators.required],
            core_country_id: ['', Validators.required],
            core_state_id: ['', Validators.required],
            core_city_id: ['', Validators.required],
            address: ['', Validators.required],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
            postal_code: ['', Validators.required],
            phone_number: ['', Validators.required],
            fax_number: [''],
            email: ['', Validators.required],
            image: ['', Validators.required],
            status: [true]
        });
    }
    patchHotel() {
        this.hotelForm.patchValue({
            hotel_name: this.hotelData['hotel_name'] || '',
            contract_expiry_date: this.hotelData['contract_expiry_date'] || '',
            star_rating: this.hotelData['star_rating'] || '',
            hotel_description: this.hotelData['hotel_description'] || '',
            hotel_hotel_type_id: this.hotelData['hotel_hotel_type_id'] || '',
            core_country_id: this.hotelData['core_country_id'] || '',
            core_state_id: this.hotelData['core_state_id'] || '',
            core_city_id: this.hotelData['core_city_id'] || '',
            address: this.hotelData['address'] || '',
            latitude: this.hotelData['latitude'] || '',
            longitude: this.hotelData['longitude'] || '',
            postal_code: this.hotelData['postal_code'] || '',
            phone_number: this.hotelData['phone_number'] || '',
            fax_number: this.hotelData['fax_number'] || '',
            email: this.hotelData['email'] || '',
            image: this.hotelData['image'] || '',
            status: Number(this.hotelData['status']) ? true : false,
            hotel_hotel_amenities_ids: this.getAlreadySelectedAmenities(this.hotelData['hotel_hotel_amenities_ids']),
        });
    }
    getAlreadySelectedAmenities(amenities) {
        amenities = amenities.split(',');
        return this.hotelAmenityList.filter((val, index) => val.id == amenities[index]);
    }
    get hotel() { return this.hotelForm.controls; }
    get hotelImage() { return this.hotelImageForm.controls; }
    get hotelRoom() { return this.roomDetailForm.controls; }
    get hotelRoomImage() { return this.roomImageForm.controls; }
    get hotelRoomSeason() { return this.roomSeasonForm.controls; }
    get hotelRoomSeasonPrice() { return this.roomPriceForm.controls; }
    get hotelRoomCancelPolicy() { return this.roomCancellationPolicyForm.controls; }
    getHotelTypeList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'hotelTypeList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.hotelTypeList = resp.data;
            }
        });
    }
    getHotelAmenityList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'hotelAmenityList';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                this.hotelAmenityList = resp.data;
            }
        )
    }
    getHotelRoomTypeList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'roomTypeList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.roomTypeList = resp.data;
            }
        });
    }
    getHotelRoomAmenityList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'roomAmenityList';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            if (resp.statusCode == 200) {
                this.roomAmenityList = resp.data;
            }
        });
    }
    getCoreCountryList(): void {
        const data = [{ offset: 0, limit: 10 }]
        data['topic'] = 'countryList';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                this.coreCountryList = resp.data;
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
        let state_id = event.target.value
        const data = [{ core_state_id: state_id, offset: 0, limit: 10 }]
        data['topic'] = 'cityList';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                this.coreCityList = resp.data;
            }
        )
    }
    getGeoCoords() {
        navigator.geolocation.getCurrentPosition(pos => {
            this.center = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            if (this.center) {
                this.mapInitializer();
            }
        }, err => {
            log.error(`Browser dose not support GeoLocation`, err);
        })
    }
    mapInitializer() {
        this.mapOptions = {
            center: this.center,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
        this.placeMarker();
    }
    placeMarker() {
        this.marker = new google.maps.Marker({
            position: this.center,
            map: this.map
        });
        this.map.addListener('click', (event) => {
            if (!this.marker) {
                this.marker = new google.maps.Marker({
                    position: event.latLng,
                    map: this.map
                });
            } else {
                this.marker.setPosition(event.latLng)
                this.hotelForm.get("latitude").setValue(event.latLng.lat());
                this.hotelForm.get("longitude").setValue(event.latLng.lng());
                this.getAddress(event.latLng);
            }
        });
        this.marker.addListener('dblclick', () => {
            this.map.setZoom(12);
            this.map.setCenter(this.marker.getPosition());
        })
    }
    getAddress(latLng) {
        let geocoder = new google.maps.Geocoder();
        let self = this;
        geocoder.geocode({ 'location': latLng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    self.hotelForm.get("address").setValue(results[0]['formatted_address']);
                    let address = results[0].address_components;
                    let zipcode = address[address.length - 1].long_name;
                    self.hotelForm.get("postal_code").setValue(zipcode);
                }
                else {
                }
            }
            else {
            }
        });
    }
    preview(event) {
        if (!event.target.files[0])
            return;
        var reader = new FileReader();
        this.imagePath = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.imgURL = reader.result;
        }
    }
    onSubmitHotelDetail() {
        this.submittedHotel = true;
        if (this.hotelForm.valid) {
            const dt = new Date(this.hotelForm.value.contract_expiry_date);
            this.hotelForm.value.contract_expiry_date = formatDate(dt, '');
            this.hotelForm.value.hotel_hotel_amenities_ids = this.hotelForm.value.hotel_hotel_amenities_ids.map(v => v.id).join(",");
            this.hotelForm.value.image = 'logo.png';
            let data = Object.assign({}, this.hotelForm.value);
            try {
                if (!this.utilityService.isEmpty(this.hotelOne)) {
                    data['id'] = this.hotelOne['id'];
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
                    this.hotelForm.reset();
                    this.isHotelDetail = false;
                    this.isHotelImage = true;
                    this.isHotelImageActive = true;
                    this.createHotelImageForm();
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
    createHotelImageForm() {
        this.hotelImageForm = this.fb.group({
            image_url: [''],
            hotel_id: [''],
            status: [true]
        });
    }
    previewHotelImage(event) {
        if (!event.target.files[0])
            return;
        var reader = new FileReader();
        this.hotelImages = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.hotelImageList = reader.result;
        }
    }
    onSubmitHotelImage() {
        this.submittedHotelImage = true;
        if (this.hotelImageForm.valid) {
            const formData = new FormData();
            formData.append('image', this.hotelImages)
            formData.append('hotel_hotel_id', this.addedHotelDetail['id'])
            let data: any = [{ data: formData }]
            try {
                if (!this.utilityService.isEmpty(this.hotelOne)) {
                    data['id'] = this.hotelOne['id'];
                    data = [data];
                    data['topic'] = 'updateHotelImage';
                }
                else {
                    data = [data];
                    data['topic'] = 'uploadHotelImage';
                }
            } catch (error) {
                log.debug(error)
            }
            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    log.debug("Image Uploaded Sucessfully...!")
                    this.addedHotelImage = resp
                    this.hotelForm.reset();
                    this.isHotelImage = false;
                    this.isRoomDetail = true;
                    this.isHotelImage = false;
                    this.isRoomDetail = true;
                    this.showRoomList = true;
                    this.showRoomForm = false;
                    this.isRoomActive = true;
                    this.dropdownSettingsForRoom = {
                        singleSelection: false,
                        idField: 'id',
                        textField: 'room_amenity_name',
                    }
                    this.createHotelRoomForm();
                    this.getHotelRoomTypeList();
                    this.getHotelRoomAmenityList();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
        } else { return; }
    }
    createHotelRoomForm(): void {
        this.roomDetailForm = this.fb.group({
            hotel_room_type_id: ['', Validators.required],
            max_passanger_capacity: ['', Validators.required],
            max_adult_capacity: ['', Validators.required],
            max_child_capacity: ['', Validators.required],
            extra_bed_availability: ['', Validators.required],
            room_description: ['', Validators.required],
            room_policy: ['', Validators.required],
            hotel_room_amenity_ids: [[''], Validators.required],
            hotel_id: [''],
            status: [true]
        })
    }
    goToHotelRooms() {
        this.isHotelImage = false;
        this.isRoomDetail = true;
        this.showRoomList = true;
        this.showRoomForm = false;
        this.isRoomActive = true;
        this.dropdownSettingsForRoom = {
            singleSelection: false,
            idField: 'id',
            textField: 'room_amenity_name',
        }
        this.createHotelRoomForm();
        this.getHotelRoomTypeList();
        this.getHotelRoomAmenityList();
        let hotel_id = this.hotelData['id']
        const data = [{ id: hotel_id, offset: 0, limit: 10 }]
        data['topic'] = 'getRoomsByHotelId';
        this.hotelCrsService.fetch(data).subscribe(
            resp => {
                if (resp.statusCode == 200) {
                    this.roomList = resp.data;
                }
                else if (resp.statusCode == 404) {
                    this.noDataMessage = "No records found"
                }
            }
        )

    }
    onClickAddRoom() {
        this.showRoomList = false;
        this.showRoomForm = true;

    }
    onSubmitRoomDetail(): void {
        this.submittedRoom = true;
        if (this.roomDetailForm.valid) {
            this.roomDetailForm.value.hotel_id = this.addedHotelDetail['id'];
            this.roomDetailForm.value.hotel_room_amenity_ids = this.roomDetailForm.value.hotel_room_amenity_ids.map(v => v.id).join(",");
            let data = Object.assign({}, this.roomDetailForm.value);
            try {
                if (!this.utilityService.isEmpty(this.hotelOne)) {
                    data['id'] = this.hotelOne['id'];
                    data = [data];
                    data['topic'] = 'updateHotel';
                }
                else {
                    data = [data];
                    data['topic'] = 'addRoom';
                }
            } catch (error) {
                log.debug(error)
            }
            log.debug('data', data);

            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.addedRoomDetail = resp['data']
                    this.roomDetailForm.reset();
                    this.isRoomDetail = false;
                    this.isRoomImage = true;
                    this.isRoomImageActive = true;
                    this.showSeasonList = true;
                    this.showSeasonForm = false;
                    this.createRoomImageForm();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
        }
        else {
            return;
        }
    }
    createRoomImageForm(): void {
        this.roomImageForm = this.fb.group({
            image_url: [''],
            hotel_room_ids: [''],
            status: [true]
        })
    }
    previewImage(event) { }
    onSubmitRoomImage(): void {
        this.isRoomImage = false;
        this.isSeason = true;
        this.isSeasonActive = true;
        this.createRoomSeasonForm();
    }
    goToRoomSeason() {
        this.isRoomImage = false;
        this.isSeason = true;
        this.isSeasonActive = true;
        this.showPriceList = true;
        this.showPriceForm = false;
        this.createRoomSeasonForm();
    }
    onClickAddSeason(): void {
        this.showSeasonList = false;
        this.showSeasonForm = true;
    }
    createRoomSeasonForm(): void {
        this.roomSeasonForm = this.fb.group({
            season_name: ['', Validators.required],
            from_date: [''],
            to_date: [''],
            hotel_room_ids: [''],
            status: [true]
        })
    }
    onSubmitSeason() {
        this.submittedRoomSeason = true;
        if (this.roomSeasonForm.valid) {
            this.roomSeasonForm.value.hotel_room_ids = this.addedRoomDetail['id'];
            const dt1 = new Date(this.roomSeasonForm.value.from_date);
            this.roomSeasonForm.value.from_date = formatDate(dt1, '');
            const dt2 = new Date(this.roomSeasonForm.value.to_date);
            this.roomSeasonForm.value.to_date = formatDate(dt2, '');
            let data = Object.assign({}, this.roomSeasonForm.value);
            try {
                if (!this.utilityService.isEmpty(this.hotelOne)) {
                    data['id'] = this.hotelOne['id'];
                    data = [data];
                    data['topic'] = 'updateHotel';
                }
                else {
                    data = [data];
                    data['topic'] = 'addSeason';
                }
            } catch (error) {
                log.debug(error)
            }
            log.debug('data', data);

            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.addedSeasonDetail = resp['data']
                    this.isSeason = false;
                    this.isPrice = true;
                    this.isPriceActive = true;
                    this.roomSeasonForm.reset();
                    this.showPriceList = true;
                    this.showPriceForm = false;
                    this.createRoomPriceForm();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
        }
        else {
            return;
        }

    }
    createRoomPriceForm() {
        this.roomPriceForm = this.fb.group({
            hotel_room_season_id: ['', Validators.required],
            one_adult_price: ['', Validators.required],
            two_adult_price: ['', Validators.required],
            three_adult_price: ['', Validators.required],
            child_from_age: ['', Validators.required],
            child_to_age: ['', Validators.required],
            child_price: ['', Validators.required],
            one_adult_breakfast_price: [''],
            two_adult_breakfast_price: [''],
            three_adult_breakfast_price: [''],
            minimum_stay: ['', Validators.required],
            extra_bed_count: ['', Validators.required],
            extra_bed_price: [''],
            child_breakfast_price: [''],
            vat: [''],
            service_charge: [''],
            status: [true],
        })
    }
    onClickAddPrice() {
        this.showPriceList = false;
        this.showPriceForm = true;
        let season_id = this.addedSeasonDetail['id']
        const data = [{ id: season_id, offset: 0, limit: 10 }]
        data['topic'] = 'editSeason';
        this.hotelCrsService.fetch(data).subscribe(resp => {
            this.seasonList.push(resp['data'])
        })
    }
    onSubmitPrice() {
        this.submittedRoomPrice = true;
        if (this.roomPriceForm.valid) {
            // this.roomPriceForm.value.hotel_room_season_id = this.addedSeasonDetail['id'];
            let data = Object.assign({}, this.roomPriceForm.value);
            try {
                if (!this.utilityService.isEmpty(this.hotelOne)) {
                    data['id'] = this.hotelOne['id'];
                    data = [data];
                    data['topic'] = 'updateHotel';
                }
                else {
                    data = [data];
                    data['topic'] = 'addPrice';
                }
            } catch (error) {
                log.debug(error)
            }
            log.debug('data', data);

            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.addedPriceDetail = resp['data']
                    this.isPrice = false;
                    this.roomPriceForm.reset();
                    this.isCancellation = true;
                    this.isCancellationActive = true;
                    this.showCancelPolicyList = true;
                    this.showCancelPolicyForm = false;
                    this.createRoomCancellationPolicyForm();
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
        }
        else {
            return;
        }

    }
    onClickAddCancelPolicy() {
        this.showCancelPolicyList = false;
        this.showCancelPolicyForm = true;
    }
    createRoomCancellationPolicyForm() {
        this.roomCancellationPolicyForm = this.fb.group({
            hotel_room_id: [''],
            cancel_to: ['', Validators.required],
            penalty_type: ['', Validators.required],
            penalty: ['', Validators.required],
            cancel_description: ['', Validators.required],
            refund_policy: ['', Validators.required],
            status: [true]
        })
    }
    onReset() {

    }
    toggleInputOne() {
        if (this.showInputOne) {
            this.showInputOne = false;
        } else if (!this.showInputOne) {
            this.showInputOne = true;
        }
    }
    toggleInputTwo() {
        if (this.showInputTwo) {
            this.showInputTwo = false;
        } else if (!this.showInputTwo) {
            this.showInputTwo = true;
        }
    }
    toggleInputThree() {
        if (this.showInputThree) {
            this.showInputThree = false;
        } else if (!this.showInputThree) {
            this.showInputThree = true;
        }
    }
    toggleChildInput() {
        if (this.showChildInput) {
            this.showChildInput = false;
        } else if (!this.showChildInput) {
            this.showChildInput = true;
        }
    }
    toggleVAT() {
        if (this.showVat) {
            this.showVat = false;
        } else if (!this.showVat) {
            this.showVat = true;
        }
    }
    toggleServiceCharge() {
        if (this.showServiceCharge) {
            this.showServiceCharge = false;
        } else if (!this.showServiceCharge) {
            this.showServiceCharge = true;
        }
    }
    onSubmitCancelPolicy() {
        this.submittedRoomCancelPolicy = true;
        if (this.roomCancellationPolicyForm.valid) {
            this.roomCancellationPolicyForm.value.hotel_room_id = this.addedRoomDetail['id'];
            let data = Object.assign({}, this.roomCancellationPolicyForm.value);
            try {
                if (!this.utilityService.isEmpty(this.hotelOne)) {
                    data['id'] = this.hotelOne['id'];
                    data = [data];
                    data['topic'] = 'updateHotel';
                }
                else {
                    data = [data];
                    data['topic'] = 'addCancellationPolicy';
                }
            } catch (error) {
                log.debug(error)
            }
            log.debug('data', data);

            this.hotelCrsService.update(data).subscribe(resp => {
                if (resp.statusCode == 201) {
                    this.addedCancelPolicyDetail = resp['data']
                    this.someEvent.next({ tabId: 'list_hotels', hotel: '' })
                    this.swalService.alert.success("Hotel and Room Allocation added successfully!")
                } else if (resp.statusCode == 400) {
                    this.swalService.alert.oops(resp.msg)
                }
                else {
                    this.swalService.alert.oops(resp.msg);
                }
            })
        }
        else {
            return;
        }

    }
}
