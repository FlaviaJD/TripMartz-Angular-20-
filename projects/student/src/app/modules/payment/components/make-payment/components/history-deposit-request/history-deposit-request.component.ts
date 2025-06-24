import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig, Sort } from "@angular/material";
import { ApiHandlerService } from "projects/student/src/app/core/api-handlers";
import { SwalService } from "projects/student/src/app/core/services/swal.service";
import { UtilityService } from "projects/student/src/app/core/services/utility.service";
import { environment } from "projects/student/src/environments/environment.prod";
import { SubSink } from "subsink";
import { PaymentService } from "../../../../payment.service";
import { ImageViewComponent } from "../image-view/image-view.component";

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
const baseUrl = environment.B2B_URL;
@Component({
  selector: "app-history-deposit-request",
  templateUrl: "./history-deposit-request.component.html",
  styleUrls: ["./history-deposit-request.component.scss"],
})
export class HistoryDepositRequestComponent implements OnInit, OnDestroy {
  private subSunk = new SubSink();
  transaction_type = "All";
  requestTypes: Array<any> = [
    { name: "All" },
    { name: "Cash" },
    { name: "Cheque/DD" },
    { name: "E-Transfer" },
    { name: "CashFree" },
    { name: "Razorpay" }
  ];
  searchText: string;
  pageSize = 100;
  page = 1;
  collectionSize: number = 40;
  status: boolean;
  respData: Array<any> = [];
  displayColumn: { key: string; value: string }[] = [
    { key: "id", value: "Sl No." },
    { key: "system_transaction_id", value: "System Transaction ID" },
    { key: "mode_of_payment", value: "Mode Of Payment" }, // need to check
    { key: "request_type", value: "Request Type" },
    { key: "amount", value: "Amount" },
    { key: "bank", value: "Bank" },
    { key: "branch", value: "Branch" },
    { key: "receipt_number", value: "Receipt Number" }, // need to check
    { key: "status", value: "Status" },
    { key: "created_datetime", value: "Request Sent On" },
    { key: "update_remarks", value: "Update Remarks" },
    { key: "Image", value: "Image" },
    { key: 'downloadImage', value: 'Download Image' }
  ];
  noData: boolean = true;
  currentBalance: any;
  logoBankUri = baseUrl;
  
  constructor(
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private paymentService: PaymentService,
    private utility: UtilityService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getBalanceRequestListAccountSys(this.transaction_type);
  }

  getBalanceRequestListAccountSys(transaction_type) {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("balanceRequestListAccountSys", "post", {}, {}, {})
      .subscribe(
        (resp) => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
            this.respData = resp.data || [];
            this.noData = false;
            respDataCopy = [...this.respData];
            //latest on toplist
            this.sortData({
              active: "created_datetime",
              direction: "desc",
            });
            if (transaction_type && transaction_type != "All") {
              this.respData = this.respData.filter(
                (x) => x.transaction_type == transaction_type
              );
            }
          } else {
            this.noData=false;
            this.respData=[];
          }
        },
        (err: HttpErrorResponse) => {
            this.noData=false;
            this.respData=[];
        }
      );
  }

  applyFilter(text: string) {
    text = text.toLocaleLowerCase().trim();
  }

  getRequestTypes() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("getRequestTypes", "post", {}, {}, {})
      .subscribe((resp) => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.requestTypes = resp.data;
        }
      });
  }

  onSelect(e) {
    this.getBalanceRequestListAccountSys(e);
  }

  sortData(sort: Sort) {
    const data = filterArray.length ? filterArray : [...respDataCopy];
    if (!sort.active || sort.direction === "") {
      this.respData = data;
      return;
    }
    this.respData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "system_transaction_id":
          return this.utility.compare(
            "" + a.system_transaction_id,
            "" + b.system_transaction_id,
            isAsc
          );
        case "mode_of_payment":
          return this.utility.compare(
            "" + a.mode_of_payment.toLocaleLowerCase(),
            "" + b.mode_of_payment.toLocaleLowerCase(),
            isAsc
          );
        case "request_type":
          return this.utility.compare(
            "" + a.request_type.toLocaleLowerCase(),
            "" + b.request_type.toLocaleLowerCase(),
            isAsc
          );
        case "amount":
          return this.utility.compare(+a.amount, +b.amount, isAsc);
        case "bank":
          return this.utility.compare(
            "" + a.bank.toLocaleLowerCase(),
            "" + b.bank.toLocaleLowerCase(),
            isAsc
          );
        case "branch":
          return this.utility.compare(
            "" + a.branch.toLocaleLowerCase(),
            "" + b.branch.toLocaleLowerCase(),
            isAsc
          );
        case "transaction_number":
          return this.utility.compare(
            "" + a.transaction_number.toLocaleLowerCase(),
            "" + b.transaction_number.toLocaleLowerCase(),
            isAsc
          );
        case "receipt_number":
          return this.utility.compare(
            "" + a.receipt_number.toLocaleLowerCase(),
            "" + b.receipt_number.toLocaleLowerCase(),
            isAsc
          );
        case "status":
          return this.utility.compare(+a.status, +b.status, isAsc);
        case "created_datetime":
          return this.utility.compare(
            "" + a.created_datetime.toLocaleLowerCase(),
            "" + b.created_datetime.toLocaleLowerCase(),
            isAsc
          );
        case "update_remarks":
          return this.utility.compare(
            "" + a.update_remarks.toLocaleLowerCase(),
            "" + b.update_remarks.toLocaleLowerCase(),
            isAsc
          );

        default:
          return 0;
      }
    });
  }

    showPreviewImage(imageURL?: any) {
        this.openDialog(imageURL);
    }

    openDialog(data?: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'dialog-container';
        dialogConfig.autoFocus = true;
        dialogConfig.data = data || '';
        this.dialog.open(ImageViewComponent, dialogConfig);
    }

    async downloadPreviewImage(imageURL?: any) {
        if (!imageURL || imageURL.includes('undefined')) {
            this.swalService.alert.oops("No image found.");
        }
        else {
            const a = document.createElement("a");
            a.href = await this.toDataURL(imageURL);
            a.download = "image";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.swalService.alert.success("Image downloaded.");

        }

    }

    toDataURL(url) {
        return fetch(url).then((response) => {
            return response.blob();
        }).then(blob => {
            return URL.createObjectURL(blob);
        });
    }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
