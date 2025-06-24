import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-room-meal-type',
  templateUrl: './add-room-meal-type.component.html',
  styleUrls: ['./add-room-meal-type.component.scss']
})
export class AddRoomMealTypeComponent implements OnInit {

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
            mealTypeDetails: this.fb.array([]),
        });
        this.addFormField('no');
    }

    get mealTypeDetails() {
        return this.regConfig.get('mealTypeDetails') as FormArray;
    }
    
    addFormField(additionalControl:string){
        const property=this.fb.group({
            mealType:new FormControl(''),
            status:new FormControl(''),
        });

        this.mealTypeDetails.push(property);
        if(additionalControl=='yes'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.mealTypeDetails.removeAt(index);
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
