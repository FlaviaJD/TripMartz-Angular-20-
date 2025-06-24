import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-promocode',
  templateUrl: './list-promocode.component.html',
  styleUrls: ['./list-promocode.component.scss']
})
export class ListPromocodeComponent implements OnInit {
  @Input() label: any;
  promoData;
  displayColumn: string[];
  pageSize = 2;
  page=4;
  collectionSize;

  constructor() { }

ngOnInit() {
    this.promoData = getData();
    this.displayColumn = Object.keys(this.promoData[0])
    this.collectionSize = this.promoData.length;
  }

}



function getData() {
  return [
    {
      Sno: 1,
      'Promo Code': 'ACT10',
      Image: 'https://travelomatix.in/extras/system/template_list/template_v1/images/promocode/TMX1512291534825461f-2.jpg',
      Discount: '10.00 Plus(+ INR)',
      'Valid Upto': '30-Jun-2019(0 Days Left)',
      'Minimum Amount': '10.00',
      Module: 'Activities',
      Status: 'Active',
      'Created On': '25-Jun-2019',
      Action: 'Delete'
    }
  ]
}
