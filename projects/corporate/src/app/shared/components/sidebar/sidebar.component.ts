import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ThemeOptions } from '../../../theme-options';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';
import { IPermissions } from '../../../auth/permissions.interface';
import { MasterService } from '../../../modules/master/master.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private masterService:MasterService
  ) {

  }

  @select('config') public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = 'dashboardsMenu';
  private subSunk = new SubSink();
  navigationData: any;
  loggedInUser: any;
  userpermissions: IPermissions;
  USER_MANAGEMENT = 'p2';
  REPORTS = 'p6';
  GROUP_BOOKING = 'p9';
  TRANSACTION_LOGS = 'p12';
  MASTER_BALANCE_MANAGER = 'p13';
  COMMISSION = 'p17';
  ACCOUNT_MANAGER = 'p20';
  MARKUP = 'p24';
  CONTENT_MANAGEMENT = 'p27';
  B2B_CMS = 'p35';
  SETTINGS = 'p43'
  MASTER='p44';
  MIS_DOWNLOADS='p45';
  BILLING='p46';
  PROPERTY_CRS='p47';
  ICIC='p48';
  ACCOUNT_SYSTEM = "p15";

  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
    this.globals.sidebarHover = !this.globals.toggleSidebar
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  removeValue(){
  this.masterService.policyUpdateData.next('');
  }

  sidebarHoverMouseOut() {
    this.globals.sidebarHover = false;
  }

  sidebarHoverMouseIn() {
    this.globals.sidebarHover = false;
  }


  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('currentCorpUser'));
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
        if (this.loggedInUser['id'] == 243) {
            if (menu == 'MisDownloadsMenus' || menu == 'Master' || menu == 'ICICI Hotel Master') {
                return true;
            } else {
                return false;
            }
        }
        if (menu == 'ICICI Hotel Master') {
            return false;
        }
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

  isSubMenuExists(menu, parent_key) {
    if (this.loggedInUser['id'] == 243) {
      if (menu == 'Train' || menu == 'Hotel' || menu == 'Invoice' || (parent_key == 'p44' && menu != 'Manage Employee Code') || parent_key == 'p48') {
        return true;
      } else {
        return false;
      }
    }
    if (menu == 'Make Payment' || menu == 'Set Balance Alert' || menu == 'Update/Request Credit Limit') {
      this.loggedInUser = JSON.parse(localStorage.getItem('currentCorpUser'));
      const paymentMode = this.loggedInUser.payment_mode ? JSON.parse(this.loggedInUser.payment_mode) : '';
      return paymentMode ? (paymentMode.some(mode => mode.includes('credit') || mode.includes('debit'))) : '';
    }
    parent_key = null;
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
