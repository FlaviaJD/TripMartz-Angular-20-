import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlDirective, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-room-type',
  templateUrl: './add-room-type.component.html',
  styleUrls: ['./add-room-type.component.scss']
})
export class AddRoomTypeComponent implements OnInit {
    showDiv = {
        Details : true,
        Csv : false,
      }
    regConfig:FormGroup;
    fileUploadForm:FormGroup;
    removeButton:boolean=false
    propertyType=['Resort','Hotel','Tree House','Luxury']
    constructor(
        private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createForm()
       this.createFileUploadForm()
    }
  
    createForm(){
        this.regConfig = this.fb.group({
            roomTypeDetails: this.fb.array([]),
        });
        this.addFormField('no');
    }

    get roomTypeDetails() {
        return this.regConfig.get('roomTypeDetails') as FormArray;
    }
    
    addFormField(additionalControl:string){
        const room=this.fb.group({
            propertyType:new FormControl(''),
            roomType:new FormControl(''),
            status:new FormControl(''),
        });

        this.roomTypeDetails.push(room);
        if(additionalControl=='yes'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.roomTypeDetails.removeAt(index);
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
