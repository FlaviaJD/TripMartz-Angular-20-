import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MarkupService } from '../../../markup.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

let respDataCopy: Array<any> = [];
const baseUrl = environment.image_url;

@Component({
    selector: 'app-corporate-markup-detail',
    templateUrl: './corporate-markup-detail.component.html',
    styleUrls: ['./corporate-markup-detail.component.scss']
})
export class AgentMarkupDetailComponent implements OnInit, OnDestroy {

    @Output() toUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchForm: FormGroup;
    noData: boolean = true;
    markupList: Array<any> = [];
    agentList: any;
    agencyDetails: any;
    airlineLogoUrl = baseUrl+"/airline_logo/";
    filteredOptions: Observable<string[]>;
    markup_id:string="";
    selectedValue:string="";

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'airline_type', value: 'Airline Type' },
        { key: 'airline_name', value: 'Airlines' },
        { key: 'fare_type', value: 'Fare Type' },
        { key: 'policy_type', value: 'Policy Type' },
        { key: 'policy_markup_type', value: 'Mark Added On' },
        { key: 'value_type', value: 'Mark Type' },
        { key: 'value', value: 'Value' },
        { key: 'segments', value: 'Segment List' },
        { key: 'action', value: 'Action' }
    ];
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private markupService: MarkupService,
        private cd: ChangeDetectorRef,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.markupService.agentMarkupDetails.subscribe(res => {
            if (Object.keys(res).length > 0) {
                this.agencyDetails = res;
                this.selectedValue=this.agencyDetails.business_name+' ('+this.agencyDetails.uuid+')';
                this.markup_id= this.agencyDetails.auth_user_id;
                this.searchForm = this.fb.group({
                    markup_id: new FormControl(this.selectedValue, [Validators.maxLength(120)])
                });
                this.onSearchSubmit();
            } else {
                this.searchForm = this.fb.group({
                    markup_id: new FormControl('', [Validators.maxLength(120)])
                });
            }
        });
        this.getAgentsList();
        
    }

    setFilteredmarkup_id() {
        this.filteredOptions = this.searchForm.controls.markup_id.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }


    onSearchSubmit() {
        let authUserId = this.markup_id;
        this.noData = true;
        this.markupList = [];
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, {
            auth_user_id: authUserId,
            module_type: "corporate_flight",
            is_deleted: 1
        }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.markupList = resp.data || [];
                this.agencyDetails = resp.data.length > 0 ? resp.data[0].authUser : "";
            }
        })
    }

    getAgentsList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.CORPORATE_AUTH_ROLE_ID })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.agentList = resp.data || [];
                    this.setFilteredmarkup_id();
                }
                else {

                }
            });
    }

    onReset() {
        this.searchForm.reset();
        this.markup_id="";
        if (!this.markupList.length) {
            this.getB2bMarkupList();
        }
    }

    getB2bMarkupList() {
        let req = {};
        req['module_type'] = 'corporate_flight';
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bMarkupList', 'post', {}, {}, req).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.noData = false;
                this.markupList = resp.data || [];
                respDataCopy = JSON.parse(JSON.stringify(resp.data));
            }
        })
    }

    updateMarkup(data) {
        this.markupService.toUpdateData.next(data);
        this.markupService.selectedAgent.next(this.selectedValue);
        this.toUpdate.emit({ tabId: 'default_markup', data });
    }


    deleteMarkup(data) {
        this.swalService.alert.delete(willDelete => {
            if (willDelete) {
                this.delete(data.id);
            } else {
            }
        })
    }

    delete(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deleteMarkup', 'post', {}, {}, { id: id, is_deleted: 0 }).subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.onSearchSubmit();
            }
        })
    }

    getFormattedSegment(segment) {
        let segment_list = JSON.parse(segment);
        return segment_list;
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.agentList.filter(option => (option.business_name+' ('+ option.uuid+')').toLowerCase().includes(filterValue));
      }

      onSelectionChanged(event) {
        this.markup_id= event.option.id;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
        this.cd.detach();
        this.markupService.agentMarkupDetails.next({});
    }

}
