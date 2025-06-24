import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-update-hotel-queues',
    templateUrl: './update-hotel-queues.component.html',
    styleUrls: ['./update-hotel-queues.component.scss']
})
export class UpdateHotelQueuesComponent implements OnInit {
        @Input() updateData: any;
        updateHotelConfig: FormGroup;
        propertyList: Array<string> = ['TripMartz', 'DCB Bank']
        paymentModeList: Array<string> = ['Direct Payment By Guest', 'All Inclusive', 'Bed + Breakfast', 'Bed + Breakfast + Dinner']
        earlyCheckinList: Array<string> = ['Yes', 'No']
        statusList: Array<string> = ['BOOKING_CONFIRMED'];
        roomType: Array<string> = ['Standard Room', 'Deluxe Room', 'Luxury Room', 'Club Room', 'Executive Room', 'Suite Room', 'Premium Suite Room'];
        roomList: Array<string> = [];
        starRating: Array<string> = ['1', '2', '3', '4', '5'];
        singleRoom: Array<string> = [];
        voucherList: Array<string> = ['single', 'double'];
        @Output() back = new EventEmitter<any>();
        protected subs = new SubSink();
        hotelNames: any = [];
        filteredHotelNames: Observable<string[]>;
        searchedList: any = [];
        dropDownCity: any;
        hotelCode: string = '';
        isOpen = false as boolean;
        loading: boolean = false;
        primaryColour: any;
        secondaryColour: any;
        loadingTemplate: any;
        stateSelected: boolean = true;
        hotelSelected: boolean = true;
        enableSingleTarrief: boolean = false;
        enableDoubleTarrief: boolean = false;
        bsDateConf = {
            isAnimated: true,
            dateInputFormat: 'YYYY-MM-DD',
            rangeInputFormat: 'YYYY-MM-DD',
            containerClass: 'theme-blue',
            showWeekNumbers: false
        };
        times: string[] = [
            '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
            '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
            '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
            '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
            '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
            '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
        ];
    
        showDiv = {
            club: false,
        }
    
        constructor(
            private fb: FormBuilder,
            private apiHandlerService: ApiHandlerService,
            private swalService: SwalService,
            private router: Router,
            private datePipe: DatePipe,
            private utility: UtilityService,
            private cdr:ChangeDetectorRef
        ) { }
    
        ngOnInit() {
            this.getHotelList();
            this.createForm();
            this.updateHotelConfig.get('single_basic_fare').valueChanges.subscribe(() => {
                this.calculateTotalFare('single');
            });
            this.updateHotelConfig.get('single_Tax').valueChanges.subscribe(() => {
                this.calculateTotalFare('single');
            });
    
            this.updateHotelConfig.get('double_basic_fare').valueChanges.subscribe(() => {
                this.calculateTotalFare('double');
            });
    
            this.updateHotelConfig.get('double_Tax').valueChanges.subscribe(() => {
                this.calculateTotalFare('double');
            });
    
            this.updateHotelConfig.get('early_check_in_supplier_charge').valueChanges.subscribe(() => {
                this.calculateSupplierSupplementaryCharge();
            });
    
            this.updateHotelConfig.get('early_check_out_supplier_charge').valueChanges.subscribe(() => {
                this.calculateSupplierSupplementaryCharge();
            });
    
            this.updateHotelConfig.get('single_supplier_basic').valueChanges.subscribe(() => {
                this.calculateSupplierFare('single');
            });
            this.updateHotelConfig.get('single_supplier_tax').valueChanges.subscribe(() => {
                this.calculateSupplierFare('single');
            });
    
            this.updateHotelConfig.get('double_supplier_basic').valueChanges.subscribe(() => {
                this.calculateSupplierFare('double');
            });
            this.updateHotelConfig.get('double_supplier_tax').valueChanges.subscribe(() => {
                this.calculateSupplierFare('double');
            });
            this.updateHotelConfig.get('early_checkin').valueChanges.subscribe((value) => {
                this.handleEarlyCheckinChange(value);
            });
            this.updateHotelConfig.get('late_checkout').valueChanges.subscribe((value) => {
                this.handleLateCheckinChange(value);
            });
            this.updateHotelConfig.get('is_club_booking').valueChanges.subscribe((value) => {
                this.handleClubBookingChange(value);
            });
    
            this.updateHotelConfig.get('roomDetails').valueChanges.subscribe(() => {
                this.shouldShowClubBooking();
                this.updateClubBookingValidation();
                this.updateSingleRoomList();
                this.showTarrifDetails();
            });
        }
    
    
        updateSingleRoomList() {
            this.singleRoom = []; // Clear the existing array
            const roomDetails = this.updateHotelConfig.get('roomDetails') as FormArray;
            // Iterate through each roomDetail in the form array
            roomDetails.controls.forEach(roomDetail => {
                const max_occupancy = roomDetail.get('max_occupancy').value;
                // If voucher_occupancy is 'single', push the roomNumber to the singleRoom array
                if (max_occupancy === '1') {
                    const roomNumber = roomDetail.get('RoomId').value;
                    if (!this.singleRoom.includes(roomNumber) && roomNumber != '') {
                        this.singleRoom.push(roomNumber);
                    }
                }
            });
        }
    
