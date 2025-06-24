
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ActivatedRoute, Router } from '@angular/router';

const log = new Logger('support ticket/SentCallbackComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];


@Component({
    selector: 'app-partcipants-list',
    templateUrl: './partcipants-list.component.html',
    styleUrls: ['./partcipants-list.component.scss']
  })
export class PartcipantsListComponent implements OnInit {
    regConfig: FormGroup;
    isOpen = false as boolean;
    protected subs = new SubSink();
    noData: boolean = true;
    respData: Array<any> = [];
    maxDate = new Date();
  
    pageSize = 6;
    page = 1;
    collectionSize: number;
    private subSunk = new SubSink();
  
    constructor(
      private swalService: SwalService,
      private apiHandlerService: ApiHandlerService,
      private utility: UtilityService,
      private fb: FormBuilder,
      private exportAsService: ExportAsService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
    ) { }
  
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(q => {
            if (!this.utility.isEmpty(q)) {
                this.getTrainingDetails({ id: q.id });
            }
        });
     
    }
    getTrainingDetails(reqBody) {
      this.noData = true;
      this.respData = [];
      this.subs.sink = this.apiHandlerService.apiHandler('getTrainingDetails', 'POST', {}, {},reqBody).subscribe(res => {
        if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
          this.noData = false;
          this.respData = res.data
          respDataCopy = [...this.respData];
          this.collectionSize = respDataCopy.length;
  
        } else {
          this.respData = [];
          this.noData = false;
        }
      }, (err: HttpErrorResponse) => {
        this.respData = [];
        this.noData = false;
      }
      );
    }
    getSplit(t) {
        let emp_count =t.split(",");
        return emp_count.length;
    }
  
  }
  
