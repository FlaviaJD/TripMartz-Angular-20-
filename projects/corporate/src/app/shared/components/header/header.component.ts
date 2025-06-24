import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ThemeOptions} from '../../../theme-options';
import { HeaderService } from '../../../modules/header/header.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  loggedInUser: any;
  paymentMode: any;
  isCRedit: boolean;
  subSink = new SubSink();
  agentData: any;

  constructor(public globals: ThemeOptions,
    private cdr: ChangeDetectorRef,
    private headerService:HeaderService,
    private apiHandlerService: ApiHandlerService,
  ) {
    this.loggedInUser = JSON.parse(localStorage.getItem('currentCorpUser'));
    const paymentMode = this.loggedInUser.payment_mode ? JSON.parse(this.loggedInUser.payment_mode) : '';
    this.isCRedit = paymentMode ? paymentMode.some(mode => mode.includes('credit') || mode.includes('debit')) : '';
    this.headerService.corporateData.subscribe(user => {
      this.getAgentById();
    });
  }

  getAgentById() {
    if (this.loggedInUser) {
        let userId=this.loggedInUser.id;
        if (this.loggedInUser.auth_role_id && this.loggedInUser.auth_role_id==5){
            userId=this.loggedInUser.created_by_id; // Added to show agents balance to subagent
        }
        this.subSink.sink = this.apiHandlerService.apiHandler('getAgentById', 'POST', {}, {}, { "id": userId })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.agentData = res.data;
                }
            });
    }
}

  @HostBinding('class.isActive')
  get isActiveAsGetter() {
    return this.isActive;
  }

  isActive: boolean;

  @select('config') public config$: Observable<any>;

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  toggleHeaderMobile() {
    this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
  }

}
