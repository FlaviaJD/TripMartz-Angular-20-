import {Component, HostBinding} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ThemeOptions} from '../../../theme-options';
import { ApiHandlerService } from '../../../core/api-handlers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  loggedInUser: any;
  manageDomainData: any;

  constructor(public globals: ThemeOptions, private apiHandlerService:ApiHandlerService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('currentSupervisionUser'));
    this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {}, {})
    .subscribe(resp => {
      if (resp.statusCode == 200 || resp.statusCode == 201) {
        this.manageDomainData = resp.data[0].domain_logo;
      }
    });
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
