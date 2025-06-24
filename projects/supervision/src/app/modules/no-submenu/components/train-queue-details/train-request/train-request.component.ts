import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { Location } from '@angular/common';

@Component({
  selector: 'app-train-request',
  templateUrl: './train-request.component.html',
  styleUrls: ['./train-request.component.scss']
})
export class TrainRequestComponent implements OnInit {

    private subSunk = new SubSink();
    loading: boolean = false;
    app_reference: "";
    voucherData: any;
  constructor(private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private location: Location
    ) { }

 
  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
        this.app_reference = (queryParams['appReference']);
    });
    this.getTrainVoucher();
}

goBack(): void {
    this.location.back();
  }

getTrainVoucher() {
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('trainVoucher', 'post', {}, {},
        {
            "app_reference": this.app_reference,
        })
        .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.voucherData = resp.data[0] || [];
                this.loading = false;
            }
            else {
                this.loading = false;
                this.swalService.alert.error(resp.msg || '');
            }
        }, err => {
            this.loading = false;
        });
}

getFormtedStatus(status: string) {
    let tmpStatus = status.split('_');
    return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
}
}