        shouldShowClubBooking(): boolean {
            const roomDetails = this.updateHotelConfig.get('roomDetails') as FormArray;
            // Check if any voucher_occupancy is 'single'
            return roomDetails.controls.some(roomDetail => {
                const max_occupancy = roomDetail.get('max_occupancy').value;
                return max_occupancy === '1';
            });
        }
    
        showTarrifDetails() {
            const roomDetails = this.updateHotelConfig.get('roomDetails') as FormArray;
            // Exclude room details with max_occupancy=''
            const filteredRoomDetails = roomDetails.controls.filter(roomDetail => {
                const maxOccupancy = roomDetail.get('max_occupancy').value;
                return maxOccupancy !== '';
            });
            // Check if there is any filtered room with max_occupancy=1 and isClubBooking=false
            const hasSingleOccupancy = filteredRoomDetails.some(roomDetail => {
                const max_occupancy = roomDetail.get('max_occupancy').value;
                const isClubBooking = roomDetail.get('isClubBooking').value;
                return max_occupancy === '1' && isClubBooking == false;
            });
            // Check if there is any filtered room with  max_occupancy=2
            const hasDoubleOccupancy = filteredRoomDetails.some(roomDetail => {
                const max_occupancy = roomDetail.get('max_occupancy').value;
                return max_occupancy === '2';
            });
            // Check if there is any filtered room with max_occupancy=1 and isClubBooking=true
            const hasClubBooking = filteredRoomDetails.some(roomDetail => {
                const max_occupancy = roomDetail.get('max_occupancy').value;
                const isClubBooking = roomDetail.get('isClubBooking').value;
                return max_occupancy === '1' && isClubBooking == true;
            });
            const singleReport = filteredRoomDetails.filter(roomDetail => {
                const max_occupancy = roomDetail.get('max_occupancy').value;
                const isClubBooking = roomDetail.get('isClubBooking').value;
                return max_occupancy === '1' && isClubBooking != true;
            });
            if (hasClubBooking) {
                if (singleReport.length) {
                    this.enableSingleTarrief = true;
                }
                else {
                    this.enableSingleTarrief = false;
                }
                this.enableDoubleTarrief=true;
            } else {
                this.enableSingleTarrief = hasSingleOccupancy;
                this.enableDoubleTarrief = hasDoubleOccupancy;
            }
            // Now you can use enableSingleTarrief and enableDoubleTarrief to show the tariff details accordingly.
        }
    
        updateClubBookingValidation() {
            const clubBookingControl = this.updateHotelConfig.get('is_club_booking');
            // Set 'required' validator dynamically based on the condition
            if (this.shouldShowClubBooking()) {
                clubBookingControl.setValidators([Validators.required]);
            } else {
                clubBookingControl.clearValidators();
            }
            // Update the validity of the control
            clubBookingControl.updateValueAndValidity();
        }
    
