import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-room-amenities',
  templateUrl: './add-room-amenities.component.html',
  styleUrls: ['./add-room-amenities.component.scss']
})
export class AddRoomAmenitiesComponent implements OnInit {
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
            roomAmenitiesDetails: this.fb.array([]),
        });
        this.addFormField('no');
    }

    get roomAmenitiesDetails() {
        return this.regConfig.get('roomAmenitiesDetails') as FormArray;
    }
    
    addFormField(additionalControl:string){
        const property=this.fb.group({
            roomAmenities:new FormControl(''),
            status:new FormControl(''),
        });

        this.roomAmenitiesDetails.push(property);
        if(additionalControl=='yes'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.roomAmenitiesDetails.removeAt(index);
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
