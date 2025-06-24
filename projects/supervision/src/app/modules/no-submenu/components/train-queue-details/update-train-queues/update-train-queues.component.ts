import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-update-train-queues',
    templateUrl: './update-train-queues.component.html',
    styleUrls: ['./update-train-queues.component.scss']
})
export class UpdateTrainQueuesComponent implements OnInit {
    updateTrainConfig: FormGroup;
    statusList: Array<string> = ['BOOKING_CONFIRMED'];
    filteredCorp: Observable<string[]>;
    @Input() trainUpdateData: any;
    @Output() back = new EventEmitter<any>();
    protected subs = new SubSink();
    availablePassengers: any[] = [];
    loading:boolean=false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    minDate = new Date();
    maxDate;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    private subSunk = new SubSink();
    selectedPassenger: any[] = []; // Initialize an empty array for selected passengers
    classList: Array<{ code: string, value: string }> = [
        { code: 'SL', value: 'Sleeper' },
        { code: '1A', value: 'AC First Class' },
        { code: '2A', value: 'AC 2-Tier' },
        { code: '3A', value: 'AC 3-Tier' },
        { code: 'FC', value: 'First Class' },
        { code: 'CC', value: 'AC Chair Car' },
        { code: '2S', value: 'Second Sitting' }
    ];

    ticketStatusList: string[] = [
        'CNF','RAC','CAN','WL','GNWL','PQWL','RLWL','TQWL','NOSB'
    ];
    times: string[] = [
        '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
        '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
        '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
        '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM',
        '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM',
        '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM'
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,

    ) { }

    ngOnInit() {
        this.createForm();
        this.updateTrainConfig.get('BasicFare').valueChanges.subscribe(() => {
            this.calculateTotalFare();
        });
        this.updateTrainConfig.get('ServiceCharges').valueChanges.subscribe(() => {
            this.calculateTotalFare();
        });
        
        this.updateTrainConfig.get('SupplierBasic').valueChanges.subscribe(() => {
            this.calculateSupplierFare();
        });
        this.updateTrainConfig.get('SupplierServiceCharges').valueChanges.subscribe(() => {
            this.calculateSupplierFare();
        });
    }

    onSelectionChange(selectedPassengers: any[]) {
        this.selectedPassenger = selectedPassengers;
        // Handle any additional logic on selection change if needed
    }

    createForm() {
        this.availablePassengers = this.trainUpdateData.PaxDetails;
        this.updateTrainConfig = this.fb.group({
            // employee_no: new FormControl(this.trainUpdateData.employee_origin, [Validators.required]),
            TrainName: new FormControl('', [Validators.required,this.noWhitespaceValidator]),
            From: new FormControl(this.trainUpdateData.TrainDetails.From, [Validators.required]),
            To: new FormControl(this.trainUpdateData.TrainDetails.To, [Validators.required]),
            OnwardDate: new FormControl(this.trainUpdateData.TrainDetails.OnwardDate, [Validators.required]),
            OnwardTime: new FormControl(this.trainUpdateData.TrainDetails.OnwardTime, [Validators.required]),
            ArrivalDate: new FormControl(this.trainUpdateData.TrainDetails.ArrivalDate, [Validators.required]),
            ArrivalTimeTrain: new FormControl(this.trainUpdateData.TrainDetails.ArrivalTimeTrain, [Validators.required]),
            TrainNumber: new FormControl('', [Validators.required,this.noWhitespaceValidator]),
            PNR: new FormControl('', [Validators.required,this.noWhitespaceValidator]),
            TicketNo: new FormControl('', [Validators.required,this.noWhitespaceValidator]),
            PreferredClass: new FormControl('', [Validators.required]),
            TicketStatus: new FormControl('', [Validators.required,this.noWhitespaceValidator]),
            TicketType: new FormControl(this.trainUpdateData.TrainDetails.TicketType),
            BasicFare: new FormControl('', [Validators.required]),
            CurrentStatus: new FormControl(this.trainUpdateData.TrainDetails.CurrentStatus, [Validators.required]),
            ServiceCharges: new FormControl('', [Validators.required]),
            Tax: new FormControl('', [Validators.required]),
            TotalFare: new FormControl('', [Validators.required]),
            SupplierBasic: new FormControl('', [Validators.required]),
            SupplierServiceCharges: new FormControl('', [Validators.required]),
            SupplierTax: new FormControl('', [Validators.required]),
            SupplierPayable: new FormControl('', [Validators.required]),
            booking_status: new FormControl('BOOKING_CONFIRMED', [Validators.required]),
            TrainDetailId:new FormControl(this.trainUpdateData.TrainDetails.TrainDetailId),
            BookingType:new FormControl(this.trainUpdateData.TrainDetails.BookingType),
            CompanyName:new FormControl(this.trainUpdateData.TrainDetails.CompanyName),
            Department:new FormControl(this.trainUpdateData.PersonalDetails.Department),
            EmailId:new FormControl(this.trainUpdateData.PersonalDetails.EmailId),
            Quote:new FormControl(this.trainUpdateData.TrainDetails.Quote, [Validators.required]),
            Reason:new FormControl(this.trainUpdateData.PersonalDetails.Reason),
            Remarks:new FormControl(this.trainUpdateData.PersonalDetails.Remarks),
            image: new FormControl(null, [Validators.required]),
            file:new FormControl(null, [Validators.required])
        }
        );
    }

