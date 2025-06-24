import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CorporateCodeService } from '../corporate-code.service';
@Component({
    selector: 'app-corporate-code-add-update',
    templateUrl: './corporate-code-add-update.component.html',
    styleUrls: ['./corporate-code-add-update.component.scss']
})
export class CorporateCodeAddUpdateComponent implements OnInit {

    @Output() corporateCodeUpdate = new EventEmitter<any>();
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
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private corporateCodeService:CorporateCodeService,
    ) { }

    ngOnInit() {
        this.isUpdate=false;
        this.createForm();
        this.getClientList();
        this.getAirlines();
        this.updatePreFilledData();
    }

    createForm() {
        this.regConfig = this.fb.group({
            CorporateId: new FormControl('', [Validators.required]),
            CorporateName: new FormControl('', [Validators.required]),
            AirlineName: new FormControl('', [Validators.required]),
            AirlineCode: new FormControl('', [Validators.required]),
            DomCode: new FormControl(''),
            IntCode: new FormControl(''),
            id:new FormControl('')
        }
        );
    }

    getClientList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.CORPORATE_AUTH_ROLE_ID })
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
        this.subSunk.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'post', {}, {}, {
            "name": ""
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                this.preferredAirlines = resp.data;
                this.setFilteredAirlineList();
            }
        });
    }

    setFilteredAirlineList() {
        this.filteredAirline = this.regConfig.controls.AirlineName.valueChanges.pipe(
            startWith(''),
            map(value => this._filterAirline(value || '')),
        );
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
            if(Object.keys(data).length){
                this.isUpdate=true;
                 this.regConfig.patchValue({
                    'CorporateId':data.CorporateId,
                    'CorporateName': data.CorporateName,
                    'AirlineName': data.AirlineName,
                    'AirlineCode': data.AirlineCode,
                    'DomCode': data.DomCode,
                    'IntCode': data.IntCode,
                    'id':data.id
                });
            }
        }))
      }

    onSubmit() {
        if (!this.regConfig.valid) {
            return;
        }
        const domCode = this.regConfig.get('DomCode').value;
        const intCode = this.regConfig.get('IntCode').value;
        if (domCode === '' || intCode === '') {
            this.swalService.alert.oops("Domestic and International Corporate Code Can't Be Empty");
            return; // Exit the function if codes are empty
        }
        const payload = this.regConfig.value;
        this.loading = true;
        if (!this.isUpdate) {
            this.addCode(payload);
        } else {
            this.updateCode(payload);
        }
    }

    addCode(payload){
        delete payload.id;
        this.subSunk.sink = this.apiHandlerService.apiHandler('corporateFareCodeCreate', 'POST', {}, {}, payload)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.swalService.alert.success("Added Successfully.");
                    this.loading = false;
                    this.regConfig.reset();
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
        this.subSunk.sink = this.apiHandlerService.apiHandler('corporateFareCodeUpdate', 'POST', {}, {}, payload)
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.swalService.alert.success("Updated Successfully.");
                    this.loading = false;
                    this.regConfig.reset();
                    this.corporateCodeUpdate.emit({ tabId: 'corporate_code_list', data:'update' });
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
