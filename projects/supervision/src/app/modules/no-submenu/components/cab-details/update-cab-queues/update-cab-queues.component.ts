import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-update-cab-queues',
    templateUrl: './update-cab-queues.component.html',
    styleUrls: ['./update-cab-queues.component.scss']
})
export class UpdateCabQueuesComponent implements OnInit {

    updateHotelConfig: FormGroup;
    propertyList: Array<string> = ['TripMartz', 'DCB']
    paymentModeList: Array<string> = ['Dirrect Payment By Guest', 'Entire BTC']
    earlyCheckinList: Array<string> = ['Yes', 'No']
    statusList: Array<string> = ['BOOKING_CONFIRMED'];
    roomList: Array<string> = ['0', '1', '2']
    voucherList: Array<string> = ['single', 'double']
    @Input() cabUpdateData: any;
    @Output() back = new EventEmitter<any>();
    protected subs = new SubSink();
    vechileType: Array<any> = ['Sedan', 'Hatch-Pack', 'SUV', 'XUV', 'Luxury']
    times: string[] = [
        '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
        '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
        '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
        '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
        '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
        '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
    ];
    loading:boolean=false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.updateHotelConfig = this.fb.group({
            id: new FormControl(this.cabUpdateData.UserId, [Validators.required]),
            CompanyName: new FormControl(this.cabUpdateData.CarDetails.CompanyName, [Validators.required]),
            EmployeeCode: new FormControl(this.cabUpdateData.CarDetails.EmployeeCode, [Validators.required]),
            BillingEntityName: new FormControl(this.cabUpdateData.CarDetails.BillingEntityName, [Validators.required]),
            City: new FormControl(this.cabUpdateData.CarDetails.City, [Validators.required]),
            MobileNo: new FormControl(this.cabUpdateData.MobileNo, [Validators.required]),
            EmployeeEmail: new FormControl(this.cabUpdateData.CarDetails.EmployeeEmail, [Validators.required]),
            VehicleType: new FormControl(this.cabUpdateData.CarDetails.VehicleType, [Validators.required]),
            Appreference: new FormControl(this.cabUpdateData.AppReference, [Validators.required]),
            DriverName: new FormControl(this.cabUpdateData.CarDetails.DriverName, [Validators.required]),
            DriverPhone: new FormControl(this.cabUpdateData.CarDetails.DriverPhone, [Validators.required]),
            PickupAddress: new FormControl(this.cabUpdateData.CarDetails.PickupAddress, [Validators.required]),
            DropAddress: new FormControl(this.cabUpdateData.CarDetails.DropAddress, [Validators.required]),
            ReportingTime: new FormControl(this.cabUpdateData.CarDetails.PickupTime, [Validators.required]),
            ReportingAddress: new FormControl(this.cabUpdateData.CarDetails.PickupAddress, [Validators.required]),
            //BookedBy: new FormControl(this.cabUpdateData.CarDetails.BookedBy, [Validators.required]),
            Usage: new FormControl(this.cabUpdateData.CarDetails.Usage, [Validators.required]),
            SpecialInstructionIfany: new FormControl(this.cabUpdateData.CarDetails.SpecialInstructionIfany, [Validators.required]),
            booking_status: new FormControl("BOOKING_CONFIRMED", [Validators.required]),
        }
        );
        this.updateHotelConfig.get('Appreference').disable();
    }

    onSubmit() {
        if (!(this.updateHotelConfig.valid)) {
            return;
        }
        this.updateCarDetails(this.updateHotelConfig.value);
    }

    onDropUpChange(event: Event) {
        this.updateHotelConfig.patchValue({
            VehicleType: event
        })
    }


    onReset() {
        this.updateHotelConfig.reset();
    }

    updateCarDetails(reqBody) {
        this.loading=true;
        this.subs.sink = this.apiHandlerService.apiHandler('updateCar', 'post', {}, {}, reqBody)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.loading=false;
                    this.swalService.alert.success(resp.Message);
                    this.back.next(true)
                }
                else{
                    this.loading=false;
                    this.swalService.alert.success(resp.Message);
                    this.back.next(true);
                }
            }, err => {
                this.loading=false;
                this.back.next(true);
                this.swalService.alert.oops("Unable to update");
            });
            
    }

    onFileReset() {
        this.updateHotelConfig.reset();
    }

    getFormattedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    onChange(event: Event, control) {
        if (control == 'ReportingTime') {
            this.updateHotelConfig.patchValue({
                ReportingTime: event
            })
        }
    }
}
