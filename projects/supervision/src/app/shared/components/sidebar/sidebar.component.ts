import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ThemeOptions } from '../../../theme-options';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';
import { IPermissions } from '../../../auth/permissions.interface';
import { environment } from 'projects/supervision/src/environments/environment.prod';
const baseUrl = environment.image_url;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  manageDomainData: any;
  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {

  }

  @select('config') public config$: Observable<any>;
  logoBankUri = `${baseUrl}`;
  private newInnerWidth: number;
  private innerWidth: number;
  activeId = 'dashboardsMenu';
  private subSunk = new SubSink();
  navigationData: any;
  loggedInUser: any;
  userpermissions: IPermissions;
  USER_MANAGEMENT = 'p2';
  HOTELCRS='p120';
  GSTDETAIL='p86';
  REPORTS = 'p6';
  GROUP_BOOKING = 'p9';
  TRANSACTION_LOGS = 'p12';
  MASTER_BALANCE_MANAGER = 'p13';
  COMMISSION = 'p17';
  ACCOUNT_MANAGER = 'p20';
  MARKUP = 'p24';
  CONTENT_MANAGEMENT = 'p27';
  B2B_CMS = 'p35';
  SETTINGS = 'p105';
  MIS='p65';
  BookingQueues='p71';
  CancellationQueues='p76';
  Master='p80';
  EmployeeCMS='p89';
  AgentCMS='p90';
  Corporate='p58';
  Subadmin='p59';
  Queue='p75';
  AGENT_ACCOUNT_MANAGER = 'p21';


  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
    this.globals.sidebarHover = !this.globals.toggleSidebar
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  sidebarHoverMouseOut() {
    this.globals.sidebarHover = false;
  }

  sidebarHoverMouseIn() {
    this.globals.sidebarHover = false;
  }


  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('currentSupervisionUser'));
    this.subSunk.sink = this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {}, {})
    .subscribe(resp => {
      if (resp.statusCode == 200 || resp.statusCode == 201) {
        this.manageDomainData = resp.data[0].domain_logo;
      }
    });
    
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });
    if (this.loggedInUser && this.loggedInUser['auth_role_id'] == 3)
      this.getPrevilegeForThisUser();
    this.extraParameter = this.activatedRoute.snapshot.firstChild && this.activatedRoute.snapshot.firstChild.data.extraParameter;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }

  }

  isMenuExists(menu) {
    if (this.navigationData && this.navigationData.length > 0) {
      if (this.navigationData.some((el) => el.description == menu))
        return true;
      else
        return false;
    }
    else {
      return true;
    }
  }

  isSubMenuExists(menu, parent_key = null) {
    if (this.navigationData && this.navigationData.length > 0) {
      if (this.navigationData.some((el) => el.description == menu && el.parent_key == parent_key))
        return true;
      else
        return false;
    }
    else {
      return true;
    }
  }


  getPrevilegeForThisUser() {
    this.navigationData = JSON.parse(localStorage.getItem('userPrevilige'))
  }
  
}
