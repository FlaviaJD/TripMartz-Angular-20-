import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cab-policy',
  templateUrl: './cab-policy.component.html',
  styleUrls: ['./cab-policy.component.scss']
})
export class CabPolicyComponent implements OnInit {

    cabPolicyForm:FormGroup;
    @Output() moveToTab=new EventEmitter<String>();
    
    private subSunk = new SubSink();
    protected subs = new SubSink();
    isUpdate:boolean;
    cabType:Array<any>=[
        {name:'SUV',isChecked:false},
        {name:'Sedan',isChecked:false},
    ]
    cabCheckedList:Array<any>=[];
    constructor(
        private fb:FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService,
        private masterService:MasterService,
        private route:Router
    ) { }
  
    ngOnInit() {
      this.createCabPolicyForm();
      this.updatePreFilledData();
    }
  
    createCabPolicyForm(){
      this.cabPolicyForm=this.fb.group({
        isCab:new FormControl(''),
        cabType:new FormControl('')
      })
    }

    checkBoxSelection(inputEvent: any, checkedItem: string) {
        let isChecked = inputEvent.target.checked;
        if (isChecked) {
            this.cabCheckedList.push(checkedItem);
        } else {
            this.cabCheckedList = this.cabCheckedList.filter((item) => !item.includes(checkedItem));
        }
    }

    updatePreFilledData() {
        this.subSunk.sink = this.masterService.policyUpdateData.subscribe((data => {
            let value;
            data.car == 0 ? value = "false" : value = "true";
            // if (data.cabType && data.cabType.includes(','))
            this.cabCheckedList = data.cabType.split(',').map(c => c.trim());
            this.cabCheckedList = this.cabCheckedList.reduce((acc, value) => {
                if (value !== '') {
                    acc.push(value);
                }
                return acc;
            }, []);

            this.cabType.forEach(item => {
                if (this.cabCheckedList.includes(item.name)) {
                    item.isChecked = true;
                }
            });
            this.cabPolicyForm.patchValue({
                isCab: value,
                cabType:this.cabCheckedList
            })
        }))
    }

    goToPreviousPage(){
        this.moveToTab.emit('bus')
    }

    onSubmit(){
        let value=this.cabPolicyForm.get('isCab').value=="false"? 0 :1
        const cabData= {
            car:+value,
            cabType:this.cabCheckedList.join(',')
        }
        this.masterService.cabPolicyData.next(cabData);
        let flighPolicyInfo, hotelPolicyInfo,trainPolicyInfo,busPolicyInfo,cabPolicyInfo,postionId;
        let policyId
        let p=localStorage.getItem('positionId')
        this.masterService.flightPolicyData.subscribe((data)=>{
            flighPolicyInfo=data;
        })
        this.masterService.hotelPolicyData.subscribe((data)=>{
            hotelPolicyInfo=data;
        })

        this.masterService.trainPolicyData.subscribe((data)=>{
            trainPolicyInfo=data;
        })

        this.masterService.busPolicyData.subscribe((data)=>{
            busPolicyInfo=data;
        })

        this.masterService.cabPolicyData.subscribe((data)=>{
            cabPolicyInfo=data;
        })

        this.masterService.policyUpdateData.subscribe(item=>{
            if(item.position_name){
                this.isUpdate=true;
                policyId=item.id
            }
        })
        if(!this.isUpdate){
            this.subSunk.sink = this.apiHandlerService.apiHandler('addPolicy', 'post', {}, {},{
                position_id:Number(localStorage.getItem('positionId')),
                ...flighPolicyInfo,
                ...hotelPolicyInfo,
                ...busPolicyInfo,
                ...cabPolicyInfo,
                ...trainPolicyInfo

            })
              .subscribe(res => {
                  if (res.statusCode == 200 || res.statusCode == 201) {
                    // this.positionList=res.data;
                    this.swalService.alert.success('Policy has been added sucessfully');
                    this.route.navigate(['master/policy-list']);
                  }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
             });
        } else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('updatePolicy', 'post', {}, {},{
                position_id:Number(localStorage.getItem('positionId')),
                id:policyId,
                ...flighPolicyInfo,
                ...hotelPolicyInfo,
                ...busPolicyInfo,
                ...cabPolicyInfo,
                ...trainPolicyInfo
            })
              .subscribe(res => {
                  if (res.statusCode == 200 || res.statusCode == 201) {
                    this.swalService.alert.success('Policy has been updated sucessfully');
                    this.route.navigate(['master/policy-list']);
                  }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
             });
        }
        
    }

}
