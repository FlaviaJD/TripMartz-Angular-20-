
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/employee/src/app/core/api-handlers';

import { Logger } from 'projects/employee/src/app/core/logger/logger.service';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { UtilityService } from 'projects/employee/src/app/core/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

const log = new Logger('support ticket/AgentCallbackComponent');

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.scss']
})
export class CreateTrainingComponent implements OnInit {
  private subSunk = new SubSink();
  @ViewChild('theFile', { static: false }) fileUploader: ElementRef;

  isOpen = false as boolean;
  mytime: Date;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    containerClass: 'theme-blue',
    showWeekNumbers: false
  };
  regConfig: FormGroup;
  logoConfig: FormGroup;
  selectRqeType: string;
  noData: boolean = true;
  respData: any;
  requestTypes: any;
  protected subs = new SubSink();
  currentUser: any = {};
  trainerNameList: any = [];
  trainingNameList: any = [];
  trainingVenueList: any = [];
  loggedInUser;
  employeeCSV: string;
  imgObj = {
    isLogoToUpdate: false,
    isUploaded: false,
  };
  isClicked: boolean = false;
  checkedServices: string[] = [];
  services=[
      {
          "value": "Flight",
          "name": "Flight"
      },
      {
          "value": "Hotel",
          "name": "Hotel"
      },
      {
          "value": "Bus",
          "name": "Bus"
      }
   
    ]

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private apiHandlerService: ApiHandlerService,
    private util: UtilityService
  ) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    this.createForm();
    this.getTrainingName();
    this.getTrainerName();
    this.getTrainingVenue();
    this.currentUser = this.util.readStorage('currentUser', localStorage);
  }

  getTrainingName() {
    this.trainingNameList = "";
    this.subSunk.sink = this.apiHandlerService.apiHandler('trainingName', 'POST', '', '', {})
      .subscribe(res => {
        if (res.statusCode == 200 || res.statusCode == 201) {
          this.trainingNameList = res.data
        } else {
          this.trainingNameList = [];
        }
      }, (err) => {
        this.trainingNameList = [];
      });
  }

  getTrainerName() {
    this.trainerNameList = "";
    this.subSunk.sink = this.apiHandlerService.apiHandler('trainerName', 'POST', '', '', {})
      .subscribe(res => {
        if (res.statusCode == 200 || res.statusCode == 201) {
          this.trainerNameList = res.data
        } else {
          this.trainerNameList = [];
        }
      }, (err) => {
        this.trainerNameList = [];
      });
  }

  getTrainingVenue() {
    this.trainingVenueList = "";
    this.subSunk.sink = this.apiHandlerService.apiHandler('trainingVenue', 'POST', '', '', {})
      .subscribe(res => {
        if (res.statusCode == 200 || res.statusCode == 201) {
          this.trainingVenueList = res.data
        } else {
          this.trainingVenueList = [];
        }
      }, (err) => {
        this.trainingVenueList = [];
      });
  }

  onSubmit() {
    if (this.regConfig.invalid) {
      return;
    }
    let payload = this.regConfig.value;
    payload.Services=this.checkedServices.join(',');
    payload.TrainingDate = moment(payload.TrainingDate).format("DD-MM-YYYY");
    delete payload.SelectedFile;
    const formData = new FormData();
    // Append each field to the FormData object
    Object.keys(payload).forEach(key => {
      if (key != 'file') {
        if (Array.isArray(payload[key])) {
          // If the value is an array, append each array element separately
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          // If the value is not an array, append it as is
          formData.append(key, payload[key]);
        }
      }
    });

    this.subs.sink = this.apiHandlerService.apiHandler('addTrainingDetails', 'POST', {}, {}, formData).subscribe(res => {
      if (res.result || res.Status) {
        this.swalService.alert.success("Training details added successfully.");
        this.regConfig.reset();
      } else {
        this.swalService.alert.oops(res.Message);
      }
    }, (err: HttpErrorResponse) => {
      log.debug(err);
      console.error(err);
      this.swalService.alert.oops();
    }
    );
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onReset() {

  }

onServiceChange(service: string, isChecked: boolean) {
  if (isChecked) {
    this.checkedServices.push(service);
  } else {
    const index = this.checkedServices.indexOf(service);
    if (index !== -1) {
      this.checkedServices.splice(index, 1);
    }
  }
}


  createForm() {
    this.regConfig = this.fb.group({
      TrainingName: new FormControl('', [Validators.required]),
      TrainingDate: new FormControl('', [Validators.required]),
      TrainingTime: new FormControl('', [Validators.required]),
      Trainer: new FormControl('', [Validators.required]),
      Venue: new FormControl('', [Validators.required]),
      Services: new FormControl('', [Validators.required]),
      SelectedFile: new FormControl(''),
      SelectedTrainingImage: new FormControl(''),
      Employeecsv: new FormControl('')
    })
  }
  onFileSelected($event) {
    const file = $event.target.files[0];
    if (file && file.size) {
      let result = this.validateFileSize(file.size);
      if (!result) {
        this.fileUploader.nativeElement.value = null;
        return;
      }
    }
    if (file.name) {
      this.regConfig.get('Employeecsv').setValue(file);
    }
  }

  validateFileSize(fileSize) {
    if (fileSize > 1048576) {
      this.swalService.alert.oops("Maximum upload file size: 1 MB");
      return false;
    }
    else {
      return true
    }
  }

  onSampleDownload(event: Event) {
    event.preventDefault();
    const csvContent = this.generateCsvContent();
    this.downloadFile(csvContent, 'EmployeeList.csv');
    this.isClicked = true;
  }

  private generateCsvContent(): string {
    const header = 'Employee ID\n';
    const row = 'DCB0001\n';
    return header + row;
  }

  private downloadFile(content: string, fileName: string) {
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  onSelect(e) {
  }

  ngOnDestroy() { }
}
