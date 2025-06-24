import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { UtilityService } from "projects/supervision/src/app/core/services/utility.service";
ApiHandlerService;
import { SubSink } from "subsink";
@Component({
  selector: "app-import-pnr",
  templateUrl: "./import-pnr.component.html",
  styleUrls: ["./import-pnr.component.scss"],
})
export class ImportPnrComponent implements OnInit {
  isSubmitted = false;
  regConfig: FormGroup;
  private subSunk = new SubSink();
  respData: Array<any> = [];
  noData: boolean = true;
  agentDetails: any;
  constructor(
    public fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private util: UtilityService,
  ) { }

  createForm = this.fb.group({
    agents: new FormControl('', [Validators.required]),
    SelectApi: new FormControl("", [Validators.required]),
    EnterPNR: new FormControl("", [Validators.required]),
  });

  ngOnInit() {
    this.getUserList();
  }
  getUserList() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('userList', 'post', {}, {}, {
      auth_role_id: 2,
      status: 1
    }).subscribe(resp => {
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.respData = resp.data;
        if (this.agentDetails && this.agentDetails.id)
          this.onChange(Number(this.agentDetails.id))
      }
    });
  }
  onChange(agent_id) {
    this.agentDetails = this.respData.find(val => val.id == agent_id);
    if (!this.util.isEmpty(this.agentDetails)) {
    }
  }

  onSubmit(): void {
    let req = {
      agent_id: Number(this.agentDetails.id),
      booking_source: this.createForm.value.SelectApi,
      PNR: this.createForm.value.EnterPNR,
    };
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("importPnrList", "post", {}, {}, req)
      .subscribe((resp) => {
      });
  }
}
