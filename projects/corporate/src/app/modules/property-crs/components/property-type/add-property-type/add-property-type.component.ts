import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-property-type',
  templateUrl: './add-property-type.component.html',
  styleUrls: ['./add-property-type.component.scss']
})
export class AddPropertyTypeComponent implements OnInit {

    showDiv = {
        Details : true,
        Csv : false,
      }
    regConfig:FormGroup;
    fileUploadForm:FormGroup;
    removeButton:boolean=false

    constructor(
        private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createForm()
       this.createFileUploadForm()
    }
  
    createForm(){
        this.regConfig = this.fb.group({
            propertyTypeDetails: this.fb.array([]),
        });
        this.addFormField('no');
    }

    get propertyTypeDetails() {
        return this.regConfig.get('propertyTypeDetails') as FormArray;
    }
    
    addFormField(additionalControl:string){
        const property=this.fb.group({
            propertyType:new FormControl(''),
            status:new FormControl(''),
        });

        this.propertyTypeDetails.push(property);
        if(additionalControl=='yes'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.propertyTypeDetails.removeAt(index);
        }
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

    onSubmit(){
    }

    onReset(){
    
    }

}