    onChange(event: Event) {
        this.updateTrainConfig.patchValue({
            OnwardTime: event
        })
    }

    onArrivalChange(event: Event) {
        this.updateTrainConfig.patchValue({
            ArrivalTimeTrain: event
        })
    }


    calculateTotalFare() {
        const basicFare = +this.updateTrainConfig.get('BasicFare').value || 0;
        const serviceCharge = +this.updateTrainConfig.get('ServiceCharges').value || 0;
        let tax = 0;
        let totalFare = 0;
        if (serviceCharge) {
          tax = (serviceCharge * 18) / 100;
          totalFare = basicFare + tax + serviceCharge;
        } else {
          totalFare = basicFare + serviceCharge;
        }
        // Update the tax and total_fare fields with formatted values
        this.updateTrainConfig.get('Tax').setValue((tax));
        this.updateTrainConfig.get('TotalFare').setValue((totalFare).toFixed(2));
      }
      

    calculateSupplierFare() {
        const basicFare = +this.updateTrainConfig.get('SupplierBasic').value || 0;
        const serviceCharge = +this.updateTrainConfig.get('SupplierServiceCharges').value || 0;
        let tax = 0;
        let totalFare = 0;
        if (serviceCharge) {
            tax = (serviceCharge * 18) /100;
            totalFare = basicFare + tax + serviceCharge;
        } else {
            totalFare = basicFare + serviceCharge;
        }
        // Perform the sum
        // Update the tax and total_fare fields
        this.updateTrainConfig.get('SupplierTax').setValue((tax).toFixed(2));
        this.updateTrainConfig.get('SupplierPayable').setValue((totalFare).toFixed(2));
    }
    

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    onSubmit() {
        if (this.updateTrainConfig.invalid) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (this.selectedPassenger && this.selectedPassenger.length==0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        this.loading=true;
        let payload = this.updateTrainConfig.value;
        const selectedPassengerId = this.selectedPassenger.map(passenger => passenger.id)
        payload.SelectedPassengerId = selectedPassengerId;
        payload.ArrivalDate=moment(payload.ArrivalDate).format("YYYY-MM-DD");
        const formData = new FormData();
        // Append each field to the FormData object
        Object.keys(payload).forEach(key => {
            if(key!='file'){
                if (Array.isArray(payload[key])) {
                    // If the value is an array, append each array element separately
                        formData.append(key,JSON.stringify(payload[key]));
                } else {
                    // If the value is not an array, append it as is
                    formData.append(key, payload[key]);
                }
            }
        });
        this.updateTrain(formData);

    }
    
    updateTrain(formData) {
        this.subs.sink = this.apiHandlerService.apiHandler('updateTrain', 'post', {}, {}, formData)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.loading=false;
                    this.swalService.alert.success(resp.Message);
                    this.back.next(true)
                }
                else {
                    this.loading=false;
                    this.swalService.alert.oops(resp.Message);
                    this.back.next(true)
                }
            }, (errorResponse) => {
                this.loading=false;
                this.swalService.alert.oops("Unable To Update");
                this.back.next(true)
            });
    }

    onReset() {
        this.updateTrainConfig.reset();
    }

    noWhitespaceValidator(control) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
      }

    uploadFile($event) {
        if($event.target.files.length > 0) {
            const file = $event.target.files[0];
            this.updateTrainConfig.get('image').setValue(file);
        }
    }
}
