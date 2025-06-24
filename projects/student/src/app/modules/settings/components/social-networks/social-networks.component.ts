import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss']
})
export class SocialNetworksComponent implements OnInit {
  socialNetworkData: any;
  displayColumn: any;
  constructor() { }

  ngOnInit() {
    this.socialNetworkData = getData();
    this.displayColumn = Object.keys(this.socialNetworkData[0]);
  }

}


function getData() {
  return [
    {
      '#': 1,
      'Social Network': 'facebook',
      Url: 'https//www.facebook.com/',
      Action: true,
    }
  ]
}
