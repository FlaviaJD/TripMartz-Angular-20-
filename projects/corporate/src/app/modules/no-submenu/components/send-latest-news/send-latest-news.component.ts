import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-send-latest-news',
  templateUrl: './send-latest-news.component.html',
  styleUrls: ['./send-latest-news.component.scss']
})
export class SendLatestNewsComponent implements OnInit {

  sendNewsForm:FormGroup;
  customEmail:boolean=false;
  constructor(
                private fb:FormBuilder
  ) { }

  ngOnInit() {
    this.createSendNewsForm();
    this.watchSelectEmailChange()
  }

  createSendNewsForm(){
    this.sendNewsForm=this.fb.group({
        type:new FormControl('All'),
        emailIds:new FormControl(''),
        subject:new FormControl('',Validators.required),
        message:new FormControl('',Validators.required)
    })
  }

  watchSelectEmailChange(){
    this.sendNewsForm.get('type').valueChanges.subscribe(value => {
        this.onEmailTypeSelection(value);
      });
  }

  onEmailTypeSelection(value:string){
    if(value=='All'){
        this.customEmail=false;
    } else {
        this.customEmail=true;
    }
  }

  onSubmit(){
  }

  onCancel(){
    this.sendNewsForm.reset();
  }

}