        handleClubBookingChange(value) {
            const clubRoomNo = this.updateHotelConfig.get('RoomId');
            const personNameControl = this.updateHotelConfig.get('person_name');
            const costCenterControl = this.updateHotelConfig.get('cost_center');
            const emp_id = this.updateHotelConfig.get('emp_id');
            const request_id = this.updateHotelConfig.get('request_id');
            const department = this.updateHotelConfig.get('Department');
            const employeeBand = this.updateHotelConfig.get('EmployeeBand');
            const mobileNo = this.updateHotelConfig.get('MobileNo');
            const email = this.updateHotelConfig.get('Email');
    
            if (value) {
                clubRoomNo.setValidators([Validators.required,this.noWhitespaceValidator]);
                personNameControl.setValidators([Validators.required,this.noWhitespaceValidator]);
                costCenterControl.setValidators([Validators.required,this.noWhitespaceValidator]);
                emp_id.setValidators([Validators.required,this.noWhitespaceValidator]);
                request_id.setValidators([Validators.required,this.noWhitespaceValidator]);
                department.setValidators([Validators.required,this.noWhitespaceValidator]);
                employeeBand.setValidators([Validators.required,this.noWhitespaceValidator]);
                mobileNo.setValidators([Validators.required,Validators.minLength(10), Validators.maxLength(15)]);
                email.setValidators([Validators.required,Validators.email]);
    
            } else {
                clubRoomNo.clearValidators();
                personNameControl.clearValidators();
                costCenterControl.clearValidators();
                emp_id.clearValidators();
                request_id.clearValidators();
                department.clearValidators();
                employeeBand.clearValidators();
                mobileNo.clearValidators();
                email.clearValidators();
            }
            personNameControl.updateValueAndValidity();
            costCenterControl.updateValueAndValidity();
            emp_id.updateValueAndValidity();
            request_id.updateValueAndValidity();
        }
    
        calculateSupplierFare(control) {
            if (control == 'single' || control == 'both') {
                const basicFare = +this.updateHotelConfig.get('single_supplier_basic').value || 0;
                const serviceCharge = +this.updateHotelConfig.get('single_supplier_tax').value || 0;
                let tax = 0;
                let totalFare = 0;
                if (serviceCharge) {
                    tax = ((basicFare) * serviceCharge) / 100;
                    totalFare = basicFare + tax;
                } else {
                    totalFare = basicFare + tax;
                }
                this.updateHotelConfig.get('single_supplier_payable').setValue((totalFare).toFixed(2));
            }
    
            if (control == 'double' || control == 'both') {
                const basicFare = +this.updateHotelConfig.get('double_supplier_basic').value || 0;
                const serviceCharge = +this.updateHotelConfig.get('double_supplier_tax').value || 0;
                let tax = 0;
                let totalFare = 0;
                if (serviceCharge) {
                    tax = ((basicFare) * serviceCharge) / 100;
                    totalFare = basicFare + tax;
                } else {
                    totalFare = basicFare + tax;
                }
                this.updateHotelConfig.get('double_supplier_payable').setValue((totalFare).toFixed(2));
            }
    
        }
    
        handleLateCheckinChange(value: string) {
            const clientChargeControl = this.updateHotelConfig.get('early_check_out_client_charge');
            const supplierChargeControl = this.updateHotelConfig.get('early_check_out_supplier_charge');
    
            if (value === 'Yes') {
                clientChargeControl.setValidators([Validators.required]);
                supplierChargeControl.setValidators([Validators.required]);
                clientChargeControl.enable();
                supplierChargeControl.enable();
            } else {
                clientChargeControl.disable();
                supplierChargeControl.disable();
                clientChargeControl.clearValidators();
                supplierChargeControl.clearValidators();
                this.updateHotelConfig.patchValue({
                    early_check_out_client_charge: 0,
                    early_check_out_supplier_charge: 0
                })
            }
    
            clientChargeControl.updateValueAndValidity();
            supplierChargeControl.updateValueAndValidity();
        }
    
    
        handleEarlyCheckinChange(value: string) {
            const clientChargeControl = this.updateHotelConfig.get('early_check_in_client_charge');
            const supplierChargeControl = this.updateHotelConfig.get('early_check_in_supplier_charge');
    
            if (value === 'Yes') {
                clientChargeControl.setValidators([Validators.required]);
                supplierChargeControl.setValidators([Validators.required]);
                clientChargeControl.enable();
                supplierChargeControl.enable();
            } else {
                clientChargeControl.disable();
                supplierChargeControl.disable();
                clientChargeControl.clearValidators();
                supplierChargeControl.clearValidators();
                this.updateHotelConfig.patchValue({
                    early_check_in_client_charge: 0,
                    early_check_in_supplier_charge: 0
                })
            }
    
            clientChargeControl.updateValueAndValidity();
            supplierChargeControl.updateValueAndValidity();
        }
    
