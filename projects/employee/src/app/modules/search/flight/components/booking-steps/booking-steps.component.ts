import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Route, Router } from "@angular/router";
import { FlightService } from "../../flight.service";
import { MatDialog } from "@angular/material";
import { SwalService } from "projects/employee/src/app/core/services/swal.service";
@Component({
    selector: 'app-booking-steps',
    templateUrl: './booking-steps.component.html',
    styleUrls: ['./booking-steps.component.scss']
})

export class BookingStepsComponent implements OnInit {

    @Input() review: any = false;
    @Input() travellers: any = true;
    @Input() extras: any = false;
    @Input() payment: any = false;
    @Input() ticket: any = false;
    display: any="15:00";
    timerInterval: any;

    constructor(
        private cdr:ChangeDetectorRef,
        private router: Router,
        private flightService:FlightService,
        private dialog: MatDialog,
        private swalService:SwalService
    ) { }

    ngOnInit() {
        const savedTime = localStorage.getItem('timer');
        const time = parseInt(savedTime, 10);
        if (time>0) {
            this.display=savedTime;
            let [minutes, seconds] = this.display.split(":").map(Number);
            this.startTimer(minutes,seconds);
        } else {
            this.startTimer(15,0);  // Default to 15 minutes in seconds
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
            this.flightService.saveTime(this.display);  // Saving the time (assuming flightService is available)
            this.cdr.detectChanges();  // Detect changes in the UI
    
            // Check if the time is up
            if (seconds == 0) {
                   this.swalService.alert.oops("Your booking session has expired.");
                  this.dialog.closeAll(); // Close all open dialogs
                this.router.navigate(['/']); 
                 // Navigate when the time runs out
                clearInterval(this.timerInterval);  // Stop the timer
            }
        }, 1000);  // Run every second
    }
    

    ngOnDestroy() {
    }
}