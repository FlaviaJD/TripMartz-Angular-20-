import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';

const log = new Logger('support ticket/SentCallbackComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-training-name-list',
  templateUrl: './training-name-list.component.html',
  styleUrls: ['./training-name-list.component.scss']
})
export class TrainingNameListComponent implements OnInit {
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
  ) { }

  ngOnInit() {
    this.getTrainingNameList();
  }
  getTrainingNameList() {
    this.noData = true;
    this.respData = [];
    this.subs.sink = this.apiHandlerService.apiHandler('trainingFindAll', 'POST', {}, {}).subscribe(res => {
      if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length > 0) {
        this.noData = false;
        this.respData = res.data;
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

  onTrainingNameDelete(data){
    this.swalService.alert.delete((action)=>{
        if(action){
            //api call to delete the record 
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTrainingName', 'post', {}, {},
                    {"id":data.id})
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                        this.swalService.alert.success(`Training Name ${data.Name} has been deleted successfully`);
                        this.getTrainingNameList();
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}

}
