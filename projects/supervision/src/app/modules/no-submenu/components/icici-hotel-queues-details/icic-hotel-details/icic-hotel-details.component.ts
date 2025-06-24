import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-icic-hotel-details',
  templateUrl: './icic-hotel-details.component.html',
  styleUrls: ['./icic-hotel-details.component.scss']
})
export class IcicHotelDetailsComponent implements OnInit {
    private subSunk = new SubSink();
    app_reference: "";
    loading: boolean = false;
    voucherData:any;

  constructor(private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
        this.app_reference = (queryParams['appReference']);
    });
    this.getHotelVoucher();
  }

  getHotelVoucher() {
   
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('icicHotelVoucher', 'post', {}, {},
        {
            "app_reference": this.app_reference,
        })
        .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.loading = false;
                this.voucherData = resp.data || []; ;
            }
            else {
                this.loading = false;
                this.swalService.alert.error(resp.msg || '');
            }
        }, err => {
            this.loading = false;
        });
}
}
