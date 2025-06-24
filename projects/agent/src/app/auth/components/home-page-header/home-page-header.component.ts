import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from 'projects/agent/src/app/core/logger/logger.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AuthService } from '../../../core/authentication/auth.service';

const log = new Logger('auth/HomePageHeaderComponent');
@Component({
    selector: 'app-home-page-header',
    templateUrl: './home-page-header.component.html',
    styleUrls: ['./home-page-header.component.scss']
})

export class HomePageHeaderComponent implements OnInit, OnDestroy {
    protected subSunk = new SubSink();
    domainInfo: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.getDomainInfo();
    }

    getDomainInfo() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'POST', {}, {}, {})
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.domainInfo = res.data[0];
                }
            }, (err: HttpErrorResponse) => {
                log.debug(err);
                console.error(err);
            });
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
