import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { environment } from 'projects/student/src/environments/environment.prod';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../core/api-handlers';
import { SwalService } from '../../core/services/swal.service';
import { untilDestroyed } from '../../core/services/until-destroyed';
import { UtilityService } from '../../core/services/utility.service';
import { AdministratorService } from '../administrator/administrator.service';
import { FlightService } from '../search/flight/flight.service';
import { DashboardService } from './dashboard.service';
import { Chart } from "chart.js";
import * as moment from 'moment';
import { ReportService } from '../reports/reports.service';

HC_exporting(Highcharts);

const imgUrl = environment.SA_URL + '/sa/';
const log = new Logger('dashBoard/DashboardComponent')
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    public chart: Chart;
    @ViewChild('calender', { static: false }) calendarComponent: FullCalendarComponent;
    @Output() Navigate = new EventEmitter();
    protected subs = new SubSink();
    bookingFlightsCount: number;
    active:any;
    cancellationFlightsCount: number;
    cancellationTrainCount:number;
    cancellationCarCount:number;
    bookingHotelCount: number;
    bookingCarCount: number;
    bookingBusCount: number;
    bookingTrainCount:number;
    cancellationHotelCount: number;
    cancellationBusCount: number;
    isFlight: boolean=false;
    isHotel: boolean=false;
    isBus: boolean=false;
    popupalert: any;
    displayedColumns = ['uuid', "first_name", 'email', 'phone', 'last_login'];
    displayedFlightColumns = ['recent bookings'];
    dataSource = ELEMENT_DATA;
    flightBookingSource = ELEMENT_BOOKING_DATA;
    latestTransactionsFound: boolean = false;
    latestTransactionsData: any;
    bookingDetailsFound: boolean = false;
    bookingDetailsData: any;
    bookingCalenderFound: boolean = false;
    bookingCalenderData: any;
    monthlyRecapReportFound: boolean = false;
    monthlyRecapReportData: any;
    moduleBookingCountFound: boolean = false;
    moduleBookingCountData: any;
    noTransactions:boolean=false;
    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
    calendarEvents: EventInput[];
    selectedDate:any;
    private subSunk = new SubSink();
    noData: boolean = true;
    respData: Array<any> = [];
    bookingDetails:any=[];
    policyList:any=[];
    //flight booking chat
    highcharts = Highcharts;
    chartOptions = {
        chart: {
            type: "spline"
        },
        title: {
            text: ""
        },
        subtitle: {
            text: ""
        },
        xAxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yAxis: {
            title: {
                text: ""
            }
        },
        tooltip: {
            valueSuffix: " °C"
        },

        series: [
            {
                name: 'Flight',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                style: { stroke: 'red' }
            },
            {
                name: 'Hotel',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            },
        ]
    };
    displayColumn: { key: string, value: string }[] = [
        { key: 'ids', value: 'Sl No.' },
        { key: 'first_name', value: 'Name' },
        { key: 'uuid', value: 'Agent ID' },
        { key: 'phone', value: 'Contact No' },
        { key: 'email', value: 'Email' },
        { key: 'created_at', value: 'Registered Date' },
      
    ];
    destinationSlides : any;
    currentUser : any;
    topTransactions:  Array<any> = [];
    upcommingBooking: any;

    constructor(
        private flightService: FlightService,
        private dashboardService: DashboardService,
        private utility: UtilityService,
        private router: Router,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private administratorService: AdministratorService,
        private reportsService: ReportService,
        private cdr:ChangeDetectorRef
    ) {
        this.popupalert = this.router.getCurrentNavigation();
    }

    ngOnInit() {
        this.currentUser = this.utility.readStorage('studentCurrentUser', localStorage)
        this.chart = new Chart("canvas", {
            type: "line",
            data: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              datasets: [
                {
                  label: 'Flight',
                  data: [36, 48, 19, 8, 25, 32, 47, 66, 0, 0, 0, 0],
                  backgroundColor: 'rgba(14, 75, 16, 0.3)',
                  borderColor: 'rgba(14, 75, 16, 0.3)',
                  borderWidth: 1
                },
                {
                  label: 'Hotel',
                  data: [20, 18, 5, 30, 19, 20, 39, 20, 16, 0, 8, 0],
                  backgroundColor: 'rgba(179, 102, 6, 0.2)',
                  borderColor: 'rgba(179, 102, 6, 0.2)',
                  borderWidth: 1
                },
                {
                    label: 'Train',
                    data: [20, 18, 0, 10, 19, 10, 39, 20, 26, 10, 28, 10],
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderColor: 'rgba(255,255,255,0.4)',
                    borderWidth: 1
                  }
              ]
            },
            options: {
                legend: {
                    labels: {
                        fontColor: "rgba(255,255,255,0.8)",
                    }
                },
              scales: {
                  
                yAxes: [
                  {
                      
                    stacked: true,
                    ticks: {
                        fontColor: "rgba(255,255,255,0.8)",
                      min: 0,
                      max: 79,
                      stepSize: 5,
                      
                    },
                    gridLines: {
                        display: true,
                        color: "rgba(255,255,255,0.1)"
                      }
                  },
                ],
                xAxes: [
                  {
                    stacked: true,
                    ticks: {
                        fontColor: "rgba(255,255,255,0.8)",
                    },
                    gridLines: {
                        display: true,
                        color: "rgba(255,255,255,0.1)"
                      }
                  },
                ],
              }
            }
          });

          this.chart = new Chart("canvas1", {
            type: "line",
            data: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              datasets: [
                {
                  label: '',
                  data: [36, 48, 19, 8, 25, 32, 47, 66, 0, 0, 0, 0],
                  backgroundColor: 'rgba(14, 75, 16, 0)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',                  
                  borderWidth: 1
                },
              ]
            },
            options: {
                legend: {
                    labels: {
                        fontColor: "rgba(255,255,255,0.8)",
                    }
                },
              scales: {
                yAxes: [
                  {
                    stacked: true,
                    ticks: {
                        fontColor: "rgba(255,255,255,0.8)",
                      min: 0,
                      max: 120,
                      
                    },
                    gridLines: {
                        display: true,
                        color: "rgba(255,255,255,0.2)"
                      }
                  },
                ],
                xAxes: [
                  {
                    stacked: true,
                    ticks: {
                        fontColor: "rgba(255,255,255,0.8)",
                    },
                    gridLines: {
                        display: true,
                        color: "rgba(255,255,255,0.2)"
                      }
                  },
                ],
              }
            }
          });

          this.chart = new Chart("canvas2", {
            type: "line",
            data: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              datasets: [
                {
                  label: 'Flight',
                  data: [36, 48, 19, 8, 25, 32, 47, 66, 0, 0, 0, 0],
                  backgroundColor: 'rgba(14, 75, 16, 0.3)',
                  borderColor: 'rgba(14, 75, 16, 0.3)',
                  borderWidth: 1
                },
      
                {
                    label: 'Train',
                    data: [20, 18, 0, 10, 19, 10, 39, 20, 26, 10, 28, 10],
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderWidth: 1
                  }
              ]
            },
            options: {

                legend: {
                    labels: {
                        fontColor: "rgba(255,255,255,0.8)",
                    }
                },
              scales: {
                  
                yAxes: [
                  {
                      
                    stacked: true,
                    ticks: {
                        fontColor: "rgba(255,255,255,0.8)",
                      min: 0,
                      max: 120,
                      
                    },
                    gridLines: {
                        display: true,
                        color: "rgba(255,255,255,0.1)"
                      }
                  },
                ],
                xAxes: [
                  {
                    stacked: true,
                    ticks: {
                        fontColor: "rgba(255,255,255,0.8)",
                    },
                    gridLines: {
                        display: true,
                        color: "rgba(255,255,255,0.1)"
                      }
                  },
                ],
              }
            }
          });

          this.chart = new Chart('piechart', {
            type: 'doughnut',
            data: {
              labels: ['Flight','Hotel', 'Train'],
              datasets: [
                { 
                  data: [55,45, 55],
                  backgroundColor: ['rgba(38, 198, 218, 0.8)','rgba(251, 140, 0, 0.8)', 'rgba(239, 83, 80, 0.8)'],
                  fill: true,
                  borderWidth:0
                },
              ]
            },
            options: {
              legend: {
                display: true,
                labels: {
                    fontColor: "rgba(0,0,0,0.8)",
                }
              },
              tooltips:{
                enabled:true
              }
            }
          });
          
        const modules = this.currentUser.corporate_details.module;
        if(modules)
        {
        this.isFlight = modules.includes('Flight') && this.currentUser['auth_role_id']!=3;
        this.isHotel = modules.includes('Hotel') && this.currentUser['auth_role_id']!=3;
        this.isBus = modules.includes('Bus') && this.currentUser['auth_role_id']!=3;
        }
        else{
            this.isFlight=true;
            this.isHotel=true;
            this.isBus=true;
        }

        this.flightService.formFilled = false;
        this.selectedDate=new Date();
        (this.currentUser && this.currentUser.auth_role_id==2)? this.getPolicy():this.getSubAgentList();
        this.getBookingCalender();
        this.eventClicked();
        this.getbookingCount();
        this.setUpcommingPayload();
        // this.getTopFlightDestinations();
        this.clearFlightCache();
    }

    clearFlightCache(){
        localStorage.removeItem('ticketCache');
        localStorage.removeItem('flightSearchPostdata');
    }

    getModuleBookingCount() {
        const data = [{ agent_id: this.utility.readStorage('studentCurrentUser', localStorage)['user_id'] }];
        data['topic'] = 'moduleBookingCount';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.moduleBookingCountFound = true;
                    this.moduleBookingCountData = resp.data;
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }

    getMonthlyRecapReport() {
        const data = [{ agent_id: this.utility.readStorage('studentCurrentUser', localStorage)['user_id'] }];
        data['topic'] = 'monthlyRecapReport';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.monthlyRecapReportFound = true;
                    this.monthlyRecapReportData = getCartOptions2(resp.data);
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }

    getBookingCalender() {
        let year = this.selectedDate.getFullYear();
        var month = this.selectedDate.toLocaleString('default', { month: 'short' });
        month=month.substring(0,3)
        let classNames: string[] =['myclass1'];
        this.apiHandlerService.apiHandler('bookingCalender', 'post', {}, {},  { year: year, "month" : month.toUpperCase() })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.bookingCalenderFound = true;
                    const arr2 = resp.data.DayWise.map(x => ({...x,backgroundColor:'green',textColor:'white',classNames:classNames}));
                    this.calendarEvents = arr2;
                }
                else if (resp.statusCode == 404) {
                    this.bookingCalenderFound = false;
                    this.swalService.alert.error();
                }
            });
    }

    getBookingDetails() {
        const data = [{ agent_id: this.utility.readStorage('studentCurrentUser', localStorage)['user_id'] }];
        data['topic'] = 'bookingDetails';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.bookingDetailsFound = true;
                    this.bookingDetailsData = getChartOptions(resp.data);
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }

    getLatestTransactions() {
        const data = [{
            agent_id: this.utility.readStorage('studentCurrentUser', localStorage)['user_id'],
            user_type: 3
        }];
        data['topic'] = 'latestTransactions';
        this.dashboardService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                if (resp.statusCode == 200) {
                    this.latestTransactionsFound = true;
                    this.latestTransactionsData = resp.data;
                } else {
                    log.debug('oops sorry something went wrong');
                }
            });
    }

    getbookingCount() {
        this.subs.sink = this.apiHandlerService.apiHandler('bookingCount', 'POST', {}, {}, {}).subscribe(res => {
            if (res.Status && res.data.length !== 0) {
                const bookingCountsMap = {
                    'Flight Booking': 'bookingFlightsCount',
                    'Hotel Booking': 'bookingHotelCount',
                    'Car Booking': 'bookingCarCount',
                    'Train Booking': 'bookingTrainCount',
                    'Bus Booking':'bookingBusCount'
                };
                const cancellationCountMap = {
                    'Flight Booking Cancelled': 'cancellationFlightsCount',
                    'Hotel Booking Cancelled': 'cancellationHotelCount',
                    'Car Booking Cancelled': 'cancellationCarCount',
                    'Train Booking Cancelled': 'cancellationTrainCount',
                    'Bus Booking Cancelled   ':'cancellationBusCount'
                };
                for (let bookingCount of res.data.BookingCount) {
                    const module = bookingCount.module;
                    const count = bookingCount.noOfBookings[0].agent;

                    if (bookingCountsMap.hasOwnProperty(module)) {
                        this[bookingCountsMap[module]] = count;
                    }
                }
                for (let cancellationCount of res.data.CancellationCount) {
                    const module = cancellationCount.module;
                    const count = cancellationCount.noOfBookings[0].agent;
                    if (cancellationCountMap.hasOwnProperty(module)) {
                        this[cancellationCountMap[module]] = count;
                    }
                }
            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
            console.error(err);
        }
        );
    }
    

    
    getSubAgentList() {
        this.subSunk.sink = this.administratorService.fetchSubAgentList()
            .subscribe(resp => {
                if (resp.statusCode == 200 && resp.data.length != 0 || resp.statusCode == 201 && resp.data.length != 0) {
                    this.respData = resp.data;
                    this.respData = this.respData.filter((data) => {
                        return data.status === 1 
                    })
                    this.noData = false;
                    respDataCopy = [...this.respData];
                    this.sortData(
                        {
                            active: "created_at",
                            direction: "desc"
                        })
                        var ELEMENT_DATA: PeriodicElement[] =resp.data;
                } else {
                    // this.swalService.alert.oops("No Data Found");
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            })
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id, '' + b.system_transaction_id, isAsc);
                case 'first_name': return this.utility.compare('' + a.first_name.toLocaleLowerCase(), '' + b.first_name.toLocaleLowerCase(), isAsc);
                case 'phone': return this.utility.compare(+ a.phone, + b.phone, isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                case 'uuid': return this.utility.compare('' + a.uuid.toLocaleLowerCase(), '' + b.uuid.toLocaleLowerCase(), isAsc);
                case 'created_at': return this.utility.compare(+ a.created_at, + b.created_at, isAsc);
                default: return 0;
            }
        });
    }

    getTopFlightDestinations(){
        this.subs.sink = this.apiHandlerService.apiHandler('listFlightTopDestination', 'POST', {}, {}, {}).subscribe(res => {
            if(res.statusCode == 200 || res.statusCode==201){
                this.destinationSlides  = res.data;
            }
        }, (err: HttpErrorResponse) => {
            log.debug(err);
        }
        );
    }

    getImage(img){
        return imgUrl + img;
    }

    navigateToTop(data){
        window.scroll(0,0);
        this.flightService.flightSearchData.next(data);
    }

    calenderPrev() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.prev();
        this.setMonthYear(calendarApi);
    }

    handleDateClick(calDate) {
        this.selectedDate=calDate.date;
        let reqBody = {}
        reqBody = {
            "booked_from_date": moment(calDate.date).format('YYYY-MM-DD'),
            "booked_to_date": moment(calDate.date).format('YYYY-MM-DD'),
        }
       this.getb2bFlightReport(reqBody)
    }

    setUpcommingPayload() {
        let reqBody = {};
        let fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);
        let toDate = new Date(); // Create a new date object
        toDate.setDate(toDate.getDate() + 30);
        reqBody = {
            "booked_from_date": moment(fromDate).format('YYYY-MM-DD'),
            "booked_to_date": moment(toDate).format('YYYY-MM-DD'),
        }
        this.getUpcommingFlights(reqBody)
    }

    eventClicked(eventData?) {
        let reqBody={}
        if (eventData) {
            this.selectedDate=eventData.event.start;
            reqBody = {
                "booked_from_date": moment(new Date(eventData.event.start)).format('YYYY-MM-DD'),
                "booked_to_date": moment(new Date(eventData.event.start)).format('YYYY-MM-DD'),
            }
        }
        else {
            this.selectedDate=new Date();
            reqBody = {
                "booked_from_date": moment(new Date()).format('YYYY-MM-DD'),
                "booked_to_date": moment(new Date()).format('YYYY-MM-DD'),
            }
        }
        this.getb2bFlightReport(reqBody);
    }

    calenderNext() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.next(); 
        this.setMonthYear(calendarApi);
    }

    setMonthYear(calendarApi) {
        this.selectedDate = calendarApi.getDate();
        this.getBookingCalender();
        let reqBody = {}
        reqBody = {
            "booked_from_date": moment(new Date(this.selectedDate)).format('YYYY-MM-DD'),
            "booked_to_date": moment(new Date(this.selectedDate)).format('YYYY-MM-DD'),
        }
        this.getb2bFlightReport(reqBody)
    }


    getb2bFlightReport(reqBody) {
        reqBody.status="BOOKING_CONFIRMED",
        reqBody.app_reference="";
        reqBody.pnr="";
        reqBody.email="";
        this.reportsService.fetchBookingReports(reqBody)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                        this.bookingDetails = resp.data;
                        this.bookingDetailsFound=true;
                  
                } else {
                    this.bookingDetailsFound = false;
                    this.bookingDetails = [];
                }
            }, (err) => {
                this.bookingDetailsFound = false;
                this.bookingDetails = [];
              })
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    getUpcommingFlights(reqBody) {
        reqBody.status="BOOKING_CONFIRMED",
        reqBody.app_reference="";
        reqBody.pnr="";
        reqBody.email="";
        this.reportsService.fetchBookingReports(reqBody)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                        this.upcommingBooking = resp.data;
                } else {
                    this.upcommingBooking = false;
                }
            }, (err) => {
                this.upcommingBooking = [];
              })
    }

    setToday() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.today(); 
        this.setMonthYear(calendarApi);
    }

    onDetailsChange(data){

    }
    
    getPolicy() {
        const data = { position_id:this.currentUser.position_id, corporate_id: this.currentUser.created_by_id };
        this.subs.sink = this.apiHandlerService.apiHandler('getPolicy', 'POST', {}, {}, data).subscribe(res => {
            if (res.Status && res.data.length != 0) {
                this.policyList = res.data;
                this.setPolicyValue();
                this.cdr.detectChanges();
            }
            else {
                this.policyList = [];
                this.setPolicyValue();
                this.cdr.detectChanges();
            }
        }, (err: HttpErrorResponse) => {
            this.policyList = [];
            this.setPolicyValue();
            this.cdr.detectChanges();
        }
        );
    }

   
    setPolicyValue(){
        localStorage.setItem('policyList',JSON.stringify(this.policyList));

    }

    ngOnDestroy() { }
    destinationSliderConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };

}
// B2B users list
export interface PeriodicElement {
    uuid: string;
    first_name: string;
    email: string;
    phone: number;
    last_login: string;
}

