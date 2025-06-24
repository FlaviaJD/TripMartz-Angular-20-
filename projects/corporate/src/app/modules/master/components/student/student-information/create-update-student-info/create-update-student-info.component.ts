import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { MasterService } from "../../../../master.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiHandlerService } from "projects/corporate/src/app/core/api-handlers";
import { SubSink } from "subsink";
import { SwalService } from "projects/corporate/src/app/core/services/swal.service";
import { HttpErrorResponse } from "@angular/common/http";
import { UtilityService } from "projects/corporate/src/app/core/services/utility.service";
@Component({
  selector: "app-create-update-student-info",
  templateUrl: "./create-update-student-info.component.html",
  styleUrls: ["./create-update-student-info.component.scss"],
})
export class CreateUpdateStudentInfoComponent implements OnInit, OnDestroy {
  @Output() studentInfoUpdate = new EventEmitter<any>();
  public studentInformationForm: FormGroup;
  public fileUploadForm: FormGroup;
  public courseList: [] = [];
  public courseNameList: [] = [];
  public cityList: [] = [];
  public countryList: [] = [];
  public statesList: [] = [];
  public showDiv = {
    Details: true,
    Csv: false,
  };
  public isClicked: boolean = false;
  public subSunk = new SubSink();
  public csvFileName: string = "";
  public isUpdate: boolean = false;
  public lastKeyupTstamp: number = 0;
  public titleList: [] = [];
  public courseTypeList: [] = [];
  public universityList: [] = [];
  public searchText: string = "";
  public filterCityList: any;
  public salesExecutiveList: any;
  public searchedExecutive: string = "";
  public respData: any;

  constructor(
    private masterService: MasterService,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private utility: UtilityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    this.createForm();
    this.getCourseList();
    this.getCityList();
    this.getCourseTypeList();
    this.getUniversityList();
    this.getCountriesList();
    this.getTitleList();
    this.getEmployeeList();
    this.updateStudentInformation();
  }

