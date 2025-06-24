import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FinanceAirlineGSTService } from '../finance-airline-gst.service';

@Component({
  selector: 'finance-app-airline-gst-add-update',
  templateUrl: './financial-airline-gst-add-update.component.html',
  styleUrls: ['./financial-airline-gst-add-update.component.scss']
})
export class FinanceAirlineGstAddUpdateComponent implements OnInit {
    @Output() GSTCodeUpdate = new EventEmitter<any>();
    regConfig: FormGroup;
    fileConfig: FormGroup;
    subSunk = new SubSink();
    clientList: Array<any> = [];
    userTitleList: Array<any> = [];
    filteredOptions: Observable<string[]>;
    filteredAirline: Observable<string[]>;
    preferredAirlines: Array<any> = [];
    agent_id: string = "";
    airline_id: string = "";
    subscription: Subscription;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    isUpdate:boolean=false;
    dropdownList = [];
    selectedItems = [];
    selectedAirlineList = [];
    dropdownSettings: IDropdownSettings;
    airlineDropdownList = [];
    selectedAirlineCode: any;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private corporateCodeService:FinanceAirlineGSTService,
    ) { }

    ngOnInit() {
        this.isUpdate=false;
        this.createForm();
        this.getClientList();
        this.getAirlines();
        this.updatePreFilledData();
          this.dropdownSettings = {
            singleSelection: false,
            idField: 'code',
            textField: 'name',
            itemsShowLimit: 3,
            allowSearchFilter: true
          };
    }
    

    createForm() {
        this.regConfig = this.fb.group({
            CorporateId: new FormControl('', [Validators.required]),
            CorporateName: new FormControl('', [Validators.required]),
            prefered_airline: new FormControl('', [Validators.required]),
            AirlineName: new FormControl('', [Validators.required]),
            AirlineCode: new FormControl(''),
            GstOption: new FormControl('TripMartz', [Validators.required]),
            id:new FormControl(''),
            client_id:new FormControl('')
        }
        );
    }

    getClientList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.FINANCE_AUTH_ROLE_ID })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.clientList = resp.data || [];
                    this.setFilteredCorporateList();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
    }

    setFilteredCorporateList() {
        this.filteredOptions = this.regConfig.controls.CorporateName.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.clientList.filter(option => (option.business_name + ' (' + option.uuid + ')').toLowerCase().includes(filterValue));
    }

    getAirlines() {
        let tmp = [];
        this.subSunk.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'post', {}, {}, {
            "name": "",
            
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.preferredAirlines = resp.data;
                this.setFilteredAirlineList();
                this.airlineDropdownList=resp.data
            }
            
        });
        
    }

    setFilteredAirlineList() {
        this.filteredAirline = this.regConfig.controls.AirlineName.valueChanges.pipe(
            startWith(''),
            map(value => this._filterAirline(value || '')),
        );
    }

    onItemSelect(item: any) {
        // const selectedItem = {
        //     name: item.name,
        //     code: item.code
        // };
        // this.selectedAirlineList.push(selectedItem)
    }

    _filterAirline(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.preferredAirlines.filter(option => (option.name + ' (' + option.code + ')').toLowerCase().includes(filterValue));
    }

    onSelectionChanged(event) {
        this.regConfig.patchValue({
            CorporateId: event.option.id
        })
    }

    onSelection(event) {
        this.regConfig.patchValue({
            AirlineCode: event.option.id
        })
    }


    updatePreFilledData(){
        this.subSunk.sink=this.corporateCodeService.updateData.subscribe((data=>{
            let prefered_airline="All"
            if (Array.isArray(data.AirlineName)) {
                this.selectedAirlineList = data.AirlineName;
                prefered_airline = 'Specific Airlines';
            } else 
            {
                this.selectedAirlineList=data.AirlineName
            }
            if(Object.keys(data).length){
                this.isUpdate=true;
                 this.regConfig.patchValue({
                    'CorporateId':data.CorporateId,
                    'CorporateName': data.CorporateName,
                    'prefered_airline':prefered_airline,
                    'AirlineName': this.selectedAirlineList,
                    'AirlineCode':data.AirlineCode,
                    'GstOption': data.GstOption,
                    'id':data.id
                });
            }
        }))
      }
      
    onSubmit() {
        if (!this.regConfig.valid) {
            return;
        }
        const payload = this.regConfig.value;
        if (Array.isArray(payload.AirlineName)) {
            const codes = payload.AirlineName.map(airline => airline.code);
            payload.AirlineCode = codes.join(',');
        }else{
            payload.AirlineCode="All";
            payload.AirlineName="All"
        }
            this.loading = true;
        if (!this.isUpdate) {
            this.addCode(payload);
        } else {
            this.updateCode(payload);
        }
    }

    setValue(){
        this.regConfig.patchValue({AirlineName:'All'})
        this.regConfig.patchValue({AirlineCode:'All'})

    }

    addCode(payload){
        if (payload.prefered_airline == "Specific Airlines") {
            payload.AirlineName = JSON.stringify(payload.AirlineName);
        }
        delete payload.id;
        this.subSunk.sink = this.apiHandlerService.apiHandler('corporateWiseAirlineCreate', 'POST', {}, {}, payload)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.swalService.alert.success("Added Successfully.");
                    this.loading = false;
                    this.regConfig.reset();
                    this.GSTCodeUpdate.emit({ tabId: 'corporate_code_list', data:'update' });

                }
                else {
                    this.loading = false;
                    this.swalService.alert.oops("Unable To Add");
                }
            }, (err: HttpErrorResponse) => {
                this.loading = false;
                this.swalService.alert.oops("Unable To Add");
            });
    }

    updateCode(payload){
        if (payload.prefered_airline == "Specific Airlines") {
            payload.AirlineName = JSON.stringify(this.selectedAirlineList);
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('corporateWiseAirlineUpdate', 'POST', {}, {}, payload)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.swalService.alert.success("Updated Successfully.");
                    this.loading = false;
                    this.regConfig.reset();
                    this.GSTCodeUpdate.emit({ tabId: 'corporate_code_list', data:'update' });
                }
                else {
                    this.loading = false;
                    this.swalService.alert.oops("Unable To Update");
                }
            }, (err: HttpErrorResponse) => {
                this.loading = false;
                this.swalService.alert.oops("Unable To Update");
            });
    }
    

    onReset() {
        this.regConfig.reset();
    }

}
