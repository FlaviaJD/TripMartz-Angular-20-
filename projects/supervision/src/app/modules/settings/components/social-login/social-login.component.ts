import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

const log = new Logger('SocialLoginComponent');

@Component({
    selector: 'app-social-login',
    templateUrl: './social-login.component.html',
    styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit, OnDestroy {
    dataNotFound: boolean = false;
    socialLoginData: any;
    displayColumn: string[] = ['Sl No.', 'Social Network', 'Status', 'Config Id', 'Action'];
    status; configid; isUpdated: boolean = false;
    noData:boolean=false;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService
    ) { }

    ngOnInit() {
        this.noData=true;
        this.socialLoginData=[];
        this.apiHandlerService.apiHandler('SocialLogin', 'post')
            .pipe(
                finalize(() => this.dataNotFound = false),
                untilDestroyed(this)
            )
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.socialLoginData = resp.Data;
                    this.noData=false;
                }
                else{
                    this.socialLoginData=[];
                    this.noData=false;
                }
            }, (err) => {
                this.noData = false;
                this.socialLoginData = [];
            });
    }

    update(doc): void {
        log.debug(doc);
        const data = {
            social_login_id: doc.id,
            configid: doc.configid,
            status: doc.status
        };
        this.apiHandlerService.apiHandler('UpdateSocialLogin', 'post', {}, {}, data)
        .pipe(
            finalize( () => this.isUpdated = true),
            untilDestroyed(this),
        )
        .subscribe( resp => {
            if(resp.Status && resp.Data.msg){
                this.isUpdated = true;
                log.debug(resp.Data)
                this.swalService.alert.update();
            } else {
                this.isUpdated = false;
                log.debug(resp.Data)
                this.swalService.alert.oops();

            }
        })

    }

    ngOnDestroy() {
    }

}


function getData() {
    return [
        {
            '#': 1,
            'Social Network': 'facebook',
            Status: false,
            'Config Id': '123456',
            Action: 'Update',
        },
        {
            '#': 2,
            'Social Network': 'twitter',
            Status: true,
            'Config Id': '9451387',
            Action: 'Update',
        },
        {
            '#': 3,
            'Social Network': 'googleplus',
            Status: false,
            'Config Id': '8671539',
            Action: 'Update',
        },
        {
            '#': 4,
            'Social Network': 'linkedin',
            Status: true,
            'Config Id': '421576',
            Action: 'Update',
        },
    ]
}