import { HttpErrorResponse } from "@angular/common/http";
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import * as moment from "moment";
import { SubSink } from "subsink";
import { ApiHandlerService } from "../../../../../../core/api-handlers";
import { SwalService } from "../../../../../../core/services/swal.service";
import { PaymentService } from "../../../../payment.service";
import { environment } from "../../../../../../../../src/environments/environment";
import { UtilityService } from "projects/employee/src/app/core/services/utility.service";
const baseUrl = environment.B2B_URL;
@Component({
  selector: "app-nagad",
  templateUrl: "./nagad.component.html",
  styleUrls: ["./nagad.component.scss"],
})
export class NagadComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  @Input("requestType") requestType;
  @Input("paymentType") paymentType;
  @Output() activateSubChildTab = new EventEmitter<string>();
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
  maxDate = new Date();
  isOpen = false as boolean;
  // date = false as boolean;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: "YYYY-MM-DD",
    rangeInputFormat: "YYYY-MM-DD",
    containerClass: "theme-blue",
    showWeekNumbers: false
  };
  regConfig: FormGroup;
  logoConfig: FormGroup;
  noData: boolean = true;
  respData: any;
  addOrUpdate: string = "";
  bankLogo: string;
  logoBankUri = `${baseUrl}/sa/cms/cms-bankaccounts/`;
  imgObj = {
    isLogoToUpdate: false,
    isUploaded: false,
  };
  depositRequestData: any = {};
  
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private utility: UtilityService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.paymentService.depositRequestData.subscribe((data) => {
      this.depositRequestData = data;
    });
  }

  imageSrc;
  onFileSelected($event) {
    const file = $event.target.files[0];
    if (file && file.size) {
        let result=this.validateFileSize(file.size);
        if(!result){
            this.bankLogo = "";
            this.imageSrc=""
            this.fileUploader.nativeElement.value = null;
            this.logoConfig.reset();
            return;
        }
    }
    if (file.name) {
      this.bankLogo = "";
      this.imgObj.isLogoToUpdate = true;
      this.logoConfig.setValue({ file_upload: file });
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.imgObj.isLogoToUpdate = false;
    }
  }

  validateFileSize(fileSize) {
    if (fileSize >1048576) {
        this.swalService.alert.oops("Maximum upload file size: 1 MB");
        return false;
    }
    else {
        return true
    }
}

  ondateChange(e) { }

  createForm() {
    this.regConfig = this.fb.group({
       amount: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),
      date: new FormControl("", [Validators.required]),
      remarks: new FormControl("", [
        Validators.minLength(2),
        Validators.maxLength(200),
      ]),
    });

    this.logoConfig = this.fb.group({
      file_upload: new FormControl("",[Validators.required]),
    });
  }

  async onSubmit() {
    if (this.regConfig.invalid) return;
    if(this.depositRequestData.paymentType == 'Cash Bank Deposit' && this.logoConfig.invalid){
        this.swalService.alert.oops("Kindly upload transaction document");
        return;
    }
    const formData = await new FormData();
    await formData.append('transactiontype', this.depositRequestData.requestType);
    await formData.append('bankname', "");
    await formData.append('branchname', "");
    await formData.append('accountnumber', "");
    await formData.append('depositedbranch', "");
    await formData.append('amount', this.regConfig.value.amount);
    await formData.append('dateoftransaction', moment(this.regConfig.value.date).format("YYYY-MM-DD HH:mm:ss"),);
    formData.append('remarks', this.regConfig.value.remarks);
    if (this.logoConfig.get('file_upload').value) {
      await formData.append('request_file', this.logoConfig.get('file_upload').value);
    }
    formData.append('transactionnumber', this.regConfig.value.transactionnumber || 12345);
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("balanceRequestAccountSys", "post", {}, {}, formData)
      .subscribe(
        (resp) => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.swalService.alert.success();
            this.onReset();
            this.activateSubChildTab.emit("History_Deposit_Request");
          } else {
            this.swalService.alert.oops();
          }
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.swalService.alert.oops();
        }
      );
  }

  onReset() {
    this.regConfig.reset();
    this.regConfig.clearValidators();
    this.logoConfig.reset();
    this.bankLogo = "";
    this.imageSrc="";
   // this.fileUploader.nativeElement.value = null;
  }


  numberOnly(event): boolean {
    return this.utility.numberOnly(event);
}

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
