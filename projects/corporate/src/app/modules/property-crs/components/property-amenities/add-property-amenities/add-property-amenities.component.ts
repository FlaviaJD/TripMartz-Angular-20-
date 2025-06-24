import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-property-amenities',
  templateUrl: './add-property-amenities.component.html',
  styleUrls: ['./add-property-amenities.component.scss']
})
export class AddPropertyAmenitiesComponent implements OnInit {

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
            propertyAmenitiesDetails: this.fb.array([]),
        });
        this.addFormField('no');
    }

    get propertyAmenitiesDetails() {
        return this.regConfig.get('propertyAmenitiesDetails') as FormArray;
    }
    
    addFormField(additionalControl:string){
        const property=this.fb.group({
            propertyAmenities:new FormControl(''),
            status:new FormControl(''),
        });

        this.propertyAmenitiesDetails.push(property);
        if(additionalControl=='yes'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.propertyAmenitiesDetails.removeAt(index);
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
