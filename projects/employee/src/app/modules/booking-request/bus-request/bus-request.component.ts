import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { formatDate } from '@fullcalendar/core';
import { ApiHandlerService } from '../../../core/api-handlers';
import { UtilityService } from '../../../core/services/utility.service';
import { Sort } from '@angular/material';
import { ReportService } from '../../reports/reports.service';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-bus-request',
  templateUrl: './bus-request.component.html',
  styleUrls: ['./bus-request.component.scss']
})
export class BusRequestComponent implements OnInit {
 
      searchType = 'hotel';
      navLinks = [];
      pageSize = 10;
      loading: boolean = false;
      page = 1;
      collectionSize: number;
      deleteData: any = [];
      showConfirm: boolean = false;
      showData: any = [];
      status: string = "";
      primaryColour: any;
      secondaryColour: any;
      loadingTemplate: any;
      copied: boolean = false;
      cancellationRemark: string = '';
      isTemplateClicked:boolean=false;
      displayColumn: { key: string, value: string }[] = [
          { key: 'id', value: 'Sl No.' },
        //   { key: 'action', value: 'Action' },
          { key: 'request_id', value: 'Application Reference' },
          { key: 'approvar_status', value: 'Approvar Status' },
          { key: 'request_from', value: 'Request From' },
          { key: 'booking_type', value: 'Booking Type' },
          { key: 'pnr', value: 'PNR' },
          { key: 'createdDatetime', value: 'Requested On' },
          { key: 'email', value: 'Email' },
          { key: 'phone_no', value: 'Phone Number' },
          { key: 'totalFare', value: 'Total Fare' },
      ];
  
      showDiv = {
          full: true,
          partial: false,
      }
  
      noData: boolean = true;
      respData: any;
      showPaxDetails: boolean;
      currentRecord: any = [];
      paxDetails: any = [];
      selectedRecord:any=[];
  
    constructor(
      private cdr:ChangeDetectorRef,
      private apiHandlerService:ApiHandlerService,
      private utility: UtilityService,
      private reportsService:ReportService
    ) { }
  
    ngOnInit() {
      this.getBookingList();
    }
  
    getBookingList() {
      this.noData=true;
      this.respData=[];
      let request={
         "RequestType": "Approval"
      }
      this.apiHandlerService.apiHandler('busApprovalRequest', 'POST', {}, {}, request).subscribe(res => {
          if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
              this.respData = res.data;
              respDataCopy = [...this.respData];
              this.noData = false;
              this.cdr.detectChanges();
          }
          else {
              this.respData = [];
              this.collectionSize = this.respData.length;
              this.noData = false;
              this.cdr.detectChanges();
          }
      }, (err) => {
              this.respData = [];
              this.collectionSize = this.respData.length;
              this.noData = false;
              this.cdr.detectChanges();
      });
  }
  
  applyFilter(text: string) {
      text = text.toLocaleLowerCase().trim();
      filterArray = respDataCopy.slice().filter((objData, index) => {
          const filterOnFields = {
              request_id: objData.app_reference,
              approvar_status:objData.approvar_status,
              request_from: objData.busBusBookingPaxDetails[0].name,
              booking_type: objData.booking_type,
              pnr: objData.pnr,
              createdDatetime: objData.created_at,
              email: objData.email,
              phone_no: objData.phone_number,
              totalFare: objData.total_fare,
          }
          if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
              return objData;
          }
      });
      if (filterArray.length && text.length)
          this.respData = filterArray;
      else
          this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];
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
              case 'request_id': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
              case 'approvar_status': return this.utility.compare('' + a.approvar_status, '' + a.approvar_status, isAsc);
              case 'request_from': return this.utility.compare('' + a.busBusBookingPaxDetails[0].name, '' + b.busBusBookingPaxDetails[0].name, isAsc);
              case 'booking_type': return this.utility.compare(+ a.booking_type, + b.booking_type, isAsc);
              case 'pnr': return this.utility.compare(+ a.pnr, + b.pnr, isAsc);
              case 'createdDatetime': return this.utility.compare('' + a.createdDatetime, '' + b.createdDatetime, isAsc);
              case 'email': return this.utility.compare('' + a.email, '' + b.email, isAsc);
              case 'totalFare': return this.utility.compare(+ a.total_fare, + b.total_fare, isAsc);
              default: return 0;
          }
      });
  }
  
  exportExcel(): void {
      if (this.respData && this.respData.length > 0) {
          const fileToExport = this.respData.map((response: any, index: number) => {
              return {
                  "Sl No.": index + 1,
                  "Application Reference": response.app_reference || 'N/A',
                  "Approvar Status":response.approvar_status || "PENDING",
                  "Request From":response.busBusBookingPaxDetails[0].name,
                  "Booking Type":response.booking_type,
                  "PNR":response.pnr,
                  "Requested On":response.created_at,
                  "Email":response.email,
                  "Phone Number":response.phone_number,
                  "Total Fare":response.total_fare,
              }
          });
          const columnWidths = [
              { wch: 5 }
          ];
          const fieldsLength = this.respData.length;
          for (let i = 0; i < fieldsLength; i++) {
              columnWidths.push({ wch: 30 })
          }
          this.utility.exportToExcel(
              fileToExport,
              'Bus Report',
              columnWidths
          );
      }
  }
  
  copy(appReference) {
    this.copied = true;
      this.reportsService.copy(appReference);
  }
    
  }
  