        calculateTotalFare(control) {
            if (control == 'single' || control == 'both') {
                const basicFare = +this.updateHotelConfig.get('single_basic_fare').value || 0;
                const serviceCharge = +this.updateHotelConfig.get('single_Tax').value || 0;
                let tax = 0;
                let totalFare = 0;
                if (serviceCharge) {
                    tax = ((basicFare) * serviceCharge) / 100;
                    totalFare = basicFare + tax;
                } else {
                    totalFare = basicFare + serviceCharge;
                }
                this.updateHotelConfig.get('single_TotalFare').setValue((totalFare).toFixed(2));
            }
    
            if (control == 'double' || control == 'both') {
                const basicFare = +this.updateHotelConfig.get('double_basic_fare').value || 0;
                const serviceCharge = +this.updateHotelConfig.get('double_Tax').value || 0;
                let tax = 0;
                let totalFare = 0;
                if (serviceCharge) {
                    tax = ((basicFare) * serviceCharge) / 100;
                    totalFare = basicFare + tax;
                } else {
                    totalFare = basicFare + serviceCharge;
                }
                this.updateHotelConfig.get('double_TotalFare').setValue((totalFare).toFixed(2));
            }
    
        }
    
        calculateSupplierSupplementaryCharge() {
            const checkInFare = +this.updateHotelConfig.get('early_check_in_supplier_charge').value || 0;
            const checkOutFare = +this.updateHotelConfig.get('early_check_out_supplier_charge').value || 0;
            const totalFare = checkInFare + checkOutFare
            this.updateHotelConfig.get('single_supplier_supplementary_charge').setValue((totalFare).toFixed(2));
            this.updateHotelConfig.get('double_supplier_supplementary_charge').setValue((totalFare).toFixed(2));
            this.updateHotelConfig.get('supplier_supplementary_charge').setValue((totalFare).toFixed(2));
        }
    
        calculateClientSupplementaryCharge() {
            const checkInFare = +this.updateHotelConfig.get('early_check_in_client_charge').value || 0;
            const checkOutFare = +this.updateHotelConfig.get('early_check_out_client_charge').value || 0;
            const totalFare = checkInFare + checkOutFare
            this.updateHotelConfig.get('single_client_supplementary_charge').setValue((totalFare).toFixed(2));
            this.updateHotelConfig.get('double_client_supplementary_charge').setValue((totalFare).toFixed(2));;
            this.calculateTotalFare('both');
        }
    
