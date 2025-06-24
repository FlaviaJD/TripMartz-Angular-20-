import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
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

@Component({
  selector: "app-create-update-university",
  templateUrl: "./create-update-university.component.html",
  styleUrls: ["./create-update-university.component.scss"],
})
export class CreateUpdateUniversityComponent implements OnInit, OnDestroy {
  @Output() universityUpdate = new EventEmitter<any>();
  public universityForm: FormGroup;
  public fileUploadFrom: FormGroup;
  public cityList: any = [];
  public countryList: any = [];
  public showDiv = {
    Details: true,
    Csv: false,
  };
  public isClicked: boolean = false;
  public csvFileName: string = "";
  public subSunk = new SubSink();
  public isUpdate: boolean = false;
  public id: number;
  public primaryColour: any;
  public secondaryColour: any;
  public loadingTemplate: any;
  public loading: boolean = false;

  constructor(
    private masterService: MasterService,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    this.createForm();
    this.getCityList();
    this.getCountriesList();
    this.updateUniversity();
  }

  createForm() {
    this.universityForm = this.fb.group({
      university_name: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
    });

    this.fileUploadFrom = this.fb.group({
      upload_file: new FormControl("", [Validators.required]),
    });
  }

  onSubmit() {
    let formValue = this.universityForm.value;
    let reqObj = {
      uni_name: formValue.university_name,
      city_name: formValue.city,
      country_name: formValue.country,
    };
    if (this.universityForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.isUpdate) {
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("universityCreate", "post", {}, {}, reqObj)
        .subscribe(
          (res) => {
            if (res.statusCode == 200 || res.statusCode == 201) {
              this.universityForm.reset();
              this.universityUpdate.emit({ tabId: "studentsUniversity", res });
              this.loading = false;
            } else {
              this.swalService.alert.error("Unable to add University");
              this.loading = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
            this.loading = false;
          }
        );
    } else {
      reqObj["id"] = this.id;
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("universityUpdate", "post", {}, {}, reqObj)
        .subscribe(
          (res) => {
            if (res.statusCode == 200 || res.statusCode == 201) {
              this.isUpdate = false;
              this.loading = false;
              this.universityForm.reset();
              this.universityUpdate.emit({ tabId: "studentsUniversity", res });
            } else {
              this.swalService.alert.error("Unable to update university");
              this.loading = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.error(err["error"]["Message"]);
            this.loading = false;
          }
        );
    }
  }

  onReset() {
    this.universityForm.reset();
    this.isUpdate = false;
  }

  onCSVUpload() {
    const file = this.fileUploadFrom.get("upload_file").value;
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
    this.fileUploadFrom.reset();
    this.csvFileName = "";
  }

  uploadFile($event) {
    const file = $event.target.files[0];
    this.fileUploadFrom.get("upload_file").patchValue(file);
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
    this.downloadFile(csvContent, "student_universities_list_data.csv");
    this.isClicked = true;
  }

  private generateCsvContent(): string {
    const header =
      "employeeId,title,first_name,last_name,position_name,department_name,cost_center,email,phone,address,city,state,country,pincode,xlpro_client_code,approvar_required,approvar_id,gender,is_approvar,access\n";
    const row =
      "EMP1001,1,Animesh,Singh,GROUP ASSOCIATE VICE PRESIDENT,DATA SCIENCE & INSIGHTS,3107,animeshtest@gmail.com,9876543210,Electronic City,Bangalore,Karnataka,151,56100,8765,TRUE,522,Male,TRUE,on_behalf,personal";
    return header + row;
  }

  onUniversityUpdate(data): void {
    this.masterService.studentUniversityData.next(data);
    this.universityUpdate.emit({ tabId: "create/update_university", data });
  }

  updateUniversity(): void {
    this.subSunk.sink = this.masterService.studentUniversityData.subscribe(
      (data) => {
        if (data) {
          this.id = data.id;
          this.universityForm.patchValue({
            university_name: data.uni_name ? data.uni_name : "",
            city: data.city ? data.city : "",
            country: data.country ? data.country : "",
          });
          this.isUpdate = true;
        }
      }
    );
  }

  getCityList(): void {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("getCity", "post", {}, {}, {})
      .subscribe(
        (res) => {
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

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
