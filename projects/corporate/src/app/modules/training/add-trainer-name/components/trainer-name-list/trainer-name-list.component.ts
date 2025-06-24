import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-trainer-name-list',
  templateUrl: './trainer-name-list.component.html',
  styleUrls: ['./trainer-name-list.component.scss']
})
export class TrainerNameListComponent implements OnInit {
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
    this.getTrainerNameList();
  }
  getTrainerNameList() {
    this.noData = true;
    this.respData = [];
    this.subs.sink = this.apiHandlerService.apiHandler('trainerNameFindAll', 'POST', {}, {}).subscribe(res => {
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



  onTrainerNameDelete(data){
    this.swalService.alert.delete((action)=>{
        if(action){
            //api call to delete the record 
            this.subSunk.sink = this.apiHandlerService.apiHandler('deleteTrainerName', 'post', {}, {},
                    {"id":data.id})
                    .subscribe(response => {
                        if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                        this.swalService.alert.success(`Trainer Name ${data.Name} has been deleted successfully`);
                        this.getTrainerNameList();
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
}
