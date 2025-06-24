import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-board-type',
  templateUrl: './add-board-type.component.html',
  styleUrls: ['./add-board-type.component.scss']
})
export class AddBoardTypeComponent implements OnInit {
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
            boardTypeDetails: this.fb.array([]),
        });
        this.addFormField('no');
    }

    get boardTypeDetails() {
        return this.regConfig.get('boardTypeDetails') as FormArray;
    }
    
    addFormField(additionalControl:string){
        const board=this.fb.group({
            boardType:new FormControl(''),
            status:new FormControl(''),
        });

        this.boardTypeDetails.push(board);
        if(additionalControl=='yes'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.boardTypeDetails.removeAt(index);
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