        createForm() {
            let hotel_check_in = this.datePipe.transform(this.updateData.hotel_check_in, 'yyyy-MM-dd');
            let hotel_check_out = this.datePipe.transform(this.updateData.hotel_check_out, 'yyyy-MM-dd');
            this.updateHotelConfig = this.fb.group({
                property: new FormControl('', [Validators.required]),
                BookingId: new FormControl(this.updateData.confirmation_reference, [Validators.required, Validators.pattern(this.utility.regExp.icici),this.noWhitespaceValidator]),
                HotelName: new FormControl(this.updateData.hotel_name, [Validators.required, Validators.pattern(this.utility.regExp.icici),this.noWhitespaceValidator]),
                HotelContactNo: new FormControl(this.updateData.phone_number, [Validators.required, Validators.minLength(10)]),
                HotelAddress: new FormControl(this.updateData.hotel_address, [Validators.required]),
                state: new FormControl(this.updateData.State, [Validators.required]),
                HotelCheckIn: new FormControl(hotel_check_in, [Validators.required]),
                checkin_time: new FormControl('', [Validators.required]),
                HotelCheckOut: new FormControl(hotel_check_out, [Validators.required]),
                checkout_time: new FormControl('', [Validators.required]),
                StarRating: new FormControl(this.updateData.star_rating, [Validators.required]),
                roomDetails: this.fb.array([]), // Add an empty FormArray for room details
                is_club_booking: new FormControl(false),
                RoomId: new FormControl(''),
                request_id: new FormControl(''),
                person_name: new FormControl(''),
                cost_center: new FormControl(''),
                emp_id: new FormControl(''),
                Department:new FormControl(''),
                EmployeeBand:new FormControl(''),
                MobileNo:new FormControl(''),
                Email:new FormControl(''),
                early_checkin: new FormControl('Yes', [Validators.required]),
                early_check_in_client_charge: new FormControl("0"),
                early_check_in_supplier_charge: new FormControl("0"),
                late_checkout: new FormControl('Yes', [Validators.required]),
                early_check_out_client_charge: new FormControl("0"),
                early_check_out_supplier_charge: new FormControl("0"),
                supplier_supplementary_charge: new FormControl("0"),
    
                single_basic_fare: new FormControl("0", [Validators.required]),
                single_client_supplementary_charge: new FormControl("0"),
                single_Tax: new FormControl("0", [Validators.required]),
                single_TotalFare: new FormControl('0', [Validators.required]),
                single_supplier_basic: new FormControl("0", [Validators.required]),
                single_supplier_supplementary_charge: new FormControl("0"),
                single_supplier_tax: new FormControl("0", [Validators.required]),
                single_supplier_payable: new FormControl("0"),
    
                double_basic_fare: new FormControl("0", [Validators.required]),
                double_client_supplementary_charge: new FormControl("0"),
                double_Tax: new FormControl("0", [Validators.required]),
                double_TotalFare: new FormControl('0', [Validators.required]),
                double_supplier_basic: new FormControl("0", [Validators.required]),
                double_supplier_supplementary_charge: new FormControl("0"),
                double_supplier_tax: new FormControl("0", [Validators.required]),
                double_supplier_payable: new FormControl("0"),
    
                PaymentMode: new FormControl('', [Validators.required]),
                RoomType: new FormControl('', [Validators.required]),
                voucher_occupancy: new FormControl('',[Validators.required]),
                status: new FormControl('BOOKING_CONFIRMED', [Validators.required]),
                Remarks: new FormControl('', [Validators.pattern(this.utility.regExp.icici),this.noWhitespaceValidator]),
                PersonalRemarks: new FormControl('')
            }
            );
            for (let i = 0; i < this.updateData.PaxDetails.length; i++) {
                this.addRoomDetail(i);
            }
        }
    
        get f() {
            return this.updateHotelConfig.controls;
        }
    
        get roomDetails() {
            return this.f.roomDetails as FormArray;
        }
    
        addRoomDetail(index) {
            const roomDetailFormGroup = this.fb.group({
                passengerName: new FormControl(this.updateData.PaxDetails[index].first_name + ' ' + this.updateData.PaxDetails[index].last_name, [Validators.required]),
                RoomId: new FormControl(this.updateData.PaxDetails[index].room_number, [Validators.required]),
                max_occupancy: new FormControl('', [Validators.required]),
                isClubBooking: new FormControl(false, [Validators.required]),
            });
            let room_number=this.updateData.PaxDetails[index].room_number.toString();
            if (!this.roomList.includes(room_number)) {
                this.roomList.push(room_number);
            }
            this.roomDetails.push(roomDetailFormGroup);
        }
    
        filterHotelNames(value: string): string[] {
            //this.hotelSelected = false;
            const filterValue = value.toLowerCase();
            return this.hotelNames.filter(hotel => hotel.HotelName.toLowerCase().includes(filterValue));
        }
    
    
        clearHotelName(value) {
            if(value=='ICICI'){
                this.hotelSelected=true;
                this.cdr.detectChanges();
            }
            this.updateHotelConfig.get('HotelName').setValue('');
        }
    
