import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {

    regConfig:FormGroup;
    isOpen = false as boolean;
    removeButton:boolean=false
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    roomTypes=['Single','Double Room','Duplex','Luxury']
    boardType=['Room Only(RO)','Bed and Breakfast(BB)','Half Board(HB)']
    mealType=['Veg','Non-Veg']
    boardTypeSelected:Array<string>=[];
    mealTypeSelected:Array<string>=[];
    constructor(
        private fb:FormBuilder,
    ) { }
  
    ngOnInit() {
      this.createAddRoomForm()
    }
  
    createAddRoomForm(){
        this.regConfig = this.fb.group({
            roomDetails: this.fb.array([]),
        });
        this.addNewRoom('no');
    }

    get roomDetails() {
        return this.regConfig.get('roomDetails') as FormArray;
    }
    
    addNewRoom(additionalControl:string){
        const roomTypeGroup=this.fb.group({
            roomType:new FormControl(''),
            roomName:new FormControl(''),
            occupency:new FormControl(''),
            roomAmeneties:new FormControl(''),
            boardType:new FormControl(''),
            mealType:new FormControl(''),
            noOfRooms:new FormControl(''),
            roomStatus:new FormControl('0'),
            roomDescription:new FormControl(''),
            cancellationPolicy:new FormControl('')
        });
        this.roomDetails.push(roomTypeGroup);

        if(additionalControl=='yes'){
            this.removeButton=true;
        }
    }

    removeRoomDetails(index: number) {
    this.roomDetails.removeAt(index);
    }

    boardTypeSelection(event,checkedItem){
        let isChecked=event.target.checked;
        if(isChecked){
            this.boardTypeSelected.push(checkedItem);
        } else{
            this.boardTypeSelected = this.boardTypeSelected.filter((item) => !item.toLowerCase().includes(checkedItem.toLowerCase()));
        }
    }

    mealTypeSelection(event,checkedItem){
        let isChecked=event.target.checked;
        if(isChecked){
            this.mealTypeSelected.push(checkedItem);
        } else{
            this.mealTypeSelected = this.mealTypeSelected.filter((item) => !item.toLowerCase().includes(checkedItem.toLowerCase()));
        }
    }

    onSumbit(){
    }

}
