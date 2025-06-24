import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { Logger } from '../../core/logger/logger.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { DashboardService } from './dashboard.service';
import { SwalService } from '../../core/services/swal.service';
import { ConfService } from '../../core/services/conf.service';
import { SubSink } from 'subsink';
import { AppService } from '../../app.service';
import * as moment from 'moment';
HC_exporting(Highcharts);

declare var $: any;
const log = new Logger('DashboardComponent');

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    @ViewChild('calender', { static: false }) calendarComponent: FullCalendarComponent;
    private subSunk = new SubSink();
    moduleBookingCount = [
    ];
    moduleBookingCountFound: boolean = false;
    bookingCalenderFound: boolean = false;
    bookingDetailsFound: boolean = false;
    noData: boolean = false;
    highcharts = Highcharts;
    highcharts2 = Highcharts;
    data: any;
    chartOptions: any;
    chartOptions2: any;
    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
    calendarEvents: EventInput[];
    defaultCurrency: string = 'USD';
    bookingDetails:any;
    selectedDate:any;
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private dashboardService: DashboardService,
        private swalService: SwalService,
        private confService: ConfService,
        private appService: AppService,
        private cdr:ChangeDetectorRef
    ) {
        this.defaultCurrency = this.appService.defaultCurrency;
        
    }


    // public barChartOptions: ChartOptions = {
    //     responsive: true,
    //   };
    //   public barChartLabels: Label[] = ['HyperMiles', 'DCB', 'ICIC', 'Reliance', 'Provab', 'Travelomatix', "3i Infotechs", "Midmark", 'Accentria'];
    //   public barChartType: ChartType = 'bar';
    //   public barChartLegend = true;
    //   public barChartPlugins = [];
    //   public colors = [
    //     { backgroundColor:"#0A5081" },
    //     { backgroundColor:"#172b4c" },
    //     { backgroundColor:"#e8a900" },
    //     { backgroundColor:"#e30458" },
    //     { backgroundColor:"#318ae5" }
    //     ];
    
    //     public barChartData: ChartDataSets[] = [
    //       { data: [100, 200, 180], label: 'Flight', stack: 'a' },
    //       { data: [120, 80, 19], label: 'Hotel', stack: 'a' },
    //       { data: [80, 150, 200], label: 'Bus', stack: 'a' },
    //       { data: [400, 300], label: 'Train', stack: 'a' },
    //       { data: [40, 180], label: 'Cab', stack: 'a' }
    //     ];

    public doughnutChartLabels:Array<string> = ['TripMartz', 'TCS', 'ICIC', 'Reliance'];
    public demodoughnutChartData:Array<number> = [46, 25, 12, 15];
    public doughnutChartType:string = 'doughnut';
    public doughnutChartOptions: any = { legend: { display: true, labels: { fontColor: 'black' } }}
    public donutColors=[
        {
          backgroundColor: [
            '#0A5081',
            '#172b4c',
            '#e8a900',
            '#e30458',
            '#318ae5'
        ]
        }
      ];

      
    
    public chartClicked(e:any):void {
      }
     
      public chartHovered(e:any):void {
      }


    public doughnut1ChartLabels:Array<string> = ['Flight', 'Hotel'];
    public demodoughnut1ChartData:Array<number> = [46, 25];
    public doughnut1ChartType:string = 'doughnut';
    public doughnut1ChartOptions: any = { legend: { display: true, labels: { fontColor: 'black' } }}
    public donut1Colors=[
        {
          backgroundColor: [
            '#e8a900',
            '#318ae5',
            '#0A5081',
            '#172b4c',
            '#e30458'
        ]
        }
      ];
    
      public chart1Clicked(e:any):void {
      }
     
      public chart1Hovered(e:any):void {
      }

    ngOnInit() {
        this.getModuleBookingCount();
        this.getMonthlyRecapReport();
        this.selectedDate=new Date();
        this.getBookingCalender();
       // this.getBookingDetails();
        this.chartOptions = {
            // chart: {
            //     type: "spline" // line
            // },
            // title: {
            //     text: "Banking Details"
            // },
            // subtitle: {
            //     text: 'Source: provab.com'
            // },
            // xAxis: {
            //     categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            // },
            // yAxis: {
            //     title: {
            //         text: "No.of Bookings"
            //     }
            // },
            // plotOptions: {
            //     line: {
            //         datamodules: {
            //             enabled: true
            //         },
            //         enableMouseTracking: false
            //     }
            // },
            // series: [{
            //     name: 'Banking Details',
            //     data: [0, 9, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // },
            //     // {
            //     //   name: 'Nicesnippets.com',
            //     //   data: [677, 455, 677, 877, 455, 778, 888, 567, 785, 488, 567, 654]
            //     // }
            // ],
            // navigation: {
            //     buttonOptions: {
            //         enabled: true
            //     }
            // },
        };

        this.eventClicked();
    }


    getModuleBookingCount(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('bookingCount', 'post', {}, {}, {})
            .subscribe(resp => {
                log.debug(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.moduleBookingCountFound = true;
                    this.moduleBookingCount = resp['data']['BookingCount'];
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
                if (resp.statusCode == 200) {
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

    handleDateClick(calDate) {
        this.selectedDate=calDate.date;
        let reqBody = {}
        reqBody = {
            "booked_from_date": moment(calDate.date).format('YYYY-MM-DD'),
            "booked_to_date": moment(calDate.date).format('YYYY-MM-DD'),
        }
        this.getb2bFlightReport(reqBody)
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

    setToday() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.today(); 
        this.setMonthYear(calendarApi);
    }

    calenderPrev() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.prev();
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

    getb2bFlightReport(reqBody){
        reqBody['app_reference']="";
        reqBody['pnr']="";
        reqBody['email']="";
        reqBody['status']= "BOOKING_CONFIRMED";
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightReport', 'post', {}, {}, reqBody)
        .subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.bookingDetails=resp.data;
                this.bookingDetailsFound=true;
                this.cdr.detectChanges();
            }
            else {
                this.bookingDetailsFound = false;
                this.cdr.detectChanges();
            }
        });
    }

    getMonthlyRecapReport() {
        this.chartOptions2 = getCartOptions2({});
        // this.dashboardService.fetch({ topic: 'monthlyRecapReport' })
        //     .subscribe(resp => {
        //         log.debug(resp);
        //         if (resp.statusCode == 200) {
        //             this.noData = false;
        //             this.chartOptions2 = getCartOptions2(resp.data);
        //         }
        //         else if (resp.statusCode == 404) {
        //             this.noData = true;
        //             this.swalService.alert.error();
        //         }
        //     });
    }

    copyMessage(val: string){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}

function getcalendarEvents(respData) {
    return respData.calender_data.map(val => {
        let data = {
            reference_number: val['app_reference'],
            status: val['status'],
            booking_source: val['booking_source'],
        }
        let qP = JSON.stringify(data);
        return {
            title: val.title,
            start: val.start,
            url: `./reports/flight-voucher?data=${qP}`,
        }
    });
}
function getChartOptions(respData) {
    return {
        chart: {
            type: "spline" // line
        },
        title: {
            text: respData.title || "Booking Details"
        },
        subtitle: {
            text: respData['subtitle'] ? `Source: ${respData.subtitle}` : 'Source: provab.com'
        },
        xAxis: {
            categories:
                // [...respData['time_line_interval']]
                ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        yAxis: {
            title: {
                text: `No.of Bookings (Total: ${respData['max_count'] || 0})`
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
        series: [...respData['BookingDetails']],
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
            "text": respData['source'] ? `Source: ${respData['source']}` : "Source: Tripmartz"
        },
        "xAxis": {
            "categories":
                // respData['time_line_interval'],
                [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
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

        colors: [
            '#0A5081', 
            '#495057',
            '#3D96AE',
            '#3D96AE',
            '#80699B'

            ],

        "plotOptions": {
            
            "column": {
                "pointPadding": 0.2,
                "borderWidth": 0
            }
        },
        "series":
            // [...respData['group_time_line_report']],
            [{
                "name": "Flight",
                "data": [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }, {
                "name": "Hotel",
                "data": [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            }
            ]
    }
}


function getStats() {
    return [
        {
            module: 'Flight Booking',
            class: 'bg-primary',
            icon: 'bg-primary fal fa-plane',
            noOfBookings: 2,
            reportsType: ['Agent Report']
        },
        {
            module: 'Hotel Bookins',
            class: 'bg-success',
            icon: 'fal fa-bed',
            noOfBookings: 2,
            reportsType: ['Agent Report']
        },
        // {
        //   module: 'Bus Booking',
        //   class: 'bg-danger',
        //   icon: 'fa fa-bus',
        //   noOfBookings: 2,
        //   reportsType: ['B2C Report', 'Agent Report']
        // },
        // {
        //   module: 'Transfer Booking',
        //   class: 'bg-success',
        //   icon: 'fa fa-taxi',
        //   noOfBookings: 2,
        //   reportsType: ['B2C Report', 'Agent Report']
        // },
        // {
        //   module: 'Activities Booking',
        //   class: 'bg-warning',
        //   icon: 'fa fa-binoculars',
        //   noOfBookings: 2,
        //   reportsType: ['B2C Report', 'Agent Report']
        // },
        // {
        //   module: 'Holiday Enquiry',
        //   subTitle: "Enquiries",
        //   class: 'bg-warning',
        //   icon: 'fa fa-suitcase',
        //   // noOfBookings: 0,
        //   // reportsType: ['B2C Report', 'Agent Report']
        // }
    ]
}
