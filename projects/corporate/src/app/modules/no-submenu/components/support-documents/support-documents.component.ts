import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-support-documents',
  templateUrl: './support-documents.component.html',
  styleUrls: ['./support-documents.component.scss']
})
export class SupportDocumentsComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "employeeId", value: 'Employee ID' },
        { key: "employeeName", value: 'Employee Name' },
        { key: "role", value: 'Role' },
        { key: "date", value: 'Date' },
        { key: "documents", value: 'Documents' },
        { key: "status", value: 'Status' },
        { key: "discription", value: 'Description' },
        { key: "action", value: 'Action' }
    ];
    noData: boolean = false;
    fetchingData: boolean = true;
    respData: any;
    status;
    dummyData=[
        {'employeeId':1001,'employeeName':'Vikash','role':'Admin','date':'2023-02-24','documents':'BookingStatus.pdf','status':1,'discription':'Apporve the ducument for booking'},
        {'employeeId':1301,'employeeName':'Ajit','role':'V.P','date':'2023-05-14','documents':'BookingStatus.pdf','status':1,'discription':'Apporve the ducument for booking'},
        {'employeeId':2005,'employeeName':'Animesh','role':'Director','date':'2023-03-20','documents':'BookingStatus.pdf','status':0,'discription':'Apporve the ducument for booking'},
        {'employeeId':5004,'employeeName':'Deepak','role':'Manager','date':'2023-04-09','documents':'BookingStatus.pdf','status':1,'discription':'Apporve the ducument for booking'},
        {'employeeId':5401,'employeeName':'Ankush','role':'Developer','date':'2023-02-15','documents':'BookingStatus.pdf','status':0,'discription':'Apporve the ducument for booking'},
        {'employeeId':6701,'employeeName':'Chetan','role':'Sr. V.P','date':'2023-07-12','documents':'BookingStatus.pdf','status':1,'discription':'Apporve the ducument for booking'},
        {'employeeId':7001,'employeeName':'Shreyansh','role':'Sr. Manager','date':'2023-04-24','documents':'BookingStatus.pdf','status':1,'discription':'Apporve the ducument for booking'}
    ]

    constructor(
    ) { }

    ngOnInit() {
        this.getDocumentsList();
    }

    getDocumentsList(): void {
        setTimeout(() => {
            this.respData=this.dummyData;
            this.fetchingData=false;
            this.collectionSize = this.respData.length;
        }, 2000);
    }

    onDocumentsActionUpdate(val): void {
        
    }

    sortData(sort: Sort) {
        
    }

}
