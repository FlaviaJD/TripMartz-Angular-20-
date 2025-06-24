import { Component, OnInit, Output, EventEmitter } from "@angular/core";
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
  selector: "app-create-update-duration",
  templateUrl: "./create-update-duration.component.html",
  styleUrls: ["./create-update-duration.component.scss"],
})
export class CreateUpdateDurationComponent implements OnInit {
  @Output() courseDurationUpdate = new EventEmitter<any>();
  public courseDurationForm: FormGroup;
  public fileUploadForm: FormGroup;
  public courseDurationList: { key: string; value: string }[] = [
    { key: "1", value: "1" },
    { key: "2", value: "2" },
    { key: "3", value: "3" },
    { key: "4", value: "4" },
    { key: "5", value: "5" },
  ];

  public showDiv = {
    Details: true,
    Csv: false,
  };
  public isClicked: boolean = false;
  public subSunk = new SubSink();
  public csvFileName: string = "";
  public isUpdate: boolean = false;

  constructor(
    private masterService: MasterService,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.courseDurationForm = new FormGroup({
      course_duration: new FormControl("", [Validators.required]),
    });

    this.fileUploadForm = new FormGroup({
      file_upload: new FormControl("", [Validators.required]),
    });
  }

  onSubmit() {}

  onReset() {
    this.courseDurationForm.reset();
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

  onFileReset() {}
  onCourseDurationUpdate(data): void {
    this.masterService.studentCourseDurationData.next(data);
    this.courseDurationUpdate.emit({
      tabId: "create/update_course_duration",
      data,
    });
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
    this.downloadFile(csvContent, "employee_sample_data.csv");
    this.isClicked = true;
  }

  private generateCsvContent(): string {
    const header =
      "employeeId,title,first_name,last_name,position_name,department_name,cost_center,email,phone,address,city,state,country,pincode,xlpro_client_code,approvar_required,approvar_id,gender,is_approvar,access\n";
    const row =
      "EMP1001,1,Animesh,Singh,GROUP ASSOCIATE VICE PRESIDENT,DATA SCIENCE & INSIGHTS,3107,animeshtest@gmail.com,9876543210,Electronic City,Bangalore,Karnataka,151,56100,8765,TRUE,522,Male,TRUE,on_behalf,personal";
    return header + row;
  }
}
