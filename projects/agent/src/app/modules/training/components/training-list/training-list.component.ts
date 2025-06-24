import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/agent/src/app/core/api-handlers';
import { Logger } from 'projects/agent/src/app/core/logger/logger.service';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';
import { UtilityService } from 'projects/agent/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { Sort } from '@angular/material';
import * as moment from 'moment';

const log = new Logger('support ticket/SentCallbackComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent implements OnInit {
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate = new Date();
    noData: boolean = true;
    respData: Array<any> = [];
   
    pageSize = 10;
    page = 1;
    collectionSize: number;
    protected subs = new SubSink();

  constructor(
    private swalService: SwalService,
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService,
    private fb: FormBuilder,
    private exportAsService: ExportAsService,
    ) { }

  ngOnInit() {
    this.trainingDetailsList();

  }
  trainingDetailsList() {
    this.noData = true;
    this.respData = [];
    this.subs.sink = this.apiHandlerService.apiHandler('trainingDetails', 'POST', {}, {}).subscribe(res => {
        if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length>0) {          
            this.noData = false;
            this.respData = res.data;
            this.collectionSize = this.respData.length;
           
        } else {
            this.respData = [];
            this.noData = false;
            this.collectionSize = this.respData.length;
        }
    }, (err: HttpErrorResponse) => {
        this.respData = [];
        this.noData = false;
        this.collectionSize = this.respData.length;
    }
    );
}

  onValueChange(event){

  }

  timelineFilter(value){

  }

}
