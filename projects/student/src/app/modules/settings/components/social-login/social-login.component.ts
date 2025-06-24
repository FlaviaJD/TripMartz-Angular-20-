import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {

  socialLoginData: any;
  displayColumn: any;
  constructor() { }

  ngOnInit() {
    this.socialLoginData = getData();
    this.displayColumn = Object.keys(this.socialLoginData[0]);
  }

}


function getData() {
  return [
    {
      '#': 1,
      'Social Network': 'facebook',
      Status: false,
      'Config Id': '123456',
      Action: 'Update',
    }
  ]
}