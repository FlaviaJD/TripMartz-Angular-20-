import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus-policy',
  templateUrl: './bus-policy.component.html',
  styleUrls: ['./bus-policy.component.scss']
})
export class BusPolicyComponent implements OnInit {

    busPolicyForm:FormGroup;
    @Output() moveToTab=new EventEmitter<String>();
    
    private subSunk = new SubSink();
    protected subs = new SubSink();
  isUpdate: boolean;
    
    constructor(
              private fb:FormBuilder,
              private masterService:MasterService,
              private apiHandlerService: ApiHandlerService,
              private swalService:SwalService,
              private route:Router

    ) { }
  
    ngOnInit() {
      this.createBusPolicyForm();
      this.updatePreFilledData();
    }
  
    createBusPolicyForm(){
      this.busPolicyForm=this.fb.group({
        isBus:new FormControl('',Validators.required)
      })
    }

    updatePreFilledData() {
        this.subSunk.sink = this.masterService.policyUpdateData.subscribe((data => {
            let value;
            data.bus == 0 ? value = "false" : value = "true"
            this.busPolicyForm.patchValue({
                isBus: value
            })
        }))
    }
    goToPreviousPage(){
        this.moveToTab.emit('hotel')
    }

    onSubmit(){
        let value=this.busPolicyForm.get('isBus').value=="false"? 0 :1
        const busData= {
            train:+value
        }
        this.masterService.busPolicyData.next(busData);
        this.submitData();
        //this.moveToTab.emit('cab')
    }

    submitData(){
      let value= 0;
      const cabData= {
          car:+value,
          cabType:''
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