var ELEMENT_DATA: PeriodicElement[] = [
    
];
export interface recentBookingFlight {
    bookingCode: string;
    logo: string;
    transaction: string;
}

const ELEMENT_BOOKING_DATA: recentBookingFlight[] = [
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" },
    { logo: "assets/images/login-images/assets/b-flight.png", bookingCode: "FB14-223706-863422-Fri. 14-Aug-Provab-Travelport LCC -Indigo", transaction: "flight Transaction was Successfully done" }
];

function getChartOptions(respData) {
    log.debug(respData);
    return {
        chart: {
            type: "spline" // line
        },
        title: {
            text: respData.title || "Banking Details"
        },
        subtitle: {
            text: respData.subtitle ? `Source: ${respData.subtitle}` : 'Source: provab.com'
        },
        xAxis: {
            categories: [...respData['time_line_interval']]
        },
        yAxis: {
            title: {
                text: `No.of Bookings (Total: ${respData['max_count']})`
            }
        },
        "tooltip": {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: respData['time_line_report'],
        navigation: {
            buttonOptions: {
                enabled: true
            }
        },
    }
}


function getCartOptions2(respData) {
    return {
        "chart": {
            "type": "column"
        },
        "title": {
            "text": "Monthly Recap Report"
        },
        "subtitle": {
            "text": respData['source'] ? `Source: ${respData['source']}` : "Source: Provab.com "
        },
        "xAxis": {
            "categories": respData['time_line_interval'],
            "crosshair": true
        },
        "yAxis": {
            "min": 0,
            "title": {
                "text": `Profit (${respData['currency']})`
            }
        },
        "tooltip": {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        "plotOptions": {
            "column": {
                "pointPadding": 0.2,
                "borderWidth": 0
            }
        },
        "series": [...respData['group_time_line_report']],
    }

    

}
