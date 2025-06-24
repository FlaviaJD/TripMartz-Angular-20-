import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { HotelService } from "../../hotel.service";

@Component({
    selector: 'app-hotel-booking-steps',
    templateUrl: './hotel-booking-steps.component.html',
    styleUrls: ['./hotel-booking-steps.component.scss']
})

export class HotelBookingStepsComponent implements OnInit {

    @Input() guests: any = false;
    @Input() rooms: any = true;
    @Input() payment: any = false;
    @Input() confirmation: any = false;

    display: any="20:00";
    timerInterval: any;

   constructor(
           private cdr:ChangeDetectorRef,
           private router: Router,
           private hotelService:HotelService
       ) { }
   
       ngOnInit() {
           const savedTime = localStorage.getItem('hoteltimer');
           const time = parseInt(savedTime, 10);
           if (time>0) {
               this.display=savedTime;
               let [minutes, seconds] = this.display.split(":").map(Number);
               this.startTimer(minutes,seconds);
           } else {
               this.startTimer(20,0);  // Default to 20 minutes in seconds
           }
       }
       
   
       startTimer(minute: number, initialSeconds) {
           let seconds: number = minute * 60 + initialSeconds;  // Convert minutes to seconds and add the initial seconds
           let textSec: any = '0';
           let statSec: number = seconds % 60;  // Start with the initial seconds (from the minute and seconds input)
       
           const prefix = minute < 10 ? '0' : '';
       
           this.timerInterval = setInterval(() => {
               seconds--;  // Decrease the total time by 1 second
       
               // Calculate the remaining seconds
               if (statSec != 0) statSec--;
               else statSec = 59;  // Reset the seconds to 59 once it reaches 0
       
               // Format the seconds
               if (statSec < 10) {
                   textSec = '0' + statSec;
               } else {
                   textSec = statSec;
               }
       
               // Update the display in MM:SS format
               this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
               this.hotelService.saveTime(this.display);  // Saving the time (assuming flightService is available)
               this.cdr.detectChanges();  // Detect changes in the UI
       
               // Check if the time is up
               if (seconds == 0) {
                   this.router.navigate(['/']);  // Navigate when the time runs out
                   clearInterval(this.timerInterval);  // Stop the timer
               }
           }, 1000);  // Run every second
       }
       
   
       ngOnDestroy() {
       }
}
