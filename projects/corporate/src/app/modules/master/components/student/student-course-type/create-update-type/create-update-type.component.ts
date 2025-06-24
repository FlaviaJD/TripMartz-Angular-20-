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
  selector: "app-create-update-type",
  templateUrl: "./create-update-type.component.html",
  styleUrls: ["./create-update-type.component.scss"],
})
export class CreateUpdateTypeComponent implements OnInit, OnDestroy {
  @Output() courseTypeUpdate = new EventEmitter<any>();
  public courseTypeForm: FormGroup;
  public fileUploadForm: FormGroup;
  public courseList: { key: string; value: string }[] = [
    { key: "degree", value: "Degree" },
    { key: "diploma", value: "Diploma" },
    { key: "post_graduation", value: "Post Graduation" },
  ];

  public showDiv = {
    Details: true,
    Csv: false,
  };
  public isClicked: boolean = false;
  public subSunk = new SubSink();
  public csvFileName: string = "";
  public isUpdate: boolean = false;
  public id: number = 0;

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
    this.updateCourseType();
  }

  createForm() {
    this.courseTypeForm = this.fb.group({
      course_type: new FormControl("", [Validators.required]),
    });

    this.fileUploadForm = this.fb.group({
      file_upload: new FormControl("", [Validators.required]),
    });
  }
  onCourseTypeUpdate(data): void {
    this.masterService.studentCourseTypeData.next(data);
    this.courseTypeUpdate.emit({ tabId: "create/update_course_type", data });
  }

  updateCourseType() {
    this.subSunk.sink = this.masterService.studentCourseTypeData.subscribe(
      (data) => {
        if (data) {
          this.id = data.id;
          this.isUpdate = true;
          this.courseTypeForm.patchValue({
            course_type: data.course_type_name ? data.course_type_name : "",
          });
        }
      }
    );
  }

  onSubmit() {
    let formData = this.courseTypeForm.value;
    let reqObj = {
      course_type_name: formData.course_type,
    };
    if (this.courseTypeForm.invalid) {
      return;
    }
    if (this.isUpdate) {
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("courseTypeCreate", "post", {}, {}, reqObj)
        .subscribe(
          (resp) => {
            this.isUpdate = false;
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.swalService.alert.success("Course Type added successfully.");
              this.courseTypeForm.reset();
              this.courseTypeUpdate.emit({ tabId: "studentCourseType", resp });
            } else {
              this.swalService.alert.oops("Unable to create course type.");
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.oops(err.error.Message);
          }
        );
    } else {
      reqObj["id"] = this.id;
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("courseTypeUpdate", "post", {}, {}, reqObj)
        .subscribe(
          (resp) => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
              this.isUpdate = false;
              this.swalService.alert.success(
                "Course Type Updated successfully."
              );
              this.courseTypeForm.reset();
              this.courseTypeUpdate.emit({ tabId: "studentCourseType", resp });
            } else {
              this.swalService.alert.oops("Unable to update course type.");
            }
          },
          (err: HttpErrorResponse) => {
            this.swalService.alert.oops(err.error.Message);
          }
        );
    }
  }

  onReset() {
    this.courseTypeForm.reset();
    this.isUpdate = false;
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

  uploadFile($event) {
    const file = $event.target.files[0];
    this.fileUploadForm.get("file_upload").patchValue(file);
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
    this.downloadFile(csvContent, "student_course_type_data.csv");
    this.isClicked = true;
  }

  private generateCsvContent(): string {
    const header =
      "employeeId,title,first_name,last_name,position_name,department_name,cost_center,email,phone,address,city,state,country,pincode,xlpro_client_code,approvar_required,approvar_id,gender,is_approvar,access\n";
    const row =
      "EMP1001,1,Animesh,Singh,GROUP ASSOCIATE VICE PRESIDENT,DATA SCIENCE & INSIGHTS,3107,animeshtest@gmail.com,9876543210,Electronic City,Bangalore,Karnataka,151,56100,8765,TRUE,522,Male,TRUE,on_behalf,personal";
    return header + row;
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
