import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';

@Component({
  selector: 'app-train-policy',
  templateUrl: './train-policy.component.html',
  styleUrls: ['./train-policy.component.scss']
})
export class TrainPolicyComponent implements OnInit {

    trainPolicyForm:FormGroup;
    @Output() moveToTab=new EventEmitter<String>();
    
    private subSunk = new SubSink();
    protected subs = new SubSink();
    
    constructor(
              private fb:FormBuilder,
              private masterService:MasterService,
    ) { }
  
    ngOnInit() {
      this.createTrainPolicyForm();
      this.updatePreFilledData();
    }

    updatePreFilledData() {
        this.subSunk.sink = this.masterService.policyUpdateData.subscribe((data => {
            let value;
            data.train == 0 ? value = "false" : value = "true"
            this.trainPolicyForm.patchValue({
                isTrain: value
            })
        }))
    }
  
    createTrainPolicyForm() {
        this.trainPolicyForm = this.fb.group({
            isTrain: new FormControl('', Validators.required)
        })
    }

    goToPreviousPage(){
        this.moveToTab.emit('hotel')
    }

    onSubmit(){
        let value=this.trainPolicyForm.get('isTrain').value=="false"? 0 :1
        const trainData = {
            train: +value
        }
        this.masterService.trainPolicyData.next(trainData)
        this.moveToTab.emit('bus')
    }

}
