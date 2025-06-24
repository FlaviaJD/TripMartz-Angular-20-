import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiHandlerService } from '../../../../core/api-handlers';
import { environment } from "projects/corporate/src/environments/environment.prod";
import { SubSink } from "subsink";
import { SwalService } from "projects/corporate/src/app/core/services/swal.service";

const baseUrl = environment.baseUrl;
@Component({
  selector: "app-domain-logo",
  templateUrl: "./domain-logo.component.html",
  styleUrls: ["./domain-logo.component.scss"],
})
export class DomainLogoComponent implements OnInit {
  regConfig: FormGroup;
  bankLogo: string;
  imgObj = {
    isLogoToUpdate: false,
    isUploaded: false,
  };
  logoConfig = new FormGroup({
    domain_logo: new FormControl(null, Validators.required),
  });
  url: any;
  private subSunk = new SubSink();
  submitted: boolean = false;
  loggedInUser: any;
  noData: boolean = true;
  manageDomainData: any;
  @ViewChild ('theFile',{static: false}) fileUploader:ElementRef;
  imageUrl: any;
  image: any;
  domainInformation: any;

  constructor(private fb: FormBuilder, private apiHandlerService: ApiHandlerService, private swalService: SwalService) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem("currentCorpUser"));
   
  }

  imageSrc;
  onFileSelected($event) {
    const file = $event.target.files[0];
    if (file && file.size) {
        let result=this.validateFileSize( file.size);
        if(!result){
            this.bankLogo = "";
            this.imageSrc=""
            this.fileUploader.nativeElement.value = null;
            this.logoConfig.reset();
            this.imgObj.isLogoToUpdate = false;
            return;
        }
    }

    if (file.name) {
      this.bankLogo = "";
      this.imgObj.isLogoToUpdate = true;
      this.logoConfig.patchValue({ domain_logo: file });
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
    } else {
      this.imgObj.isLogoToUpdate = false;
    }
  }

  validateFileSize(fileSize) {
    if (fileSize > 100000) {
        this.swalService.alert.oops("Maximum upload file size: 100KB");
        return false;
    }
    else {
        return true
    }
}

  onSubmit() {
    if (this.logoConfig.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('image', this.logoConfig.value.domain_logo);
    formData.append('id',this.loggedInUser.id);
    this.subSunk.sink = this.apiHandlerService.apiHandler('domainLogo', 'post', {}, {}, formData)
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.submitted = true;
          this.swalService.alert.success("logo added successfully.");
        }
        else {
          this.swalService.alert.oops(resp.msg);
        }
      });
  }
}