        onSubmit() {
            if (this.updateHotelConfig.invalid || !this.stateSelected || !this.hotelSelected) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            this.loading = true;
            const bookingDetails = this.updateHotelConfig.getRawValue();
            if (bookingDetails.HotelCheckIn) {
                bookingDetails.HotelCheckIn = moment(bookingDetails.HotelCheckIn).format('YYYY-MM-DD')
            }
            if (bookingDetails.HotelCheckOut) {
                bookingDetails.HotelCheckOut = moment(bookingDetails.HotelCheckOut).format('YYYY-MM-DD')
            }
            const propertiesToConvertToNumber = ['single_TotalFare', 'double_TotalFare'];
            for (const property of propertiesToConvertToNumber) {
                if (bookingDetails[property]) {
                    bookingDetails[property] = +bookingDetails[property];
                }
            }
            bookingDetails.GuesthouseName = this.updateHotelConfig.get('HotelName').value;
            bookingDetails.City = this.updateData.City;
            bookingDetails.Location=this.updateData.Location;
            bookingDetails.HotelCode = this.hotelCode;
            bookingDetails.roomDetails = this.setRoomDetails(bookingDetails);
            bookingDetails.single_room_charges = this.setSingleRoomCharge(bookingDetails);
            bookingDetails.double_room_charges = this.setDoubleRoomCharge(bookingDetails);
            delete bookingDetails.supplier_supplementary_charge;
            bookingDetails.Club = this.setClubDetails(bookingDetails);
            bookingDetails.AppReference=this.updateData.app_reference
            let payload = this.generateUpdateHotelDetails(bookingDetails);
            delete payload.BookingDetails.state;
            delete payload.BookingDetails.status;
            delete payload.BookingDetails.AppReference;
            this.updateHotelDetails(payload);
        }
    
        setRoomDetails(bookingDetails) {
            let rooomDetails = bookingDetails.roomDetails;
            let roomDetail = [];
            for (let i = 0; i < rooomDetails.length; i++) {
                let room = {
                    'RoomId': +(rooomDetails[i].RoomId),
                    'max_occupancy': rooomDetails[i].isClubBooking ? 2 : +(rooomDetails[i].max_occupancy),
                    'isClubBooking': (rooomDetails[i].isClubBooking)
                }
                roomDetail.push(room);
            }
            return roomDetail;
        }
    
        setClubDetails(bookingDetails) {
            let club = {
                'RoomId': +(bookingDetails.RoomId),
                'person_name': bookingDetails.person_name,
                'cost_center': bookingDetails.cost_center,
                'request_id': bookingDetails.request_id,
                'emp_id': bookingDetails.emp_id,
                'Department':bookingDetails.Department,
                'EmployeeBand':bookingDetails.EmployeeBand,
                'MobileNo':bookingDetails.MobileNo,
                'Email':bookingDetails.Email
            }
            delete bookingDetails.RoomId;
            delete bookingDetails.person_name;
            delete bookingDetails.cost_center;
            delete bookingDetails.request_id;
            delete bookingDetails.emp_id;
            delete bookingDetails.Department;
            delete bookingDetails.EmployeeBand;
            delete bookingDetails.MobileNo;
            delete bookingDetails.Email;
            return club;
        }
    
        setSingleRoomCharge(bookingDetails) {
            const {
                single_basic_fare,
                single_client_supplementary_charge,
                single_Tax,
                single_TotalFare,
                single_supplier_basic,
                single_supplier_supplementary_charge,
                single_supplier_tax,
                single_supplier_payable
            } = bookingDetails;
    
            const single_room_charges = {
                basic_fare: single_basic_fare,
                client_supplementary_charge: single_client_supplementary_charge,
                Tax: single_Tax,
                TotalFare: single_TotalFare,
                supplier_basic: single_supplier_basic,
                supplier_supplementary_charge: single_supplier_supplementary_charge,
                supplier_tax: single_supplier_tax,
                supplier_payable: single_supplier_payable
            };
    
            // Remove the original properties
            delete bookingDetails.single_basic_fare;
            delete bookingDetails.single_client_supplementary_charge;
            delete bookingDetails.single_Tax;
            delete bookingDetails.single_TotalFare;
            delete bookingDetails.single_supplier_basic;
            delete bookingDetails.single_supplier_supplementary_charge;
            delete bookingDetails.single_supplier_tax;
            delete bookingDetails.single_supplier_payable;
    
            return single_room_charges;
        }
    
