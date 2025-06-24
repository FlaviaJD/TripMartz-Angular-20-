import {
  Component,
  OnInit,
  Output,
  EventEmitter,
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

interface Course {
  key?: string;
  value?: string;
}
@Component({
  selector: "app-create-update-course",
  templateUrl: "./create-update-course.component.html",
  styleUrls: ["./create-update-course.component.scss"],
})
export class CreateUpdateCourseComponent implements OnInit, OnDestroy {
  @Output() courseListUpdate = new EventEmitter<any>();
  public courseForm: FormGroup;
  public fileUploadForm: FormGroup;
  public courseList: Course[] = [
    { key: "hotel_management", value: "Hotel Management" },
    { key: "mba", value: "MBA" },
  ];

  public showDiv = {
    Details: true,
    Csv: false,
  };
  public isClicked: boolean = false;
  public subSunk = new SubSink();
  public csvFileName: string = "";
  public isUpdate: boolean = false;
  public loading: boolean = false;
  public id: number = 0;
  public respData: [] = [];
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
    this.getCourseTypeList()
    this.createForm();
    this.updateCourse();
    
  }

  createForm() {
    this.courseForm = this.fb.group({
      select_course: new FormControl("", Validators.required),
      course_name:new FormControl("", Validators.required),
    });

    this.fileUploadForm = this.fb.group({
      upload_file: new FormControl("", Validators.required),
    });
  }
getCourseTypeList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("courseTypeList", "post", {}, {})
      .subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.respData = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err["error"]["Message"]);
        }
      );
  }
  onDepartmentUpdate(data): void {
    this.masterService.studentCourseUpdateData.next(data);
    this.courseListUpdate.emit({ tabId: "create/update_student_course", data });
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      return;
    }
    const formData = this.courseForm.value;
    let reqObj = {
      course_type: formData.select_course,
      course_name:formData.course_name
    };
    if (this.isUpdate) {
      this.subSunk.sink = this.apiHandlerService
        .apiHandler("courseNameCreate", "post", {}, {}, reqObj)
        .subscribe(
          (res) => {
            if (res.statusCode == 200 || res.statusCode == 201) {
              this.courseForm.reset();
              this.isUpdate = false;
              this.swalService.alert.success("Course added successfully.");
              this.courseListUpdate.emit({ tabId: "studentCourseList", res });
              this.loading = false;
            } else {
              this.swalService.alert.error("Unable to add course");
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
        .apiHandler("courseNameUpdate", "post", {}, {}, reqObj)
        .subscribe(
          (res) => {
            if (res.statusCode == 200 || res.statusCode == 201) {
              this.isUpdate = false;
              this.loading = false;
              this.courseForm.reset();
              this.swalService.alert.success("Course updated successfully.");
              this.courseListUpdate.emit({ tabId: "studentCourseList", res });
            } else {
              this.swalService.alert.error("Unable to update course");
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
    this.courseForm.reset();
    this.isUpdate = false;
  }

  updateCourse() {
    this.subSunk.sink = this.masterService.studentCourseUpdateData.subscribe(
      (data) => {
        if (data) {
          this.id = data.course_id;
          this.courseForm.patchValue({
            select_course: data.course_type,
             course_name: data.course_name,
          });
          this.isUpdate = true;
        }
      }
    );
  }

  onCSVUpload() {
    const file = this.fileUploadForm.get("upload_file").value;
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
    this.downloadFile(csvContent, "student_course_list_data.csv");
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
