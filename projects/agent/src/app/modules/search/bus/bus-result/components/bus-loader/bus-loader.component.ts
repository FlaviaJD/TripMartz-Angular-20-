import { Component, Inject, OnInit ,ViewChild,ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bus-loader',
  templateUrl: './bus-loader.component.html',
  styleUrls: ['./bus-loader.component.scss']
})
export class BusLoaderComponent implements OnInit {
  @ViewChild("progressBar", { static: false }) progressBar!: ElementRef;
  busInfo: any;
  percent = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngAfterViewInit() {
    let progress = 0;
    let interval = setInterval(() => {
      progress += 5; // Increase progress in steps
      this.percent = progress;
      this.progressBar.nativeElement.style.width = `${this.percent}%`;
  
      if (progress >= 100) {
        clearInterval(interval); // Stop when it reaches 100%
      }
    }, 500); // Update every 100ms for a smooth effect
  }


  ngOnInit(): void {
    this.busInfo = this.data.data;
  }

}