        setDoubleRoomCharge(bookingDetails) {
            const {
                double_basic_fare,
                double_client_supplementary_charge,
                double_Tax,
                double_TotalFare,
                double_supplier_basic,
                double_supplier_supplementary_charge,
                double_supplier_tax,
                double_supplier_payable
            } = bookingDetails;
    
            const double_room_charges = {
                basic_fare: double_basic_fare,
                client_supplementary_charge: double_client_supplementary_charge,
                Tax: double_Tax,
                TotalFare: double_TotalFare,
                supplier_basic: double_supplier_basic,
                supplier_supplementary_charge: double_supplier_supplementary_charge,
                supplier_tax: double_supplier_tax,
                supplier_payable: double_supplier_payable
            };
    
            // Remove the original properties
            delete bookingDetails.double_basic_fare;
            delete bookingDetails.double_client_supplementary_charge;
            delete bookingDetails.double_Tax;
            delete bookingDetails.double_TotalFare;
            delete bookingDetails.double_supplier_basic;
            delete bookingDetails.double_supplier_supplementary_charge;
            delete bookingDetails.double_supplier_tax;
            delete bookingDetails.double_supplier_payable;
            return double_room_charges;
        }
    
        setCurrentInput(t) {
            this.dropDownCity = t;
        }
    
