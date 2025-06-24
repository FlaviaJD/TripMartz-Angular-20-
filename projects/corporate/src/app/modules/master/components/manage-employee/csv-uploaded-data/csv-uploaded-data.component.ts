import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-csv-uploaded-data',
  templateUrl: './csv-uploaded-data.component.html',
  styleUrls: ['./csv-uploaded-data.component.scss']
})
export class CsvUploadedDataComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    searchText='';
    noData: boolean = true;
    excelData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'employeeId', value: 'Employee Id' },
        { key: 'title', value: 'Title' },
        { key: 'firstName', value: 'First Name' },
        { key: 'lastName', value: 'Last Name' },
        { key: "band", value: 'Band' },
        { key: 'positionName', value: 'Position Name' },
        { key: 'departmentName', value: 'Department Name' },
        { key: 'costCenter', value: 'Cost Center' },
        { key: 'phoneNo', value: 'Phone No' },
        { key: 'address', value: 'Address' },
        { key: 'city', value: 'City' },
        { key: 'state', value: 'State' },
        { key: 'country', value: 'Country' },
        { key: 'pinCode', value: 'Pin Code' },
        { key: 'userStatus', value: 'User Status' },
        { key: 'xlproClientCode', value: 'Xlpro Client Code' },
        { key: 'approvar', value: 'Approvar' },
        { key: "approvarRequired", value: 'Approvar Required' },
        { key: "email", value: 'Email' }
    ];
     
    dummyData = [
        {
          employeeId: 101,
          title: "Mr.",
          firstName: "John",
          lastName: "Doe",
          band: "B2",
          positionName: "Software Engineer",
          departmentName: "Engineering",
          costCenter: "CC123",
          phoneNo: "123-456-7890",
          address: "123 Main Street",
          city: "Anytown",
          state: "CA",
          country: "USA",
          pinCode: "12345",
          userStatus: "Active",
          xlproClientCode: "CL456",
          approvar: "Manager",
          approvarRequired: true,
          email: "john.doe@example.com",
        },
        {
          employeeId: 102,
          title: "Ms.",
          firstName: "Jane",
          lastName: "Smith",
          band: "C1",
          positionName: "Product Manager",
          departmentName: "Product Management",
          costCenter: "CC789",
          phoneNo: "987-654-3210",
          address: "456 Elm Street",
          city: "Somewhere",
          state: "NY",
          country: "USA",
          pinCode: "54321",
          userStatus: "Inactive",
          xlproClientCode: "CL789",
          approvar: "Director",
          approvarRequired: false,
          email: "jane.smith@example.com",
        },
        {
          employeeId: 103,
          title: "Dr.",
          firstName: "Robert",
          lastName: "Johnson",
          band: "A3",
          positionName: "Research Scientist",
          departmentName: "Research and Development",
          costCenter: "CC567",
          phoneNo: "555-123-4567",
          address: "789 Oak Avenue",
          city: "Anotherville",
          state: "TX",
          country: "USA",
          pinCode: "67890",
          userStatus: "Active",
          xlproClientCode: "CL123",
          approvar: "Supervisor",
          approvarRequired: true,
          email: "robert.johnson@example.com",
        },
        {
          employeeId: 104,
          title: "Mrs.",
          firstName: "Emily",
          lastName: "Brown",
          band: "B1",
          positionName: "Marketing Coordinator",
          departmentName: "Marketing",
          costCenter: "CC456",
          phoneNo: "987-654-3210",
          address: "567 Pine Street",
          city: "Townsville",
          state: "CA",
          country: "USA",
          pinCode: "54321",
          userStatus: "Active",
          xlproClientCode: "CL789",
          approvar: "Manager",
          approvarRequired: false,
          email: "emily.brown@example.com",
        },
        {
          employeeId: 105,
          title: "Mr.",
          firstName: "Michael",
          lastName: "Davis",
          band: "C2",
          positionName: "Sales Representative",
          departmentName: "Sales",
          costCenter: "CC789",
          phoneNo: "123-456-7890",
          address: "789 Maple Lane",
          city: "Villageville",
          state: "IL",
          country: "USA",
          pinCode: "98765",
          userStatus: "Inactive",
          xlproClientCode: "CL567",
          approvar: "Supervisor",
          approvarRequired: true,
          email: "michael.davis@example.com",
        },
        {
          employeeId: 106,
          title: "Miss",
          firstName: "Sophia",
          lastName: "Wilson",
          band: "A1",
          positionName: "Graphic Designer",
          departmentName: "Design",
          costCenter: "CC345",
          phoneNo: "555-789-1234",
          address: "234 Cedar Street",
          city: "Artville",
          state: "CA",
          country: "USA",
          pinCode: "12345",
          userStatus: "Active",
          xlproClientCode: "CL678",
          approvar: "Manager",
          approvarRequired: false,
          email: "sophia.wilson@example.com",
        },
        {
          employeeId: 107,
          title: "Mr.",
          firstName: "William",
          lastName: "Martinez",
          band: "B2",
          positionName: "Finance Analyst",
          departmentName: "Finance",
          costCenter: "CC678",
          phoneNo: "987-654-3210",
          address: "345 Oak Street",
          city: "Moneyville",
          state: "NY",
          country: "USA",
          pinCode: "54321",
          userStatus: "Active",
          xlproClientCode: "CL567",
          approvar: "Manager",
          approvarRequired: true,
          email: "william.martinez@example.com",
        },
        {
          employeeId: 108,
          title: "Mrs.",
          firstName: "Olivia",
          lastName: "Taylor",
          band: "C1",
          positionName: "Human Resources Manager",
          departmentName: "Human Resources",
          costCenter: "CC234",
          phoneNo: "555-123-4567",
          address: "456 Elm Street",
          city: "HRTown",
          state: "CA",
          country: "USA",
          pinCode: "67890",
          userStatus: "Inactive",
          xlproClientCode: "CL901",
          approvar: "Director",
          approvarRequired: true,
          email: "olivia.taylor@example.com",
        },
        {
          employeeId: 109,
          title: "Dr.",
          firstName: "James",
          lastName: "Anderson",
          band: "A2",
          positionName: "Research Scientist",
          departmentName: "Research and Development",
          costCenter: "CC567",
          phoneNo: "123-456-7890",
          address: "567 Pine Street",
          city: "Labville",
          state: "CA",
          country: "USA",
          pinCode: "98765",
          userStatus: "Active",
          xlproClientCode: "CL890",
          approvar: "Supervisor",
          approvarRequired: false,
          email: "james.anderson@example.com",
        },
        {
          employeeId: 110,
          title: "Ms.",
          firstName: "Ava",
          lastName: "Harris",
          band: "B1",
          positionName: "Customer Support Specialist",
          departmentName: "Customer Support",
          costCenter: "CC123",
          phoneNo: "555-789-1234",
          address: "123 Maple Lane",
          city: "Helpville",
          state: "TX",
          country: "USA",
          pinCode: "12345",
          userStatus: "Active",
          xlproClientCode: "CL123",
          approvar: "Manager",
          approvarRequired: true,
          email: "ava.harris@example.com",
        },
    ];
      
  constructor() { }

  ngOnInit() {
    this.execlUploadedData();
  }

  execlUploadedData(): void {
    setTimeout(() => {
        this.excelData=this.dummyData;
        this.noData=false;
        this.collectionSize = this.excelData.length;
    }, 2000);
  }

  onConfirmExcelUpload(){

  }

  exportExcel(){

  }

  sortData(event){

  }

}
