import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { ThemeOptions } from "../../../theme-options";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { FlightService } from "../../../modules/search/flight/flight.service";
import { ApiHandlerService } from "../../../core/api-handlers";
import { UtilityService } from "../../../core/services/utility.service";
import { untilDestroyed } from "../../../core/services";
import { NgbAccordion, NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SwalService } from "../../../core/services/swal.service";
import { SubSink } from "subsink";
import { TripIdService } from "../../../modules/tripid/services/trip-id.service";
import { HeaderService } from "../header/header.service";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public HeaderLogo: string = "assets/images/login-images/l-logo.png";
  public searchIcon: string = "assets/images/awesome-search.png";
  public extraParameter: any;
  @ViewChild("myaccordion", { static: true }) accordion: NgbAccordion;
  public logo: any;
  tabSubscription: any;
  searchTabValue: any;
  selectedSidebar: any = "searchMenus";
  regConfig: FormGroup;
  navigationData: any;

  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private flightService: FlightService,
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private swalService: SwalService,
    private tripService:TripIdService,
    private headerService:HeaderService
  ) { }

  @select("config") public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = "searchMenus";
  keepActive: boolean = false;
  SEARCH_SYSTEM = "p2";
  ADMINISTRATOR = "p5";
  REPORTS = "p8";
  QUEUE_SYSTEM = "p11";
  ACCOUNT_SYSTEM = "p15";
  AGENT_TOOLS = "p25";
  MARKUP_MANAGEMENT = "p30";
  SUPPORT_TICKETS = "p33";
  DOMAIN_LOGO = "p31";
  loggedInUser: any;
  hideOther:boolean=false;
  browserRefresh: boolean;
  private subSunk = new SubSink();
  isFlight: boolean=false;
  isHotel: boolean=false;
  isBus: boolean=false;

  toggleSidebar(menuId?: any) {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
    this.globals.sidebarHover = !this.globals.toggleSidebar;
    //this.setModule('');
  }
  logoConfig = new FormGroup({
    domain_logo: new FormControl(null, Validators.required),
  });

  beforeChange($event: NgbPanelChangeEvent) {
    this.globals.toggleSidebar = false;
    this.flightService.sidebarEventChange($event.panelId);
    localStorage.setItem(
      "SelectedMenu",
      JSON.stringify({ activeMenu: $event.panelId })
    );
    this.cdr.detectChanges();
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  sidebarHoverMouseOut() {
    this.globals.sidebarHover = false;
  }

  sidebarHoverMouseIn() {
    this.globals.sidebarHover = true;
  }

  ngOnInit() {
    this.setValue();
    this.hideOther=this.globals.hideOther;
    this.loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    const modules = this.loggedInUser.corporate_details.module;
    if(modules){
    this.isFlight = modules.includes('Flight') && this.loggedInUser['auth_role_id']!=3;
    this.isHotel = modules.includes('Hotel') && this.loggedInUser['auth_role_id']!=3;
    this.isBus = modules.includes('Bus') && this.loggedInUser['auth_role_id']!=3;
   }
   else{
    this.isFlight=true;
    this.isHotel=true;
    this.isBus=true;
}
    if (this.loggedInUser  && this.loggedInUser["auth_role_id"] == 5) this.getPrevilegeForThisUser();
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });
    this.getDomainLogo();
    this.regConfig = this.fb.group({
      input: new FormControl("", [
        Validators.maxLength(50),
        Validators.minLength(10),
      ]),
    });
    const SelectedMenu =
      JSON.parse(localStorage.getItem("SelectedMenu")) || {};
    if (SelectedMenu && SelectedMenu.activeMenu) {
      this.selectedSidebar = SelectedMenu.activeMenu;
    }
    // this.getLogo();
  }
  // getLogo() {
  //   const user = JSON.parse(localStorage.getItem('currentUser'));
  //   const formData = new FormData();
  //   formData.append('image', this.HeaderLogo);
  //   formData.append('id', user.id);
  //   this.subSunk.sink = this.apiHandlerService.apiHandler('getDomainLogo', 'post', {}, {}, formData)
  //     .subscribe(resp => {
  //       if (resp.statusCode == 200 || resp.statusCode == 201) {
  //         window.open(resp.data.url);
  //       }
  //       else {
  //         this.swalService.alert.oops(resp.msg);
  //       }
  //     });
  // }

  ngAfterViewInit() {
    // this.tabSubscription = this.flightService.changeEmitted$.subscribe(
    //   (tabvalue) => {
    //     alert("d dd")
    //     this.searchTabValue = tabvalue;
    //   }
    // );
  }

  setValue() {
    let bookingRequest = JSON.parse(localStorage.getItem('bookingRequest')) || {};
    if (Object.keys(bookingRequest).length>0) {
        this.globals.hideOther=true;
    }
}

  onKeyUp(e) {
    let app_reference = String(e.target.value).trim();
    app_reference.length > 10 &&
      this.apiHandlerService
        .apiHandler(
          "searchByBookindId",
          "post",
          {},
          {},
          {
            app_reference,
          }
        )
        .pipe(untilDestroyed(this))
        .subscribe(
          (resp) => {
            if (
              (resp.statusCode == 200 || resp.statusCode == 201) &&
              resp.hasOwnProperty("data")
            ) {
              if (resp.data.moduleName == "Flight") {
                this.router.navigate(["/reports/flight-booking-details"], {
                  queryParams: { appRef: resp.data.app_reference },
                });
              } else if (resp.data.moduleName == "Hotel") {
                this.router.navigate(["/reports/hotel-booking-details"], {
                  queryParams: { appRef: resp.data.app_reference },
                });
              }
            } else {
            }
          },
          (err) => {
          }
        );
  }

  getDomainLogo() {
    const data = {
      agent_id: this.utility.readStorage("currentUser", localStorage)[
        "user_id"
      ],
    };
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }
  }

  resetSearchForm() {
    this.flightService.formFilled = false;
    this.flightService.resetSearch();
    this.flightService.emitChange("flights");
  }
  
  isMenuExists(menu) {
    if (this.navigationData && this.navigationData.length > 0) {
      if (this.navigationData.some((el) => el.description == menu)) return true;
      else return false;
    } else {
      return true;
    }
  }

  isSubMenuExists(menu, parent_key = null) {
    if (this.navigationData && this.navigationData.length > 0) {
      if (
        this.navigationData.some(
          (el) => el.description == menu && el.parent_key == parent_key
        )
      )
        return true;
      else return false;
    } else {
      return true;
    }
  }

  getPrevilegeForThisUser() {
    this.navigationData = JSON.parse(localStorage.getItem("userPrevilige"));
    this.globals.toggleSidebar = false;
  }

  setModule(module){
    this.router.navigate(['/dashboard/search-form']);
    this.headerService.selectedModule.next(module);
    this.flightService.emitChange(module);
  }

  clearValue(){
    this.tripService.tripData.next({})
  }
  
  ngOnDestroy() { }
}