  getCourseList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("courseNameList", "post", {}, {})
      .subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.courseList = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err["error"]["Message"]);
        }
      );
  }

  getCourseTypeList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("courseTypeList", "post", {}, {})
      .subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.courseTypeList = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err["error"]["Message"]);
        }
      );
  }

  getEmployeeList(): void {
    this.subSunk.sink = this.apiHandlerService.apiHandler('getEmployee', 'post', {}, {},{
    })
      .subscribe(res => {
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.respData=res.data;
            this.salesExecutiveList = [...this.respData];
          }
        },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
     });
}

  getUniversityList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("universitiesList", "post", {}, {})
      .subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.universityList = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err["error"]["Message"]);
        }
      );
  }

  getCityList(): void {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("getCity", "post", {}, {}, {})
      .subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.cityList = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err["error"]["Message"]);
        }
      );
  }

  getCountriesList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("countryList", "post", "", "")
      .subscribe((res) => {
        this.countryList = res.data.countries;
      });
  }

  getTitleList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("userTitleList", "post", "", "")
      .subscribe((res) => {
        this.titleList = res.data;
      });
  }

  createForm() {
    this.studentInformationForm = this.fb.group({
      title: new FormControl("", Validators.required),
      first_name: new FormControl("", Validators.required),
      last_name: new FormControl("", Validators.required),
      gender: new FormControl("", Validators.required),
      college: new FormControl("", Validators.required),
      course_type: new FormControl("", Validators.required),
      course_name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      sales_executive: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      locality: new FormControl("", Validators.required),
      city: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      country: new FormControl("", Validators.required),
      zip_code: new FormControl("", Validators.required),
      status: new FormControl("", Validators.required),
      travel_credit_limit: new FormControl("", Validators.required),
    });

    this.fileUploadForm = new FormGroup({
      file_upload: new FormControl("", Validators.required),
    });
  }

  formData() {
    let formData = this.studentInformationForm.value;
    let reqObj = {
      status: formData.status,
      email: formData.email,
      employeeId: "HM00022",
      title: formData.title,
      first_name: formData.first_name,
      last_name: formData.last_name,
      address: formData.address,
      phone: formData.phone,
      city: formData.city,
      locality: formData.locality,
      state: formData.state,
      country: formData.country,
      pincode: formData.zip_code,
      college_name: formData.college,
      course_type: formData.course_type,
      course_name: formData.course_name,
      staff_id: formData.sales_executive.id,
      credit_limit: formData.travel_credit_limit,
      gender: formData.gender == 1 ? "Male" : "Female",
    };

    return reqObj;
  }

  onDropdownOpen() {
    this.searchText = '';
    this.filterCityList = [...this.cityList];
  }

  onSalesExecutiveDropdownOpen() {
    this.searchedExecutive = '';
    this.salesExecutiveList = [...this.respData];
  }

  filteredSalesExecutive(value) {
    const search = value.target.value.toLowerCase();
    this.salesExecutiveList = this.respData.filter((sales: any) =>
  sales.first_name.toLowerCase().includes(search)
    );
    this.cdr.detectChanges();
  }
  filteredCities(value) {
    const search = value.target.value.toLowerCase();
    this.filterCityList = this.cityList.filter((city: any) =>
  city.city_name.toLowerCase().includes(search)
    );
    this.cdr.detectChanges();
  }
  onSubmit() {
    if (this.studentInformationForm.invalid) {
      return;
    }
    let req = this.formData();
    // req['auth_role_id'] = GlobalConstants.STUDENT_AUTH_ROLE_ID;
    if (!this.isUpdate) {
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("studentRegistration", "post", {}, {}, req)
        .subscribe(
          (resp) => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success("Student added successfully.");
              this.studentInformationForm.reset();
              this.studentInfoUpdate.emit({ tabId: "studentsInformation" });
            } else {
              this.swalService.alert.oops("Unable to create student.");
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.oops(err.error.Message);
          }
        );
    } else {
      this.isUpdate = false;
    }
  }

  onReset() {
    this.studentInformationForm.reset();
  }

  onCSVUpload() {
    const file = this.fileUploadForm.get("file_upload").value;
    if (file) {
      if (file.name.endsWith(".csv")) {
        const formData = new FormData();
        formData.append("csv", file);
        // this.subSunk.sink = this.apiHandlerService.apiHandler('uploadEmployeeCSV', 'post', {}, {},
        // formData
        // ).subscribe(response => {
        // if (response.statusCode == 200 || response.statusCode == 201) {
        //     this.swalService.alert.success('Employee CSV Data has been added successfully')
        //     // this.toUpdate.emit({ tabId: 'employeeList', data:'CSV Upload' });
        // }
        // },(err: HttpErrorResponse) => {
        //     this.swalService.alert.error(err['error']['Message']);
        // });
      } else {
        this.swalService.alert.error("Please select a valid csv file");
      }
    }
  }

  onFileReset() {
    this.fileUploadForm.reset();
    this.csvFileName = "";
  }

  updateStudentInfo() {
    this.subSunk.sink = this.masterService.studentInformationData.subscribe(
      (res) => {
        if (res) {
          console.log("res",res)
          this.studentInformationForm.patchValue({
            title: "",
            first_name: "",
            last_name: "",
            gender: "",
            college: "",
            course_type: "",
            course_name: "",
            phone: "",
            email: "",
            sales_executive: "",
            address: "",
            locality: "",
            city: "",
            state: "",
            country: "",
            zip_code: "",
            status: "",
            travel_credit_limit: "",
          });
        }
        this.isUpdate = true;
      }
    );
  }

  uploadFile($event) {
    const file = $event.target.files[0];
    this.fileUploadForm.get("upload_file").patchValue(file);
    this.csvFileName = file.name;
  }

  private downloadFile(content: string, fileName: string) {
    const blob = new Blob([content], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  onSampleDownload(event: Event) {
    event.preventDefault();
    const csvContent = this.generateCsvContent();
    this.downloadFile(csvContent, "student_data.csv");
    this.isClicked = true;
  }

  private generateCsvContent(): string {
    const header =
      "employeeId,title,first_name,last_name,position_name,department_name,cost_center,email,phone,address,city,state,country,pincode,xlpro_client_code,approvar_required,approvar_id,gender,is_approvar,access\n";
    const row =
      "EMP1001,1,Animesh,Singh,GROUP ASSOCIATE VICE PRESIDENT,DATA SCIENCE & INSIGHTS,3107,animeshtest@gmail.com,9876543210,Electronic City,Bangalore,Karnataka,151,56100,8765,TRUE,522,Male,TRUE,on_behalf,personal";
    return header + row;
  }

  getAutoCompleteState(event, type) {
    let inpValue = event.target.value;
    if (inpValue.length > 0 && event.timeStamp - this.lastKeyupTstamp > 10) {
      this.subSunk.sink = this.apiHandlerService
        .apiHandler(
          "stateList",
          "post",
          {},
          {},
          {
            state_name: `${inpValue}`,
          }
        )
        .subscribe(
          (resp) => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
              this.statesList = resp.data || [];
            } else {
              // log.error('Something went wrong')
            }
          },
          (err) => {
            // log.error(err)
          }
        );
      this.lastKeyupTstamp = event.timeStamp;
    }
  }

  onStateSelect(state: any) {
    this.studentInformationForm.patchValue({ state: state.name });
    this.statesList = [];
  }

  onStudentInfoUpdate(data): void {
    this.masterService.studentInformationData.next(data);
    this.studentInfoUpdate.emit({
      tabId: "create/update_student_information",
      data,
    });
  }

  updateStudentInformation() {
    this.subSunk.sink = this.masterService.studentInformationData.subscribe(
      (data) => {
        if (data) {
          this.studentInformationForm.patchValue(data);
        }
      }
    );
  }

  omitSpecialCharacters(event) {
    let k = event.charCode;
    if ((k > 64 && k < 91) || (k > 96 && k < 123)) {
      return true;
    } else {
      return false;
    }
  }

  numberOnly(event): boolean {
    return this.utility.numberOnly(event);
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