        updateHotelDetails(cleanedBookingDetails) {
            this.subs.sink = this.apiHandlerService.apiHandler('updateBooking', 'post', {}, {}, cleanedBookingDetails)
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.swalService.alert.success(resp.Message);
                        this.back.next(true)
                    }
                    else {
                        this.loading = false;
                        this.swalService.alert.oops(resp.Message);
                        this.back.next(true)
                    }
                }, (errorResponse) => {
                    this.loading = false;
                    this.swalService.alert.oops("Unable To Update");
                    this.back.next(true)
                });
        }
    
    
        onReset() {
            this.updateHotelConfig.reset();
        }
    
        onFileReset() {
            this.updateHotelConfig.reset();
        }
    
        getDynamicCity(event: any): void {
            let city = `${event.name} (${event.state_code})`;
            if (city) {
                if (event.inputFor === 'state') {
                    this.updateHotelConfig.get('state').patchValue(city);
                    this.stateSelected = true;
                }
            }
        }
    
        getSearchedList(event: any): void {
            if (event && event.target.value) {
                this.stateSelected = false;
                const state_name = `${event.target.value}`.trim();
                if (state_name) {
                    this.apiHandlerService.apiHandler('hotelStates', 'POST', '', '', { state_name })
                        .pipe(
                            shareReplay(1),
                            untilDestroyed(this)
                        )
                        .subscribe((resp: any) => {
                            if (resp.Status) {
                                this.searchedList = resp.data;
                            } else {
                                const msg = resp['Message'];
                                this.searchedList = [];
                            }
    
                        });
                }
                else {
                    this.searchedList = [];
                }
            }
            else {
                this.stateSelected = false;
            }
    
        }
    
    
        isCurrentInput(t) {
            return this.dropDownCity == t;
        }
    
    
        getHotelList() {
            this.subs.sink = this.apiHandlerService.apiHandler('hotelNames', 'POST', '', '', {}).subscribe(resp => {
                this.hotelNames = resp.data;
                this.filteredHotelNames = this.updateHotelConfig.controls.HotelName.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterHotelNames(value))
                );
            })
        }
    
        onOptionSelected(event: MatAutocompleteSelectedEvent) {
            this.hotelSelected = true;
            const selectedHotelName = event.option.viewValue;
            this.hotelCode = event.option.id;
        }
    
        removeEmptyValues(obj) {
            for (const key in obj) {
                if (obj[key] === 0 || obj[key] === "") {
                    delete obj[key];
                }
            }
            return obj;
        }
    
    
        generateUpdateHotelDetails(cleanedBookingDetails) {
            const passengerDetails = this.setPaxDetails();
            const bookingRequest = {
                BookingDetails: cleanedBookingDetails,
                status: cleanedBookingDetails.status,
                created_by_id: +(this.updateData.created_by_id),
                UserType: "B2B",
                select_reason: '',
                other_reason: '',
                gender: this.updateData.PaxDetails[0].Gender,
                IciciHotelBookingRef: this.updateData.request_id,
                NoOfRooms: +(cleanedBookingDetails.roomDetails.length),
                AppReference: cleanedBookingDetails.AppReference,
                Email: this.updateData.email,
                booking_reference: this.updateData.app_reference,
                RoomDetails: [
                    {
                        PassengerDetails: passengerDetails,
                        AddressDetails: {
                            Title: '',
                            FirstName: passengerDetails[0].FirstName,
                            LastName: passengerDetails[0].LastName,
                            Address: cleanedBookingDetails.HotelAddress,
                            Address2: cleanedBookingDetails.HotelAddress,
                            City: '',
                            State: cleanedBookingDetails.state,
                            PostalCode: '',
                            Email: this.updateData.email,
                            PhoneCode: '+91',
                            Contact: cleanedBookingDetails.HotelContactNo,
                            Country: 'IND',
                        },
                    },
                ],
                booking_source: 'TLAPNO00003',
                BookingSource: 'B2B',
            };
    
            return bookingRequest;
        }
    
        setPaxDetails() {
            const roomDetails = this.updateHotelConfig.get('roomDetails') as FormArray;
            const passengerDetails = this.updateData.PaxDetails.map((data, index) => ({
                Title: data.title,
                FirstName: data.first_name,
                LastName: data.last_name,
                Dob: '',
                PassengerSelectionAdult: '',
                RoomId:data.room_number,
                PanNumber: '',
                PassportNumber: '',
                Age: '',
                PaxType: data.pax_type,
                LeadPassenger: true,
                Email: data.email,
                EmployeeId: data.EmployeeId,
                MobileNo: data.phone,
                Department: data.Department,
                EmployeeBand: data.EmployeeBand,
                Gender: data.Gender,
                EmployeeCostCenter:data.EmployeeCostCenter
            }));
            return passengerDetails;
        }
    
    
    
        getFormattedStatus(status: string) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
        }
    
        onChange(event: Event, control) {
            if (control == 'checkin_time') {
                this.updateHotelConfig.patchValue({
                    checkin_time: event
                })
            }
            else {
                this.updateHotelConfig.patchValue({
                    checkout_time: event
                })
            }
        }
    
        setSelectedRoom(value) {
            const roomDetails = this.updateHotelConfig.get('roomDetails') as FormArray;
            roomDetails.controls.forEach((roomDetail, index) => {
                const roomNumber = roomDetail.get('RoomId').value;
                const max_occupancy = roomDetail.get('max_occupancy').value;
    
                if (roomNumber === value && max_occupancy === '1') {
                    roomDetail.patchValue({
                        'isClubBooking': true
                    });
                } else {
                    roomDetail.patchValue({
                        'isClubBooking': false
                    });
                }
            });
        }
    
        setRoomId(value) {
            this.updateHotelConfig.patchValue({
                is_club_booking: false
            });
            this.setClubStatus();
            this.setClubBooking(false);
    
        }
    
        onChangeStar(event: Event) {
            this.updateHotelConfig.patchValue({
                StarRating: event
            })
        }
    
        setMaxOccupancy(value) {
            this.showTarrifDetails();
        }
    
        setClubBooking(status) {
            if (status) {
                this.updateHotelConfig.patchValue({
                    is_club_booking: true
                });
                this.enableDoubleTarrief = false;
                this.enableSingleTarrief = false;
                this.showDiv.club = status === true; // Convert the string to a boolean
            }
            else {
                this.updateHotelConfig.patchValue({
                    is_club_booking: false
                });
    
                this.showDiv.club = false; // Convert the string to a boolean
            }
            this.setClubStatus();
            this.showTarrifDetails();
        }
    
        setClubStatus() {
            const roomDetails = this.updateHotelConfig.get('roomDetails') as FormArray;
            roomDetails.controls.forEach(roomDetail => {
                roomDetail.patchValue({
                    isClubBooking: false
                })
            });
            this.updateHotelConfig.patchValue({
                RoomId: ''
            })
    
        }
    
        noWhitespaceValidator(control) {
            const isWhitespace = (control.value || '').trim().length === 0;
            const isValid = !isWhitespace;
            return isValid ? null : { 'whitespace': true };
          }
    
        ngOnDestroy(): void {
        }
    
}

