import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { CmsService } from '../../../../cms.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
@Component({
    selector: 'app-agent-add-update-content',
    templateUrl: './agent-add-update-content.component.html',
    styleUrls: ['./agent-add-update-content.component.scss']
})
export class AgentAddUpdateContentComponent implements OnInit, OnDestroy {
    @Output() staticContentTab = new EventEmitter<any>();

    regConfig: FormGroup;
    ckeditorContent = "Some Text";
    addOrUpdate;
    private subSunk = new SubSink();
    Positions = [
        { id: 1, name: "Top" },
        { id: 2, name: "Bottom" },
        { id: 3, name: "Both" },
    ]
    TitleList = [
        { id: 1, name: "Our Company" },
        { id: 2, name: "Legal" },
        { id: 3, name: "Connect With Us" },
    ]

    public model = {
        editorData: ''
    };
    public editorConfig = {
        type: "divarea",
        uiColor: '#FFFFFF',
        forcePasteAsPlainText: true,
        allowedContent: false,
    }
    constructor(
        private fb: FormBuilder,
        private utility: UtilityService,
        private cmsService: CmsService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
        this.createForm();
        this.getToUpdate();
    }

    createForm() {
        this.regConfig = this.fb.group({
            id: new FormControl(''),
            title: new FormControl('',[Validators.required]),
            page_title: new FormControl('', [Validators.required]),
            page_description: new FormControl('', [Validators.required]),
            page_seo_title: new FormControl('', [Validators.required]),
            page_seo_keyword: new FormControl('', [Validators.required]),
            page_seo_description: new FormControl('', [Validators.required]),
            page_redirection_url: new FormControl('', [Validators.required]),
            page_position: new FormControl('', [Validators.required]),
        });
    }

    omitSpecialCharacters(event) {
        return this.utility.omitSpecialCharacters(event);
    }
    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }
    getToUpdate() {

        this.subSunk.sink = this.cmsService.StaticContent.subscribe(data => {
            if (!this.utility.isEmpty(data)) {

                this.addOrUpdate = 'update';
                this.regConfig.patchValue({
                    id: data.id ? data.id : '',
                    page_title: data.page_title ? data.page_title : '',
                    page_seo_title: data.page_seo_title ? data.page_seo_title : '',
                    page_description: data.page_description ? data.page_description : '',
                    page_seo_keyword: data.page_seo_keyword ? data.page_seo_keyword : '',
                    page_seo_description: data.page_seo_description ? data.page_seo_description : '',
                    page_position: data.page_position ? data.page_position : '',
                    page_redirection_url: data.page_redirection_url ? data.page_redirection_url : '',
                    status: data.status ? data.status : '',

                }, { emitEvent: false })
                this.model.editorData=data.page_description;
            } else {
                this.addOrUpdate = 'add';
            }
        })
    }

    onChange($event: any): void {
    }

    onPaste($event: any): void {
    }
    
    onSubmit() {
        if (this.regConfig.invalid) {
            return;
        }
        let req = JSON.parse(JSON.stringify(this.regConfig.value));
        req['data_source'] = "b2b";
        switch (this.addOrUpdate) {
            case 'add':
                delete req.id;
                delete req.title;
                this.subSunk.sink = this.cmsService.addContent(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Content added successfully.");
                            this.regConfig.reset();
                            this.staticContentTab.emit({ tabId: 'staticpage_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops();
                    })
                break;
            case 'update':
                delete req.title;
                
                this.subSunk.sink = this.cmsService.updateContent(req)
                    .subscribe(resp => {
                        if (resp.statusCode == 200 || resp.statusCode == 201) {
                            this.swalService.alert.success("Content updated successfully.");
                            this.regConfig.reset();
                            this.cmsService.StaticContent.next({});
                            this.staticContentTab.emit({ tabId: 'staticpage_list' });
                        } else {
                            this.swalService.alert.oops();
                        }
                    }, (err: HttpErrorResponse) => {
                        console.error(err);
                        this.swalService.alert.oops();
                    })
                break;
            default:
                break;
        }

    }

    onReset(){
        this.cmsService.StaticContent.next({});
        this.regConfig.reset();
        this.addOrUpdate = 'add';
        this.regConfig.patchValue({
            page_description: '',
        })
    }
    

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
