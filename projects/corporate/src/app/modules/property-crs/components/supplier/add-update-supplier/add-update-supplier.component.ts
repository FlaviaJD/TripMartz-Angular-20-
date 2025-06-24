import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update-supplier',
  templateUrl: './add-update-supplier.component.html',
  styleUrls: ['./add-update-supplier.component.scss']
})
export class AddUpdateSupplierComponent implements OnInit {
    showDiv = {
        Details : true,
        Csv : false,
      }
    
    regConfig:FormGroup;
    fileUploadForm:FormGroup;
    
    constructor(
              private fb:FormBuilder
    ) { }
  
    ngOnInit() {
      this.createEmployeeForm();
      this.createFileUploadForm();;
    }
  
    createEmployeeForm(){
      this.regConfig=this.fb.group({
        ownerName:new FormControl('',[Validators.required]),
        mobileNumber:new FormControl('',[Validators.required]),
        emailId:new FormControl('',[Validators.required]),
        NoOfProperty:new FormControl('',[Validators.required]),
        propertyName:new FormControl('',[Validators.required]),
        propertyAddress:new FormControl('',[Validators.required]),
        noOfRooms:new FormControl('',[Validators.required]),
        clientName:new FormControl(''),
        uploadDoc:new FormControl(''),
        hotelEmail:new FormControl('',[Validators.required]),
        hotelMobileNo:new FormControl('',[Validators.required]),
        contactPerson:new FormControl('',[Validators.required])
      })
    }

    onSubmit(){
    }

    onReset(){
        
    }

    createFileUploadForm(){
        this.fileUploadForm=this.fb.group({
            uploadFile:new FormControl('',[Validators.required])
        })
    }
    
    onSampleDownload(){
    
    }

    uploadFile(event){
  
    }

    onFileSubmit(){
    }
    
    onFileReset(){
    
    }

    onConfirmExcelUpload(){
        
    }

}
