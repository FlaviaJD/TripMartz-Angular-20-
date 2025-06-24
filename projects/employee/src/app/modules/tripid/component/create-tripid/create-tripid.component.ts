import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiHandlerService } from 'projects/employee/src/app/core/api-handlers';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { TripIdService } from '../../services/trip-id.service';

@Component({
    selector: 'app-create-tripid',
    templateUrl: './create-tripid.component.html',
    styleUrls: ['./create-tripid.component.scss']
})
export class CreateTripidComponent implements OnInit {
    regConfig: FormGroup;
    private subSunk = new SubSink();
    dropdownSettings: IDropdownSettings;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    updateData;
    isUpdate:boolean=false;
    cityDropdownList = [];
    selectedcityList = [];
    minDate;
    services = [
        {
            "value": "Flight",
            "name": "Flight",
            "isChecked":true
        },
        {
            "value": "Hotel",
            "name": "Hotel",
            "isChecked":true
        },
        {
            "value": "Car",
            "name": "Car",
            "isChecked":true
        },
        {
            "value": "Train",
            "name": "Train",
            "isChecked":true
        },
        {
            "value": "Bus",
            "name": "Bus",
            "isChecked":true
        }

    ]
    checkedServices: string[] = [];
    toDateMin= new Date();
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private router: Router,
        private tripService:TripIdService
    ) {
        this.minDate= new Date();
        this.createForm();
        
        this.setUpdateData();
    }

    ngOnInit() {

    }

    createForm() {
        this.regConfig = this.fb.group({
            TripName: new FormControl('', [Validators.required]),
            ServiceList: new FormControl(''),
            FromDate: new FormControl('', [Validators.required]),
            ToDate: new FormControl('', [Validators.required]),
        }, { validators: this.dateRangeValidator });
        this.regConfig.get('FromDate').valueChanges.subscribe(fromDate => {
            if (fromDate) {
              this.toDateMin = new Date(fromDate);
            } else {
              this.toDateMin = undefined;
            }
            //this.checkDateRange();
          });
    }

    // checkDateRange() {
    //     const fromDate = this.regConfig.get('FromDate')?.value;
    //     const toDate = this.regConfig.get('ToDate')?.value;
    
    //     if (fromDate && toDate && new Date(toDate) <= new Date(fromDate)) {
    //       this.regConfig.get('ToDate')?.setErrors({ dateRangeInvalid: true });
    //     } else {
    //       this.regConfig.get('ToDate')?.setErrors(null);
    //     }
    //   }

    onItemSelect(item: any) {
        if (this.selectedcityList.length === 0 || !this.selectedcityList.some(airline => airline.name === item.name)) {
            this.selectedcityList.push(item);
        }
    }

    onSelectAll(items: any) {
        this.selectedcityList = this.cityDropdownList;
    }

    onItemDeSelect(item: any) {
        this.selectedcityList = this.selectedcityList.filter(airline => airline.name !== item.name);
    }


    onSubmit() {
        if (!this.regConfig.valid) {
            return;
        }
        this.createTripId();
    }

    createTripId() {
        let payload = this.regConfig.value;
        this.checkedServices = this.checkedServices.filter(service => service !== '');
        payload.ServiceList=this.checkedServices.join(',');
        payload.FromDate = moment(payload.FromDate, 'DD-YYYY-MM').format('YYYY-MM-DD');
        payload.ToDate = moment(payload.ToDate, 'DD-YYYY-MM').format('YYYY-MM-DD');
        this.subSunk.sink = this.apiHandlerService.apiHandler('createTripId', 'POST', '', '', payload)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.swalService.alert.success("Trip added successfully.");
                    this.regConfig.reset();
                    this.router.navigate(['/tripid/tripid-list']);
                } else {
                    this.swalService.alert.oops(res.Message);
                }
            }, (err) => {
                this.swalService.alert.oops(err.error.Message);
            });
    }

    update(){
        if (!this.regConfig.valid) {
            return;
        }
        this.updateTripId();
    }

    updateTripId() {
        let payload = this.regConfig.value;
        payload.id=this.updateData.id;
        this.checkedServices = this.checkedServices.filter(service => service !== '');
        payload.ServiceList=this.checkedServices.join(',');
        payload.FromDate = moment(payload.FromDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        payload.ToDate = moment(payload.ToDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateTripId', 'POST', '', '',payload)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.swalService.alert.success("Trip updated successfully.");
                    this.regConfig.reset();
                    this.router.navigate(['/tripid/tripid-list']);
                } else {
                    this.swalService.alert.oops(res.Message);
                }
            }, (err) => {
                this.swalService.alert.oops(err.error.Message);
            });
    }

    onServiceChange(value, isChecked: boolean) {
        value.isChecked=isChecked;
        let service=value.value;
        if (isChecked) {
            this.checkedServices.push(service);
        } else {
            const index = this.checkedServices.indexOf(service);
            if (index !== -1) {
                this.checkedServices.splice(index, 1);
            }
        }
    }

    setUpdateData() {
        this.tripService.tripData.subscribe(res => {
            if (Object.keys(res).length>0) {
                this.isUpdate=true;
                this.updateData=res;
                let fromDate = moment(res.FromDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
                let toDate = moment(res.ToDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
                let services = res.ServiceList.includes(',') ? (res.ServiceList.split(',')) : (res.ServiceList.split(','));
                this.checkedServices=services;
                this.regConfig.patchValue({
                    TripName: res.TripName,
                    Attribute: res.Attribute,
                    FromDate: fromDate,
                    ToDate: toDate,
                    ServiceList:res.ServiceList
                });
                this.services.forEach(service => {
                    if (services.includes(service.value)) {
                        service.isChecked = true;
                    } else {
                        service.isChecked = false;
                    }
                });
                
            }
        });
    }

    dateRangeValidator(group: FormGroup) {
        const fromDate = group.get('FromDate').value;
        const toDate = group.get('ToDate').value;
        if (fromDate && toDate && new Date(toDate) <= new Date(fromDate)) {
            return { dateRangeInvalid: true };
        }
        return null;
    }

    onReset(){
        this.regConfig.reset();
    }

}
